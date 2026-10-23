package InterviewAI.repository;

import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

    Optional<CandidateProfile> findByUser(AppUser user);
}