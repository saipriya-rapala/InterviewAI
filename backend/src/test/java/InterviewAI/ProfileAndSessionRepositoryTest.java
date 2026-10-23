package InterviewAI;

import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.InterviewSession;
import InterviewAI.entity.InterviewSessionQuestion;
import InterviewAI.entity.ProfileExperience;
import InterviewAI.entity.ProfileProject;
import InterviewAI.entity.ResumeDocument;
import InterviewAI.repository.AppUserRepository;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.InterviewSessionRepository;
import InterviewAI.repository.ResumeDocumentRepository;
import InterviewAI.service.CandidateProfileService;
import InterviewAI.service.ResumeProfileParser;
import InterviewAI.service.ResumeProfileService;
import InterviewAI.service.ResumeTextExtractor;
import jakarta.persistence.EntityManager;
import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.mock.web.MockMultipartFile;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class ProfileAndSessionRepositoryTest {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Autowired
    private ResumeDocumentRepository resumeRepository;

    @Autowired
    private InterviewSessionRepository sessionRepository;

        @Autowired
        private EntityManager entityManager;

        @TempDir
        private Path storageDirectory;

    @Test
    void persistsEditableProfileResumeMetadataAndOwnedSession() {
        AppUser user = userRepository.save(
                new AppUser("Candidate", "candidate@example.com", "encoded")
        );
        CandidateProfile profile = new CandidateProfile(user);
        profile.setTargetRole("Backend Engineer");
        profile.setTechnicalSkills(List.of("Java", "Spring Boot", "PostgreSQL"));
        profile.setProjects(List.of(new ProfileProject(
                "Order API", "Order service", "Spring Boot, PostgreSQL", "Designed endpoints"
        )));
        profile.setWorkExperience(List.of(new ProfileExperience(
                "Developer", "Example Co", "2023-2025", "Built APIs"
        )));
        profileRepository.saveAndFlush(profile);
        resumeRepository.saveAndFlush(new ResumeDocument(
                profile,
                "a1b2c3d4e5f607182930aabbccddeeff",
                "resume.pdf",
                "application/pdf"
        ));

        InterviewSession session = new InterviewSession(
                user,
                "Backend Engineer",
                "Medium",
                List.of("Project deep dive")
        );
        session.addQuestion(new InterviewSessionQuestion(
                "Project deep dive",
                "PROFILE_GENERATED",
                "Describe the Order API architecture.",
                "Describe components and trade-offs."
        ));
        sessionRepository.saveAndFlush(session);

        CandidateProfile loadedProfile = profileRepository.findByUser(user).orElseThrow();
        InterviewSession loadedSession = sessionRepository
                .findByIdAndUser(session.getId(), user)
                .orElseThrow();

        assertEquals(List.of("Java", "Spring Boot", "PostgreSQL"), loadedProfile.getTechnicalSkills());
        assertEquals("Spring Boot, PostgreSQL", loadedProfile.getProjects().getFirst().getTechnologies());
        assertEquals("Example Co", loadedProfile.getWorkExperience().getFirst().getOrganization());
        assertEquals("resume.pdf", resumeRepository.findByProfile(loadedProfile)
                .orElseThrow().getOriginalFileName());
        assertEquals(1, loadedSession.getQuestions().size());
        assertTrue(loadedSession.getQuestions().getFirst().getQuestionText().contains("Order API"));
    }

        @Test
        void persistsParsedResumeCollectionsWhenUpdatingAnExistingProfile() {
                AppUser user = userRepository.save(
                                new AppUser("Candidate", "candidate@example.com", "encoded")
                );
                CandidateProfile profile = new CandidateProfile(user);
                profile.setTechnicalSkills(List.of("Java"));
                profile.setResumeAnalysisSummary("Professional overview\nBackend developer");
                profile.setResumeAnalysisMode("deterministic");
                profileRepository.saveAndFlush(profile);
                entityManager.clear();

                CandidateProfile loadedProfile = profileRepository.findByUser(user).orElseThrow();
                ResumeProfileParser.ParsedResume parsed = new ResumeProfileParser.ParsedResume(
                                "Candidate",
                                "candidate@example.com",
                                null,
                                "Backend developer",
                                List.of("Java", "Spring Boot", "PostgreSQL"),
                                List.of("Collaboration"),
                                List.of("B.S. Computer Science"),
                                List.of(),
                                List.of("Improved API latency"),
                                List.of(new ProfileProject("Order API", "Order service", "Spring Boot, PostgreSQL", "Built endpoints")),
                                List.of(new ProfileExperience("Developer", "Example Co", "2023-2025", "Built APIs"))
                );

                new CandidateProfileService(profileRepository, resumeRepository)
                        .applyParsedResume(loadedProfile, parsed);
                        new CandidateProfileService(profileRepository, resumeRepository)
                                .applyParsedResume(loadedProfile, parsed);
                profileRepository.saveAndFlush(loadedProfile);
                entityManager.clear();

                CandidateProfile persisted = profileRepository.findByUser(user).orElseThrow();
                assertEquals(List.of("Java", "Spring Boot", "PostgreSQL"), persisted.getTechnicalSkills());
                assertEquals("B.S. Computer Science", persisted.getEducation().getFirst());
                assertEquals("Order API", persisted.getProjects().getFirst().getName());
                assertEquals("Example Co", persisted.getWorkExperience().getFirst().getOrganization());
                assertEquals("deterministic", persisted.getResumeAnalysisMode());
                assertTrue(persisted.getResumeAnalysisSummary().contains("Backend developer"));
        }

        @Test
        void uploadsDocxAndReloadsParsedProfileSummaryAndResumeMetadata() throws Exception {
                AppUser user = userRepository.save(
                                new AppUser("Candidate", "candidate@example.com", "encoded")
                );
                byte[] docx;
                try (XWPFDocument document = new XWPFDocument(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                        document.createParagraph().createRun().setText("Candidate Name");
                        document.createParagraph().createRun().setText("SKILLS");
                        document.createParagraph().createRun().setText("Java, Spring Boot, PostgreSQL");
                        document.createParagraph().createRun().setText("PROJECTS");
                        document.createParagraph().createRun().setText("Order API | REST order service using Spring Boot and PostgreSQL");
                        document.write(output);
                        docx = output.toByteArray();
                }

                ResumeProfileService resumeService = new ResumeProfileService(
                                storageDirectory,
                                new ResumeTextExtractor(),
                                new ResumeProfileParser(),
                                new CandidateProfileService(profileRepository, resumeRepository),
                                profileRepository,
                                resumeRepository
                );
                resumeService.upload(user, new MockMultipartFile(
                                "file",
                                "candidate.docx",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                docx
                ));
                entityManager.flush();
                entityManager.clear();

                CandidateProfile persisted = profileRepository.findByUser(user).orElseThrow();
                assertTrue(persisted.getTechnicalSkills().contains("Java"));
                assertEquals("Order API", persisted.getProjects().getFirst().getName());
                assertTrue(persisted.getResumeAnalysisSummary().contains("Potential interview focus areas"));
                assertEquals("deterministic", persisted.getResumeAnalysisMode());
                assertEquals("candidate.docx", resumeRepository.findByProfile(persisted)
                                .orElseThrow().getOriginalFileName());
        }
}