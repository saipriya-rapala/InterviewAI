package InterviewAI.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
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
import jakarta.persistence.UniqueConstraint;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidate_profile")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    @Column(length = 100)
    private String candidateName;

    @Column(length = 254)
    private String contactEmail;

    @Column(length = 80)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String professionalSummary;

        @Column(columnDefinition = "TEXT")
        private String resumeAnalysisSummary;

        @Column(length = 30)
        private String resumeAnalysisMode;

    @Column(length = 80)
    private String experienceLevel;

    @Column(length = 120)
    private String targetRole;

    @Column(length = 80)
    private String preferredLanguage;

    @Column(length = 20)
    private String interviewDifficulty = "Medium";

    @ElementCollection
    @CollectionTable(name = "candidate_profile_skills",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "skill", nullable = false, length = 120)
    private List<String> technicalSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_soft_skills",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "skill", nullable = false, length = 120)
    private List<String> softSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_topics",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "topic", nullable = false, length = 160)
    private List<String> topicsToPractice = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_education",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "education", nullable = false, length = 1000)
    private List<String> education = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_certifications",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "certification", nullable = false, length = 500)
    private List<String> certifications = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_achievements",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @Column(name = "achievement", nullable = false, length = 1000)
    private List<String> achievements = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_projects",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "project_name", length = 180)),
            @AttributeOverride(name = "description", column = @Column(name = "description", columnDefinition = "TEXT")),
            @AttributeOverride(name = "technologies", column = @Column(name = "technologies", length = 1200)),
            @AttributeOverride(name = "responsibilities", column = @Column(name = "responsibilities", columnDefinition = "TEXT"))
    })
    private List<ProfileProject> projects = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "candidate_profile_experience",
            joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "item_order")
    @AttributeOverrides({
            @AttributeOverride(name = "title", column = @Column(name = "title", length = 180)),
            @AttributeOverride(name = "organization", column = @Column(name = "organization", length = 180)),
            @AttributeOverride(name = "period", column = @Column(name = "period", length = 100)),
            @AttributeOverride(name = "details", column = @Column(name = "details", columnDefinition = "TEXT"))
    })
    private List<ProfileExperience> workExperience = new ArrayList<>();

    @OneToOne(mappedBy = "profile", fetch = FetchType.LAZY)
    private ResumeDocument resume;

    public CandidateProfile() {
    }

    public CandidateProfile(AppUser user) {
        this.user = user;
        this.candidateName = user.getName();
        this.contactEmail = user.getEmail();
    }

    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public String getCandidateName() { return candidateName; }
    public String getContactEmail() { return contactEmail; }
    public String getPhone() { return phone; }
    public String getProfessionalSummary() { return professionalSummary; }
        public String getResumeAnalysisSummary() { return resumeAnalysisSummary; }
        public String getResumeAnalysisMode() { return resumeAnalysisMode; }
    public String getExperienceLevel() { return experienceLevel; }
    public String getTargetRole() { return targetRole; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public String getInterviewDifficulty() { return interviewDifficulty; }
    public List<String> getTechnicalSkills() { return technicalSkills; }
    public List<String> getSoftSkills() { return softSkills; }
    public List<String> getTopicsToPractice() { return topicsToPractice; }
    public List<String> getEducation() { return education; }
    public List<String> getCertifications() { return certifications; }
    public List<String> getAchievements() { return achievements; }
    public List<ProfileProject> getProjects() { return projects; }
    public List<ProfileExperience> getWorkExperience() { return workExperience; }
    public ResumeDocument getResume() { return resume; }

    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setProfessionalSummary(String professionalSummary) { this.professionalSummary = professionalSummary; }
        public void setResumeAnalysisSummary(String resumeAnalysisSummary) { this.resumeAnalysisSummary = resumeAnalysisSummary; }
        public void setResumeAnalysisMode(String resumeAnalysisMode) { this.resumeAnalysisMode = resumeAnalysisMode; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    public void setInterviewDifficulty(String interviewDifficulty) { this.interviewDifficulty = interviewDifficulty; }
    public void setTechnicalSkills(List<String> technicalSkills) { this.technicalSkills = technicalSkills; }
    public void setSoftSkills(List<String> softSkills) { this.softSkills = softSkills; }
    public void setTopicsToPractice(List<String> topicsToPractice) { this.topicsToPractice = topicsToPractice; }
    public void setEducation(List<String> education) { this.education = education; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }
    public void setAchievements(List<String> achievements) { this.achievements = achievements; }
    public void setProjects(List<ProfileProject> projects) { this.projects = projects; }
    public void setWorkExperience(List<ProfileExperience> workExperience) { this.workExperience = workExperience; }
    public void setResume(ResumeDocument resume) { this.resume = resume; }
}