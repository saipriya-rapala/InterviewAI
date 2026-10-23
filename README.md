# 🚀 InterviewAI — Full-Stack AI Technical Interview & Placement Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4+-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk)](https://openjdk.org/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg?logo=docker)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg?logo=githubactions)](https://github.com/features/actions)

> **InterviewAI** is an intelligent, full-stack career readiness platform designed to prepare engineering students and software professionals for technical interviews, placement drives, and coding assessments. It combines real-time speech evaluation, multi-language coding sandboxes, placement cheat sheets, 350+ MCQs, and ATS resume optimization into a unified experience.

---

## 🌟 Key Platform Features

### 1. 🎙️ AI Voice Simulator & Coaching
* **Dual Round Simulation**: Practice **Technical Rounds (TR)** and **HR / Behavioral Rounds**.
* **STAR Evaluation Engine**: Evaluates responses based on **Situation, Task, Action, and Result**.
* **Real-time Speech Recognition**: Integrated Web Speech API converts your spoken answers into text in real-time.
* **Rubric Feedback**: Instant breakdown of technical strengths, missed concepts, and recommended ideal answers.

### 2. 💻 Code Studio — Hands-on DSA Sandbox
* **Multi-Language Execution**: Code in **Python, JavaScript, Java, C++, and C**.
* **Curated Problem Library**: LeetCode and CodeChef interview problems categorized by difficulty (Easy, Medium, Hard).
* **Automated Test Runner**: Validates multiple edge-case test suites and surfaces assertion failures.
* **Smart Bookmark System**: Flag difficult questions for last-minute review with persistent bookmark storage.

### 3. 🧠 Technical & Core CS MCQ Quiz Studio
* **350+ Curated Placement MCQs**: Frequently tested questions across placement drives (TCS, Infosys, Wipro, Cognizant, FAANG).
* **Comprehensive Subjects**: Core Java, Python, C++, Web Development, OS, Computer Networks, and DBMS.
* **Instant Explanations**: Instant feedback on correctness with deep conceptual explanations.

### 4. 📚 10 Core Subject Placement Cheat Sheets
1-page high-density formula and revision sheets to review 15 minutes before an interview:
1. **Operating Systems (OS)**: CPU Scheduling formulas (TAT, WT, RT), Coffman Deadlock conditions, Paging, Belady's Anomaly.
2. **Computer Networks (CN)**: OSI 7-Layer functions, CIDR Subnetting reference (`/24` to `/30`), Ports & TCP 3-Way Handshake.
3. **DBMS & SQL**: SQL Execution Pipeline (`FROM` $\rightarrow$ `WHERE` $\rightarrow$ `SELECT`), Normalization rules (1NF–BCNF), `DELETE` vs `TRUNCATE` vs `DROP`.
4. **OOPs & Design Patterns**: SOLID Principles, Composition vs Aggregation, Thread-Safe Volatile Singleton snippet.
5. **DSA Big-O Reference**: Time & space complexity master table across sorting and data structure algorithms.
6. **System Design (HLD)**: CAP & PACELC Tradeoffs, Caching strategies (Cache-Aside, Write-Through/Back), Consistent Hashing, Sharding.
7. **Cloud Computing & DevOps**: Docker directives (`ENTRYPOINT` vs `CMD`, `COPY` vs `ADD`), Kubernetes Architecture, Circuit Breaker, Saga pattern.
8. **Git & Software Engineering**: `git rebase` vs `merge`, `reset` modes, Scrum ceremonies, Testing Pyramid (Unit 70%, Integration 20%, E2E 10%), TDD.
9. **Computer Architecture (COA)**: Cache Mapping & 3 C's of misses, 5-Stage RISC Pipeline hazards (RAW, WAR, WAW), Little vs Big Endian.
10. **Theory of Computation (TOC / CD)**: Chomsky Hierarchy (Regular, CFL, CSL, RE), 6 Compiler Phases, LL(1) vs LR parsing conflicts.

### 5. 🎯 ATS Resume Optimizer & Matcher
* **Compatibility Match Score**: Compares resume text against any target Job Description (JD) and calculates compatibility percentage.
* **Path to 100% Score Engine**: Tailored Executive Summary generator that embeds all missing JD keywords with 1-click copy.
* **Google XYZ Formula Rewriter**: Automatically refactors standard bullet points into *"Accomplished [X] measured by [Y] by doing [Z]"*.
* **ATS Layout & Parser Diagnostics**: Audits formatting, standard left-alignment, font size specifications, and quantifiable metrics density.

### 6. 🏆 Official Readiness Report (Print-to-PDF)
* Generates a certified Placement Readiness Certificate containing candidate credentials, readiness score, verified competency badges, and a verified report ID with clean print styling.

---

## 🏗️ Architecture & Tech Stack

```
InterviewAI/
├── backend/                       # Spring Boot 3 Java Backend
│   ├── src/main/java/InterviewAI/ # REST Controllers, Services, Security & Repositories
│   ├── src/main/resources/        # application.properties, schemas
│   ├── Dockerfile                 # Multi-stage JDK 21 build
│   └── pom.xml                    # Maven configuration
│
├── frontend/                      # React 19 + Vite Frontend
│   ├── src/components/            # Modular feature views & studio tabs
│   ├── src/App.jsx                # Navigation shell & state orchestration
│   ├── Dockerfile                 # Production Node build + Nginx static server
│   └── package.json               # Frontend dependencies & scripts
│
├── .github/workflows/ci.yml       # Automated GitHub Actions CI/CD pipeline
├── docker-compose.yml             # Single-command full stack orchestration
├── render.yaml                    # 1-Click cloud deployment blueprint
├── .env.example                   # Environment configuration template
└── README.md                      # Platform documentation
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
* **Java 21 JDK** installed
* **Node.js 20+** installed
* **Git** installed

### 1. Clone the Repository
```bash
git clone https://github.com/saipriya-rapala/InterviewAI.git
cd InterviewAI
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your OpenAI API Key:
```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### 3. Start Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
> Backend runs at `http://localhost:8081` with live REST endpoints.

### 4. Start Frontend (React + Vite)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`.

---

## 🐳 Running with Docker

You can spin up the full platform (Backend + Frontend) with a single command:

```bash
docker compose up --build
```
* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:8081`

---

## ☁️ Cloud Deployment (Render Blueprint)

This repository includes a `render.yaml` infrastructure-as-code file for 1-click cloud hosting:

1. Fork or push this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **New** $\rightarrow$ **Blueprint**.
3. Connect your `InterviewAI` repository.
4. Supply your `OPENAI_API_KEY` when prompted.
5. Click **Apply** — Render will automatically build the Spring Boot service and deploy the static React Vite frontend.

---

## 🛡️ Security & Privacy
* Real API keys and credentials are never stored in the repository (`.gitignore` enforces strict exclusion of `.env`).
* Passwords are securely hashed with `BCryptPasswordEncoder`.
* Stateless authentication is managed using signed JWT tokens.

---

## 👤 Author & Maintainer
* **Sai Priya Rapala** ([@saipriya-rapala](https://github.com/saipriya-rapala))
* Repository: [https://github.com/saipriya-rapala/InterviewAI](https://github.com/saipriya-rapala/InterviewAI)
