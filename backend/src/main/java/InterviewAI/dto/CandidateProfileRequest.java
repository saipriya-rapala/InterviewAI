package InterviewAI.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CandidateProfileRequest(
        @Size(max = 100) String candidateName,
        @Pattern(regexp = "^$|^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        @Size(max = 254) String contactEmail,
        @Size(max = 80) String phone,
        @Size(max = 5000) String professionalSummary,
        @Size(max = 80) String experienceLevel,
        @Size(max = 120) String targetRole,
        @Size(max = 80) String preferredLanguage,
        @Size(max = 20) String interviewDifficulty,
        @Size(max = 80) List<@Size(max = 120) String> technicalSkills,
        @Size(max = 40) List<@Size(max = 120) String> softSkills,
        @Size(max = 40) List<@Size(max = 160) String> topicsToPractice,
        @Size(max = 30) List<@Size(max = 1000) String> education,
        @Size(max = 30) List<@Size(max = 500) String> certifications,
        @Size(max = 30) List<@Size(max = 1000) String> achievements,
        @Valid @Size(max = 20) List<ProfileProjectDto> projects,
        @Valid @Size(max = 30) List<ProfileExperienceDto> workExperience) {
}