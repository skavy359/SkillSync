# 13. Reverse Engineer the Project

## How the project was built
SkillSync appears to have been developed iteratively, starting from a strong foundational schema.
1. **Database Schema First:** The developers likely mapped out the `users`, `skills`, and `learning_sessions` tables first, realizing these form the core engine of the app.
2. **Backend Scaffolding:** Spring Initializr was likely used to bootstrap the backend. JPA entities were written to map to the DB schema. Basic REST controllers were built for CRUD operations.
3. **Security Integration:** Spring Security and JWTs were added to protect the endpoints before frontend development began, ensuring that `userId` foreign keys could be reliably extracted from tokens rather than trusted from client payloads.
4. **Frontend Scaffolding:** `vite create react-app` was used to spin up the frontend. TailwindCSS was configured.
5. **Feature Vertical Slices:** The developers likely built "Vertical Slices"—building the entire stack for one feature at a time (e.g., The "Log Session" feature: UI Modal -> Axios Post -> Spring Controller -> Service -> DB).
6. **Advanced Features:** Finally, complex features like Recharts analytics, burnout detection algorithms, and PDF/PNG achievement generation were layered on top of the established data.

## Why certain design decisions exist
- **Why PostgreSQL instead of MongoDB?** SkillSync relies heavily on aggregations, sums, and strict relationships (e.g., a Session *must* belong to a Skill; a Skill *must* belong to a User). Relational databases like Postgres handle these structured foreign-key constraints and `GROUP BY SUM()` analytical queries far better than NoSQL document stores.
- **Why React instead of plain HTML/JS?** The application is highly interactive. Dashboards update without page reloads, and complex modals manage intricate state. React's virtual DOM is necessary to handle this level of reactivity efficiently.
- **Why the Catppuccin Theme?** The developers specifically wanted a "Professional SaaS" look that appeals to developers and students. Catppuccin provides a highly curated, aesthetically pleasing dark mode that reduces eye strain compared to stark black/white themes.

## Hidden relationships
- **The Burnout & Session Link:** The burnout detector isn't a separate table. It is entirely derived logic based on the frequency and density of records in the `learning_sessions` table. Every time a session is logged, it implicitly alters the burnout risk score.
- **Role Inheritance:** While not explicitly a hierarchy in the DB, the `ROLE_ADMIN` logically encompasses all permissions of `ROLE_USER`. The backend security filters assume that if a route requires `USER`, an `ADMIN` can also access it, managed via Spring Security authority configurations.
- **Skill to Goal implicit link:** A `LearningGoal` targets a specific `Skill`. When a `LearningSession` updates a `Skill`'s total hours or level, it implicitly affects the progress calculation of any active `LearningGoal` pointing to that skill.

## Execution dependencies
- The frontend absolutely depends on the backend being active on a specific port (usually 8080) for Axios requests to resolve.
- The backend will crash on startup if the PostgreSQL database is not running or if the credentials in `application.properties` are incorrect, because Hibernate attempts to validate or update the schema on boot.
- The achievement generator on the frontend (`html2canvas`, `jspdf`) depends on the DOM being fully rendered. If executed while data is still loading, it will generate a blank or broken image.

## Internal mechanics
- **Token Expiration:** The JWT token has an expiration time set inside the token itself during generation. The backend mechanically checks this timestamp on every request. There is no central database table checking if a token is valid; the token's cryptographic signature guarantees its authenticity.
- **Hibernate Dirty Checking:** When a Service method marked with `@Transactional` fetches a `Skill` entity and calls `skill.setTotalHours(newHours)`, the developer does not strictly need to call `repository.save(skill)`. Hibernate tracks changes to the entity (dirty checking) and automatically fires an `UPDATE` statement when the transaction commits.
- **Vite Hot Module Replacement (HMR):** During development, Vite injects a websocket connection into the frontend. When a React file is saved, Vite sends the new module over the socket, and React mechanically replaces the component tree in the browser without losing application state.