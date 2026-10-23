package InterviewAI;

import InterviewAI.entity.Question;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.TechnologyCatalog;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
})
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping("/api/questions")
    public List<Question> getQuestions(
            @RequestParam(defaultValue = "Java") String language,
            @RequestParam(defaultValue = "Easy") String difficulty,
            @RequestParam(required = false) String category) {

        if (TechnologyCatalog.all().stream()
            .noneMatch(option -> option.name().equalsIgnoreCase(language))) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Choose a supported programming language."
            );
        }
        if (!Set.of("easy", "medium", "hard").contains(difficulty.toLowerCase(Locale.ROOT))) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Difficulty must be Easy, Medium, or Hard."
            );
        }

        List<Question> questions = questionRepository
                .findByLanguageIgnoreCaseAndDifficultyIgnoreCase(
                        language, difficulty);
        if (category == null || category.isBlank()) return questions;
        return questions.stream()
            .filter(question -> question.getCategory() != null
                && question.getCategory().equalsIgnoreCase(category))
            .toList();
    }
}