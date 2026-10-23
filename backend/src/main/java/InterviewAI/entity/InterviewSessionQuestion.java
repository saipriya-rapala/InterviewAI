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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_session_question")
public class InterviewSessionQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, length = 30)
    private String source;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String correctnessFeedback;

    @Column(columnDefinition = "TEXT")
    private String sampleAnswer;

    @Column(length = 500)
    private String followUpQuestion;

    @Column(length = 20)
    private String evaluationMode;

    @ElementCollection
    @CollectionTable(name = "session_question_strengths",
            joinColumns = @JoinColumn(name = "session_question_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "strength", nullable = false, length = 1000)
    private List<String> strengths = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "session_question_missing_concepts",
            joinColumns = @JoinColumn(name = "session_question_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "concept", nullable = false, length = 1000)
    private List<String> missingConcepts = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "session_question_suggestions",
            joinColumns = @JoinColumn(name = "session_question_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "suggestion", nullable = false, length = 1000)
    private List<String> improvementSuggestions = new ArrayList<>();

    public InterviewSessionQuestion() {
    }

    public InterviewSessionQuestion(String category, String source, String questionText, String sampleAnswer) {
        this.category = category;
        this.source = source;
        this.questionText = questionText;
        this.sampleAnswer = sampleAnswer;
    }

    public Long getId() { return id; }
    public InterviewSession getSession() { return session; }
    public String getCategory() { return category; }
    public String getSource() { return source; }
    public String getQuestionText() { return questionText; }
    public String getAnswerText() { return answerText; }
    public Integer getScore() { return score; }
    public String getCorrectnessFeedback() { return correctnessFeedback; }
    public String getSampleAnswer() { return sampleAnswer; }
    public String getFollowUpQuestion() { return followUpQuestion; }
    public String getEvaluationMode() { return evaluationMode; }
    public List<String> getStrengths() { return strengths; }
    public List<String> getMissingConcepts() { return missingConcepts; }
    public List<String> getImprovementSuggestions() { return improvementSuggestions; }

    public void setSession(InterviewSession session) { this.session = session; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
    public void setScore(Integer score) { this.score = score; }
    public void setCorrectnessFeedback(String correctnessFeedback) { this.correctnessFeedback = correctnessFeedback; }
    public void setSampleAnswer(String sampleAnswer) { this.sampleAnswer = sampleAnswer; }
    public void setFollowUpQuestion(String followUpQuestion) { this.followUpQuestion = followUpQuestion; }
    public void setEvaluationMode(String evaluationMode) { this.evaluationMode = evaluationMode; }
    public void setStrengths(List<String> strengths) { this.strengths = new ArrayList<>(strengths); }
    public void setMissingConcepts(List<String> missingConcepts) { this.missingConcepts = new ArrayList<>(missingConcepts); }
    public void setImprovementSuggestions(List<String> improvementSuggestions) { this.improvementSuggestions = new ArrayList<>(improvementSuggestions); }
}