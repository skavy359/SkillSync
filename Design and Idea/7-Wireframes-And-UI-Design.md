# 7. Wireframes & UI Design

## Wireframe diagrams for all major screens
*(Note: As text-based documentation, these are structural representations.)*

### 1. Dashboard Wireframe
```text
[ Navbar: Logo | Search | Notifications | Profile Avatar ]
------------------------------------------------------------
[ Sidebar:  ] | [ Welcome Back, User!                      ]
[ Dashboard ] | 
[ Skills    ] | [ Quick Stats: Total Hours | Active Goals  ]
[ Sessions  ] | 
[ Analytics ] | [ Activity Heatmap (GitHub style)          ]
[ Community ] | [ x x x x x x x                            ]
[ Settings  ] | 
[ Admin     ] | [ Recent Sessions List ] [ Burnout Alert ]
```

### 2. Skills Management Wireframe
```text
[ Navbar ]
------------------------------------------------------------
[ Sidebar ]   | [ Skills Header ] [ + Add New Skill Btn ]
              | 
              | [ Category Tabs: All | Programming | Art ]
              | 
              | [ Skill Card 1 ] [ Skill Card 2 ]
              |   - Title        - Title
              |   - Level Bar    - Level Bar
              |   - Total Hrs    - Total Hrs
```

### 3. Analytics Wireframe
```text
[ Navbar ]
------------------------------------------------------------
[ Sidebar ]   | [ Analytics Dashboard ]
              | 
              | [ Time Range Selector: 7d | 30d | 1y ]
              | 
              | [ Bar Chart: Hours per Category ]
              | 
              | [ Line Chart: Learning Velocity ]
              | 
              | [ Radar Chart: Skill Distribution ]
```

## UI layout diagrams
The application utilizes a standard **Admin/Dashboard Layout**:
1. **Top Navbar (Fixed):** Contains global search, notification bell, and user profile dropdown. High z-index.
2. **Left Sidebar (Fixed):** Primary navigation menu. Collapses to icons on smaller screens.
3. **Main Content Area (Scrollable):** The dynamic router outlet where pages render. Uses a max-width container to prevent excessive stretching on ultra-wide monitors.

## Navigation flow diagrams
```text
[Login/Register] --> (Auth Success) --> [Dashboard]
                                           |
    +-----------------+--------------------+------------------+
    |                 |                    |                  |
[Skills]         [Sessions]           [Analytics]        [Community]
    |                 |                    |                  |
[Skill Detail]   [Log Session Modal]  [Goal Metrics]     [Leaderboard]
                                                         [Study Groups]
```

## User interaction diagrams
**Adding a Session Flow:**
1. User clicks "Log Session" FAB (Floating Action Button).
2. Background dims, Modal opens.
3. User selects Skill from dropdown, inputs duration, types notes.
4. User clicks "Save".
5. Button shows loading spinner.
6. Modal closes, Toast notification "Session Saved!" appears top-right.
7. Dashboard graphs re-animate to show new data.

## Page hierarchy maps
- `/` -> Redirects to `/dashboard` (if auth) or `/login`
- `/dashboard`
- `/skills`
  - `/skills/:id` (Skill Detail Page)
- `/categories`
- `/sessions`
- `/goals`
- `/analytics`
- `/community`
  - `/community/leaderboard`
  - `/community/groups`
- `/settings`
- `/admin` (Protected Role)
  - `/admin/users`
  - `/admin/analytics`

## UX structure
- **Progressive Disclosure:** Complex settings and deep analytics are hidden behind tabs or "View More" links to keep the primary view uncluttered.
- **Feedback Loops:** Every user action (create, update, delete) is met with immediate visual feedback via toast notifications. Destructive actions require confirmation dialogues.
- **Empty States:** If a user has no skills, they aren't shown a blank table. They see an illustrated empty state with a clear, pulsing Call to Action (CTA) button encouraging them to create their first skill.

## Screen relationships
Screens are contextually linked. For example, clicking on a specific skill in the Dashboard's "Recent Sessions" list routes the user directly to `/skills/:id`, passing the context to immediately show detailed statistics for that specific skill, rather than forcing the user to navigate through the main Skills directory.

## Component positioning concepts
- **F-Pattern Layout:** The UI respects the standard western F-pattern reading layout. Logos and primary nav items are top-left. Content headers are top-left of the main area.
- **Card-Based UI:** Information is chunked into discrete cards with distinct borders and subtle shadows, creating a clear visual hierarchy and preventing data bleeding.
