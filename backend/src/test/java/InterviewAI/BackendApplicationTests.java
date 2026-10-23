package InterviewAI;

import InterviewAI.service.AnswerEvaluator;
import InterviewAI.service.MockAnswerEvaluator;
import InterviewAI.service.OpenAiAnswerEvaluator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.security.SecureRandom;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private AnswerEvaluator answerEvaluator;

	@DynamicPropertySource
	static void configureTestEnvironment(DynamicPropertyRegistry properties) {
		byte[] jwtSecret = new byte[32];
		new SecureRandom().nextBytes(jwtSecret);
		String encodedJwtSecret = Base64.getEncoder().encodeToString(jwtSecret);

		properties.add("spring.datasource.url", () ->
				"jdbc:h2:mem:interviewai-context;DB_CLOSE_DELAY=-1");
		properties.add("spring.datasource.username", () -> "sa");
		properties.add("spring.datasource.password", () -> "");
		properties.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
		properties.add("app.jwt.secret", () -> encodedJwtSecret);
		properties.add("app.ai.openai.api-key", () -> "test-only-key");
	}

	@Test
	void contextLoads() {
	}

	@Test
	void selectsOpenAiEvaluatorByDefaultWhenConfigured() {
		assertInstanceOf(OpenAiAnswerEvaluator.class, answerEvaluator);
	}

}
