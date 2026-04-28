# 12. Visual Documentation

*(Note: These diagrams use Mermaid.js syntax. You can view them by rendering this markdown file in a compatible viewer like GitHub or a Mermaid live editor.)*

## 1. Flowchart: User Registration & Onboarding

```mermaid
flowchart TD
    A([User Lands on Site]) --> B{Has Account?}
    B -->|Yes| C[Login Screen]
    B -->|No| D[Registration Screen]
    D --> E[Submit Form]
    E --> F{Validation Passes?}
    F -->|No| G[Show Error Messages]
    G --> D
    F -->|Yes| H[Save User to DB]
    H --> I[Generate JWT]
    I --> J([Redirect to Dashboard])
    J --> K[Prompt to Add First Skill]
```

## 2. Sequence Diagram: Creating a Goal

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant API Gateway
    participant GoalController
    participant GoalService
    participant Database

    User->>Browser: Fill Goal Form & Click Submit
    Browser->>API Gateway: POST /api/goals (JWT + JSON)
    API Gateway->>GoalController: Route Request
    GoalController->>GoalService: map to DTO & call create()
    GoalService->>Database: INSERT INTO goals...
    Database-->>GoalService: GoalEntity (id=42)
    GoalService-->>GoalController: GoalResponseDTO
    GoalController-->>API Gateway: 201 Created
    API Gateway-->>Browser: JSON Response
    Browser->>User: Toast "Goal Created!" & Update List
```

## 3. Architecture Chart: Tech Stack

```mermaid
mindmap
  root((SkillSync))
    Frontend
      React 19
      Vite
      TailwindCSS
      Axios
      Recharts
    Backend
      Java 17
      Spring Boot 4
      Spring Security
      Spring Data JPA
      Hibernate
    Database
      PostgreSQL
      pgAdmin (Tooling)
    Infrastructure (Target)
      Docker
      AWS / Vercel
```

## 4. Class Diagram (Backend Entities Snippet)

```mermaid
classDiagram
    class User {
        +Long id
        +String username
        +String email
        +String password
        +List~Role~ roles
    }
    class Skill {
        +Long id
        +String name
        +Integer level
        +Long userId
    }
    class LearningSession {
        +Long id
        +Long skillId
        +Integer durationMinutes
        +String notes
        +LocalDateTime date
    }
    class StudyGroup {
        +Long id
        +String name
        +String description
    }

    User "1" -- "*" Skill : tracks
    Skill "1" -- "*" LearningSession : has logs
    User "*" -- "*" StudyGroup : joins
```

## 5. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ SKILLS : "creates"
    USERS ||--o{ LEARNING_GOALS : "sets"
    USERS }|..|{ STUDY_GROUPS : "joins via group_memberships"
    USERS }|..|{ ROLES : "has via user_roles"
    
    SKILL_CATEGORIES ||--o{ SKILLS : "categorizes"
    
    SKILLS ||--o{ LEARNING_SESSIONS : "logs time via"
    
    USERS {
        int id PK
        string username
        string password
    }
    SKILLS {
        int id PK
        int user_id FK
        int category_id FK
        string title
        int level
    }
    LEARNING_SESSIONS {
        int id PK
        int skill_id FK
        int duration
        timestamp created_at
    }
```