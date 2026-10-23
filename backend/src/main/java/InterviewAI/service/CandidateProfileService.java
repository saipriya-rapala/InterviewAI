package InterviewAI.service;

import InterviewAI.dto.CandidateProfileRequest;
import InterviewAI.dto.CandidateProfileResponse;
import InterviewAI.dto.ProfileExperienceDto;
import InterviewAI.dto.ProfileProjectDto;
import InterviewAI.dto.ResumeDocumentDto;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.ProfileExperience;
import InterviewAI.entity.ProfileProject;
import InterviewAI.entity.ResumeDocument;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.ResumeDocumentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final ResumeDocumentRepository resumeRepository;

    public CandidateProfileService(
            CandidateProfileRepository profileRepository,
            ResumeDocumentRepository resumeRepository) {
        this.profileRepository = profileRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional
    public CandidateProfileResponse getOrCreate(AppUser user) {
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> profileRepository.save(new CandidateProfile(user)));
        return toResponse(profile);
    }

    @Transactional
    public CandidateProfileResponse update(AppUser user, CandidateProfileRequest request) {
                String requestedDifficulty = defaultText(request.interviewDifficulty(), "Medium");
                if (!List.of("Easy", "Medium", "Hard").stream()
                                .anyMatch(level -> level.equalsIgnoreCase(requestedDifficulty))) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.BAD_REQUEST,
                                        "Interview difficulty must be Easy, Medium, or Hard."
                        );
                }
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new CandidateProfile(user));

        profile.setCandidateName(defaultText(request.candidateName(), user.getName()));
        profile.setContactEmail(defaultText(request.contactEmail(), user.getEmail()));
        profile.setPhone(clean(request.phone()));
        profile.setProfessionalSummary(clean(request.professionalSummary()));
        profile.setExperienceLevel(clean(request.experienceLevel()));
        profile.setTargetRole(clean(request.targetRole()));
        profile.setPreferredLanguage(clean(request.preferredLanguage()));
        profile.setInterviewDifficulty(requestedDifficulty);
        profile.setTechnicalSkills(cleanList(request.technicalSkills()));
        profile.setSoftSkills(cleanList(request.softSkills()));
        profile.setTopicsToPractice(cleanList(request.topicsToPractice()));
        profile.setEducation(cleanList(request.education()));
        profile.setCertifications(cleanList(request.certifications()));
        profile.setAchievements(cleanList(request.achievements()));
        profile.setProjects(request.projects() == null ? List.of()
                : request.projects().stream()
                        .map(this::toProject)
                        .filter(project -> !project.getName().isBlank()
                                || !project.getDescription().isBlank())
                        .toList());
        profile.setWorkExperience(request.workExperience() == null ? List.of()
                : request.workExperience().stream()
                        .map(this::toExperience)
                        .filter(experience -> !experience.getTitle().isBlank()
                                || !experience.getDetails().isBlank())
                        .toList());

        return toResponse(profileRepository.save(profile));
    }

    @Transactional
    public CandidateProfile getOrCreateEntity(AppUser user) {
        return profileRepository.findByUser(user)
                .orElseGet(() -> profileRepository.save(new CandidateProfile(user)));
    }

    @Transactional
    public CandidateProfileResponse toResponse(CandidateProfile profile) {
        ResumeDocumentDto resume = resumeRepository.findByProfile(profile)
                .map(document -> new ResumeDocumentDto(
                        document.getOriginalFileName(),
                        document.getContentType(),
                        document.getUploadedAt()
                ))
                .orElse(null);

        return new CandidateProfileResponse(
                profile.getId(),
                profile.getCandidateName(),
                profile.getContactEmail(),
                profile.getPhone(),
                profile.getProfessionalSummary(),
                profile.getExperienceLevel(),
                profile.getTargetRole(),
                profile.getPreferredLanguage(),
                profile.getInterviewDifficulty(),
                List.copyOf(profile.getTechnicalSkills()),
                List.copyOf(profile.getSoftSkills()),
                List.copyOf(profile.getTopicsToPractice()),
                List.copyOf(profile.getEducation()),
                List.copyOf(profile.getCertifications()),
                List.copyOf(profile.getAchievements()),
                profile.getProjects().stream().map(this::toProjectDto).toList(),
                profile.getWorkExperience().stream().map(this::toExperienceDto).toList(),
                resume,
                profile.getResumeAnalysisSummary(),
                profile.getResumeAnalysisMode()
        );
    }

    public void applyParsedResume(
            CandidateProfile profile,
            ResumeProfileParser.ParsedResume parsed) {
        if (hasText(parsed.candidateName())) profile.setCandidateName(parsed.candidateName());
        if (hasText(parsed.contactEmail())) profile.setContactEmail(parsed.contactEmail());
        profile.setPhone(parsed.phone());
        profile.setProfessionalSummary(parsed.professionalSummary());
        replaceContents(profile.getTechnicalSkills(), parsed.technicalSkills());
        replaceContents(profile.getSoftSkills(), parsed.softSkills());
        replaceContents(profile.getEducation(), parsed.education());
        replaceContents(profile.getCertifications(), parsed.certifications());
        replaceContents(profile.getAchievements(), parsed.achievements());
        replaceContents(profile.getProjects(), parsed.projects());
        replaceContents(profile.getWorkExperience(), parsed.workExperience());
        }

        private <T> void replaceContents(List<T> current, List<T> replacement) {
                current.clear();
                current.addAll(replacement);
    }

    private ProfileProject toProject(ProfileProjectDto project) {
        return new ProfileProject(
                defaultText(project.name(), ""),
                defaultText(project.description(), ""),
                defaultText(project.technologies(), ""),
                defaultText(project.responsibilities(), "")
        );
    }

    private ProfileExperience toExperience(ProfileExperienceDto experience) {
        return new ProfileExperience(
                defaultText(experience.title(), ""),
                defaultText(experience.organization(), ""),
                defaultText(experience.period(), ""),
                defaultText(experience.details(), "")
        );
    }

    private ProfileProjectDto toProjectDto(ProfileProject project) {
        return new ProfileProjectDto(
                project.getName(),
                project.getDescription(),
                project.getTechnologies(),
                project.getResponsibilities()
        );
    }

    private ProfileExperienceDto toExperienceDto(ProfileExperience experience) {
        return new ProfileExperienceDto(
                experience.getTitle(),
                experience.getOrganization(),
                experience.getPeriod(),
                experience.getDetails()
        );
    }

    private List<String> cleanList(List<String> values) {
        if (values == null) return List.of();
        return values.stream()
                .map(this::clean)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String defaultText(String value, String fallback) {
        return hasText(value) ? value.trim() : fallback;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}