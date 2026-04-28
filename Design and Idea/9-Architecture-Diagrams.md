# 9. Architecture Diagrams

## System architecture diagram

```mermaid
graph TD
    Client[Browser / React SPA] -->|HTTPS / REST| Gateway[Spring Security Filter Chain]
    Gateway -->|Valid JWT| Controllers[Spring REST Controllers]
    Controllers --> Services[Business Logic Services]
    Services --> Repositories[Spring Data JPA Repositories]
    Repositories -->|Hibernate / SQL| DB[(PostgreSQL Database)]
    
    subgraph Frontend [React 19 Frontend]
        Client
    end
    
    subgraph Backend [Spring Boot 4 Backend]
        Gateway
        Controllers
        Services
        Repositories
    end
```

## Frontend-backend communication diagram

```mermaid
sequenceDiagram
    participant User
    participant React UI
    participant Axios Client
    participant Spring Controller
    participant Spring Service
    participant PostgreSQL

    User->>React UI: Clicks "Add Session"
    React UI->>Axios Client: POST /api/sessions payload
    Axios Client->>Spring Controller: HTTP POST (with Bearer Token)
    Spring Controller->>Spring Service: Pass DTO
    Spring Service->>Spring Service: Validate Business Logic
    Spring Service->>PostgreSQL: INSERT into learning_sessions
    PostgreSQL-->>Spring Service: Return saved Entity
    Spring Service-->>Spring Controller: Return Response DTO
    Spring Controller-->>Axios Client: 201 Created (JSON)
    Axios Client-->>React UI: Resolve Promise
    React UI->>User: Show Success Toast & Update UI
```

## Request lifecycle diagram

```mermaid
flowchart LR
    Request((Incoming Request)) --> AuthFilter{Has Valid JWT?}
    AuthFilter -->|No| 401[401 Unauthorized]
    AuthFilter -->|Yes| DispatcherServlet
    DispatcherServlet --> Controller[RestController]
    Controller --> Validation{Is Payload Valid?}
    Validation -->|No| 400[400 Bad Request]
    Validation -->|Yes| Service[Service Layer]
    Service --> DB[Database]
    DB --> Service
    Service --> Controller
    Controller --> Response((HTTP 200/201 JSON))
```

## Data flow diagram

```mermaid
graph TD
    UI[Frontend Forms/Views] -->|JSON DTO| Controller
    Controller -->|Java DTO| Mapper1(DTO to Entity Mapper)
    Mapper1 --> Entity[JPA Entity]
    Entity --> Repository
    Repository -->|SQL INSERT/UPDATE| DB[(Database)]
    DB -->|SQL SELECT| Repository
    Repository --> Entity
    Entity --> Mapper2(Entity to DTO Mapper)
    Mapper2 -->|Java DTO| Controller
    Controller -->|JSON| UI
```

## Module interaction diagram

```mermaid
graph TD
    AuthModule[Authentication Module] --> UserModule[User Profile Module]
    UserModule --> SkillModule[Skill Management Module]
    SkillModule --> SessionModule[Learning Sessions Module]
    SkillModule --> CategoryModule[Category Module]
    SessionModule --> AnalyticsModule[Analytics & Heatmap Module]
    SkillModule --> GoalModule[Goals Module]
    UserModule --> CommunityModule[Community / Forum Module]
    UserModule --> AdminModule[Admin Audit & Management]
```

## Dependency graph

```mermaid
graph LR
    Frontend --> React[React 19]
    Frontend --> Vite[Vite Build Tool]
    Frontend --> Tailwind[TailwindCSS]
    Frontend --> Axios[Axios HTTP]
    Frontend --> Recharts[Recharts]
    
    Backend --> SpringBoot[Spring Boot 4]
    SpringBoot --> SpringSecurity[Spring Security]
    SpringBoot --> SpringData[Spring Data JPA]
    SpringSecurity --> JJWT[JJWT Library]
    SpringData --> Hibernate[Hibernate ORM]
    Hibernate --> PostgresDriver[PostgreSQL Driver]
```

## Component interaction chart

```mermaid
graph TD
    Dashboard[Dashboard Page] --> StatCard[Stat Cards Component]
    Dashboard --> Heatmap[Activity Heatmap Component]
    Dashboard --> RecentList[Recent Sessions List]
    
    Skills[Skills Page] --> SkillCard[Skill Card Component]
    Skills --> AddSkillModal[Add Skill Modal]
    
    SkillCard --> ProgressBar[Progress Bar Component]
    AddSkillModal --> FormInput[Custom Form Input]
    AddSkillModal --> PrimaryButton[Primary Button]
```
