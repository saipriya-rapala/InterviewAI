package InterviewAI;

import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.dto.InterviewAnswerRequest;
import InterviewAI.dto.InterviewSetupRequest;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.InterviewSession;
import InterviewAI.entity.InterviewSessionQuestion;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.InterviewSessionQuestionRepository;
import InterviewAI.repository.InterviewSessionRepository;
import InterviewAI.repository.QuestionRepository;
import InterviewAI.service.AnswerEvaluator;
import InterviewAI.service.PersonalizedInterviewService;
import InterviewAI.service.ResumeAiAssistant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.test.util.ReflectionTestUtils;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PersonalizedInterviewServiceTest {

    @Mock
    private CandidateProfileRepository profileRepository;

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private InterviewSessionQuestionRepository sessionQuestionRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerEvaluator answerEvaluator;

        @Mock
        private ResumeAiAssistant resumeAiAssistant;

    private PersonalizedInterviewService service;
    private AppUser user;

    @BeforeEach
    void setUp() {
        service = new PersonalizedInterviewService(
                profileRepository,
                sessionRepository,
                sessionQuestionRepository,
                questionRepository,
                answerEvaluator,
                resumeAiAssistant
        );
        user = new AppUser("Candidate", "candidate@example.com", "encoded");
    }

    @Test
    void generatesProjectPromptFromUserSuppliedDetailsOnly() {
        CandidateProfile profile = new CandidateProfile(user);
        profile.setTechnicalSkills(List.of("Java", "Spring Boot", "PostgreSQL"));
        profile.setProjects(List.of(new InterviewAI.entity.ProfileProject(
                "Order API",
                "Order service with database persistence.",
                "Spring Boot, PostgreSQL",
                "Implemented REST endpoints."
        )));
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(questionRepository.findAllByDifficultyIgnoreCase("Medium"))
                .thenReturn(List.of());
        when(sessionRepository.save(any(InterviewSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(user, new InterviewSetupRequest(
                "Backend Engineer",
                "Medium",
                1,
                List.of("Project deep dive")
        ));

        assertEquals(1, response.questions().size());
        assertTrue(response.questions().getFirst().questionText().contains("Order API"));
        assertTrue(response.questions().getFirst().questionText().contains("Spring Boot, PostgreSQL"));
        assertEquals("PROFILE_GENERATED", response.questions().getFirst().source());
        verify(answerEvaluator, never()).evaluate(any(), any(), any());
    }

    @Test
    void resumeProjectScopeGeneratesAndStoresOnlyQuestionsForTheOwnedProject() {
        CandidateProfile profile = new CandidateProfile(user);
        profile.setTechnicalSkills(List.of("Java", "Spring Boot"));
        profile.setProjects(List.of(
                new InterviewAI.entity.ProfileProject("Order API", "Order service", "Spring Boot", "Built endpoints"),
                new InterviewAI.entity.ProfileProject("Study Planner", "Planning app", "React", "Built screens")
        ));
        profile.setResume(new InterviewAI.entity.ResumeDocument(
                profile, "a1b2c3d4e5f607182930aabbccddeeff", "resume.pdf", "application/pdf"));
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(sessionRepository.save(any(InterviewSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(user, new InterviewSetupRequest(
                "Backend Engineer", "Medium", 10, List.of(), "PROJECT", "Order API"
        ));
        assertEquals(10, response.questions().size());

        assertEquals("PROJECT", response.scope());
        assertEquals("Order API", response.focus());
        assertTrue(response.questions().stream().allMatch(question ->
                question.questionText().contains("Order API")
                        && question.source().equals("RESUME_FALLBACK")));
        ArgumentCaptor<InterviewSession> sessionCaptor = ArgumentCaptor.forClass(InterviewSession.class);
        verify(sessionRepository).save(sessionCaptor.capture());
        assertEquals(profile, sessionCaptor.getValue().getProfile());
    }

        @Test
        void rejectsProjectNotPresentInAuthenticatedUsersProfile() {
                CandidateProfile profile = new CandidateProfile(user);
                profile.setProjects(List.of(new InterviewAI.entity.ProfileProject(
                                "Order API", "Order service", "Spring Boot", "Built endpoints"
                )));
                        profile.setResume(new InterviewAI.entity.ResumeDocument(
                                profile, "a1b2c3d4e5f607182930aabbccddeeff", "resume.pdf", "application/pdf"));
                when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

                assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> service.create(
                                user,
                                new InterviewSetupRequest("Backend Engineer", "Easy", 3, List.of(), "PROJECT", "Another User Project")
                ));
                verify(sessionRepository, never()).save(any());
        }

            @Test
            void usesResumeAiQuestionsWhenProviderReturnsGroundedContent() {
                CandidateProfile profile = new CandidateProfile(user);
                profile.setProjects(List.of(new InterviewAI.entity.ProfileProject(
                        "Order API", "Order service", "Spring Boot", "Built endpoints"
                )));
                profile.setResume(new InterviewAI.entity.ResumeDocument(
                        profile, "a1b2c3d4e5f607182930aabbccddeeff", "resume.pdf", "application/pdf"));
                when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
                when(resumeAiAssistant.isConfigured()).thenReturn(true);
                when(resumeAiAssistant.generateQuestions(profile, "Hard", 1, "PROJECT", "Order API"))
                        .thenReturn(List.of(new ResumeAiAssistant.GeneratedQuestion(
                                "Project architecture",
                                "For Order API, how would you evaluate a security boundary?",
                                "Discuss a verified design decision and trade-off without assuming unlisted implementation details."
                        )));
                when(sessionRepository.save(any(InterviewSession.class)))
                        .thenAnswer(invocation -> invocation.getArgument(0));

                var response = service.create(user, new InterviewSetupRequest(
                        "Backend Engineer", "Hard", 1, List.of(), "PROJECT", "Order API"
                ));

                assertEquals("RESUME_AI", response.questions().getFirst().source());
                assertTrue(response.questions().getFirst().questionText().contains("Order API"));
                verify(resumeAiAssistant).generateQuestions(profile, "Hard", 1, "PROJECT", "Order API");
            }

    @Test
    void generatesQuestionsForTopicsExplicitlySelectedByCandidate() {
        CandidateProfile profile = new CandidateProfile(user);
        profile.setTopicsToPractice(List.of("PostgreSQL indexing"));
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(questionRepository.findAllByDifficultyIgnoreCase("Easy"))
                .thenReturn(List.of());
        when(sessionRepository.save(any(InterviewSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(user, new InterviewSetupRequest(
                "Database Engineer",
                "Easy",
                1,
                List.of("Database and SQL")
        ));

        assertTrue(response.questions().getFirst().questionText().contains("PostgreSQL indexing"));
        assertEquals("PROFILE_GENERATED", response.questions().getFirst().source());
    }

    @Test
    void evaluatesAndPersistsAnswerOnOwnedSessionQuestion() {
        InterviewSession session = new InterviewSession(user, "Backend Engineer", "Medium", List.of("Project deep dive"));
        ReflectionTestUtils.setField(session, "id", 4L);
        InterviewSessionQuestion sessionQuestion = new InterviewSessionQuestion(
                "Project deep dive",
                "PROFILE_GENERATED",
                "Describe the project architecture.",
                "Explain components and trade-offs."
        );
        session.addQuestion(sessionQuestion);
        sessionQuestion.setAnswerText(null);
        when(sessionRepository.findByIdAndUser(4L, user)).thenReturn(Optional.of(session));
        when(sessionQuestionRepository.findByIdAndSession_Id(7L, 4L))
                .thenReturn(Optional.of(sessionQuestion));
        when(answerEvaluator.evaluate("Interview", "Describe the project architecture.", "I built a service."))
                .thenReturn(new EvaluationFeedback(
                        6,
                        "Mock feedback.",
                        List.of("Describes a service"),
                        List.of("architecture detail"),
                        List.of("Explain the data flow"),
                        "A stronger answer explains the components."
                ));
        when(answerEvaluator.evaluationMode()).thenReturn("mock");

        var response = service.submitAnswer(
                user,
                4L,
                7L,
                new InterviewAnswerRequest("I built a service.")
        );

        assertEquals("mock", response.questions().getFirst().evaluationMode());
        assertEquals(6, response.questions().getFirst().score());
        assertTrue(response.questions().getFirst().followUpQuestion().contains("architecture detail"));
        ArgumentCaptor<InterviewSessionQuestion> questionCaptor =
                ArgumentCaptor.forClass(InterviewSessionQuestion.class);
        verify(sessionQuestionRepository).save(questionCaptor.capture());
        assertEquals("I built a service.", questionCaptor.getValue().getAnswerText());
    }

    @Test
    void preventsOtherUserFromReadingOrAnsweringSession() {
        when(sessionRepository.findByIdAndUser(4L, user)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> service.get(user, 4L));
        assertThrows(ResponseStatusException.class, () -> service.submitAnswer(
                user, 4L, 7L, new InterviewAnswerRequest("answer")
        ));

        verify(sessionQuestionRepository, never()).findByIdAndSession_Id(any(), any());
        verify(answerEvaluator, never()).evaluate(any(), any(), any());
    }

        @Test
        void fallsBackToRuleBasedFeedbackWhenAiProviderFails() {
                InterviewSession session = new InterviewSession(user, "Backend Engineer", "Medium", List.of("Project deep dive"));
                ReflectionTestUtils.setField(session, "id", 4L);
                InterviewSessionQuestion sessionQuestion = new InterviewSessionQuestion(
                                "Project deep dive", "RESUME_FALLBACK", "Explain the Order API architecture.", "Grounded sample."
                );
                session.addQuestion(sessionQuestion);
                when(sessionRepository.findByIdAndUser(4L, user)).thenReturn(Optional.of(session));
                when(sessionQuestionRepository.findByIdAndSession_Id(7L, 4L)).thenReturn(Optional.of(sessionQuestion));
                when(answerEvaluator.evaluate(any(), any(), any()))
                                .thenThrow(new InterviewAI.service.AiEvaluationException(
                                                org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Provider unavailable"));
                when(sessionQuestionRepository.save(any(InterviewSessionQuestion.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                var response = service.submitAnswer(user, 4L, 7L, new InterviewAnswerRequest("I would trace the request flow."));

                assertEquals("rule-based-fallback", response.questions().getFirst().evaluationMode());
                assertTrue(response.questions().getFirst().score() != null);
        }
}