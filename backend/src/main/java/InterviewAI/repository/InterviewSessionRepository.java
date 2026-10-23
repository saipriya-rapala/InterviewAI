package InterviewAI.repository;

import InterviewAI.entity.AppUser;
import InterviewAI.entity.InterviewSession;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    Optional<InterviewSession> findByIdAndUser(Long id, AppUser user);

    List<InterviewSession> findAllByUserOrderByCreatedAtDesc(AppUser user);
}