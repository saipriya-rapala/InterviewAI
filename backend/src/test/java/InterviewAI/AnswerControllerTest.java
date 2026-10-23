package InterviewAI;

import InterviewAI.dto.AnswerHistoryItem;
import InterviewAI.dto.AnswerEvaluationResponse;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.InterviewAnswer;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.repository.InterviewAnswerRepository;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.AnswerEvaluationService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnswerControllerTest {

    @Mock
    private InterviewAnswerRepository answerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AppUserRepository userRepository;

        @Mock
        private AnswerEvaluationService evaluationService;

    private AnswerController controller;

    @BeforeEach
    void setUp() {
        controller = new AnswerController(
                answerRepository,
                questionRepository,
                userRepository,
                evaluationService
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void savesAnswerForAuthenticatedUser() {
        AppUser user = new AppUser("User A", "a@example.com", "encoded");
        authenticateAs("a@example.com");
        when(userRepository.findByEmailIgnoreCase("a@example.com"))
                .thenReturn(Optional.of(user));
        when(questionRepository.existsById(7L)).thenReturn(true);
        when(answerRepository.save(any(InterviewAnswer.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AnswerController.AnswerRequest request = new AnswerController.AnswerRequest();
        request.setQuestionId(7L);
        request.setAnswerText("  My answer  ");

        InterviewAnswer saved = controller.submitAnswer(request);

        ArgumentCaptor<InterviewAnswer> answerCaptor =
                ArgumentCaptor.forClass(InterviewAnswer.class);
        verify(answerRepository).save(answerCaptor.capture());
        InterviewAnswer persisted = answerCaptor.getValue();

        assertSame(user, ReflectionTestUtils.getField(persisted, "user"));
        assertEquals(7L, saved.getQuestionId());
        assertEquals("My answer", saved.getAnswerText());
    }

    @Test
    void returnsOnlyAnswersForAuthenticatedUser() {
        AppUser userA = new AppUser("User A", "a@example.com", "encoded");
        AppUser userB = new AppUser("User B", "b@example.com", "encoded");
        InterviewAnswer answerA = new InterviewAnswer(7L, "Answer A");
        InterviewAnswer answerB = new InterviewAnswer(7L, "Answer B");
        when(questionRepository.existsById(7L)).thenReturn(true);
        when(userRepository.findByEmailIgnoreCase("a@example.com"))
                .thenReturn(Optional.of(userA));
        when(userRepository.findByEmailIgnoreCase("b@example.com"))
                .thenReturn(Optional.of(userB));
        when(answerRepository.findByQuestionIdAndUser(7L, userA))
                .thenReturn(List.of(answerA));
        when(answerRepository.findByQuestionIdAndUser(7L, userB))
                .thenReturn(List.of(answerB));

        authenticateAs("a@example.com");
        List<InterviewAnswer> answersForA = controller.getAnswers(7L);
        authenticateAs("b@example.com");
        List<InterviewAnswer> answersForB = controller.getAnswers(7L);

        assertEquals(List.of(answerA), answersForA);
        assertEquals(List.of(answerB), answersForB);
        verify(answerRepository).findByQuestionIdAndUser(7L, userA);
        verify(answerRepository).findByQuestionIdAndUser(7L, userB);
    }

    @Test
    void returnsHistoryForAuthenticatedUserOnly() {
        AppUser userA = new AppUser("User A", "a@example.com", "encoded");
        AnswerHistoryItem historyItem = new AnswerHistoryItem(
                10L,
                7L,
                "Answer A",
                java.time.LocalDateTime.parse("2026-10-09T10:00:00"),
                "Explain encapsulation.",
                "Java",
                true
        );
        authenticateAs("a@example.com");
        when(userRepository.findByEmailIgnoreCase("a@example.com"))
                .thenReturn(Optional.of(userA));
        when(answerRepository.findHistoryByUser(userA))
                .thenReturn(List.of(historyItem));

        List<AnswerHistoryItem> history = controller.getHistory();

        assertEquals(List.of(historyItem), history);
        verify(answerRepository).findHistoryByUser(userA);
    }

    @Test
    void returnsEmptyHistoryForUserWithoutAnswers() {
        AppUser user = new AppUser("User A", "a@example.com", "encoded");
        authenticateAs("a@example.com");
        when(userRepository.findByEmailIgnoreCase("a@example.com"))
                .thenReturn(Optional.of(user));
        when(answerRepository.findHistoryByUser(user)).thenReturn(List.of());

        assertEquals(List.of(), controller.getHistory());
    }

        @Test
        void evaluatesAnswerAsAuthenticatedUser() {
                AppUser user = new AppUser("User A", "a@example.com", "encoded");
                AnswerEvaluationResponse response = new AnswerEvaluationResponse(
                                1L,
                                9L,
                                8,
                                "Correct and relevant.",
                                List.of("Clear explanation"),
                                List.of(),
                                List.of("Mention the complexity"),
                                "Sample answer",
                                java.time.LocalDateTime.parse("2026-10-09T10:00:00"),
                                "openai"
                );
                authenticateAs("a@example.com");
                when(userRepository.findByEmailIgnoreCase("a@example.com"))
                                .thenReturn(Optional.of(user));
                when(evaluationService.evaluate(9L, user)).thenReturn(response);

                assertEquals(response, controller.evaluateAnswer(9L));
                verify(evaluationService).evaluate(9L, user);
        }

        @Test
        void rejectsAnswerLongerThanConfiguredLimit() {
                AnswerController.AnswerRequest request = new AnswerController.AnswerRequest();
                request.setQuestionId(7L);
                request.setAnswerText("x".repeat(20_001));

                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> controller.submitAnswer(request)
                );

                assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        }

    @Test
    void rejectsNonexistentQuestionWhenRetrievingAnswers() {
        when(questionRepository.existsById(404L)).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.getAnswers(404L)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

        @Test
        void rejectsNonexistentQuestionWhenSubmittingAnswer() {
                when(questionRepository.existsById(404L)).thenReturn(false);

                AnswerController.AnswerRequest request = new AnswerController.AnswerRequest();
                request.setQuestionId(404L);
                request.setAnswerText("My answer");

                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> controller.submitAnswer(request)
                );

                assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        }

    @Test
    void rejectsEmptyAnswer() {
        AnswerController.AnswerRequest request = new AnswerController.AnswerRequest();
        request.setQuestionId(7L);
        request.setAnswerText("  ");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.submitAnswer(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private void authenticateAs(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, List.of())
        );
    }
}