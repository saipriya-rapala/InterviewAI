package InterviewAI.dto;

import java.util.List;

public record EvaluationFeedback(
        Integer score,
        String correctnessFeedback,
        List<String> strengths,
        List<String> missingConcepts,
        List<String> improvementSuggestions,
        String sampleAnswer) {
}