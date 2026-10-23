package InterviewAI;

import InterviewAI.dto.CandidateProfileResponse;
import InterviewAI.entity.AppUser;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.service.CandidateProfileService;
import InterviewAI.service.ResumeProfileService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private CandidateProfileService profileService;

    @Mock
    private ResumeProfileService resumeProfileService;

    private ProfileController controller;

    @BeforeEach
    void setUp() {
        controller = new ProfileController(userRepository, profileService, resumeProfileService);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void profileReadsUseOnlyAuthenticatedUser() {
        AppUser user = new AppUser("Candidate", "candidate@example.com", "encoded");
        authenticateAs("candidate@example.com");
        when(userRepository.findByEmailIgnoreCase("candidate@example.com"))
                .thenReturn(Optional.of(user));
        when(profileService.getOrCreate(user)).thenReturn(new CandidateProfileResponse(
                1L, "Candidate", "candidate@example.com", null, null, null,
                null, null, "Medium", List.of(), List.of(), List.of(), List.of(),
                List.of(), List.of(), List.of(), List.of(), null, null, null
        ));

        controller.getProfile();

        verify(profileService).getOrCreate(user);
    }

    @Test
    void rejectsProfileAccessWithoutAuthenticatedPrincipal() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> controller.getProfile()
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }

    private void authenticateAs(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, List.of())
        );
    }
}