package InterviewAI.service;

import InterviewAI.dto.EvaluationFeedback;

public interface AnswerEvaluator {

    EvaluationFeedback evaluate(
            String language,
            String questionText,
            String answerText);
        default String evaluationMode() {
            return "openai";
        }
}