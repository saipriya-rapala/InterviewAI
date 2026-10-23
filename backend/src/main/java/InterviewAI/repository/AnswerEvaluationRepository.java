package InterviewAI.repository;

import InterviewAI.entity.AnswerEvaluation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerEvaluationRepository
        extends JpaRepository<AnswerEvaluation, Long> {

    Optional<AnswerEvaluation> findByAnswer_Id(Long answerId);
}