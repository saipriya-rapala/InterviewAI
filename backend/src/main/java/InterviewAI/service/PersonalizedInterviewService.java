package InterviewAI.service;

import InterviewAI.dto.EvaluationFeedback;
import InterviewAI.dto.InterviewAnswerRequest;
import InterviewAI.dto.InterviewSessionQuestionResponse;
import InterviewAI.dto.InterviewSessionResponse;
import InterviewAI.dto.InterviewSetupRequest;
import InterviewAI.entity.AppUser;
import InterviewAI.entity.CandidateProfile;
import InterviewAI.entity.InterviewSession;
import InterviewAI.entity.InterviewSessionQuestion;
import InterviewAI.entity.Question;
import InterviewAI.repository.CandidateProfileRepository;
import InterviewAI.repository.InterviewSessionQuestionRepository;
import InterviewAI.repository.InterviewSessionRepository;
import InterviewAI.repository.QuestionRepository;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PersonalizedInterviewService {

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Resume and introduction",
            "HR and behavioral",
            "Programming language fundamentals",
            "Data structures and algorithms",
            "Frameworks and tools",
            "Database and SQL",
            "Project deep dive"
    );
    private static final Set<String> ALLOWED_CATEGORIES = Set.of(
            "Resume and introduction",
            "HR and behavioral",
            "Programming language fundamentals",
            "Data structures and algorithms",
            "Frameworks and tools",
            "Database and SQL",
            "Project deep dive",
            "System design"
    );
    private static final Set<String> DIFFICULTIES = Set.of("easy", "medium", "hard");

    private final CandidateProfileRepository profileRepository;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewSessionQuestionRepository sessionQuestionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerEvaluator answerEvaluator;
        private final ResumeAiAssistant resumeAiAssistant;

        @org.springframework.beans.factory.annotation.Autowired
    public PersonalizedInterviewService(
            CandidateProfileRepository profileRepository,
            InterviewSessionRepository sessionRepository,
            InterviewSessionQuestionRepository sessionQuestionRepository,
            QuestionRepository questionRepository,
            AnswerEvaluator answerEvaluator,
            ResumeAiAssistant resumeAiAssistant) {
        this.profileRepository = profileRepository;
        this.sessionRepository = sessionRepository;
        this.sessionQuestionRepository = sessionQuestionRepository;
        this.questionRepository = questionRepository;
        this.answerEvaluator = answerEvaluator;
        this.resumeAiAssistant = resumeAiAssistant;
        }

        public PersonalizedInterviewService(
            CandidateProfileRepository profileRepository,
            InterviewSessionRepository sessionRepository,
            InterviewSessionQuestionRepository sessionQuestionRepository,
            QuestionRepository questionRepository,
            AnswerEvaluator answerEvaluator) {
        this(profileRepository, sessionRepository, sessionQuestionRepository,
            questionRepository, answerEvaluator, null);
    }

    @Transactional
    public InterviewSessionResponse create(AppUser user, @Valid InterviewSetupRequest request) {
        String difficulty = request.difficulty() == null || request.difficulty().isBlank()
                ? "Medium"
                : request.difficulty().trim();
        if (!DIFFICULTIES.contains(difficulty.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Difficulty must be Easy, Medium, or Hard.");
        }
        int questionCount = request.questionCount() == null ? 10 : request.questionCount();
        if (questionCount < 1 || questionCount > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Question count must be between 1 and 30.");
        }
        List<String> categories = normalizeCategories(request.categories());
        CandidateProfile profile = profileRepository.findByUser(user).orElse(null);
        boolean resumeBased = request.scope() != null && !request.scope().isBlank();
        List<GeneratedQuestion> generated;
        String scope = resumeBased ? request.scope().trim().toUpperCase(Locale.ROOT) : "";
        if (resumeBased) {
            if (!Set.of("RESUME", "PROJECT", "SKILL").contains(scope)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Interview scope must be Resume, Project, or Skill.");
            }
            if (profile == null) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT,
                        "Upload a resume or save a candidate profile before generating personalized questions.");
            }
            if (profile.getResume() == null) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT,
                        "Upload a resume before generating resume-based interview questions.");
            }
            validateResumeFocus(profile, scope, request.focus());
            generated = generateFromResume(profile, difficulty, questionCount, scope, request.focus());
        } else {
            if (profile == null) profile = new CandidateProfile(user);
            generated = generate(profile, request.targetRole(), difficulty, categories, questionCount);
        }
        if (generated.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_CONTENT,
                    "No questions are available for this profile and selection.");
        }

        InterviewSession session = new InterviewSession(
                user,
            resumeBased ? profile : null,
                clean(request.targetRole()),
                difficulty,
                categories,
                resumeBased ? scope : null,
                resumeBased ? clean(request.focus()) : null
        );
        generated.forEach(question -> session.addQuestion(new InterviewSessionQuestion(
                question.category(),
                question.source(),
                question.text(),
                question.sampleAnswer()
        )));
        return toResponse(sessionRepository.save(session));
    }

    private void validateResumeFocus(CandidateProfile profile, String scope, String focus) {
        if ("PROJECT".equals(scope)
                && profile.getProjects().stream().noneMatch(project -> project.getName().equals(focus))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a project from your saved resume profile.");
        }
        if ("SKILL".equals(scope)
                && profile.getTechnicalSkills().stream().noneMatch(skill -> skill.equalsIgnoreCase(clean(focus)))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a skill from your saved resume profile.");
        }
    }

    private List<GeneratedQuestion> generateFromResume(
            CandidateProfile profile,
            String difficulty,
            int questionCount,
            String scope,
            String focus) {
        List<GeneratedQuestion> questions = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        if (resumeAiAssistant != null && resumeAiAssistant.isConfigured()) {
            try {
                List<ResumeAiAssistant.GeneratedQuestion> aiQuestions = resumeAiAssistant.generateQuestions(
                        profile, difficulty, questionCount, scope, focus);
                for (ResumeAiAssistant.GeneratedQuestion question : aiQuestions) {
                    addGenerated(questions, seen, question.category(), "RESUME_AI",
                            question.questionText(), question.sampleAnswer());
                }
            } catch (ResumeAiException exception) { }
        }
        if (questions.size() < questionCount) {
            List<GeneratedQuestion> fallback = fallbackResumeQuestions(profile, difficulty, scope, focus);
            for (GeneratedQuestion question : fallback) {
                if (questions.size() >= questionCount) break;
                addGenerated(questions, seen, question.category(), "RESUME_FALLBACK",
                        question.text(), question.sampleAnswer());
            }
        }
        return questions.stream().limit(questionCount).toList();
    }

    private List<GeneratedQuestion> fallbackResumeQuestions(
            CandidateProfile profile,
            String difficulty,
            String scope,
            String focus) {
        List<GeneratedQuestion> questions = new ArrayList<>();
            Set<String> seen = new LinkedHashSet<>();
        List<InterviewAI.entity.ProfileProject> projects = profile.getProjects().stream()
                .filter(project -> !"PROJECT".equals(scope) || project.getName().equals(focus))
                .toList();
        List<String> skills = profile.getTechnicalSkills().stream()
                .filter(skill -> !"SKILL".equals(scope) || skill.equalsIgnoreCase(clean(focus)))
                .toList();
            if ("RESUME".equals(scope)) {
                for (var experience : profile.getWorkExperience()) {
                String anchor = hasText(experience.getTitle()) ? experience.getTitle() : experience.getOrganization();
                if (!hasText(anchor)) continue;
                addGenerated(questions, seen, "HR and behavioral", "RESUME_FALLBACK",
                    "In your " + anchor + ", what did you personally own, how did you work with others, and what did you learn?",
                    "Use responsibilities and outcomes you can verify. The profile does not establish unlisted actions or results.");
                break;
                }
                if (!profile.getAchievements().isEmpty()) {
                String achievement = profile.getAchievements().getFirst();
                addGenerated(questions, seen, "HR and behavioral", "RESUME_FALLBACK",
                    "Your resume lists this achievement: '" + achievement + "'. What actions contributed to it, and what would you do differently next time?",
                    "Explain only actions and results you can support; no missing metrics or context should be inferred.");
                }
            }
        for (InterviewAI.entity.ProfileProject project : projects) {
            String name = project.getName();
            String technologies = hasText(project.getTechnologies()) ? project.getTechnologies() : "the technologies listed for this project";
            String architecturePrompt = switch (difficulty.toLowerCase(Locale.ROOT)) {
                case "easy" -> "For '" + name + "', walk through the main components and data flow. Where did " + technologies + " fit?";
                case "hard" -> "For '" + name + "', analyze the architecture and data flow, then explain how " + technologies
                        + " affected reliability, security, and scaling trade-offs.";
                default -> "For '" + name + "', explain the architecture and data flow using details you can verify. How did "
                        + technologies + " fit into the design?";
            };
            addGenerated(questions, seen, "Project architecture", "RESUME_FALLBACK",
                    architecturePrompt,
                    "Describe only the architecture and technologies you actually used. State where details are missing rather than guessing.");
            addGenerated(questions, seen, "Project contribution", "RESUME_FALLBACK",
                    "For '" + name + "', what did you personally implement, and how would you demonstrate that contribution?",
                    "Connect your answer to the responsibilities stated for " + name + "; do not claim unlisted ownership.");
            addGenerated(questions, seen, "Project decisions", "RESUME_FALLBACK",
                    "For '" + name + "', explain one technical decision involving " + technologies
                            + " and a trade-off or alternative you would evaluate.",
                    "Use a decision you actually made. Explain its constraints, trade-offs, and what evidence informed it.");
                    addGenerated(questions, seen, "Project implementation", "RESUME_FALLBACK",
                        "For '" + name + "', walk through one implementation detail involving " + technologies
                            + " and explain how you would verify it behaves as intended.",
                        "Describe an implementation detail you can verify from your work. Avoid filling resume gaps with assumptions.");
                    addGenerated(questions, seen, "Project debugging", "RESUME_FALLBACK",
                        "For '" + name + "', how would you isolate and debug a difficult failure in its main data flow?",
                        "Use a real debugging example if available. Otherwise present a diagnostic approach as hypothetical, not past experience.");
                    addGenerated(questions, seen, "Project testing", "RESUME_FALLBACK",
                        "For '" + name + "', what tests would give confidence in the main behavior and its edge cases?",
                        "Separate tests you actually wrote from tests you would add; the resume does not confirm unlisted coverage.");
                    addGenerated(questions, seen, "Project security", "RESUME_FALLBACK",
                        "For '" + name + "', identify a relevant security risk and explain how you would validate a mitigation.",
                        "Discuss risk assessment as design analysis, not as a claim that a mitigation was implemented.");
                    addGenerated(questions, seen, "Project improvement", "RESUME_FALLBACK",
                        "For '" + name + "', what improvement would you prioritize next and how would you measure its impact?",
                        "Choose a real or proposed improvement and state what evidence would validate impact; do not invent past metrics.");
                    addGenerated(questions, seen, "Project follow-up", "RESUME_FALLBACK",
                        "For '" + name + "', what limitation or edge case would you investigate next, and what would your first experiment be?",
                        "Frame unknown implementation details as an investigation plan rather than project facts.");
            addGenerated(questions, seen, "Project improvement", "RESUME_FALLBACK",
                    "For '" + name + "', describe a challenge you faced, how you debugged or tested it, and one improvement you would prioritize.",
                    "Use a real challenge and test or debugging step from your work; the profile does not provide missing implementation details.");
            if (difficulty.equalsIgnoreCase("Hard")) {
                addGenerated(questions, seen, "Project security", "RESUME_FALLBACK",
                        "For '" + name + "', what security risks would you assess in the design, and how would you validate mitigations?",
                        "Discuss relevant risks and validation steps as design considerations, not as claims that they were implemented.");
            }
            if ("RESUME".equals(scope)) {
                addGenerated(questions, seen, "HR and behavioral", "RESUME_FALLBACK",
                        "For '" + name + "', describe a real collaboration challenge or difficult feedback moment and how you responded.",
                        "Use a real situation and explain your own actions. If the resume does not describe one, choose another accurate example rather than inventing details.");
            }
        }
        for (String skill : skills) {
                String skillQuestion = switch (difficulty.toLowerCase(Locale.ROOT)) {
                case "easy" -> "Your resume lists " + skill + ". Explain one core concept and give a simple example.";
                case "hard" -> "Your resume lists " + skill + ". Describe how you would diagnose a difficult production issue involving it, validate a fix, and assess security or performance trade-offs.";
                default -> "Your resume lists " + skill + ". Explain how you would implement a practical solution with it and evaluate one limitation or trade-off.";
                };
                addGenerated(questions, seen, "Technical skill", "RESUME_FALLBACK", skillQuestion,
                    "Explain only verified concepts. Relate the answer to personal experience only when that experience is accurate; the resume confirms the skill listing, not a specific implementation.");
                    addGenerated(questions, seen, "Skill implementation", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". How would you implement a small solution with it and validate correctness?",
                        "Outline an approach using verified concepts. Do not claim the resume lists a specific implementation.");
                    addGenerated(questions, seen, "Skill debugging", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". What evidence would you gather first to debug unexpected behavior involving it?",
                        "Describe a diagnostic method and distinguish hypothetical steps from experience you actually have.");
                    addGenerated(questions, seen, "Skill testing", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". What unit, integration, or edge-case checks would you use for a change involving it?",
                        "Choose tests that fit the proposed change; do not claim unlisted past test work.");
                    addGenerated(questions, seen, "Skill trade-offs", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". Compare it with one alternative for a suitable use case and explain the trade-off.",
                        "Compare accurate properties and state your assumptions. No project-specific use is implied by the skill listing.");
                    addGenerated(questions, seen, "Skill security", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". What security concern would you review when using it, and how could you validate the result?",
                        "Frame the answer as technical analysis unless the resume confirms a specific security implementation.");
                    addGenerated(questions, seen, "Skill performance", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". How would you identify and measure a performance bottleneck involving it?",
                        "Propose measurements and distinguish them from results actually achieved.");
                    addGenerated(questions, seen, "Skill design", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". What design choice would you consider before using it in a new feature?",
                        "Discuss a general design choice without asserting a particular feature or project from the resume.");
                    addGenerated(questions, seen, "Skill edge cases", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". Describe an edge case a developer should consider and how to test it.",
                        "Use a technically relevant edge case and describe a check that could detect it.");
                    addGenerated(questions, seen, "Skill limitations", "RESUME_FALLBACK",
                        "Your resume lists " + skill + ". In what situation might it be a poor fit, and what would you evaluate instead?",
                        "Explain the constraints behind the choice and avoid claiming experience not present in the resume.");
        }
        if ("RESUME".equals(scope) && !skills.isEmpty()) {
            String anchor = skills.getFirst();
            addGenerated(questions, seen, "HR and behavioral", "RESUME_FALLBACK",
                    "Your resume lists " + anchor + ". Describe a real time you learned or applied a technical skill, your specific actions, and what you learned.",
                    "Use a real situation; the resume only confirms the listed skill and does not establish a particular story or outcome.");
        }
        return questions;
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponse get(AppUser user, Long sessionId) {
        return toResponse(findOwnedSession(user, sessionId));
    }

    @Transactional(readOnly = true)
    public List<InterviewSessionResponse> list(AppUser user) {
        return sessionRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public InterviewSessionResponse submitAnswer(
            AppUser user,
            Long sessionId,
            Long sessionQuestionId,
            InterviewAnswerRequest request) {
        InterviewSession session = findOwnedSession(user, sessionId);
        InterviewSessionQuestion question = sessionQuestionRepository
                .findByIdAndSession_Id(sessionQuestionId, session.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Interview question not found."
                ));
        String answerText = request.answerText().trim();
        question.setAnswerText(answerText);

        EvaluationFeedback feedback;
        String evaluationMode;
        try {
            feedback = answerEvaluator.evaluate("Interview", question.getQuestionText(), answerText);
            evaluationMode = answerEvaluator.evaluationMode();
        } catch (AiEvaluationException exception) {
            feedback = new MockAnswerEvaluator().evaluate("Interview", question.getQuestionText(), answerText);
            evaluationMode = "rule-based-fallback";
        }
        feedback = EvaluationFeedbackValidator.validate(feedback);
        question.setScore(feedback.score());
        question.setCorrectnessFeedback(feedback.correctnessFeedback());
        question.setStrengths(feedback.strengths());
        question.setMissingConcepts(feedback.missingConcepts());
        question.setImprovementSuggestions(feedback.improvementSuggestions());
        question.setSampleAnswer(feedback.sampleAnswer());
        question.setEvaluationMode(evaluationMode);
        question.setFollowUpQuestion(createFollowUp(question, feedback));
        sessionQuestionRepository.save(question);
        return toResponse(session);
    }

    private List<GeneratedQuestion> generate(
            CandidateProfile profile,
            String targetRole,
            String difficulty,
            List<String> categories,
            int questionCount) {
        List<GeneratedQuestion> result = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        List<String> technologies = profile.getTechnicalSkills() == null
                ? new ArrayList<>()
                : new ArrayList<>(profile.getTechnicalSkills());
        if (hasText(profile.getPreferredLanguage())) technologies.add(profile.getPreferredLanguage());

        List<Question> curatedQuestions = questionRepository.findAllByDifficultyIgnoreCase(difficulty);
        for (String category : categories) {
            if (category.equals("Resume and introduction")) {
                addGenerated(result, seen, category,
                        "PROFILE_GENERATED",
                        introductionQuestion(profile, targetRole),
                        "A concise introduction should connect your real experience, selected skills, and interest in the target role. Use only details from your own background.");
                for (var experience : profile.getWorkExperience()) {
                    if (result.size() >= questionCount) break;
                    if (!hasText(experience.getTitle()) && !hasText(experience.getDetails())) continue;
                    String organization = hasText(experience.getOrganization())
                        ? " at " + experience.getOrganization()
                        : "";
                    addGenerated(result, seen, category,
                        "PROFILE_GENERATED",
                        "In your " + experience.getTitle() + organization
                            + " experience, what did you personally own and how did you measure the result?",
                        "Describe only responsibilities and outcomes you can verify. Explain your role, the technical work, and evidence of the result; your profile does not supply missing metrics.");
                }
            } else if (category.equals("HR and behavioral")) {
                addGenerated(result, seen, category,
                    "PROFILE_GENERATED",
                        behavioralQuestion(difficulty),
                        "Use a real situation, describe your specific actions, and explain the outcome. Do not claim an outcome you did not experience.");
            } else if (category.equals("Project deep dive") && !profile.getProjects().isEmpty()) {
                for (var project : profile.getProjects()) {
                    if (result.size() >= questionCount) break;
                    String tech = hasText(project.getTechnologies())
                            ? project.getTechnologies()
                            : "the technologies involved";
                    addGenerated(result, seen, category,
                            "PROFILE_GENERATED",
                            "For your project '" + project.getName() + "', what was your personal role, how did "
                                    + tech + " fit into the design, and what technical decision would you revisit?",
                            "Describe your actual responsibilities and system flow, explain a real technical decision and its trade-offs, then mention a real challenge or improvement. The profile does not specify every implementation detail, so avoid guessing.");
                }
            } else if (category.equals("Data structures and algorithms")) {
                addGenerated(result, seen, category,
                    "PROFILE_GENERATED",
                        dsaQuestion(difficulty),
                        "Explain a correct approach, walk through a small example, and state time and space complexity. Confirm edge cases before proposing an implementation.");
            } else if (category.equals("System design")) {
                addGenerated(result, seen, category,
                    "PROFILE_GENERATED",
                        systemDesignQuestion(targetRole, difficulty),
                        "Clarify requirements, estimate scale, outline components and data flow, then discuss reliability, security, and trade-offs. This is a practice outline, not a design specific to your employer.");
            }

            if (Set.of("Programming language fundamentals", "Frameworks and tools", "Database and SQL",
                    "Data structures and algorithms").contains(category)) {
                for (String topic : profile.getTopicsToPractice()) {
                    if (result.size() >= questionCount) break;
                    addGenerated(result, seen, category,
                            "PROFILE_GENERATED",
                            "You selected '" + topic + "' to practise. Explain its core idea, give an example, and describe one limitation or trade-off.",
                            "Define the topic accurately, walk through a concrete example, and explain a relevant trade-off. Relate it to your own experience only where applicable.");
                }
            }

            if (result.size() >= questionCount) break;
            addCuratedForCategory(result, seen, curatedQuestions, technologies, category, questionCount);
        }

        if (result.size() < questionCount) {
            addCuratedForCategory(result, seen, curatedQuestions, technologies,
                    "Programming language fundamentals", questionCount);
        }
        return result.stream().limit(questionCount).toList();
    }

    private void addCuratedForCategory(
            List<GeneratedQuestion> result,
            Set<String> seen,
            List<Question> curatedQuestions,
            List<String> technologies,
            String category,
            int maximum) {
            List<Question> categoryQuestions = curatedQuestions.stream()
                .filter(question -> matchesCategory(question, category))
                .toList();
            List<Question> profileMatches = categoryQuestions.stream()
                .filter(question -> matchesProfileTechnology(question, technologies))
                .toList();
            List<Question> candidates = profileMatches.isEmpty()
                ? categoryQuestions
                : profileMatches;

            for (Question question : candidates) {
            if (result.size() >= maximum) return;
            String normalizedText = question.getQuestionText().trim().toLowerCase(Locale.ROOT);
            if (seen.add(normalizedText)) {
                result.add(new GeneratedQuestion(
                        category,
                        "CURATED",
                        question.getQuestionText(),
                        sampleAnswerFor(question)
                ));
            }
        }
    }

    private boolean matchesProfileTechnology(Question question, List<String> technologies) {
        return technologies.stream().anyMatch(technology ->
                technology.equalsIgnoreCase(question.getLanguage())
                        || (question.getLanguage().equalsIgnoreCase("SQL")
                        && Set.of("PostgreSQL", "MySQL", "MongoDB", "Redis")
                                .stream().anyMatch(database -> database.equalsIgnoreCase(technology))));
    }

    private boolean matchesCategory(Question question, String requestedCategory) {
        String sourceCategory = question.getCategory() == null ? "" : question.getCategory();
        if (requestedCategory.equals("Database and SQL")) {
            return sourceCategory.equalsIgnoreCase("Database and SQL")
                    || question.getLanguage().equalsIgnoreCase("SQL");
        }
        if (requestedCategory.equals("Frameworks and tools")) {
            return sourceCategory.equalsIgnoreCase("Frameworks and tools");
        }
        return requestedCategory.equals("Programming language fundamentals")
                && (sourceCategory.equalsIgnoreCase("Language fundamentals")
                || sourceCategory.equalsIgnoreCase("Programming language fundamentals"));
    }

    private String sampleAnswerFor(Question question) {
        MockQuestionKnowledgeBase.Entry reference =
            MockQuestionKnowledgeBase.find(question.getQuestionText());
        return reference == null
            ? "No local reference answer is available for this curated question. Build an answer from verified concepts and consult a trusted technical reference."
            : reference.sampleAnswer();
    }

    private String introductionQuestion(CandidateProfile profile, String targetRole) {
        String role = hasText(targetRole) ? targetRole : "your target role";
        String focus = hasText(profile.getProfessionalSummary())
                ? "Connect your introduction to this profile summary: "
                        + profile.getProfessionalSummary().substring(0,
                                Math.min(240, profile.getProfessionalSummary().length()))
                : "Introduce your background and the skills you want to highlight";
        return "Give a concise introduction for " + role + ". " + focus
                + ". Use only experiences and achievements that are accurate for you.";
    }

    private String behavioralQuestion(String difficulty) {
        if (difficulty.equalsIgnoreCase("Easy")) {
            return "Describe a real time you learned a new technical skill. What steps did you take and what did you learn?";
        }
        if (difficulty.equalsIgnoreCase("Hard")) {
            return "Describe a real technical disagreement or setback. How did you handle it, what evidence informed your decision, and what would you change?";
        }
        return "Describe a real project challenge and how you collaborated to resolve it. What was your contribution and what did you learn?";
    }

    private String dsaQuestion(String difficulty) {
        return switch (difficulty.toLowerCase(Locale.ROOT)) {
            case "easy" -> "Given an array of integers, how would you find its largest value and handle an empty input?";
            case "hard" -> "How would you design an LRU cache with constant-time lookup and update? Explain the data structures and complexity.";
            default -> "Given a string, how would you determine whether it contains duplicate characters, and what are the time and space costs?";
        };
    }

    private String systemDesignQuestion(String targetRole, String difficulty) {
        String role = hasText(targetRole) ? targetRole : "a web application";
        return "Design a scalable " + role + " service. Clarify requirements and scale, then explain the components, data flow, and trade-offs. Difficulty: " + difficulty + ".";
    }

    private void addGenerated(
            List<GeneratedQuestion> result,
            Set<String> seen,
            String category,
            String source,
            String text,
            String sample) {
        String normalized = text.trim().toLowerCase(Locale.ROOT);
        if (!text.isBlank() && seen.add(normalized)) {
            result.add(new GeneratedQuestion(category, source, text, sample));
        }
    }

    private List<String> normalizeCategories(List<String> requested) {
        List<String> categories = requested == null || requested.isEmpty()
                ? DEFAULT_CATEGORIES
                : requested.stream().distinct().toList();
        if (categories.stream().anyMatch(category -> !ALLOWED_CATEGORIES.contains(category))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "One or more interview categories are unsupported.");
        }
        return categories;
    }

    private InterviewSession findOwnedSession(AppUser user, Long sessionId) {
        return sessionRepository.findByIdAndUser(sessionId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Interview session not found."));
    }

    private InterviewSessionResponse toResponse(InterviewSession session) {
        List<InterviewSessionQuestionResponse> questions = new ArrayList<>();
        for (int index = 0; index < session.getQuestions().size(); index++) {
            InterviewSessionQuestion question = session.getQuestions().get(index);
            questions.add(new InterviewSessionQuestionResponse(
                    question.getId(),
                    index + 1,
                    question.getCategory(),
                    question.getSource(),
                    question.getQuestionText(),
                    question.getAnswerText(),
                    question.getScore(),
                    question.getCorrectnessFeedback(),
                    List.copyOf(question.getStrengths()),
                    List.copyOf(question.getMissingConcepts()),
                    List.copyOf(question.getImprovementSuggestions()),
                    question.getSampleAnswer(),
                    question.getFollowUpQuestion(),
                    question.getEvaluationMode()
            ));
        }
        return new InterviewSessionResponse(
                session.getId(),
                session.getTargetRole(),
                session.getDifficulty(),
                session.getCreatedAt(),
                List.copyOf(session.getCategories()),
                questions,
                session.getScope(),
                session.getFocus()
        );
    }

    private String createFollowUp(
            InterviewSessionQuestion question,
            EvaluationFeedback feedback) {
        if (feedback.missingConcepts().isEmpty()) {
            return "What trade-off or edge case would you consider next for this question?";
        }
        String concept = feedback.missingConcepts().getFirst();
        return "Can you explain '" + concept + "' and relate it to your answer?";
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private record GeneratedQuestion(
            String category,
            String source,
            String text,
            String sampleAnswer) {
    }
}