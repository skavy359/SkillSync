# 11. Technical Deep Dive

## Core algorithms
1. **Burnout Detection Algorithm:** Found in the `AnalyticsService`. It works by analyzing the derivative of learning velocity (hours spent per rolling 7-day window). If the current window exceeds the historical average by a threshold (e.g., > 150%) while concurrently logging > 4 hours consecutively without a break day, the system flags a "High Burnout Risk".
2. **Heatmap Generation:** To create the GitHub-style heatmap, the backend fetches all `LearningSessions` for a user within a date range (e.g., past 365 days). It groups these by `LocalDate` and sums the `durationMinutes`. It maps these sums to "Intensity Levels" (0 to 4) which the frontend maps to specific color hex codes (e.g., empty to bright green).

## Design patterns used
- **DTO (Data Transfer Object) Pattern:** Prevents over-posting attacks and decouples the internal DB schema from the public API contract.
- **Repository Pattern:** Provided by Spring Data JPA, abstracting away SQL specifics to provide a clean, interface-driven data access layer.
- **Singleton Pattern:** Spring IoC container ensures that all `@Service` and `@Controller` classes are singletons by default, optimizing memory usage.
- **Observer Pattern (Frontend):** React's Context API acts as an implementation of the observer pattern, where deeply nested components re-render when the provided context values change.

## Framework usage
- **Spring Boot (Auto-Configuration):** Eliminates massive XML configurations. The `@SpringBootApplication` annotation triggers classpath scanning, automatically configuring components like the Tomcat server, Jackson JSON parser, and Hibernate based on dependencies present in the `pom.xml`.
- **React (Hooks):** Utilizing `useEffect` for lifecycle management and `useState` for local reactivity. Hooks allow functional components to manage state without the overhead of class-based components and `this` bindings.
- **TailwindCSS (JIT):** The Just-In-Time compiler scans the React files to generate only the specific CSS classes used, resulting in an incredibly small CSS payload.

## Important logic decisions
- **Stateless Authentication (JWT) vs. Stateful (Sessions):** SkillSync chose JWTs to allow for seamless scalability. Since no server holds session state, the backend can be replicated across multiple nodes without needing sticky sessions or a centralized Redis session store.
- **Soft Deletes vs. Hard Deletes on Skills:** Currently, if a user deletes a skill, it is a hard delete. The design decision was made to prioritize database cleanliness and GDPR compliance (Right to Erasure) over holding historical data the user explicitly requested to remove.
- **Local State for Forms:** Complex forms (like creating a learning goal) manage their state locally in the modal component rather than polluting a global Redux store or Context. This ensures state is garbage-collected when the modal closes.

## Performance considerations
- **JPA N+1 Problem Prevention:** Repositories use `@EntityGraph` or `JOIN FETCH` in custom JPQL queries to load related entities (like a user and their roles) in a single SQL query, avoiding the N+1 problem.
- **Database Indexing:** Columns heavily queried in `WHERE` clauses (e.g., `user_id` in `learning_sessions`, `status` in `learning_goals`) are indexed at the database level to maintain sub-millisecond query times even as tables grow to millions of rows.
- **Frontend Bundle Splitting:** Vite automatically code-splits the React application. Routes are loaded on demand, ensuring the initial Javascript payload is small, improving Time to Interactive (TTI).

## Scalability concerns
- **Database Bottlenecks:** As the user base grows, the `learning_sessions` table will become enormous. Future scalability might require partitioning this table by year or user_id.
- **Read-Heavy Architecture:** Dashboards hit the database heavily for aggregate calculations. Implementing a caching layer (like Redis) for the `AnalyticsService` responses would significantly reduce DB load, cacheing the heatmap data for 5-10 minutes since real-time precision is not strictly necessary for historical data.
- **Monolithic Limitations:** Currently, the entire backend is one Spring Boot app. If the community/forum feature scales disproportionately to the core tracking features, the application might need to be split into Microservices (e.g., `CoreTrackingService`, `CommunityService`).
