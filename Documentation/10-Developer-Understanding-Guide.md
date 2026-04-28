# 10. Developer Understanding Guide

## How this project works internally
SkillSync is a standard modern web application.
- **Frontend:** Built with React. It uses functional components and hooks to manage UI state. It talks to the backend via REST API calls using `axios`.
- **Backend:** Built with Spring Boot (Java). It receives requests, checks if the user is logged in (using a JWT token), interacts with the database (PostgreSQL) using Spring Data JPA, and sends JSON back to the frontend.
- **Data Flow Summary:** Browser -> Axios -> Spring Controller -> Spring Service -> Spring Repository -> PostgreSQL -> (And back up).

## How to extend it
1. **Adding a New Database Field (e.g., adding a `color` field to `SkillCategory`):**
   - **Backend:** Update the `SkillCategory.java` entity model. Add `String color`. Spring Data JPA/Hibernate will automatically update the DB schema on restart (if `ddl-auto` is set to update).
   - **Backend:** Update `SkillCategoryDTO` to include the `color` field.
   - **Backend:** Update `SkillCategoryService` if there's specific logic for color generation.
   - **Frontend:** Update the form in `Categories.jsx` to include a color picker input. Ensure the `axios.post` payload includes the `color` key. Update the UI to render the category using that color.

2. **Adding a New Page (e.g., "Achievements"):**
   - **Frontend:** Create `Achievements.jsx` in `src/pages/`.
   - **Frontend:** Add the route `<Route path="/achievements" element={<Achievements />} />` inside `App.jsx`.
   - **Frontend:** Add an "Achievements" link to the Sidebar component.
   - **Backend:** Create `AchievementController.java` to serve achievement data.

## Where to add new features
- **UI Components:** `frontend/src/components/`
- **Full Pages:** `frontend/src/pages/`
- **API Endpoints:** `backend/src/main/java/com/skillsync/backend/controller/`
- **Business Logic:** `backend/src/main/java/com/skillsync/backend/service/`
- **Database Queries:** `backend/src/main/java/com/skillsync/backend/repository/`

## How modules connect
Modules are loosely coupled. The **Skill Module** operates independently but interacts with the **User Module** (because every skill belongs to a user) and the **Session Module** (because sessions are logged against a skill). This is enforced via JPA foreign keys in the database and by importing appropriate Services in the backend (e.g., `SessionService` might inject `SkillService` to verify the skill exists before logging time).

## How to debug it
- **Frontend UI issues:** Use the React Developer Tools browser extension to inspect component state and props. Use the browser's Network tab to verify that the JSON payload being sent to the backend is correct.
- **Backend API errors:** Check the Spring Boot console output. If you get a 400 Bad Request, look for validation error messages. If you get a 500, check the stack trace in the terminal.
- **Database issues:** Connect a tool like DBeaver or pgAdmin to your PostgreSQL database to run raw SQL queries and verify data is actually being saved.

## Important code paths
- **Authentication:** `frontend/src/pages/Login.jsx` -> `backend/src/main/java/com/skillsync/backend/controller/AuthController.java` -> `backend/src/main/java/com/skillsync/backend/security/JwtAuthenticationFilter.java`
- **Logging a Session (Core Feature):** `frontend/src/pages/Dashboard.jsx` -> `SessionModal` -> `axios.post` -> `SessionController.java` -> `SessionService.java` -> `SessionRepository.java`

## Critical files to understand first
1. **`BackendApplication.java`**: See where the app boots up.
2. **`JwtAuthenticationFilter.java`**: Understand how the backend secures its endpoints using tokens.
3. **`App.jsx`**: See the entire frontend routing map and global state providers.
4. **`Dashboard.jsx`**: The most complex frontend page; understanding this will make the rest of the React code easy to follow.
5. **`application.properties` (or `application.yml`)**: Located in `backend/src/main/resources/`, it contains the database connection strings and JWT secret keys.