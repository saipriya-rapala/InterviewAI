package InterviewAI.dto;

import java.util.List;

public record ResumeUploadResponse(
        CandidateProfileResponse profile,
        String extractionStatus,
        int extractedCharacterCount,
        List<String> warnings) {
}