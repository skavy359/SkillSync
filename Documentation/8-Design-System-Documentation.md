# 8. Design System Documentation

## UI design guidelines
SkillSync's UI is designed to look like a premium, modern SaaS product. The design guidelines are heavily inspired by tools like Linear, Vercel, and Notion.
- **Minimalism:** Remove unnecessary borders, backgrounds, and dividers. Let whitespace define structure.
- **Depth via Opacity:** Instead of heavy drop shadows, use semi-transparent backgrounds and subtle borders (glassmorphism) to create depth.
- **Feedback:** Every interactive element must have a defined hover, active, and disabled state.
- **Corners:** Consistent `rounded-xl` or `rounded-2xl` on cards to create a friendly but professional feel. Sharp edges are avoided.

## Color palette suggestions
SkillSync uses a customized **Catppuccin Mocha** (Dark) theme:
- **Base Background:** `#1e1e2e` - Deep, desaturated purple/blue for the main app background.
- **Mantle/Crust:** `#181825` / `#11111b` - Used for sidebars and deeper elevated surfaces.
- **Surface (Cards):** `#313244` - Used for cards, modals, and elevated containers.
- **Primary Text:** `#cdd6f4` (Text) - High contrast but softer than pure white.
- **Subtext:** `#a6adc8` (Subtext0) - For secondary information and placeholders.
- **Accents:**
  - **Primary/Brand:** `#cba6f7` (Mauve) or `#89b4fa` (Blue) for primary buttons and active states.
  - **Success:** `#a6e3a1` (Green) for completed goals and positive metrics.
  - **Warning:** `#f9e2af` (Yellow) for burnout warnings and mid-level progress.
  - **Danger:** `#f38ba8` (Red) for destructive actions and severe burnout alerts.

## Typography system
- **Primary Font:** `Inter` or `Geist` (sans-serif). Chosen for its high legibility in dense data applications and modern aesthetic.
- **Headings (h1, h2):** Bold (700), tight tracking (-0.02em) for a punchy look.
- **Body Text:** Regular (400) or Medium (500), comfortable line height (1.5 or 1.6) to reduce eye strain during long reading sessions.
- **Monospace:** `JetBrains Mono` or `Fira Code` for code snippets, session IDs, or tabular data where alignment is crucial.

## Layout spacing
The system uses an 8px grid (Tailwind defaults):
- `gap-2` (8px) for tightly coupled elements (icon + text).
- `gap-4` (16px) for standard component spacing.
- `gap-6` (24px) or `gap-8` (32px) between major sections or cards.
- **Padding:** Containers usually have `p-6` to ensure content breathes.

## Component consistency
- **Buttons:** All primary buttons share a consistent height (`h-10`), padding (`px-4`), and rounded corners. Hover states typically lighten the background color by 10%.
- **Inputs:** Form inputs have a subtle background (`bg-surface`), a subtle border (`border-overlay`), and a clear focus ring using the primary accent color.
- **Cards:** Cards never have harsh borders. They use a subtle 1px border (`border-white/5`) and a very soft shadow to lift them off the base background.

## Theme explanation
The application is built **Dark Mode First**. While light mode could be supported via Tailwind's `dark:` modifier, the core identity of the app relies on the sleek, focused environment that a dark theme provides. It reduces eye strain for developers and students who are the target audience and frequently use the application at night or in low-light environments.

## UI principles
1. **Clarity over Density:** Do not cram all data onto one screen. Use whitespace and progressive disclosure.
2. **Data-Ink Ratio:** Maximize the data-to-ink ratio in charts. Remove grid lines, axis ticks, and borders where they aren't strictly necessary. Let the data (the color fill or line) stand out.
3. **Motion with Purpose:** Animations should be fast (< 200ms) and serve a purpose, such as indicating that a page transition is happening or a sidebar is collapsing, rather than just being decorative.