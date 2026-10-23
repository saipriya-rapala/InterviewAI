package InterviewAI.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AnswerEvaluationResponse(
        Long id,
        Long answerId,
        Integer score,
        String correctnessFeedback,
        List<String> strengths,
        List<String> missingConcepts,
        List<String> improvementSuggestions,
        String sampleAnswer,
        LocalDateTime evaluatedAt,
        String evaluationMode) {
}