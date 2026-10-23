package InterviewAI.service;

import InterviewAI.dto.CandidateProfileResponse;
import InterviewAI.dto.ResumeUploadResponse;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.ResumeDocument;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.ResumeDocumentRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ResumeProfileService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeProfileService.class);
    private static final long MAX_UPLOAD_BYTES = 10L * 1024 * 1024;

    private final Path storageRoot;
    private final ResumeTextExtractor textExtractor;
    private final ResumeProfileParser profileParser;
    private final CandidateProfileService profileService;
    private final CandidateProfileRepository profileRepository;
    private final ResumeDocumentRepository resumeRepository;
    private ResumeAiAssistant resumeAiAssistant;

    @Autowired(required = false)
    public void setResumeAiAssistant(ResumeAiAssistant resumeAiAssistant) {
        this.resumeAiAssistant = resumeAiAssistant;
    }

    @Autowired
    public ResumeProfileService(
            @Value("${app.resume.storage-dir:./private-resumes}") String storageDirectory,
            ResumeTextExtractor textExtractor,
            ResumeProfileParser profileParser,
            CandidateProfileService profileService,
            CandidateProfileRepository profileRepository,
            ResumeDocumentRepository resumeRepository) {
        this(
                Path.of(storageDirectory),
                textExtractor,
                profileParser,
                profileService,
                profileRepository,
                resumeRepository
        );
    }

    public ResumeProfileService(
            Path storageRoot,
            ResumeTextExtractor textExtractor,
            ResumeProfileParser profileParser,
            CandidateProfileService profileService,
            CandidateProfileRepository profileRepository,
            ResumeDocumentRepository resumeRepository) {
        this.storageRoot = storageRoot.toAbsolutePath().normalize();
        this.textExtractor = textExtractor;
        this.profileParser = profileParser;
        this.profileService = profileService;
        this.profileRepository = profileRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public ResumeUploadResponse upload(AppUser user, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a PDF or DOCX resume to upload.");
        }
        if (file.getSize() > MAX_UPLOAD_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Resume files must be 10 MB or smaller.");
        }

        String displayName = safeDisplayName(file.getOriginalFilename());
        String extension = fileExtension(displayName);
        String contentType = validateFile(extension, file);

        byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file could not be read.");
        }

        String extractedText;
        try {
            extractedText = extension.equals("pdf")
                    ? textExtractor.extractPdf(content)
                    : textExtractor.extractDocx(content);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file is malformed or exceeds parsing limits.");
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT,
                    "The resume could not be parsed. For scanned PDFs, OCR is not enabled; upload a text-based PDF or DOCX.");
            } catch (RuntimeException exception) {
                logger.warn("Resume parsing failed ({}).", exception.getClass().getSimpleName());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The uploaded resume is malformed or could not be parsed.");
        }

        ResumeProfileParser.ParsedResume parsed = profileParser.parse(
                extractedText,
                user.getName(),
                user.getEmail()
        );
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new CandidateProfile(user));
        profileService.applyParsedResume(profile, parsed);

        List<String> warnings = new ArrayList<>();
        String analysisMode = "deterministic";
        String analysisSummary;
        if (resumeAiAssistant != null && resumeAiAssistant.isConfigured()) {
            try {
                analysisSummary = resumeAiAssistant.summarize(profile);
                analysisMode = "openai";
            } catch (ResumeAiException exception) {
                analysisSummary = deterministicSummary(profile);
                warnings.add("AI analysis is unavailable; showing a grounded rule-based summary.");
            }
        } else {
            analysisSummary = deterministicSummary(profile);
        }
        profile.setResumeAnalysisSummary(analysisSummary);
        profile.setResumeAnalysisMode(analysisMode);
        CandidateProfile persistedProfile = profileRepository.save(profile);
        String storageId = UUID.randomUUID().toString().replace("-", "");
        Path newFile = safeStoragePath(storageId, extension);
        Path previousFile = resumeRepository.findByProfile(persistedProfile)
            .map(document -> safeStoragePath(document.getStorageId(),
                fileExtension(document.getOriginalFileName())))
            .orElse(null);

        try {
            Files.createDirectories(storageRoot);
            Files.write(newFile, content, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        } catch (IOException exception) {
            logger.error("Resume storage failed ({}).", exception.getClass().getSimpleName());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "The resume could not be stored securely. Please try again.");
        }

        registerFileCleanup(newFile, previousFile);

        ResumeDocument document = resumeRepository.findByProfile(persistedProfile)
            .orElseGet(() -> new ResumeDocument(persistedProfile, storageId, displayName, contentType));
        document.replaceFile(storageId, displayName, contentType);
        persistedProfile.setResume(document);
        resumeRepository.save(document);

            CandidateProfileResponse response = profileService.toResponse(persistedProfile);
        String extractionStatus = "TEXT_EXTRACTED";
        if (extractedText.isBlank()) {
            extractionStatus = "NO_SELECTABLE_TEXT";
            warnings.add("No selectable text was found. Scanned/image-only PDFs require OCR, which is not implemented.");
        } else if (parsed.technicalSkills().isEmpty()) {
            warnings.add("No catalog skills were detected. Review and add skills manually.");
        }
        return new ResumeUploadResponse(response, extractionStatus, extractedText.length(), List.copyOf(warnings));
    }

        private String deterministicSummary(CandidateProfile profile) {
        StringBuilder summary = new StringBuilder();
        summary.append("Professional overview\n")
            .append(hasText(profile.getProfessionalSummary())
                ? profile.getProfessionalSummary() : "No professional overview was confidently extracted.")
            .append("\n\nEducation\n").append(joinOrMissing(profile.getEducation()))
            .append("\n\nExperience\n").append(profile.getWorkExperience().isEmpty()
                ? "No work experience was confidently extracted."
                : profile.getWorkExperience().stream()
                    .map(item -> String.join(" | ", List.of(item.getTitle(), item.getOrganization(), item.getPeriod(), item.getDetails())
                        .stream().filter(ResumeProfileService::hasText).toList()))
                    .reduce((left, right) -> left + "\n" + right).orElse("No work experience was confidently extracted."))
            .append("\n\nTechnical skills\n").append(joinOrMissing(profile.getTechnicalSkills()))
            .append("\n\nProjects\n").append(profile.getProjects().isEmpty()
                ? "No project summaries were confidently extracted."
                : profile.getProjects().stream()
                    .map(project -> project.getName() + ": " + project.getDescription()
                        + " Technologies: " + (hasText(project.getTechnologies()) ? project.getTechnologies() : "not extracted")
                        + " Responsibilities: " + (hasText(project.getResponsibilities()) ? project.getResponsibilities() : "not extracted"))
                    .reduce((left, right) -> left + "\n" + right).orElse("No project summaries were confidently extracted."))
            .append("\n\nAchievements\n").append(joinOrMissing(profile.getAchievements()))
            .append("\n\nPotential interview focus areas\n")
            .append("Project architecture and personal contribution; technical decisions and trade-offs; "
                + "implementation details; challenges and debugging; testing and security; possible improvements. "
                + "These are practice prompts, not claims about unlisted experience.");
        return summary.length() > 12000 ? summary.substring(0, 12000) : summary.toString();
        }

        private String joinOrMissing(List<String> items) {
        return items.isEmpty() ? "No information was confidently extracted." : String.join("\n", items);
        }

        private static boolean hasText(String value) {
        return value != null && !value.isBlank();
        }

    @Transactional
    public CandidateProfileResponse removeResume(AppUser user) {
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        ResumeDocument document = resumeRepository.findByProfile(profile)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No resume is uploaded."));
        Path storedFile = safeStoragePath(document.getStorageId(), fileExtension(document.getOriginalFileName()));
        resumeRepository.delete(document);
        profile.setResume(null);
        registerFileCleanup(null, storedFile);
        return profileService.toResponse(profile);
    }

    @Transactional
    public CandidateProfileResponse regenerateAnalysis(AppUser user) {
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        if (profile.getResume() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Upload a resume before retrying its analysis.");
        }
        if (resumeAiAssistant == null || !resumeAiAssistant.isConfigured()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI analysis is not configured. Set OPENAI_API_KEY on the backend and retry.");
        }
        try {
            profile.setResumeAnalysisSummary(resumeAiAssistant.summarize(profile));
            profile.setResumeAnalysisMode("openai");
        } catch (ResumeAiException exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI analysis is unavailable. Your saved rule-based analysis is unchanged; retry later.");
        }
        profileRepository.save(profile);
        return profileService.toResponse(profile);
    }

    private String validateFile(String extension, MultipartFile file) {
        if (!extension.equals("pdf") && !extension.equals("docx")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Only PDF and DOCX resumes are supported.");
        }
        try {
            byte[] header = file.getBytes();
            if (extension.equals("pdf")) {
                int signatureIndex = indexOfPdfSignature(header);
                if (signatureIndex < 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file does not contain a valid PDF signature.");
                }
                return "application/pdf";
            }
            if (header.length < 4 || header[0] != 'P' || header[1] != 'K') {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file does not contain a valid DOCX archive.");
            }
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file could not be read.");
        }
    }

    private int indexOfPdfSignature(byte[] bytes) {
        byte[] signature = "%PDF-".getBytes(java.nio.charset.StandardCharsets.US_ASCII);
        int limit = Math.min(bytes.length - signature.length, 1024);
        for (int index = 0; index <= limit; index++) {
            boolean matches = true;
            for (int offset = 0; offset < signature.length; offset++) {
                if (bytes[index + offset] != signature[offset]) {
                    matches = false;
                    break;
                }
            }
            if (matches) return index;
        }
        return -1;
    }

    private String safeDisplayName(String originalName) {
        if (originalName == null || originalName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The uploaded file must have a PDF or DOCX filename.");
        }
        String basename = originalName.replace('\\', '/');
        basename = basename.substring(basename.lastIndexOf('/') + 1)
                .replaceAll("[\\p{Cntrl}]", "")
                .trim();
        if (basename.length() > 255) basename = basename.substring(basename.length() - 255);
        return basename;
    }

    private String fileExtension(String name) {
        int dot = name.lastIndexOf('.');
        return dot < 0 ? "" : name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private Path safeStoragePath(String storageId, String extension) {
        if (storageId == null || !storageId.matches("[a-f0-9]{32}")
                || (!extension.equals("pdf") && !extension.equals("docx"))) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stored resume metadata is invalid.");
        }
        Path path = storageRoot.resolve(storageId + "." + extension).normalize();
        if (!path.startsWith(storageRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid stored file identifier.");
        }
        return path;
    }

    private void registerFileCleanup(Path newFile, Path oldFile) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            deleteQuietly(oldFile);
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_COMMITTED) {
                    deleteQuietly(oldFile);
                } else {
                    deleteQuietly(newFile);
                }
            }
        });
    }

    private void deleteQuietly(Path path) {
        if (path == null) return;
        try {
            Files.deleteIfExists(path);
        } catch (IOException exception) {
            logger.warn("A private resume file could not be removed ({}).",
                    exception.getClass().getSimpleName());
        }
    }
}