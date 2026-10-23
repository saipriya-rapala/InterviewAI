package InterviewAI;

import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.service.AiEvaluationException;
import InterviewAI.service.OpenAiAnswerEvaluator;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.io.IOException;
import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OpenAiAnswerEvaluatorTest {

    private static final String VALID_FEEDBACK = """
            {"score":8,"correctnessFeedback":"Correct and relevant.","strengths":["Identifies the key idea"],"missingConcepts":[],"improvementSuggestions":["Mention the time complexity"],"sampleAnswer":"A concise ideal answer."}
            """;

    @Mock
    private HttpClient httpClient;

    @Mock
    private HttpResponse<String> httpResponse;

    private OpenAiAnswerEvaluator evaluator;

    @BeforeEach
    void setUp() {
        evaluator = new OpenAiAnswerEvaluator(
                new ObjectMapper(),
                "test-key",
                "https://provider.example.test/v1/chat/completions",
                "test-model",
                Duration.ofSeconds(3),
                httpClient
        );
    }

    @Test
    void parsesAndValidatesProviderFeedback() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(200);
        when(httpResponse.body()).thenReturn(envelope(VALID_FEEDBACK));

        EvaluationFeedback feedback = evaluator.evaluate(
                "Java",
                "What is encapsulation?",
                "It hides internal state."
        );

        assertEquals(8, feedback.score());
        assertEquals("Correct and relevant.", feedback.correctnessFeedback());
        assertEquals("A concise ideal answer.", feedback.sampleAnswer());
    }

    @Test
    void rejectsProviderScoreOutsideZeroToTen() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(200);
        when(httpResponse.body()).thenReturn(envelope(
                VALID_FEEDBACK.replace("\"score\":8", "\"score\":11")
        ));

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
    }

    @Test
        void mapsProviderOutageToServiceUnavailable() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(500);

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }

    @Test
    void mapsProviderAuthenticationFailureToBadGateway() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(401);

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
    }

    @Test
    void mapsProviderRateLimitToTooManyRequests() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(429);

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, exception.getStatusCode());
    }

    @Test
    void mapsNetworkFailureToServiceUnavailable() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenThrow(new IOException("network unavailable"));

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }

    @Test
    void mapsTimeoutToGatewayTimeout() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenThrow(new HttpTimeoutException("timeout"));

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.GATEWAY_TIMEOUT, exception.getStatusCode());
    }

    @Test
        void reportsMissingApiKeyWithoutCallingProvider() throws Exception {
        OpenAiAnswerEvaluator unconfigured = new OpenAiAnswerEvaluator(
                new ObjectMapper(),
                " ",
                "https://provider.example.test/v1/chat/completions",
                "test-model",
                Duration.ofSeconds(3),
                httpClient
        );

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> unconfigured.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
        verify(httpClient, org.mockito.Mockito.never()).send(
                any(HttpRequest.class),
                any(HttpResponse.BodyHandler.class)
        );
    }

    @Test
    void rejectsMalformedProviderResponse() throws Exception {
        when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                .thenReturn(httpResponse);
        when(httpResponse.statusCode()).thenReturn(200);
        when(httpResponse.body()).thenReturn("{\"choices\":[]}");

        AiEvaluationException exception = assertThrows(
                AiEvaluationException.class,
                () -> evaluator.evaluate("Java", "Question", "Answer")
        );

        assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
    }

        @Test
        void rejectsMalformedFeedbackJson() throws Exception {
                when(httpClient.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
                                .thenReturn(httpResponse);
                when(httpResponse.statusCode()).thenReturn(200);
                when(httpResponse.body()).thenReturn(envelope("{not-json"));

                AiEvaluationException exception = assertThrows(
                                AiEvaluationException.class,
                                () -> evaluator.evaluate("Java", "Question", "Answer")
                );

                assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
        }

        private String envelope(String content) throws Exception {
        return "{\"choices\":[{\"message\":{\"content\":"
                + new ObjectMapper().writeValueAsString(content)
                + "}}]}";
    }
}