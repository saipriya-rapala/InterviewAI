package InterviewAI;

import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.service.MockAnswerEvaluator;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MockAnswerEvaluatorTest {

    private final MockAnswerEvaluator evaluator = new MockAnswerEvaluator();

    @Test
    void identifiesBlankAnswerAsMockAndGivesStartingGuidance() {
        EvaluationFeedback feedback = evaluator.evaluate(
                "Java",
            "What is an object in Java?",
                "   "
        );

        assertEquals(0, feedback.score());
        assertTrue(feedback.correctnessFeedback().contains("Mock evaluation"));
        assertTrue(feedback.improvementSuggestions().getFirst().contains("definition"));
        assertTrue(feedback.sampleAnswer().contains("instance of a class"));
        }

        @Test
        void givesCorrectSampleAnswerAndConceptScoreForJavaObject() {
        EvaluationFeedback feedback = evaluator.evaluate(
            "Java",
            "What is an object in Java?",
            "An object is an instance of a class. It has state in its fields and behavior in its methods. I create one with new: Car car = new Car();"
        );

        assertEquals(10, feedback.score());
        assertTrue(feedback.sampleAnswer().contains("instance of a class"));
        assertTrue(feedback.sampleAnswer().contains("new Car()"));
        assertTrue(feedback.sampleAnswer().contains("String color"));
        assertTrue(feedback.missingConcepts().isEmpty());
        }

        @Test
        void matchesKnownQuestionIgnoringCaseAndPunctuation() {
        EvaluationFeedback feedback = evaluator.evaluate(
            "Java",
            "WHAT IS AN OBJECT IN JAVA!!!",
            "An object is an instance of a class with state and behavior. Java creates it using new."
        );

        assertTrue(feedback.sampleAnswer().contains("instance of a class"));
        assertFalse(feedback.sampleAnswer().contains("Generic mock guidance"));
        }

        @Test
        void providesQuestionSpecificPythonAndSqlSamples() {
        EvaluationFeedback python = evaluator.evaluate(
            "Python",
            "What are generators in Python?",
            "Generators use yield to lazily produce values from an iterator and can save memory."
        );
        EvaluationFeedback sql = evaluator.evaluate(
            "SQL",
            "Explain joins in SQL.",
            "A join combines rows using related columns. An inner join keeps matches and a left join retains every left row."
        );

        assertTrue(python.sampleAnswer().contains("one at a time"));
        assertTrue(sql.sampleAnswer().contains("LEFT JOIN"));
        assertTrue(python.correctnessFeedback().contains("question-specific concepts"));
        assertTrue(sql.correctnessFeedback().contains("question-specific concepts"));
        }

    @Test
    void hasSpecificSamplesForEverySeededQuestion() {
        List<QuestionCase> questions = List.of(
                new QuestionCase("Java", "What is Java?"),
                new QuestionCase("Java", "What is a class in Java?"),
                new QuestionCase("Java", "What is an object in Java?"),
                new QuestionCase("Java", "Explain multithreading in Java."),
                new QuestionCase("Java", "What is the difference between HashMap and Hashtable?"),
                new QuestionCase("Java", "Explain exception handling in Java."),
                new QuestionCase("Python", "What is Python?"),
                new QuestionCase("Python", "What is a list in Python?"),
                new QuestionCase("Python", "What is a tuple in Python?"),
                new QuestionCase("Python", "Explain decorators in Python."),
                new QuestionCase("Python", "What are generators in Python?"),
                new QuestionCase("Python", "Explain Python's memory management."),
                new QuestionCase("SQL", "What is SQL?"),
                new QuestionCase("SQL", "What is a primary key?"),
                new QuestionCase("SQL", "What is a foreign key?"),
                new QuestionCase("SQL", "Explain joins in SQL."),
                new QuestionCase("SQL", "What is a window function?"),
                new QuestionCase("SQL", "Explain database normalization.")
        );

        for (QuestionCase question : questions) {
            EvaluationFeedback feedback = evaluator.evaluate(
                    question.language(),
                    question.text(),
                    ""
            );

            assertFalse(
                    feedback.sampleAnswer().contains("Generic mock guidance"),
                    question.text()
            );
        }
    }

    @Test
    void doesNotGiveFullConceptCreditForGenericSqlTerms() {
        EvaluationFeedback feedback = evaluator.evaluate(
                "SQL",
                "Explain joins in SQL.",
                "Rows and tables connect."
        );

        assertTrue(feedback.score() <= 2);
        assertFalse(feedback.missingConcepts().isEmpty());
    }

        @Test
        void labelsUnknownQuestionSampleAsGenericAndUnverified() {
        EvaluationFeedback feedback = evaluator.evaluate(
            "Java",
            "How does a trie compress shared prefixes?",
            "A trie stores prefixes in shared paths. It can reduce repeated prefix storage."
        );

        assertTrue(feedback.correctnessFeedback().contains("not in the local reference bank"));
        assertTrue(feedback.sampleAnswer().contains("Generic mock guidance"));
        assertTrue(feedback.sampleAnswer().contains("not verified for this question"));
        assertTrue(feedback.score() <= 6);
    }

    @Test
    void capsVeryShortAnswerScoreEvenWhenItMatchesAKeyword() {
        EvaluationFeedback feedback = evaluator.evaluate(
                "Java",
                "Explain encapsulation in Java.",
                "encapsulation"
        );

        assertTrue(feedback.score() <= 3);
        assertTrue(feedback.strengths().stream()
                .anyMatch(strength -> strength.contains("encapsulation")));
    }

    @Test
    void rewardsRelevantDetailedAnswerMoreThanLongIrrelevantText() {
        EvaluationFeedback detailed = evaluator.evaluate(
                "Java",
                "Explain encapsulation in Java.",
                "Encapsulation restricts direct access to fields. Java classes expose controlled methods for reading state."
        );
        EvaluationFeedback irrelevant = evaluator.evaluate(
                "Java",
                "Explain encapsulation in Java.",
                "This unrelated discussion has many words but does not address the requested programming concepts."
        );

        assertTrue(detailed.score() > irrelevant.score());
        assertTrue(irrelevant.score() <= 3);
        assertTrue(detailed.missingConcepts().isEmpty());
    }

    @Test
    void tagsEveryResultAsMockMode() {
        assertEquals("mock", evaluator.evaluationMode());
    }

    private record QuestionCase(String language, String text) {
    }
}