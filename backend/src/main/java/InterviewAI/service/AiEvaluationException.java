package InterviewAI.service;

import org.springframework.web.server.ResponseStatusException;

import org.springframework.http.HttpStatus;

public class AiEvaluationException extends ResponseStatusException {
    public AiEvaluationException(HttpStatus status, String message) {
        super(status, message);
    }
}