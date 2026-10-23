package InterviewAI;

import InterviewAI.dto.CandidateProfileRequest;
import InterviewAI.dto.CandidateProfileResponse;
import InterviewAI.dto.ResumeUploadResponse;
import InterviewAI.dto.TechnologyOptionDto;
import InterviewAI.entity.AppUser;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.service.CandidateProfileService;
import InterviewAI.service.ResumeProfileService;
import InterviewAI.service.TechnologyCatalog;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.onrender.com"})
public class ProfileController {

    private final AppUserRepository userRepository;
    private final CandidateProfileService profileService;
    private final ResumeProfileService resumeProfileService;

    public ProfileController(
            AppUserRepository userRepository,
            CandidateProfileService profileService,
            ResumeProfileService resumeProfileService) {
        this.userRepository = userRepository;
        this.profileService = profileService;
        this.resumeProfileService = resumeProfileService;
    }

    @GetMapping
    public CandidateProfileResponse getProfile() {
        return profileService.getOrCreate(getAuthenticatedUser());
    }

    @PutMapping
    public CandidateProfileResponse updateProfile(
            @Valid @org.springframework.web.bind.annotation.RequestBody CandidateProfileRequest request) {
        return profileService.update(getAuthenticatedUser(), request);
    }

    @PostMapping("/resume")
    public ResumeUploadResponse uploadResume(@RequestPart("file") MultipartFile file) {
        return resumeProfileService.upload(getAuthenticatedUser(), file);
    }

    @DeleteMapping("/resume")
    public CandidateProfileResponse removeResume() {
        return resumeProfileService.removeResume(getAuthenticatedUser());
    }

    @PostMapping("/resume/analysis/regenerate")
    public CandidateProfileResponse regenerateResumeAnalysis() {
        return resumeProfileService.regenerateAnalysis(getAuthenticatedUser());
    }

    @GetMapping("/technologies")
    public List<TechnologyOptionDto> technologies() {
        return TechnologyCatalog.all();
    }

    private AppUser getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
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