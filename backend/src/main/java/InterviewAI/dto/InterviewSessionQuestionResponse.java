package InterviewAI.dto;

import java.util.List;

public record InterviewSessionQuestionResponse(
        Long id,
        int order,
        String category,
        String source,
        String questionText,
        String answerText,
        Integer score,
        String correctnessFeedback,
        List<String> strengths,
        List<String> missingConcepts,
        List<String> improvementSuggestions,
        String sampleAnswer,
        String followUpQuestion,
        String evaluationMode) {
}