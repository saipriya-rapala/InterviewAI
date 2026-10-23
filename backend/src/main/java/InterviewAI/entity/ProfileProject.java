package InterviewAI.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProfileProject {

    private String name;
    private String description;
    private String technologies;
    private String responsibilities;

    public ProfileProject() {
    }

    public ProfileProject(String name, String description, String technologies, String responsibilities) {
        this.name = name;
        this.description = description;
        this.technologies = technologies;
        this.responsibilities = responsibilities;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getTechnologies() { return technologies; }
    public String getResponsibilities() { return responsibilities; }
}