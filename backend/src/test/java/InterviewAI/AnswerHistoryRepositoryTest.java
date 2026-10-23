package InterviewAI;

import InterviewAI.dto.AnswerHistoryItem;
import InterviewAI.entity.AnswerEvaluation;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.InterviewAnswer;
import InterviewAI.entity.Question;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.repository.AnswerEvaluationRepository;
import InterviewAI.repository.InterviewAnswerRepository;
import InterviewAI.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class AnswerHistoryRepositoryTest {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private InterviewAnswerRepository answerRepository;

        @Autowired
        private AnswerEvaluationRepository evaluationRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    void returnsOnlyOwnersAnswersNewestFirstWithQuestionDetails() {
        AppUser userA = userRepository.save(
                new AppUser("User A", "a@example.com", "encoded")
        );
        AppUser userB = userRepository.save(
                new AppUser("User B", "b@example.com", "encoded")
        );
        Question question = questionRepository.save(
                new Question("Java", "Easy", "Explain encapsulation.")
        );
        LocalDateTime olderDate = LocalDateTime.parse("2026-10-08T09:00:00");
        LocalDateTime newerDate = LocalDateTime.parse("2026-10-09T09:00:00");

        InterviewAnswer olderAnswer = new InterviewAnswer(
                question.getId(),
                "Older answer"
        );
        olderAnswer.setUser(userA);
        olderAnswer.setSubmittedAt(olderDate);
        answerRepository.save(olderAnswer);

        InterviewAnswer newerAnswer = new InterviewAnswer(
                question.getId(),
                "Newer answer"
        );
        newerAnswer.setUser(userA);
        newerAnswer.setSubmittedAt(newerDate);
        answerRepository.save(newerAnswer);
        evaluationRepository.save(new AnswerEvaluation(
                newerAnswer,
                8,
                "Correct and relevant.",
                List.of("Identifies the concept"),
                List.of(),
                List.of("Add an example"),
                "Sample answer."
        ));

        InterviewAnswer otherUsersAnswer = new InterviewAnswer(
                question.getId(),
                "Private answer"
        );
        otherUsersAnswer.setUser(userB);
        otherUsersAnswer.setSubmittedAt(newerDate.plusDays(1));
        answerRepository.save(otherUsersAnswer);

        List<AnswerHistoryItem> history =
                answerRepository.findHistoryByUser(userA);

        assertEquals(List.of(
                new AnswerHistoryItem(
                        newerAnswer.getId(),
                        question.getId(),
                        "Newer answer",
                        newerDate,
                        "Explain encapsulation.",
                        "Java",
                        true
                ),
                new AnswerHistoryItem(
                        olderAnswer.getId(),
                        question.getId(),
                        "Older answer",
                        olderDate,
                        "Explain encapsulation.",
                        "Java",
                        false
                )
        ), history);
    }

    @Test
    void returnsEmptyHistoryWhenUserHasNoAnswers() {
        AppUser user = userRepository.save(
                new AppUser("User A", "a@example.com", "encoded")
        );

        assertEquals(List.of(), answerRepository.findHistoryByUser(user));
    }
}