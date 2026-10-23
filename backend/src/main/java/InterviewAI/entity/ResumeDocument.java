package InterviewAI.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_document")
public class ResumeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private CandidateProfile profile;

    @Column(nullable = false, unique = true, length = 40)
    private String storageId;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false, length = 100)
    private String contentType;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    public ResumeDocument() {
    }

    public ResumeDocument(
            CandidateProfile profile,
            String storageId,
            String originalFileName,
            String contentType) {
        this.profile = profile;
        this.storageId = storageId;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public CandidateProfile getProfile() { return profile; }
    public String getStorageId() { return storageId; }
    public String getOriginalFileName() { return originalFileName; }
    public String getContentType() { return contentType; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setProfile(CandidateProfile profile) { this.profile = profile; }

    public void replaceFile(
            String storageId,
            String originalFileName,
            String contentType) {
        this.storageId = storageId;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
        this.uploadedAt = LocalDateTime.now();
    }
}