# 3. Folder & File Structure Documentation

## Entire folder hierarchy

```text
SkillSync/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/skillsync/backend/
│       ├── BackendApplication.java
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── exception/
│       ├── model/
│       ├── repository/
│       ├── security/
│       └── service/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── data/
        ├── hooks/
        ├── pages/
        └── services/
```

## Purpose of every folder

### Backend Folders
- **`config/`**: Contains global configuration files (e.g., CORS setup, WebMvc configuration, Jackson configurations).
- **`controller/`**: Houses the REST API endpoints. Defines the routing and maps HTTP requests to service layer methods.
- **`dto/`**: Data Transfer Objects. Used to transfer data between the client and server without exposing internal database models.
- **`exception/`**: Custom exception classes and global exception handlers (`@ControllerAdvice`) to standardize API error responses.
- **`model/`**: JPA Entity classes representing the database tables (e.g., `User`, `Skill`, `LearningSession`).
- **`repository/`**: Interfaces extending Spring Data JPA repositories (`JpaRepository`) for database CRUD operations.
- **`security/`**: Configuration for Spring Security, JWT filters, authentication providers, and role-based access logic.
- **`service/`**: Contains the core business logic. Acts as an intermediary between controllers and repositories.

### Frontend Folders
- **`components/`**: Reusable UI elements (Buttons, Cards, Modals, Layouts, Navbars).
- **`data/`**: Static datasets or mock data used for fallback or UI testing.
- **`hooks/`**: Custom React hooks (e.g., `useAuth`, `useFetch`, `useTheme`) encapsulating complex stateful logic.
- **`pages/`**: Top-level route components representing complete screens (e.g., `Dashboard.jsx`, `Skills.jsx`, `Login.jsx`).
- **`services/`**: API client modules containing Axios configurations and methods to call backend endpoints.

## Purpose of every important file
- **`BackendApplication.java`**: The entry point for the Spring Boot application.
- **`pom.xml`**: Maven configuration detailing backend dependencies (Spring Boot, PostgreSQL driver, JWT libraries, Lombok).
- **`main.jsx`**: The React entry point that mounts the application to the DOM.
- **`App.jsx`**: The root React component containing the main Router setup and global providers.
- **`index.css`**: Global CSS file containing Tailwind directives and custom utility classes/CSS variables (Catppuccin color scheme).
- **`package.json`**: NPM configuration detailing frontend dependencies (React, Vite, TailwindCSS, Axios, Recharts).
- **`vite.config.js`**: Configuration for the Vite bundler and dev server.

## Relationships between files
1. **Frontend to Backend:** A page component (e.g., `Skills.jsx`) imports a service function (e.g., `skillService.getAllSkills()`). The service uses `axios` to make an HTTP request to `SkillController.java` in the backend.
2. **Backend Flow:** `SkillController.java` injects `SkillService.java`. The controller delegates the request to the service. The service injects `SkillRepository.java` to fetch data from the DB, transforms `Skill.java` entities to `SkillDTO.java`, and returns them to the controller.
3. **Component Composition:** Top-level pages in `pages/` import and compose smaller blocks from `components/` to build the full UI.

## Dependency connections
- **Backend Dependencies:** Spring Web interfaces with Jackson (JSON parsing), Spring Security interfaces with JJWT (token generation/validation), Spring Data JPA interfaces with PostgreSQL driver.
- **Frontend Dependencies:** React relies on React Router for DOM navigation. Pages utilize Recharts for rendering SVG charts based on data fetched via Axios. TailwindCSS processes `index.css` and all component files to generate a minimal stylesheet at build time.

## Module mapping
- **Auth Module:** `Login.jsx`/`Register.jsx` <-> `authService.js` <-> `AuthController.java` <-> `AuthService.java` <-> `UserRepository.java`
- **Skill Module:** `Skills.jsx` <-> `skillService.js` <-> `SkillController.java` <-> `SkillService.java` <-> `SkillRepository.java`
- **Admin Module:** `AdminDashboard.jsx` <-> `adminService.js` <-> `AdminController.java` <-> `UserService.java`/`AuditRepository.java`
