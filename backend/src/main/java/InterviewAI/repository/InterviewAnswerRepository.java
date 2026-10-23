package InterviewAI.repository;

import InterviewAI.entity.InterviewAnswer;
import InterviewAI.entity.AppUser;
import InterviewAI.dto.AnswerHistoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface InterviewAnswerRepository
        extends JpaRepository<InterviewAnswer, Long> {

    List<InterviewAnswer> findByQuestionIdAndUser(Long questionId, AppUser user);

    Optional<InterviewAnswer> findByIdAndUser(Long id, AppUser user);

    @Query("""
            select new InterviewAI.dto.AnswerHistoryItem(
                answer.id,
                answer.questionId,
                answer.answerText,
                answer.submittedAt,
                question.questionText,
                question.language,
                case when evaluation.id is null then false else true end
            )
            from InterviewAnswer answer
            left join Question question on question.id = answer.questionId
            left join AnswerEvaluation evaluation on evaluation.answer = answer
            where answer.user = :user
            order by answer.submittedAt desc, answer.id desc
            """)
    List<AnswerHistoryItem> findHistoryByUser(@Param("user") AppUser user);
}