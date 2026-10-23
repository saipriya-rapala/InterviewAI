package InterviewAI.service;

import InterviewAI.entity.ProfileExperience;
import InterviewAI.entity.ProfileProject;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class ResumeProfileParser {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "(?i)\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"
    );
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?<!\\w)(?:\\+?\\d[\\d ()-]{7,}\\d)(?!\\w)"
    );
        private static final Pattern EXPERIENCE_PERIOD = Pattern.compile(
            "(?i)\\b(?:19|20)\\d{2}\\s*(?:-|–|to)\\s*(?:(?:19|20)\\d{2}|present|current)\\b"
        );
    private static final Pattern SECTION_HEADER = Pattern.compile(
            "(?i)^(professional\\s+summary|summary|profile|about(?:\\s+me)?|technical\\s+skills|skills|projects?|work\\s+experience|experience|employment|internships?|education|certifications?|achievements?)\\s*:?\\s*(.*)$"
    );
    private static final Set<String> SOFT_SKILL_TERMS = Set.of(
            "communication", "leadership", "collaboration", "teamwork", "mentoring",
            "problem solving", "problem-solving", "adaptability", "ownership",
            "time management", "presentation", "stakeholder management"
    );

    public ParsedResume parse(String text, String fallbackName, String fallbackEmail) {
        Map<String, List<String>> sections = splitSections(text);
        String candidateName = findCandidateName(text, sections);
        String contactEmail = firstMatch(EMAIL_PATTERN, text, fallbackEmail);
        String phone = firstMatch(PHONE_PATTERN, text, null);

        String summary = joinSection(sections, "summary");
        if (summary.isBlank()) {
            summary = firstLinesBeforeSections(text, 3);
        }

        String skillsText = joinSection(sections, "skills");
        if (skillsText.isBlank()) {
            skillsText = text;
        }
        List<String> technicalSkills = TechnologyCatalog.detectIn(skillsText);
        List<String> softSkills = detectSoftSkills(text);
        List<ProfileProject> projects = parseProjects(joinSection(sections, "projects"));
        List<ProfileExperience> experience = parseExperience(joinSection(sections, "experience"));

        return new ParsedResume(
                candidateName == null ? fallbackName : candidateName,
                contactEmail,
                phone,
                truncate(summary, 5000),
                technicalSkills,
                softSkills,
                parseList(joinSection(sections, "education"), 20, 1000),
                parseList(joinSection(sections, "certifications"), 20, 500),
                parseList(joinSection(sections, "achievements"), 20, 1000),
                projects,
                experience
        );
    }

    private Map<String, List<String>> splitSections(String text) {
        Map<String, List<String>> sections = new java.util.LinkedHashMap<>();
        String current = "intro";
        sections.put(current, new ArrayList<>());

        for (String rawLine : (text == null ? "" : text).split("\\R")) {
            String line = rawLine.trim();
            if (line.isEmpty()) {
                sections.get(current).add("");
                continue;
            }
            Matcher matcher = SECTION_HEADER.matcher(line);
            if (matcher.matches()) {
                current = canonicalSection(matcher.group(1));
                sections.computeIfAbsent(current, ignored -> new ArrayList<>());
                if (!matcher.group(2).isBlank()) {
                    sections.get(current).add(matcher.group(2).trim());
                }
            } else {
                sections.get(current).add(line);
            }
        }
        return sections;
    }

    private String canonicalSection(String heading) {
        String normalized = heading.toLowerCase(Locale.ROOT);
        if (normalized.contains("skill")) return "skills";
        if (normalized.contains("project")) return "projects";
        if (normalized.contains("experience") || normalized.contains("employment")
                || normalized.contains("internship")) return "experience";
        if (normalized.contains("education")) return "education";
        if (normalized.contains("certification")) return "certifications";
        if (normalized.contains("achievement")) return "achievements";
        if (normalized.contains("summary") || normalized.contains("profile")
                || normalized.startsWith("about")) return "summary";
        return "intro";
    }

    private String findCandidateName(String text, Map<String, List<String>> sections) {
        for (String line : sections.getOrDefault("intro", List.of())) {
            if (!EMAIL_PATTERN.matcher(line).find()
                    && !PHONE_PATTERN.matcher(line).find()
                    && line.length() <= 100
                    && line.split("\\s+").length <= 6
                    && !line.contains(":")
                    && !TechnologyCatalog.detectIn(line).contains(line)) {
                return stripBullet(line);
            }
        }
        return null;
    }

    private String firstMatch(Pattern pattern, String text, String fallback) {
        Matcher matcher = pattern.matcher(text == null ? "" : text);
        return matcher.find() ? matcher.group().trim() : fallback;
    }

    private String joinSection(Map<String, List<String>> sections, String name) {
        return String.join("\n", sections.getOrDefault(name, List.of()));
    }

    private String firstLinesBeforeSections(String text, int maximumLines) {
        return splitSections(text).getOrDefault("intro", List.of()).stream()
                .limit(maximumLines)
                .reduce((left, right) -> left + " " + right)
                .orElse("");
    }

    private List<String> detectSoftSkills(String text) {
        String lowerText = text == null ? "" : text.toLowerCase(Locale.ROOT);
        return SOFT_SKILL_TERMS.stream()
                .filter(lowerText::contains)
                .map(this::displaySoftSkill)
                .toList();
    }

    private String displaySoftSkill(String skill) {
        return java.util.Arrays.stream(skill.split(" "))
                .map(word -> Character.toUpperCase(word.charAt(0)) + word.substring(1))
                .reduce((left, right) -> left + " " + right)
                .orElse(skill);
    }

    private List<ProfileProject> parseProjects(String section) {
        List<String> blocks = splitBlocks(section);
        List<ProfileProject> projects = new ArrayList<>();
        int index = 1;
        for (String block : blocks) {
            String name = extractTitle(block, "Project " + index++);
            String clean = stripBullet(block);
            List<String> technologies = TechnologyCatalog.detectIn(block);
            projects.add(new ProfileProject(
                    truncate(name, 180),
                    truncate(clean, 5000),
                    String.join(", ", technologies),
                    truncate(clean, 5000)
            ));
        }
        return projects.stream().limit(20).toList();
    }

    private List<ProfileExperience> parseExperience(String section) {
        List<String> blocks = splitBlocks(section);
        List<ProfileExperience> experience = new ArrayList<>();
        for (String block : blocks) {
            String firstLine = block.lines().findFirst().orElse(block).trim();
                String[] titleAndOrganization = firstLine.split("\\s+[|–—]\\s+|\\s+-\\s+", 3);
            String title = truncate(titleAndOrganization[0].trim(), 180);
            String organization = titleAndOrganization.length > 1
                ? truncate(titleAndOrganization[1].trim(), 180)
                : "";
            Matcher periodMatcher = EXPERIENCE_PERIOD.matcher(block);
                String period = titleAndOrganization.length > 2
                    ? titleAndOrganization[2].trim()
                    : periodMatcher.find() ? periodMatcher.group().trim() : "";
            experience.add(new ProfileExperience(
                title.isBlank() ? "Role" : title,
                organization,
                period,
                    truncate(stripBullet(block), 5000)
            ));
        }
        return experience.stream().limit(30).toList();
    }

    private List<String> parseList(String section, int maximum, int maximumLength) {
        return (section == null ? java.util.stream.Stream.<String>empty()
            : java.util.Arrays.stream(section.split("\\R")))
                .map(this::stripBullet)
                .filter(value -> !value.isBlank())
                .map(value -> truncate(value, maximumLength))
                .distinct()
                .limit(maximum)
                .toList();
    }

    private List<String> splitBlocks(String section) {
        if (section == null || section.isBlank()) {
            return List.of();
        }
        List<String> blocks = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (String rawLine : section.split("\\R")) {
            String line = rawLine.trim();
            if (line.isBlank()) {
                flushBlock(blocks, current);
                continue;
            }
            if (current.length() > 0 && isEntryHeading(line)) {
                flushBlock(blocks, current);
            }
            if (current.length() > 0) current.append('\n');
            current.append(line);
        }
        flushBlock(blocks, current);
        return List.copyOf(blocks);
    }

    private boolean isEntryHeading(String line) {
        return line.matches(".*\\s[|–—-]\\s.*")
                || line.matches("(?i)^(project|role|internship|experience)\\s*[:#].*");
    }

    private void flushBlock(List<String> blocks, StringBuilder current) {
        String value = current.toString().trim();
        if (!value.isBlank()) blocks.add(value);
        current.setLength(0);
    }

    private String extractTitle(String block, String fallback) {
        String firstLine = block.lines().findFirst().orElse(block).trim();
        String title = firstLine.split("\\s+[|–—-]\\s+|:", 2)[0].trim();
        return title.isBlank() ? fallback : title;
    }

    private String stripBullet(String value) {
        return value.replaceFirst("^[•*\\-\\u2022\\s]+", "").trim();
    }

    private String truncate(String value, int maximum) {
        if (value == null) return null;
        return value.length() <= maximum ? value : value.substring(0, maximum);
    }

    public record ParsedResume(
            String candidateName,
            String contactEmail,
            String phone,
            String professionalSummary,
            List<String> technicalSkills,
            List<String> softSkills,
            List<String> education,
            List<String> certifications,
            List<String> achievements,
            List<ProfileProject> projects,
            List<ProfileExperience> workExperience) {
    }
}