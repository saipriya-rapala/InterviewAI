package InterviewAI.service;

import InterviewAI.dto.EvaluationFeedback;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(
        prefix = "app.evaluation",
        name = "mode",
        havingValue = "mock",
        matchIfMissing = true
)
public class MockAnswerEvaluator implements AnswerEvaluator {

    private static final Pattern WORD_PATTERN =
            Pattern.compile("[a-z][a-z0-9_+#-]{2,}");

    private static final Set<String> STOP_WORDS = Set.of(
            "about", "after", "also", "and", "are", "between", "can", "describe",
            "does", "explain", "for", "from", "give", "how", "into", "mean",
            "that", "the", "their", "then", "this", "through", "what", "when",
            "where", "which", "while", "with", "would", "your"
    );

    @Override
    public EvaluationFeedback evaluate(
            String language,
            String questionText,
            String answerText) {
        String response = answerText == null ? "" : answerText.trim();
        if (response.isEmpty()) {
            return evaluateEmpty(language, questionText);
        }

        MockQuestionKnowledgeBase.Entry entry = MockQuestionKnowledgeBase.find(questionText);
        return entry == null
                ? evaluateUnknown(language, questionText, response)
                : evaluateKnown(response, entry);
    }

    @Override
    public String evaluationMode() {
        return "mock";
    }

    private EvaluationFeedback evaluateEmpty(String language, String questionText) {
        MockQuestionKnowledgeBase.Entry entry = MockQuestionKnowledgeBase.find(questionText);
        List<String> missing = entry == null
                ? List.of("the main concept in the question")
                : entry.concepts().stream()
                        .limit(5)
                        .map(MockQuestionKnowledgeBase.Concept::label)
                        .toList();
        String sample = entry == null
                ? genericSample(language)
                : entry.sampleAnswer();

        return new EvaluationFeedback(
                0,
                "Mock evaluation: the answer is blank, so no question-specific concepts were demonstrated.",
                List.of("The feedback identifies a clear starting point: add an answer to demonstrate your understanding."),
                missing,
                List.of("Start with a direct definition, then explain one key detail and add an example."),
                sample
        );
    }

    private EvaluationFeedback evaluateKnown(
            String response,
            MockQuestionKnowledgeBase.Entry entry) {
        String normalizedResponse = normalize(response);
        List<MockQuestionKnowledgeBase.Concept> covered = entry.concepts().stream()
                .filter(concept -> concept.matches(normalizedResponse))
                .toList();
        List<MockQuestionKnowledgeBase.Concept> missing = entry.concepts().stream()
                .filter(concept -> !concept.matches(normalizedResponse))
                .toList();

        int totalWeight = entry.concepts().stream()
                .mapToInt(MockQuestionKnowledgeBase.Concept::weight)
                .sum();
        int coveredWeight = covered.stream()
                .mapToInt(MockQuestionKnowledgeBase.Concept::weight)
                .sum();
        int score = (int) Math.round(8.0 * coveredWeight / totalWeight);
        boolean hasExplanation = response.matches("(?s).*\\b(because|therefore|which means|so that|this allows)\\b.*")
                || sentenceCount(response) >= 2;
        boolean hasExample = response.matches("(?s).*\\b(for example|for instance|example|e\\.g\\.)\\b.*")
                || response.contains("```")
                || response.matches("(?s).*\\bnew\\s+[A-Z][A-Za-z0-9_]*\\s*\\(.*");
        if (hasExplanation) {
            score++;
        }
        if (hasExample) {
            score++;
        }
        if (wordCount(response) < 4) {
            score = Math.min(score, 3);
        }
        if (covered.isEmpty()) {
            score = Math.min(score, 2);
        }
        score = Math.min(score, 10);

        List<String> strengths = new ArrayList<>();
        if (!covered.isEmpty()) {
            strengths.add("Addresses: " + String.join(", ", covered.stream()
                    .map(MockQuestionKnowledgeBase.Concept::label)
                    .toList()) + ".");
        } else {
            strengths.add("Makes an attempt, but none of this question's expected concepts were identified.");
        }
        if (hasExplanation) {
            strengths.add("Explains how or why the main idea works.");
        }
        if (hasExample) {
            strengths.add("Supports the explanation with an example or code.");
        }

        List<String> missingLabels = missing.stream()
                .limit(5)
                .map(MockQuestionKnowledgeBase.Concept::label)
                .toList();
        List<String> suggestions = new ArrayList<>();
        if (!missingLabels.isEmpty()) {
            suggestions.add("Add these question-specific points: " + String.join(", ", missingLabels) + ".");
        }
        if (!hasExample) {
            suggestions.add("Include a small example that demonstrates the concept.");
        }
        if (suggestions.isEmpty()) {
            suggestions.add("The key points are covered; keep the explanation focused and technically precise.");
        }

        return new EvaluationFeedback(
                score,
                "Mock evaluation: matched " + covered.size() + " of "
                        + entry.concepts().size()
                        + " question-specific concepts, plus explanation/example checks. This rule-based score is only a demo, not a semantic correctness assessment.",
                strengths,
                missingLabels,
                suggestions,
                entry.sampleAnswer()
        );
    }

