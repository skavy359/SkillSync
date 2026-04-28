# 14. Frontend-Backend Connection Guide

## Introduction
This guide explains exactly how the React frontend talks to the Spring Boot backend, assuming you have zero prior knowledge of how web applications communicate over a network.

## The Network Concept: Request and Response
Imagine the **Frontend (React)** is a customer in a restaurant, and the **Backend (Spring Boot)** is the kitchen. They communicate by sending messages over the internet (or your local network).
1. **Request:** The Frontend asks the Backend for something (e.g., "Give me a list of my skills").
2. **Response:** The Backend processes the request (checks the database) and sends back an answer (e.g., "Here is JSON data containing your skills").

This communication happens using **HTTP** (HyperText Transfer Protocol) and **JSON** (JavaScript Object Notation - a text format that both systems understand).

## Step-by-Step Flow: Logging a Learning Session

Let's trace a real action: A user clicks "Save" on a form to log 60 minutes of studying "Java".

### 1. The Frontend Trigger (React Component)
In the frontend code (e.g., `Dashboard.jsx`), there is a button connected to a function:
```javascript
const handleSaveSession = async () => {
    const sessionData = {
        skillId: 5,
        durationMinutes: 60,
        notes: "Studied Java Spring"
    };
    // Calls the service layer
    await apiService.createSession(sessionData);
}
```

### 2. The Frontend Service (Axios Client)
To send the data across the network, the frontend uses a library called `axios`. In `src/services/apiService.js`, there is a function:
```javascript
import axios from 'axios';

// The base URL of the backend kitchen
const API_URL = 'http://localhost:8080/api'; 

export const createSession = async (sessionData) => {
    // We grab the JWT token from local storage to prove who we are
    const token = localStorage.getItem('token');
    
    // We make an HTTP POST request to the backend
    const response = await axios.post(
        `${API_URL}/sessions`, // Where to send it
        sessionData,           // The JSON data payload
        {
            headers: { Authorization: `Bearer ${token}` } // The ID badge
        }
    );
    return response.data;
}
```

### 3. Crossing the Network
The data leaves the browser, travels over port `8080`, and hits the Spring Boot backend.

### 4. The Backend Gateway (Spring Security Filter)
Before the backend accepts the data, a security guard (`JwtAuthenticationFilter.java`) intercepts the request. It looks at the `Authorization: Bearer <token>` header, verifies the cryptographic signature, and says, "Ah, this is User ID 12. Let them through."

### 5. The Backend Receiver (Spring Controller)
The request reaches `SessionController.java`. The controller is listening for POST requests at `/api/sessions`.
```java
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionDTO> logSession(@RequestBody SessionRequestDTO requestDto) {
        // Spring automatically converts the JSON from the frontend into the Java 'requestDto' object.
        SessionDTO savedSession = sessionService.createSession(requestDto);
        return new ResponseEntity<>(savedSession, HttpStatus.CREATED);
    }
}
```

### 6. The Backend Brain (Spring Service)
The `SessionService.java` takes over. It contains the business logic.
```java
@Service
public class SessionService {
    public SessionDTO createSession(SessionRequestDTO dto) {
        // 1. Check if Skill ID 5 actually exists
        // 2. Add 60 minutes to the Skill's total time
        // 3. Create a new LearningSession entity
        LearningSession session = new LearningSession();
        session.setDurationMinutes(dto.getDurationMinutes());
        // 4. Save to database using Repository
        sessionRepository.save(session);
        
        // 5. Convert entity back to a safe DTO to send to frontend
        return convertToDto(session);
    }
}
```

### 7. The Database (PostgreSQL)
`sessionRepository.save(session)` tells Hibernate (the ORM) to generate an SQL command:
`INSERT INTO learning_sessions (skill_id, duration_minutes, notes) VALUES (5, 60, 'Studied Java Spring');`

### 8. The Journey Back (Response)
1. The Database tells the Service it succeeded.
2. The Service gives the data to the Controller.
3. The Controller packages it into an HTTP Response with status code `201 CREATED` and converts the Java object back into JSON format.
4. The JSON is fired back across the network to the browser.

### 9. The Frontend Reacts
Back in `Dashboard.jsx`, the `await` finishes.
```javascript
const handleSaveSession = async () => {
    try {
        const result = await apiService.createSession(sessionData);
        // Result contains the newly saved session data!
        toast.success("Session logged successfully!");
        refreshDashboardData(); // Update the UI to show the new data
    } catch (error) {
        toast.error("Failed to save session.");
    }
}
```
The user sees a green popup saying "Session logged successfully!" and their dashboard heatmap instantly lights up with the new data. This entire cycle usually happens in under 100 milliseconds.
