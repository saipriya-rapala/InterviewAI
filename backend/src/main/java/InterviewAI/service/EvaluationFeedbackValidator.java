package InterviewAI.service;

import InterviewAI.dto.EvaluationFeedback;
import java.util.List;
import org.springframework.http.HttpStatus;

public final class EvaluationFeedbackValidator {

    private static final int MAX_TEXT_LENGTH = 5_000;
    private static final int MAX_SAMPLE_ANSWER_LENGTH = 12_000;
    private static final int MAX_LIST_ITEMS = 8;
    private static final int MAX_LIST_ITEM_LENGTH = 1_000;

    private EvaluationFeedbackValidator() {
    }

    public static EvaluationFeedback validate(EvaluationFeedback feedback) {
        if (feedback == null
                || feedback.score() == null
                || feedback.score() < 0
                || feedback.score() > 10) {
            throw invalidFeedback();
        }

        String correctness = validateText(feedback.correctnessFeedback(), MAX_TEXT_LENGTH);
        String sampleAnswer = validateText(
                feedback.sampleAnswer(),
                MAX_SAMPLE_ANSWER_LENGTH
        );
        List<String> strengths = validateList(feedback.strengths(), true);
        List<String> missingConcepts = validateList(feedback.missingConcepts(), false);
        List<String> suggestions = validateList(
                feedback.improvementSuggestions(),
                true
        );

        return new EvaluationFeedback(
                feedback.score(),
                correctness,
                strengths,
                missingConcepts,
                suggestions,
                sampleAnswer
        );
    }

    private static String validateText(String value, int maximumLength) {
        if (value == null || value.isBlank() || value.length() > maximumLength) {
            throw invalidFeedback();
        }
        return value.trim();
    }

    private static List<String> validateList(List<String> values, boolean required) {
        if (values == null
                || values.size() > MAX_LIST_ITEMS
                || (required && values.isEmpty())) {
            throw invalidFeedback();
        }

        return values.stream()
                .map(value -> validateText(value, MAX_LIST_ITEM_LENGTH))
                .toList();
    }

    private static AiEvaluationException invalidFeedback() {
        return new AiEvaluationException(
                HttpStatus.BAD_GATEWAY,
                "The AI provider returned an invalid evaluation. Please try again."
        );
    }
}