package InterviewAI;

import InterviewAI.entity.Question;
import InterviewAI.repository.QuestionRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionControllerTest {

    @Mock
    private QuestionRepository questionRepository;

    private QuestionController controller;

    @BeforeEach
    void setUp() {
        controller = new QuestionController(questionRepository);
    }

    @Test
    void acceptsSupportedLanguageAndMediumDifficulty() {
        List<Question> expected = List.of(
                new Question("Rust", "Medium", "Explain borrowing in Rust.")
        );
        when(questionRepository.findByLanguageIgnoreCaseAndDifficultyIgnoreCase("Rust", "Medium"))
                .thenReturn(expected);

        assertEquals(expected, controller.getQuestions("Rust", "Medium", null));
    }

    @Test
    void rejectsUnsupportedLanguage() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.getQuestions("Cobol", "Easy", null)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void rejectsInvalidDifficulty() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.getQuestions("Java", "Expert", null)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}