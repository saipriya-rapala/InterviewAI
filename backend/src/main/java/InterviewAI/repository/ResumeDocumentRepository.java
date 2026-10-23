package InterviewAI.repository;

import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.ResumeDocument;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeDocumentRepository extends JpaRepository<ResumeDocument, Long> {

    Optional<ResumeDocument> findByProfile(CandidateProfile profile);
}