# 6. Database & Data Flow

## Database structure
SkillSync utilizes a robust relational database schema deployed on **PostgreSQL**. The schema is normalized (typically 3NF) to reduce data redundancy while ensuring data integrity. Spring Data JPA manages the DDL operations via Hibernate's `auto-update` functionality during development.

## Tables/collections
Key tables in the system include:
- `users`: Core table containing user credentials, email, and basic profile info.
- `roles` & `user_roles`: Manages the Many-to-Many relationship for RBAC (Role-Based Access Control).
- `skill_categories`: Defines the grouping structure for skills (e.g., "Programming", "Music").
- `skills`: Holds specific skills a user tracks.
- `learning_sessions`: A granular log of time spent. Contains timestamps, duration, and notes.
- `learning_goals`: Defines targets set by the user with a specific deadline and target metric.
- `study_groups`: Contains metadata about collaborative groups.
- `group_memberships`: Join table managing the Many-to-Many relationship between Users and StudyGroups.
- `forum_posts` & `forum_replies`: Supports the community discussion system.

## Relationships
The architecture heavily relies on relational foreign keys mapping out specific JPA relationships:
- **One-to-Many:** 
  - `User` (1) to `Skill` (N): A user has multiple skills.
  - `Skill` (1) to `LearningSession` (N): A skill has multiple logged sessions.
  - `User` (1) to `LearningGoal` (N).
  - `SkillCategory` (1) to `Skill` (N).
- **Many-to-Many:**
  - `User` (N) to `StudyGroup` (N) mapped via `group_memberships`.
  - `User` (N) to `Role` (N) mapped via `user_roles`.

## Data lifecycle
1. **Creation:** A user interacts with the UI (e.g., creating a new skill). The frontend sends a JSON POST payload. The backend creates a new instance of the `Skill` entity and persists it. It is assigned an auto-incremented primary key (`id`).
2. **Read/Aggregation:** When rendering the dashboard, the backend performs aggregations. It queries `learning_sessions`, groups by date, and sums durations to generate the heatmap payload.
3. **Update:** A user edits a goal deadline. The backend fetches the entity by ID, modifies the field, and Hibernate issues an `UPDATE` statement.
4. **Deletion:** Users can delete skills. Cascading delete rules (defined in JPA) ensure that if a `Skill` is deleted, its associated `LearningSessions` are also removed to prevent orphaned records.

## CRUD flow
*Example: Logging a Learning Session*
- **Create:** `POST /api/sessions` payload: `{ skillId: 5, durationMinutes: 60, notes: "Studied React hooks" }` -> Insert into `learning_sessions`.
- **Read:** `GET /api/sessions/skill/5` -> Selects all sessions where `skill_id = 5`.
- **Update:** `PUT /api/sessions/102` -> Updates duration or notes.
- **Delete:** `DELETE /api/sessions/102` -> Removes the row.

## Query behavior
- **Eager vs. Lazy Loading:** By default, JPA fetches To-Many relationships lazily. For example, loading a `User` does not immediately load all their `Skills`. This prevents massive N+1 query performance hits.
- **Custom JPQL:** The `AnalyticsService` requires complex data. Rather than loading all sessions into memory and summing them in Java, Repositories define custom `@Query` methods using JPQL (or native SQL) to let PostgreSQL handle aggregations efficiently (e.g., `SUM(duration)` grouped by `DATE(created_at)`).

## Data mapping
- **DTO to Entity:** Controllers receive DTOs (e.g., `SkillRequestDto`). Service layers map these to Entities (`Skill`) before calling the repository.
- **Entity to DTO:** Repositories return Entities. Services map them to DTOs (e.g., `SkillResponseDto`) to prevent exposing sensitive internal data (like passwords inside User objects) or triggering lazy-loading exceptions during JSON serialization.

## Storage logic
- **Timestamps:** Entities utilize JPA Auditing features (`@CreatedDate`, `@LastModifiedDate`) to automatically manage `created_at` and `updated_at` columns on all major tables.
- **Soft Deletes vs. Hard Deletes:** Most deletions are hard deletes. However, depending on business logic requirements (e.g., retaining audit trails), some entities might implement soft deletes via a boolean flag (`is_active = false`), filtering them out in repository queries.
- **Indexing:** Foreign key columns (`user_id`, `skill_id`) are inherently indexed to ensure `JOIN` operations and filter queries (like loading a user's dashboard) are highly performant.
