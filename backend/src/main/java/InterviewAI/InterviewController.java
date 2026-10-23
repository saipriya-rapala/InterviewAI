package InterviewAI;

import InterviewAI.dto.InterviewAnswerRequest;
import InterviewAI.dto.InterviewSessionResponse;
import InterviewAI.dto.InterviewSetupRequest;
import InterviewAI.entity.AppUser;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.service.PersonalizedInterviewService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.onrender.com"})
public class InterviewController {

    private final AppUserRepository userRepository;
    private final PersonalizedInterviewService interviewService;

    public InterviewController(
            AppUserRepository userRepository,
            PersonalizedInterviewService interviewService) {
        this.userRepository = userRepository;
        this.interviewService = interviewService;
    }

    @PostMapping
    public InterviewSessionResponse create(@Valid @RequestBody InterviewSetupRequest request) {
        return interviewService.create(getAuthenticatedUser(), request);
    }

    @GetMapping
    public List<InterviewSessionResponse> list() {
        return interviewService.list(getAuthenticatedUser());
    }

    @GetMapping("/{sessionId}")
    public InterviewSessionResponse get(@PathVariable Long sessionId) {
        return interviewService.get(getAuthenticatedUser(), sessionId);
    }

    @PostMapping("/{sessionId}/questions/{questionId}/answer")
    public InterviewSessionResponse submitAnswer(
            @PathVariable Long sessionId,
            @PathVariable Long questionId,
            @Valid @RequestBody InterviewAnswerRequest request) {
        return interviewService.submitAnswer(
                getAuthenticatedUser(),
                sessionId,
                questionId,
                request
        );
    }

    private AppUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof String email)
                || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required.");
        }
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found."
                ));
    }
}