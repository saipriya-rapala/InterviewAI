package InterviewAI;

import InterviewAI.entity.Question;
import InterviewAI.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    public DataLoader(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) {

        addQuestion("Java", "Easy", "What is Java?");
        addQuestion("Java", "Easy", "What is a class in Java?");
        addQuestion("Java", "Easy", "What is an object in Java?");

        addQuestion("Java", "Hard", "Explain multithreading in Java.");
        addQuestion("Java", "Hard", "What is the difference between HashMap and Hashtable?");
        addQuestion("Java", "Hard", "Explain exception handling in Java.");

        addQuestion("Python", "Easy", "What is Python?");
        addQuestion("Python", "Easy", "What is a list in Python?");
        addQuestion("Python", "Easy", "What is a tuple in Python?");

        addQuestion("Python", "Hard", "Explain decorators in Python.");
        addQuestion("Python", "Hard", "What are generators in Python?");
        addQuestion("Python", "Hard", "Explain Python's memory management.");

        addQuestion("SQL", "Easy", "What is SQL?");
        addQuestion("SQL", "Easy", "What is a primary key?");
        addQuestion("SQL", "Easy", "What is a foreign key?");

        addQuestion("SQL", "Hard", "Explain joins in SQL.");
        addQuestion("SQL", "Hard", "What is a window function?");
        addQuestion("SQL", "Hard", "Explain database normalization.");

        for (QuestionBankCatalog.Seed seed : QuestionBankCatalog.questions()) {
            addQuestion(seed.language(), seed.difficulty(), seed.category(), seed.questionText());
        }

        System.out.println("Interview questions checked and loaded!");
    }

    private void addQuestion(String language, String difficulty, String questionText) {
        addQuestion(language, difficulty, "Language fundamentals", questionText);
    }

    private void addQuestion(String language, String difficulty, String category, String questionText) {
        Question existing = questionRepository
                .findByLanguageIgnoreCaseAndQuestionTextIgnoreCase(language, questionText)
                .orElse(null);
        if (existing == null) {
            questionRepository.save(new Question(language, difficulty, category, questionText));
        } else if (existing.getCategory() == null || existing.getCategory().isBlank()) {
            existing.setCategory(category);
            questionRepository.save(existing);
        }
    }
}