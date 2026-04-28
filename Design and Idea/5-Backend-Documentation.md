# 5. Backend Documentation

## API architecture
SkillSync's backend is a monolithic Spring Boot 4 REST API. It strictly adheres to REST principles, utilizing standard HTTP methods (GET, POST, PUT, DELETE) mapped to resource URIs (e.g., `/api/v1/skills`, `/api/v1/sessions`). The API speaks JSON exclusively, utilizing Jackson for serialization and deserialization.

## Business logic flow
The application utilizes a classic N-Tier architecture:
1. **Controller Layer:** `@RestController` classes intercept incoming HTTP requests. They parse path variables, request parameters, and JSON bodies into Java DTOs (Data Transfer Objects).
2. **Service Layer:** Controllers pass DTOs to `@Service` classes. This layer contains the core business logic (e.g., calculating burnout metrics, verifying permissions, managing the logic of leveling up a skill). Services act as the transaction boundaries (`@Transactional`).
3. **Repository Layer:** Services call `@Repository` interfaces extending `JpaRepository`. This layer handles database abstraction and custom JPQL/Native SQL queries.

## Database interaction
Interaction with PostgreSQL is managed via **Spring Data JPA** and **Hibernate**.
- **Entities:** Java classes annotated with `@Entity` map directly to database tables.
- **ORM:** Hibernate handles the Object-Relational Mapping, converting Java objects to SQL statements.
- **Repositories:** Developers define interfaces extending `JpaRepository<Entity, ID>`. Spring automatically generates the implementation at runtime. Custom queries are written using method name conventions (e.g., `findByUserIdAndSkillId`) or the `@Query` annotation.

## Authentication system
Authentication is stateless and implemented using **Spring Security** and **JSON Web Tokens (JWT)**.
1. **Login:** A user posts `{username, password}` to `AuthController`.
2. **Verification:** `AuthenticationManager` checks credentials against the database.
3. **Token Generation:** A JWT is generated containing the user's ID, username, and roles in the claims, signed with a secret key.
4. **Token Usage:** The client sends the JWT in the `Authorization: Bearer <token>` header for subsequent requests.
5. **Filter Chain:** A custom `JwtAuthenticationFilter` intercepts incoming requests, validates the signature and expiration, extracts the user details, and populates the `SecurityContextHolder`.

## Services and controllers
- **Controllers:** `AuthController`, `SkillController`, `AdminController`, `UserProfileController`, `ForumController`, `StudyGroupController`, etc. They are kept lean, focusing solely on request handling and HTTP status mapping.
- **Services:** `AuthService`, `SkillService`, `AnalyticsService`, etc. They handle complex logic. For example, `AnalyticsService` queries the repository to build the GitHub-style heatmap data structures required by the frontend.

## Models/entities
Key JPA Entities found in the `model` package:
- `User`: Core identity, containing credentials and roles.
- `Skill`: Represents a subject a user is learning. Linked to a user and a `SkillCategory`.
- `LearningSession`: Records time spent on a specific `Skill`.
- `LearningGoal`: Targets set by the user.
- `StudyGroup`: Collaborative groups users can join.
- `ForumPost` / `ForumReply`: Entities supporting the community discussion features.

## Middleware
In Spring Boot, middleware equivalents are implemented as **Filters** and **Interceptors**:
- **Filters:** `JwtAuthenticationFilter` is the primary middleware, running before requests reach the `DispatcherServlet` to assert security context.
- **Exception Handlers:** `@ControllerAdvice` serves as global error-handling middleware. It catches exceptions thrown by controllers or services (e.g., `ResourceNotFoundException`) and formats them into standard JSON error responses with appropriate HTTP status codes (e.g., 404 Not Found).

## Request-response lifecycle
1. Request arrives at Tomcat server.
2. Passes through Spring Security Filter Chain (JWT Validation).
3. If valid, passes to `DispatcherServlet`.
4. Routed to the appropriate `@RestController` method.
5. JSON payload mapped to DTO and validated (`@Valid`).
6. Service method executed.
7. Service accesses database via Repository.
8. Service returns Entity or DTO to Controller.
9. Controller returns `ResponseEntity<T>`.
10. Jackson serializes response to JSON.
11. HTTP response sent to client.

## Data validation
Input validation is enforced at the Controller layer using standard Java Bean Validation (JSR 380) annotations on DTOs:
- `@NotNull`, `@NotBlank`, `@Email` ensure fields exist and conform to basic formats.
- `@Size` restricts string lengths.
- If validation fails, Spring automatically throws a `MethodArgumentNotValidException`, which is caught by the global exception handler and returned as a `400 Bad Request` containing details of the validation errors.

## Security flow
Beyond authentication, **Authorization** is handled via method-level security:
- `@PreAuthorize("hasRole('ADMIN')")` protects admin-only endpoints.
- Resource-level security is enforced in the Service layer (e.g., verifying that the `userId` associated with a requested `Skill` matches the `userId` in the `SecurityContext` before allowing deletion).
- CORS configuration allows requests exclusively from the designated frontend URL, protecting against cross-origin attacks.
