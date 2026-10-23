package InterviewAI;

import InterviewAI.dto.AnswerEvaluationResponse;
import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.entity.AnswerEvaluation;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.InterviewAnswer;
import InterviewAI.entity.Question;
import InterviewAI.repository.AnswerEvaluationRepository;
import InterviewAI.repository.InterviewAnswerRepository;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.AiEvaluationException;
import InterviewAI.service.AnswerEvaluationService;
import InterviewAI.service.AnswerEvaluator;
import InterviewAI.service.MockAnswerEvaluator;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnswerEvaluationServiceTest {

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerEvaluationRepository evaluationRepository;

    @Mock
    private AnswerEvaluator answerEvaluator;

    private AnswerEvaluationService service;
    private AppUser user;
    private InterviewAnswer answer;
    private Question question;

    @BeforeEach
    void setUp() {
        service = new AnswerEvaluationService(
                answerRepository,
                questionRepository,
                evaluationRepository,
                answerEvaluator
        );
        user = new AppUser("User A", "a@example.com", "encoded");
        answer = new InterviewAnswer(7L, "Candidate answer");
        answer.setId(9L);
        question = new Question("Java", "Easy", "Explain encapsulation.");
        question.setId(7L);
    }

    @Test
    void evaluatesOwnedAnswerUsingStoredQuestionAndPersistsResult() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());
        when(questionRepository.findById(7L)).thenReturn(Optional.of(question));
        when(answerEvaluator.evaluate(
                "Java",
                "Explain encapsulation.",
                "Candidate answer"
        )).thenReturn(validFeedback());
        when(evaluationRepository.save(any(AnswerEvaluation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AnswerEvaluationResponse response = service.evaluate(9L, user);

        assertEquals(9L, response.answerId());
        assertEquals(8, response.score());
        assertEquals("Correct and relevant.", response.correctnessFeedback());
        verify(answerEvaluator).evaluate(
                "Java",
                "Explain encapsulation.",
                "Candidate answer"
        );
        verify(evaluationRepository).save(any(AnswerEvaluation.class));
    }

    @Test
    void evaluatesBlankLegacyAnswerInMockMode() {
        answer.setAnswerText(" ");
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());
        when(questionRepository.findById(7L)).thenReturn(Optional.of(question));
        when(answerEvaluator.evaluate("Java", "Explain encapsulation.", " "))
                .thenReturn(new MockAnswerEvaluator().evaluate(
                        "Java",
                        "Explain encapsulation.",
                        " "
                ));
        when(answerEvaluator.evaluationMode()).thenReturn("mock");
        when(evaluationRepository.save(any(AnswerEvaluation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AnswerEvaluationResponse response = service.evaluate(9L, user);

        assertEquals(0, response.score());
        assertEquals("mock", response.evaluationMode());
        verify(evaluationRepository).save(any(AnswerEvaluation.class));
    }

    @Test
    void doesNotEvaluateAnotherUsersAnswer() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.evaluate(9L, user)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(answerEvaluator, never()).evaluate(any(), any(), any());
        verify(evaluationRepository, never()).save(any());
    }

        @Test
        void doesNotReadAnotherUsersEvaluation() {
                when(answerRepository.findByIdAndUser(9L, user))
                                .thenReturn(Optional.empty());

                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> service.getEvaluation(9L, user)
                );

                assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
                verify(evaluationRepository, never()).findByAnswer_Id(any());
        }

    @Test
    void returnsSavedEvaluationWithoutCallingProviderAgain() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L))
                .thenReturn(Optional.of(savedEvaluation()));

        AnswerEvaluationResponse response = service.evaluate(9L, user);

        assertEquals(8, response.score());
        verify(answerEvaluator, never()).evaluate(any(), any(), any());
        verify(evaluationRepository, never()).save(any());
    }

    @Test
        void persistsClearlyLabeledFallbackWhenProviderFails() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());
        when(questionRepository.findById(7L)).thenReturn(Optional.of(question));
        when(answerEvaluator.evaluate(any(), any(), any()))
                .thenThrow(new AiEvaluationException(
                        HttpStatus.BAD_GATEWAY,
                        "Provider unavailable"
                ));
        when(evaluationRepository.save(any(AnswerEvaluation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AnswerEvaluationResponse response = service.evaluate(9L, user);

        assertEquals("rule-based-fallback", response.evaluationMode());
        verify(evaluationRepository).save(any(AnswerEvaluation.class));
    }

    @Test
    void rejectsInvalidProviderScoreBeforePersisting() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());
        when(questionRepository.findById(7L)).thenReturn(Optional.of(question));
        when(answerEvaluator.evaluate(any(), any(), any())).thenReturn(
                new EvaluationFeedback(
                        11,
                        "Feedback",
                        List.of("Strength"),
                        List.of(),
                        List.of("Suggestion"),
                        "Sample answer"
                )
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.evaluate(9L, user)
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
        verify(evaluationRepository, never()).save(any());
    }

    @Test
    void rejectsUnsupportedQuestionLanguage() {
        when(answerRepository.findByIdAndUser(9L, user))
                .thenReturn(Optional.of(answer));
        when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());
        Question unsupportedQuestion = new Question(
                "JavaScript",
                "Easy",
                "Question text"
        );
        when(questionRepository.findById(7L))
                .thenReturn(Optional.of(unsupportedQuestion));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.evaluate(9L, user)
        );

        assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, exception.getStatusCode());
        verify(answerEvaluator, never()).evaluate(any(), any(), any());
    }

        @Test
        void rejectsOversizedPreviouslySavedAnswer() {
                answer.setAnswerText("x".repeat(20_001));
                when(answerRepository.findByIdAndUser(9L, user))
                                .thenReturn(Optional.of(answer));
                when(evaluationRepository.findByAnswer_Id(9L)).thenReturn(Optional.empty());

                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> service.evaluate(9L, user)
                );

                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
                verify(answerEvaluator, never()).evaluate(any(), any(), any());
        }

    private EvaluationFeedback validFeedback() {
        return new EvaluationFeedback(
                8,
                "Correct and relevant.",
                List.of("Identifies the core concept"),
                List.of(),
                List.of("Explain the benefit"),
                "A concise sample answer."
        );
    }

    private AnswerEvaluation savedEvaluation() {
        AnswerEvaluation evaluation = new AnswerEvaluation(
                answer,
                8,
                "Correct and relevant.",
                List.of("Identifies the core concept"),
                List.of(),
                List.of("Explain the benefit"),
                "A concise sample answer."
        );
        ReflectionTestUtils.setField(evaluation, "id", 21L);
        return evaluation;
    }
}