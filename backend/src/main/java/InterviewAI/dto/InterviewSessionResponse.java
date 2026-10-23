package InterviewAI.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InterviewSessionResponse(
        Long id,
        String targetRole,
        String difficulty,
        LocalDateTime createdAt,
        List<String> categories,
        List<InterviewSessionQuestionResponse> questions,
        String scope,
        String focus) {
}