package InterviewAI;

import InterviewAI.entity.Question;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.TechnologyCatalog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@DataJpaTest
@Import(DataLoader.class)
class QuestionBankSeedTest {

    @Autowired
    private DataLoader dataLoader;

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    void seedsEveryLanguageAtEveryDifficultyWithoutDuplicates() {
        dataLoader.run();
        long firstCount = questionRepository.count();
        dataLoader.run();

        assertEquals(firstCount, questionRepository.count());
        assertFalse(firstCount < 50);

        List<String> languages = TechnologyCatalog.all().stream()
                .filter(option -> option.category().equals("Programming languages"))
                .map(option -> option.name())
                .toList();
        for (String language : languages) {
            for (String difficulty : List.of("Easy", "Medium", "Hard")) {
                List<Question> questions = questionRepository
                        .findByLanguageIgnoreCaseAndDifficultyIgnoreCase(language, difficulty);
                assertFalse(questions.isEmpty(), language + " has no " + difficulty + " questions");
            }
        }
    }
}