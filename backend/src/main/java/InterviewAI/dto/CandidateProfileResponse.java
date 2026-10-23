package InterviewAI.dto;

import java.util.List;

public record CandidateProfileResponse(
        Long id,
        String candidateName,
        String contactEmail,
        String phone,
        String professionalSummary,
        String experienceLevel,
        String targetRole,
        String preferredLanguage,
        String interviewDifficulty,
        List<String> technicalSkills,
        List<String> softSkills,
        List<String> topicsToPractice,
        List<String> education,
        List<String> certifications,
        List<String> achievements,
        List<ProfileProjectDto> projects,
        List<ProfileExperienceDto> workExperience,
        ResumeDocumentDto resume,
        String resumeAnalysisSummary,
        String resumeAnalysisMode) {
}