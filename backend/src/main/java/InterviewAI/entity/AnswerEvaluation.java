package InterviewAI.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "answer_evaluation")
public class AnswerEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_id", nullable = false, unique = true)
    private InterviewAnswer answer;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String correctnessFeedback;

    @ElementCollection
    @CollectionTable(
            name = "answer_evaluation_strengths",
            joinColumns = @JoinColumn(name = "evaluation_id")
    )
    @OrderColumn(name = "item_order")
    @Column(name = "strength", nullable = false, length = 1000)
    private List<String> strengths = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "answer_evaluation_missing_concepts",
            joinColumns = @JoinColumn(name = "evaluation_id")
    )
    @OrderColumn(name = "item_order")
    @Column(name = "concept", nullable = false, length = 1000)
    private List<String> missingConcepts = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "answer_evaluation_suggestions",
            joinColumns = @JoinColumn(name = "evaluation_id")
    )
    @OrderColumn(name = "item_order")
    @Column(name = "suggestion", nullable = false, length = 1000)
    private List<String> improvementSuggestions = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String sampleAnswer;

    @Column(nullable = false)
    private LocalDateTime evaluatedAt;

    @Column(length = 20)
    private String evaluationMode;

    public AnswerEvaluation() {
    }

    public AnswerEvaluation(
            InterviewAnswer answer,
            Integer score,
            String correctnessFeedback,
            List<String> strengths,
            List<String> missingConcepts,
            List<String> improvementSuggestions,
            String sampleAnswer) {
            this(
                answer,
                score,
                correctnessFeedback,
                strengths,
                missingConcepts,
                improvementSuggestions,
                sampleAnswer,
                "openai"
            );
            }

            public AnswerEvaluation(
                InterviewAnswer answer,
                Integer score,
                String correctnessFeedback,
                List<String> strengths,
                List<String> missingConcepts,
                List<String> improvementSuggestions,
                String sampleAnswer,
                String evaluationMode) {
        this.answer = answer;
        this.score = score;
        this.correctnessFeedback = correctnessFeedback;
        this.strengths = new ArrayList<>(strengths);
        this.missingConcepts = new ArrayList<>(missingConcepts);
        this.improvementSuggestions = new ArrayList<>(improvementSuggestions);
        this.sampleAnswer = sampleAnswer;
        this.evaluatedAt = LocalDateTime.now();
        this.evaluationMode = evaluationMode;
    }

    public Long getId() {
        return id;
    }

    public InterviewAnswer getAnswer() {
        return answer;
    }

    public Integer getScore() {
        return score;
    }

    public String getCorrectnessFeedback() {
        return correctnessFeedback;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getMissingConcepts() {
        return missingConcepts;
    }

    public List<String> getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public String getSampleAnswer() {
        return sampleAnswer;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public String getEvaluationMode() {
        return evaluationMode;
    }
}