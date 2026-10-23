package InterviewAI.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InterviewAnswerRequest(
        @NotBlank @Size(max = 20_000) String answerText) {
}