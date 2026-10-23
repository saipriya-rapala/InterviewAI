package InterviewAI.dto;

import java.time.LocalDateTime;

public record ResumeDocumentDto(
        String fileName,
        String contentType,
        LocalDateTime uploadedAt) {
}