package InterviewAI.dto;

import jakarta.validation.constraints.Size;

public record ProfileExperienceDto(
        @Size(max = 180) String title,
        @Size(max = 180) String organization,
        @Size(max = 100) String period,
        @Size(max = 5000) String details) {
}