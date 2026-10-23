package InterviewAI.service;

import InterviewAI.dto.TechnologyOptionDto;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public final class TechnologyCatalog {

    private static final List<TechnologyOptionDto> OPTIONS = List.of(
            option("Programming languages", "Java"),
            option("Programming languages", "Python"),
            option("Programming languages", "JavaScript"),
            option("Programming languages", "TypeScript"),
            option("Programming languages", "C"),
            option("Programming languages", "C++"),
            option("Programming languages", "C#"),
            option("Programming languages", "Go"),
            option("Programming languages", "Rust"),
            option("Programming languages", "PHP"),
            option("Programming languages", "Ruby"),
            option("Programming languages", "Kotlin"),
            option("Programming languages", "Swift"),
            option("Programming languages", "SQL"),
            option("Programming languages", "R"),
            option("Programming languages", "Dart"),
            option("Programming languages", "Scala"),
            option("Programming languages", "Bash"),
            option("Frontend", "HTML"),
            option("Frontend", "CSS"),
            option("Frontend", "React"),
            option("Frontend", "Angular"),
            option("Frontend", "Vue"),
            option("Backend", "Spring Boot"),
            option("Backend", "Node.js"),
            option("Backend", "Express"),
            option("Backend", "Django"),
            option("Backend", "Flask"),
            option("Backend", "FastAPI"),
            option("Backend", ".NET"),
            option("Databases", "PostgreSQL"),
            option("Databases", "MySQL"),
            option("Databases", "MongoDB"),
            option("Databases", "Redis"),
            option("Data engineering", "Apache Spark"),
            option("Data engineering", "Kafka"),
            option("Data engineering", "ETL"),
            option("Data engineering", "Data pipelines"),
            option("Cloud and DevOps", "AWS"),
            option("Cloud and DevOps", "Azure"),
            option("Cloud and DevOps", "GCP"),
            option("Cloud and DevOps", "Docker"),
            option("Cloud and DevOps", "Kubernetes"),
            option("Cloud and DevOps", "Git"),
            option("Cloud and DevOps", "CI/CD"),
            option("Computer science", "DSA"),
            option("Computer science", "OOP"),
            option("Computer science", "DBMS"),
            option("Computer science", "Operating systems"),
            option("Computer science", "Networking"),
            option("Computer science", "System design")
    );

    private TechnologyCatalog() {
    }

    public static List<TechnologyOptionDto> all() {
        return OPTIONS;
    }

    public static List<String> detectIn(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        List<TechnologyOptionDto> ordered = new ArrayList<>(OPTIONS);
        ordered.sort((left, right) -> Integer.compare(
                right.name().length(), left.name().length()));
        List<String> detected = new ArrayList<>();
        for (TechnologyOptionDto option : ordered) {
            Pattern pattern = Pattern.compile(
                    "(?i)(?<![A-Za-z0-9])" + Pattern.quote(option.name()) + "(?![A-Za-z0-9])"
            );
            if (pattern.matcher(text).find()) {
                detected.add(option.name());
            }
        }
        return List.copyOf(detected);
    }

    private static TechnologyOptionDto option(String category, String name) {
        return new TechnologyOptionDto(category, name);
    }
}