    private EvaluationFeedback evaluateUnknown(
            String language,
            String questionText,
            String response) {
        List<String> concepts = extractFallbackConcepts(questionText);
        String normalizedResponse = normalize(response);
        List<String> covered = concepts.stream()
                .filter(concept -> containsPhrase(normalizedResponse, concept))
                .toList();
        List<String> missing = concepts.stream()
                .filter(concept -> !covered.contains(concept))
                .limit(5)
                .toList();

        int score = concepts.isEmpty()
                ? 1
                : (int) Math.round(5.0 * covered.size() / concepts.size());
        if (sentenceCount(response) >= 2) {
            score++;
        }
        if (response.contains("```") || response.matches("(?s).*\\b(for example|for instance|example)\\b.*")) {
            score++;
        }
        score = Math.min(6, score);
        if (wordCount(response) < 4) {
            score = Math.min(score, 2);
        }

        List<String> strengths = covered.isEmpty()
                ? List.of("The response is present, but this generic fallback found no question-term overlap.")
                : List.of("Uses question terms: " + String.join(", ", covered) + ".");
        List<String> suggestions = missing.isEmpty()
                ? List.of("Compare your explanation with a trusted reference for this exact question.")
                : List.of("Check that you directly address: " + String.join(", ", missing) + ".");

        return new EvaluationFeedback(
                score,
                "Generic mock fallback: this question is not in the local reference bank. The score only measures term overlap and basic structure; it does not verify technical correctness.",
                strengths,
                missing,
                suggestions,
                genericSample(language)
        );
    }

    private List<String> extractFallbackConcepts(String questionText) {
        if (questionText == null || questionText.isBlank()) {
            return List.of();
        }

        var matcher = WORD_PATTERN.matcher(normalize(questionText));
        Set<String> concepts = new LinkedHashSet<>();
        while (matcher.find() && concepts.size() < 6) {
            String word = matcher.group();
            if (!STOP_WORDS.contains(word)) {
                concepts.add(word);
            }
        }
        return List.copyOf(concepts);
    }

    private String genericSample(String language) {
        String languageName = language == null || language.isBlank()
                ? "the relevant language"
                : language;
        return "Generic mock guidance (not verified for this question): define the key term, explain the relevant "
                + languageName
                + " behavior, then support it with a concise example. Consult a trusted reference for an authoritative answer.";
    }

    private String normalize(String value) {
        return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFKD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9+#]+", " ")
                .trim()
                .replaceAll("\\s+", " ");
    }

    private boolean containsPhrase(String normalizedText, String phrase) {
        return (" " + normalizedText + " ").contains(" " + phrase + " ");
    }

    private int sentenceCount(String response) {
        return response.split("[.!?]+(?:\\s|$)").length;
    }

    private int wordCount(String response) {
        return response.isBlank() ? 0 : response.trim().split("\\s+").length;
    }
}