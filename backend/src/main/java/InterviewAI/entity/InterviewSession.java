package InterviewAI.entity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_session")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private CandidateProfile profile;

    @Column(length = 20)
    private String scope;

    @Column(length = 180)
    private String focus;

    @Column(length = 120)
    private String targetRole;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ElementCollection
    @CollectionTable(name = "interview_session_categories",
            joinColumns = @JoinColumn(name = "session_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "category", nullable = false, length = 80)
    private List<String> categories = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<InterviewSessionQuestion> questions = new ArrayList<>();

    public InterviewSession() {
    }

    public InterviewSession(AppUser user, String targetRole, String difficulty, List<String> categories) {
        this(user, null, targetRole, difficulty, categories);
    }

    public InterviewSession(AppUser user, CandidateProfile profile, String targetRole, String difficulty, List<String> categories) {
        this(user, profile, targetRole, difficulty, categories, null, null);
    }

    public InterviewSession(AppUser user, CandidateProfile profile, String targetRole, String difficulty, List<String> categories, String scope, String focus) {
        this.user = user;
        this.profile = profile;
        this.scope = scope;
        this.focus = focus;
        this.targetRole = targetRole;
        this.difficulty = difficulty;
        this.categories = new ArrayList<>(categories);
        this.createdAt = LocalDateTime.now();
    }

    public void addQuestion(InterviewSessionQuestion question) {
        question.setSession(this);
        questions.add(question);
    }

    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public CandidateProfile getProfile() { return profile; }
        public String getScope() { return scope; }
        public String getFocus() { return focus; }
    public String getTargetRole() { return targetRole; }
    public String getDifficulty() { return difficulty; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<String> getCategories() { return categories; }
    public List<InterviewSessionQuestion> getQuestions() { return questions; }
}