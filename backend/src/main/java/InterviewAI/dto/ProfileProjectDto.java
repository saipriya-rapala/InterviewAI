package InterviewAI.dto;

import jakarta.validation.constraints.Size;

public record ProfileProjectDto(
        @Size(max = 180) String name,
        @Size(max = 5000) String description,
        @Size(max = 1200) String technologies,
        @Size(max = 5000) String responsibilities) {
}