package InterviewAI.dto;

import java.time.LocalDateTime;

public record AnswerHistoryItem(
        Long id,
        Long questionId,
        String answerText,
        LocalDateTime submittedAt,
        String questionText,
        String language,
        boolean evaluationAvailable) {
}