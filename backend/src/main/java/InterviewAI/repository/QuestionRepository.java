package InterviewAI.repository;

import InterviewAI.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByLanguageIgnoreCaseAndDifficultyIgnoreCase(
            String language, String difficulty);

    List<Question> findAllByDifficultyIgnoreCase(String difficulty);

        Optional<Question> findByLanguageIgnoreCaseAndQuestionTextIgnoreCase(
            String language, String questionText);
}