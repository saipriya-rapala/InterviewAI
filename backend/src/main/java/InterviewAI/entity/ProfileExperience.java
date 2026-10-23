package InterviewAI.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProfileExperience {

    private String title;
    private String organization;
    private String period;
    private String details;

    public ProfileExperience() {
    }

    public ProfileExperience(String title, String organization, String period, String details) {
        this.title = title;
        this.organization = organization;
        this.period = period;
        this.details = details;
    }

    public String getTitle() { return title; }
    public String getOrganization() { return organization; }
    public String getPeriod() { return period; }
    public String getDetails() { return details; }
}