package InterviewAI.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String language;
    private String difficulty;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    public Question() {
    }

    public Question(String language, String difficulty, String questionText) {
        this(language, difficulty, "Language fundamentals", questionText);
    }

    public Question(String language, String difficulty, String category, String questionText) {
        this.language = language;
        this.difficulty = difficulty;
        this.category = category;
        this.questionText = questionText;
    }

    public Long getId() {
        return id;
    }

    public String getLanguage() {
        return language;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getCategory() {
        return category;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
}
