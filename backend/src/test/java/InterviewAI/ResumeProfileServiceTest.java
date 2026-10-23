package InterviewAI;

import InterviewAI.dto.CandidateProfileResponse;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.ResumeDocument;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.ResumeDocumentRepository;
import InterviewAI.service.CandidateProfileService;
import InterviewAI.service.ResumeProfileParser;
import InterviewAI.service.ResumeAiAssistant;
import InterviewAI.service.ResumeProfileService;
import InterviewAI.service.ResumeTextExtractor;
import java.nio.file.Path;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ResumeProfileServiceTest {

    @TempDir
    Path storageDirectory;

    @Mock
    private CandidateProfileService profileService;

    @Mock
    private CandidateProfileRepository profileRepository;

    @Mock
    private ResumeDocumentRepository resumeRepository;

        @Mock
        private ResumeAiAssistant resumeAiAssistant;

    private ResumeProfileService service;

    @BeforeEach
    void setUp() {
        service = new ResumeProfileService(
                storageDirectory,
                new ResumeTextExtractor(),
                new ResumeProfileParser(),
                profileService,
                profileRepository,
                resumeRepository
        );
    }

    @Test
    void rejectsUnsupportedExtensionBeforeStoringAnything() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.txt",
                "text/plain",
                "not a resume".getBytes(java.nio.charset.StandardCharsets.UTF_8)
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.upload(new AppUser("User", "user@example.com", "encoded"), file)
        );

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, exception.getStatusCode());
        verifyNoInteractions(profileService, profileRepository, resumeRepository);
    }

    @Test
    void rejectsPdfExtensionWhenContentDoesNotHavePdfSignature() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                "not a pdf".getBytes(java.nio.charset.StandardCharsets.UTF_8)
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.upload(new AppUser("User", "user@example.com", "encoded"), file)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(profileService, profileRepository, resumeRepository);
    }

    @Test
    void rejectsMalformedDocxArchive() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                new byte[] { 'P', 'K', 3, 4, 1, 2, 3 }
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.upload(new AppUser("User", "user@example.com", "encoded"), file)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(profileService, profileRepository, resumeRepository);
    }

    @Test
    void storesValidDocxWithGeneratedPathAndSanitizedDisplayName() throws Exception {
        AppUser user = new AppUser("Candidate", "candidate@example.com", "encoded");
        CandidateProfile profile = new CandidateProfile(user);
        CandidateProfileResponse profileResponse = new CandidateProfileResponse(
                3L, "Candidate", "candidate@example.com", null,
                "Backend developer", null, null, null, "Medium",
                List.of("Java"), List.of(), List.of(), List.of(), List.of(),
                List.of(), List.of(), List.of(),
                new InterviewAI.dto.ResumeDocumentDto(
                        "resume.docx",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        java.time.LocalDateTime.now()
                ),
                null,
                null
        );
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(profileRepository.save(profile)).thenReturn(profile);
        when(resumeRepository.findByProfile(profile))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.empty());
        when(resumeRepository.save(any(ResumeDocument.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(profileService.toResponse(profile)).thenReturn(profileResponse);

        byte[] docxBytes;
        try (XWPFDocument document = new XWPFDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.createParagraph().createRun().setText("SUMMARY");
            document.createParagraph().createRun().setText("Backend developer building APIs.");
            document.write(output);
            docxBytes = output.toByteArray();
        }
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "..\\private\\resume.docx",
                "application/octet-stream",
                docxBytes
        );

        var response = service.upload(user, file);

        assertEquals("TEXT_EXTRACTED", response.extractionStatus());
        assertEquals("resume.docx", response.profile().resume().fileName());
        ArgumentCaptor<CandidateProfile> profileCaptor = ArgumentCaptor.forClass(CandidateProfile.class);
        org.mockito.Mockito.verify(profileRepository).save(profileCaptor.capture());
        assertEquals("deterministic", profileCaptor.getValue().getResumeAnalysisMode());
        assertTrue(profileCaptor.getValue().getResumeAnalysisSummary().contains("Potential interview focus areas"));
        ArgumentCaptor<ResumeDocument> documentCaptor =
                ArgumentCaptor.forClass(ResumeDocument.class);
        org.mockito.Mockito.verify(resumeRepository).save(documentCaptor.capture());
        assertTrue(documentCaptor.getValue().getStorageId().matches("[a-f0-9]{32}"));
        assertTrue(Files.list(storageDirectory).findFirst().isPresent());
    }

        @Test
        void retriesAiSummaryAndPersistsItForTheAuthenticatedProfilesResume() {
                AppUser user = new AppUser("Candidate", "candidate@example.com", "encoded");
                CandidateProfile profile = new CandidateProfile(user);
                profile.setResume(new ResumeDocument(
                                profile, "a1b2c3d4e5f607182930aabbccddeeff", "resume.pdf", "application/pdf"));
                CandidateProfileResponse profileResponse = new CandidateProfileResponse(
                                3L, "Candidate", "candidate@example.com", null, null, null, null, null, "Medium",
                                List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), null,
                                "AI analysis", "openai");
                service.setResumeAiAssistant(resumeAiAssistant);
                when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
                when(resumeAiAssistant.isConfigured()).thenReturn(true);
                when(resumeAiAssistant.summarize(profile)).thenReturn("AI analysis");
                when(profileRepository.save(profile)).thenReturn(profile);
                when(profileService.toResponse(profile)).thenReturn(profileResponse);

                CandidateProfileResponse response = service.regenerateAnalysis(user);

                assertEquals("openai", response.resumeAnalysisMode());
                assertEquals("AI analysis", profile.getResumeAnalysisSummary());
                org.mockito.Mockito.verify(profileRepository).save(profile);
        }
}