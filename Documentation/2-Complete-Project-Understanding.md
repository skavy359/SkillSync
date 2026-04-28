# 2. Complete Project Understanding

## High-level project overview
SkillSync is a dual-layered system composed of a React 19 frontend and a Spring Boot 4 backend, linked via RESTful APIs. It functions as a complete SaaS ecosystem dedicated to tracking and enhancing the personal learning experience. The platform is designed around gamification, deep data analytics, and user collaboration. It supports role-based access control (User vs. Admin), robust authentication using JWTs, and persistent data storage through PostgreSQL.

## Architecture explanation
SkillSync follows a classic **Client-Server Architecture**:
- **Presentation Layer (Frontend):** A Single Page Application (SPA) built with React 19 and Vite. It utilizes TailwindCSS for styling and React Router for navigation. State is managed locally within components or via contexts, and asynchronous requests are handled by Axios.
- **Business Logic Layer (Backend):** A monolithic Spring Boot application. It exposes a REST API via Spring Web MVC. Spring Security handles endpoint protection, while controllers delegate logic to service classes.
- **Data Access Layer (Backend):** Spring Data JPA repositories interface with the PostgreSQL database using Hibernate as the ORM. Models correspond directly to database tables.
- **Database Layer:** A relational PostgreSQL database that stores all persistent data (Users, Skills, Sessions, Goals, Forums, Study Groups).

## Full workflow of the application
1. **Authentication Flow:** A user visits the application, submits credentials to the `/api/auth/login` endpoint. The backend validates the credentials and issues a JSON Web Token (JWT). The frontend stores this token and includes it in the `Authorization: Bearer <token>` header of subsequent requests.
2. **Dashboard Initialization:** Upon login, the dashboard fetches aggregated data (total sessions, active goals, heatmap data) from multiple backend endpoints simultaneously.
3. **Core Entity Management:** Users interact with specific modules (Skills, Categories, Goals). When a user creates a new Skill, the frontend sends a POST request with the DTO; the backend validates it, saves the entity via the Repository, and returns the persisted object.
4. **Learning Loop:** A user starts a session. They log time against a specific skill. The backend records this `LearningSession`, updates the associated `Skill`'s total hours, recalibrates the user's weekly statistics, and checks for goal completions or burnout risks.
5. **Collaboration Loop:** Users can join `StudyGroups`, post in `DiscussionForums`, and interact with `StudyEvents`.

## How data flows through the system
1. **User Input:** The user enters data (e.g., logging 2 hours for "React") via a React component form.
2. **API Request:** Axios intercepts the request, appends the JWT, and sends a POST request to `/api/sessions`.
3. **Controller & Validation:** The `SessionController` receives the JSON payload, mapped to a DTO. Spring's validation annotations (`@Valid`) ensure data integrity.
4. **Service Layer:** The controller passes the valid DTO to the `SessionService`. The service performs business logic (e.g., verifying the user owns the skill, updating total hours, checking burnout limits).
5. **Repository Layer:** The service invokes `SessionRepository.save()` and `SkillRepository.save()`.
6. **Database:** Hibernate translates these calls into SQL `INSERT`/`UPDATE` statements executed against PostgreSQL.
7. **Response:** The saved entity is converted back to a Response DTO and sent to the frontend with a 201 Created status.
8. **UI Update:** The React frontend updates its local state and triggers a re-render to display the newly logged session.

## What happens from app start → end process
- **App Start:** The Vite dev server serves the bundled `index.html` and JavaScript assets. The React app mounts on the root `div`. React Router determines the active route. If a valid JWT exists in local storage, the user is routed to the Dashboard; otherwise, they are redirected to Login.
- **Execution:** As the user navigates, React renders appropriate page components. `useEffect` hooks trigger Axios calls to fetch necessary data. The UI dynamically responds to loading states, errors, and successful data retrievals.
- **End Process:** When the user clicks "Logout", the frontend clears the JWT from local storage, resets user-specific states, and redirects to the Login page. From the backend's perspective, since it's stateless (JWT-based), no explicit session destruction is required on the server besides ignoring subsequent requests without a token.

## Main execution lifecycle
1. **Bootstrapping:** Backend starts (`BackendApplication.java`), initializes Spring Application Context, connects to PostgreSQL, applies schema updates (Hibernate auto-ddl), and exposes REST endpoints.
2. **Client Initialization:** Frontend is loaded in the browser, establishing the React component tree and context providers.
3. **Stateless Request Handling:** Each client action initiates a discrete HTTP request. The backend intercepts the request via the Security Filter Chain to validate the JWT, processes the request via Controller -> Service -> Repository, and returns a JSON response.
4. **View Rendering:** The frontend parses the JSON response and updates the Virtual DOM, allowing the browser to repaint the updated UI.