# 4. Frontend Documentation

## UI architecture
The frontend is constructed as a React 19 Single Page Application (SPA). The architecture follows a component-centric model where the UI is broken down into small, isolated, and reusable pure functions or stateful blocks. The overarching structure wraps the main application in global Context Providers (e.g., ThemeProvider, AuthProvider) and a top-level Router.

## Pages/screens/components
- **Pages (`src/pages/`)**: These act as smart components or container components. They map to specific URL routes. Examples include `Dashboard.jsx`, `Profile.jsx`, `Settings.jsx`, and various `Admin*.jsx` pages. Pages handle data fetching, state aggregation, and complex layout orchestration.
- **Components (`src/components/`)**: These are primarily dumb or presentational components. Examples might include `Button`, `Card`, `Modal`, `Navbar`, and `Sidebar`. They receive data via props and emit events via callbacks. They are designed to be context-agnostic so they can be reused across different Pages.

## State management
SkillSync utilizes a mixed state management strategy:
- **Local Component State**: Managed via `useState` and `useReducer` for UI-specific, ephemeral states (e.g., modal visibility, form inputs, local toggles).
- **Context API**: Managed via React `createContext` and `useContext` for global application state. This is used sparingly for things like user authentication status (`AuthContext`) and UI theme preferences (`ThemeContext`).
- **Server State**: Managed via custom hooks encapsulating `useEffect` and `useState` for asynchronous data fetching, or standardizing around Axios patterns to keep server-side data (like the list of Skills or current Leaderboard) in sync with the UI.

## Routing/navigation
Client-side routing is handled by **React Router**. 
- A top-level `<BrowserRouter>` wraps the app.
- `<Routes>` and `<Route>` define the mapping between URL paths (e.g., `/dashboard`) and React Page components (`<Dashboard />`).
- **Protected Routes**: A custom wrapper component (e.g., `<ProtectedRoute>`) intercepts navigation. If a user is not authenticated (no valid JWT), they are redirected to `/login`. Admin routes use a similar `<AdminRoute>` checking for the `ROLE_ADMIN` authority.

## Styling system
Styling is strictly managed using **TailwindCSS 4.1**.
- **Utility-First**: UI components are styled using Tailwind's utility classes directly in the `className` attribute.
- **Theme Configuration**: The `index.css` and Tailwind config define custom CSS variables corresponding to the **Catppuccin Dark** color palette.
- **Responsive Design**: Tailwind's breakpoint prefixes (`md:`, `lg:`) are used extensively to ensure mobile-first responsiveness.
- **Dark Mode**: Configured out-of-the-box, leaning heavily on the deep grays and vibrant accents of the Catppuccin theme.

## Widgets/components usage
- **Recharts**: Used for complex data visualization. The `Analytics.jsx` and `Dashboard.jsx` pages rely on Recharts to render AreaCharts, BarCharts, and custom GitHub-style activity heatmaps.
- **Lucide React**: Provides consistent, SVG-based iconography across the entire application (e.g., icons in sidebars, buttons, and alert cards).

## User interaction flow
1. **Navigation:** User clicks a link in the Sidebar. React Router updates the URL and swaps the active Page component without reloading the browser window.
2. **Action Trigger:** User interacts with a widget (e.g., clicks "Start Session").
3. **Optimistic/Pessimistic Update:** A modal appears. The user submits a form. An Axios request is fired. A loading spinner indicates progress.
4. **Completion:** Upon successful response, the local state is updated, the modal closes, and a success toast/notification is displayed.

## Frontend lifecycle
1. **Initialization:** `main.jsx` calls `createRoot().render()`.
2. **Mounting:** Top-level providers are mounted. `App.jsx` evaluates the current route.
3. **Data Hydration:** If on a protected route, `useEffect` hooks trigger Axios GET requests to hydrate the view with user data.
4. **Interactive Phase:** React reconciliation handles updates as the user interacts with stateful elements.
5. **Unmounting:** When navigating away, cleanup functions in `useEffect` (e.g., clearing timers or aborting pending fetch requests) are executed.

## Design philosophy
The design philosophy is centered around a **Professional SaaS-Grade Aesthetic**:
- High contrast, dark-mode-first visuals.
- Skeleton loaders rather than blocking full-screen spinners.
- Glassmorphism effects for modals and dropdowns.
- Consistent typography and spacing (following an 8px grid system).

## Data rendering flow
1. Component mounts -> `loading = true`.
2. `useEffect` calls `service.getData()`.
3. Axios returns a Promise.
4. If resolved -> `setData(response.data)`, `loading = false`.
5. If rejected -> `setError(error.message)`, `loading = false`.
6. Component renders: `if (loading) return <Skeleton />`, `if (error) return <ErrorMessage />`, `return <DataView data={data} />`.