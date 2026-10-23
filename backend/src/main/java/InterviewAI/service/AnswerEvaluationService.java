package InterviewAI.service;

import InterviewAI.dto.AnswerEvaluationResponse;
import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.entity.AnswerEvaluation;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.InterviewAnswer;
import InterviewAI.entity.Question;
import InterviewAI.repository.AnswerEvaluationRepository;
import InterviewAI.repository.InterviewAnswerRepository;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.AiEvaluationException;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AnswerEvaluationService {

    private static final Set<String> SUPPORTED_LANGUAGES =
            Set.of("java", "python", "sql");

    private final InterviewAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final AnswerEvaluationRepository evaluationRepository;
    private final AnswerEvaluator answerEvaluator;

    public AnswerEvaluationService(
            InterviewAnswerRepository answerRepository,
            QuestionRepository questionRepository,
            AnswerEvaluationRepository evaluationRepository,
            AnswerEvaluator answerEvaluator) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.evaluationRepository = evaluationRepository;
        this.answerEvaluator = answerEvaluator;
    }

    @Transactional
    public AnswerEvaluationResponse evaluate(Long answerId, AppUser user) {
        InterviewAnswer answer = findOwnedAnswer(answerId, user);

        AnswerEvaluation existing = evaluationRepository
                .findByAnswer_Id(answer.getId())
                .orElse(null);
        if (existing != null) {
            return toResponse(existing, answer.getId());
        }

        String answerText = answer.getAnswerText();
        if (answerText != null && answerText.length() > AnswerLimits.MAX_ANSWER_LENGTH) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Answers must be 20,000 characters or fewer."
            );
        }

        Question question = questionRepository.findById(answer.getQuestionId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "The question for this answer could not be found."
                ));
        String language = question.getLanguage();
        if (language == null
                || !SUPPORTED_LANGUAGES.contains(language.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "Evaluation is supported for Java, Python, and SQL questions."
            );
        }
        if (question.getQuestionText() == null
                || question.getQuestionText().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "The question text is unavailable for evaluation."
            );
        }

        EvaluationResult result = fallbackOnProviderFailure(language, question.getQuestionText(), answerText);
        EvaluationFeedback feedback = EvaluationFeedbackValidator.validate(result.feedback());
        String evaluationMode = result.mode();
        AnswerEvaluation evaluation = evaluationRepository.save(
                new AnswerEvaluation(
                        answer,
                        feedback.score(),
                        feedback.correctnessFeedback(),
                        feedback.strengths(),
                        feedback.missingConcepts(),
                        feedback.improvementSuggestions(),
                        feedback.sampleAnswer(),
                        evaluationMode
                )
        );

        return toResponse(evaluation, answer.getId());
    }

    private EvaluationResult fallbackOnProviderFailure(String language, String question, String answer) {
        try {
            return new EvaluationResult(answerEvaluator.evaluate(language, question, answer), answerEvaluator.evaluationMode());
        } catch (AiEvaluationException exception) {
            return new EvaluationResult(new MockAnswerEvaluator().evaluate(language, question, answer), "rule-based-fallback");
        }
    }

    @Transactional(readOnly = true)
    public AnswerEvaluationResponse getEvaluation(Long answerId, AppUser user) {
        InterviewAnswer answer = findOwnedAnswer(answerId, user);
        AnswerEvaluation evaluation = evaluationRepository
                .findByAnswer_Id(answer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No evaluation has been saved for this answer."
                ));

        return toResponse(evaluation, answer.getId());
    }

    private InterviewAnswer findOwnedAnswer(Long answerId, AppUser user) {
        return answerRepository.findByIdAndUser(answerId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Answer not found."
                ));
    }

    private AnswerEvaluationResponse toResponse(
            AnswerEvaluation evaluation,
            Long answerId) {
        return new AnswerEvaluationResponse(
                evaluation.getId(),
                answerId,
                evaluation.getScore(),
                evaluation.getCorrectnessFeedback(),
                List.copyOf(evaluation.getStrengths()),
                List.copyOf(evaluation.getMissingConcepts()),
                List.copyOf(evaluation.getImprovementSuggestions()),
                evaluation.getSampleAnswer(),
                evaluation.getEvaluatedAt(),
                evaluation.getEvaluationMode()
        );
    }

        private record EvaluationResult(EvaluationFeedback feedback, String mode) { }
}