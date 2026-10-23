package InterviewAI;

import InterviewAI.entity.InterviewAnswer;
import InterviewAI.entity.AppUser;
import InterviewAI.dto.AnswerHistoryItem;
import InterviewAI.dto.AnswerEvaluationResponse;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.repository.InterviewAnswerRepository;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.AnswerEvaluationService;
import InterviewAI.service.AnswerLimits;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
})
public class AnswerController {

    private final InterviewAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final AppUserRepository userRepository;
    private final AnswerEvaluationService evaluationService;

    public AnswerController(
            InterviewAnswerRepository answerRepository,
            QuestionRepository questionRepository,
            AppUserRepository userRepository,
            AnswerEvaluationService evaluationService) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public InterviewAnswer submitAnswer(@RequestBody AnswerRequest request) {

        if (request == null || request.getQuestionId() == null ||
                request.getAnswerText() == null ||
                request.getAnswerText().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Question ID and answer are required"
            );
        }
            if (request.getAnswerText().length() > AnswerLimits.MAX_ANSWER_LENGTH) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Answers must be 20,000 characters or fewer."
                );
            }

        if (!questionRepository.existsById(request.getQuestionId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Question not found"
            );
        }

        InterviewAnswer answer = new InterviewAnswer(
                request.getQuestionId(),
                request.getAnswerText().trim()
        );
        answer.setUser(getAuthenticatedUser());

        return answerRepository.save(answer);
    }

    @GetMapping
    public List<InterviewAnswer> getAnswers(
            @RequestParam Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Question not found"
            );
        }

        return answerRepository.findByQuestionIdAndUser(
            questionId,
            getAuthenticatedUser()
        );
    }

    @GetMapping("/history")
    public List<AnswerHistoryItem> getHistory() {
        return answerRepository.findHistoryByUser(getAuthenticatedUser());
    }

    @PostMapping("/{answerId}/evaluate")
    public AnswerEvaluationResponse evaluateAnswer(@PathVariable Long answerId) {
        return evaluationService.evaluate(answerId, getAuthenticatedUser());
    }

    @GetMapping("/{answerId}/evaluation")
    public AnswerEvaluationResponse getEvaluation(@PathVariable Long answerId) {
        return evaluationService.getEvaluation(answerId, getAuthenticatedUser());
    }

    private AppUser getAuthenticatedUser() {
        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
            || !authentication.isAuthenticated()
            || !(authentication.getPrincipal() instanceof String email)
            || email.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Authentication required"
            );
        }

        return userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Authenticated user not found"
            ));
    }

    public static class AnswerRequest {

        private Long questionId;
        private String answerText;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getAnswerText() {
            return answerText;
        }

        public void setAnswerText(String answerText) {
            this.answerText = answerText;
        }
    }
}