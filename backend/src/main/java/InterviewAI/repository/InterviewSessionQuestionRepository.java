package InterviewAI.repository;

import InterviewAI.entity.InterviewSessionQuestion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSessionQuestionRepository extends JpaRepository<InterviewSessionQuestion, Long> {

    Optional<InterviewSessionQuestion> findByIdAndSession_Id(Long id, Long sessionId);
}