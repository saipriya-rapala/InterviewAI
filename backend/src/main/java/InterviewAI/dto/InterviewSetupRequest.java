package InterviewAI.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;

public record InterviewSetupRequest(
        @Size(max = 120) String targetRole,
        @Size(max = 20) String difficulty,
        @Min(1) @Max(30) Integer questionCount,
                @Size(max = 8) List<@Size(max = 80) String> categories,
                @Size(max = 20) String scope,
                @Size(max = 180) String focus) {

        public InterviewSetupRequest(
                        String targetRole,
                        String difficulty,
                        Integer questionCount,
                        List<String> categories) {
                this(targetRole, difficulty, questionCount, categories, null, null);
        }
}