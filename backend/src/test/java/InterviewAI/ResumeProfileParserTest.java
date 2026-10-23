package InterviewAI;

import InterviewAI.service.ResumeProfileParser;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ResumeProfileParserTest {

    private final ResumeProfileParser parser = new ResumeProfileParser();

    @Test
    void extractsContactSectionsAndProjectSpecificTechnologies() {
        String resumeText = """
                Alex Taylor
                alex.taylor@example.com
                +1 555 123 4567
                PROFESSIONAL SUMMARY
                Backend engineer building secure services.
                TECHNICAL SKILLS
                Java, Spring Boot, PostgreSQL, Docker
                PROJECTS
                Order API | Built a Spring Boot and PostgreSQL REST API. Added Docker deployment and integration tests.
                WORK EXPERIENCE
                Backend Developer - Acme Systems | 2021 - 2024
                Designed service endpoints and mentored a small team.
                EDUCATION
                BSc Computer Science, State University
                CERTIFICATIONS
                AWS Certified Developer
                ACHIEVEMENTS
                Reduced API response time by 30 percent
                """;

        ResumeProfileParser.ParsedResume profile = parser.parse(
                resumeText,
                "Account Name",
                "account@example.com"
        );

        assertEquals("Alex Taylor", profile.candidateName());
        assertEquals("alex.taylor@example.com", profile.contactEmail());
        assertTrue(profile.professionalSummary().contains("Backend engineer"));
        assertTrue(profile.technicalSkills().contains("Spring Boot"));
        assertEquals(1, profile.projects().size());
        assertEquals("Order API", profile.projects().getFirst().getName());
        assertTrue(profile.projects().getFirst().getTechnologies().contains("PostgreSQL"));
        assertTrue(profile.workExperience().getFirst().getDetails().contains("mentored"));
        assertEquals("Backend Developer", profile.workExperience().getFirst().getTitle());
        assertEquals("Acme Systems", profile.workExperience().getFirst().getOrganization());
        assertEquals("2021 - 2024", profile.workExperience().getFirst().getPeriod());
        assertTrue(profile.education().getFirst().contains("Computer Science"));
        assertTrue(profile.certifications().getFirst().contains("AWS"));
        assertTrue(profile.achievements().getFirst().contains("30 percent"));
    }

    @Test
    void usesAccountDetailsWhenResumeOmitsContactInformation() {
        ResumeProfileParser.ParsedResume profile = parser.parse(
                "SUMMARY\nLearning backend development.",
                "Account Name",
                "account@example.com"
        );

        assertEquals("Account Name", profile.candidateName());
        assertEquals("account@example.com", profile.contactEmail());
        assertTrue(profile.technicalSkills().isEmpty());
    }
}