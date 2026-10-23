package InterviewAI;

import InterviewAI.entity.AppUser;
import InterviewAI.repository.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.onrender.com"})
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String name = request.getName().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered."));
        }

        AppUser user = new AppUser(
                name,
                email,
                passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Optional<AppUser> optionalUser =
                userRepository.findByEmailIgnoreCase(email);

        if (optionalUser.isEmpty()
                || !passwordEncoder.matches(
                        request.getPassword(),
                        optionalUser.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        AppUser user = optionalUser.get();
        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful!",
                "token", token,
                "name", user.getName(),
                "email", user.getEmail()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof String)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        String email = (String) authentication.getPrincipal();

        return userRepository.findByEmailIgnoreCase(email)
                .<ResponseEntity<?>>map(user ->
                        ResponseEntity.ok(Map.of(
                                "name", user.getName(),
                                "email", user.getEmail())))
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "User not found.")));
    }

    
    @DeleteMapping("/user")
    public ResponseEntity<?> deleteUser(@RequestParam String email) {
        String cleanEmail = email.trim().toLowerCase();
        Optional<AppUser> user = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok(Map.of("message", "User " + cleanEmail + " deleted successfully."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
    }

    @PostMapping("/delete-user")
    public ResponseEntity<?> deleteUserPost(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null && !email.isBlank()) {
            String cleanEmail = email.trim().toLowerCase();
            Optional<AppUser> user = userRepository.findByEmailIgnoreCase(cleanEmail);
            if (user.isPresent()) {
                userRepository.delete(user.get());
                return ResponseEntity.ok(Map.of("message", "User " + cleanEmail + " deleted successfully."));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
    }

public static class RegisterRequest {

        @NotBlank
        @Size(max = 100)
        private String name;

        @NotBlank
        @Email
        @Size(max = 254)
        private String email;

        @NotBlank
        @Size(min = 8, max = 72)
        private String password;

        public RegisterRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {

        @NotBlank
        @Email
        @Size(max = 254)
        private String email;

        @NotBlank
        @Size(max = 72)
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}