# Task Management App

A responsive, single-page task management application built with React and Tailwind CSS. It enables users to organize tasks via a clean card layout on a dashboard after passing through a presentation-only login screen. Data is kept persistent across browser sessions using safe localStorage validation checks.

## Main Features
- **Presentation Login**: Client-side validated form fields (email pattern & password length) that route directly to the dashboard.
- **Task Dashboard**: Responsive task list displaying title, optional description, priority status, and due dates.
- **Task CRUD**: Create, read, update, and delete tasks (even completed ones) with simple interactive feedback toasts.
- **Delete Confirmation**: Focus-trapped confirmation dialog (with escape-key cancel support) to avoid accidental task removals.
- **Case-Insensitive Search & Filter**: Search text matches both titles and descriptions, working in combination with All / Completed / Pending filter tabs.
- **LocalStorage Persistence**: Try-catch guarded storage handling with lazy initialization to prevent accidental empty state overwrites, and a schema validation corruption recovery trigger.

## Technologies Used
- React (v19)
- React Router (v7)
- Tailwind CSS (v4)
- Lucide React (Icons)
- Vite

## Installation & Setup Steps
1. Clone the repository to your local system.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application in development mode:
   ```bash
   npm run dev
   ```

## Production Build
To compile the application for production:
```bash
npm run build
```

---

## Important Project Notes
- **Authentication**: The login page is presentation-only and uses no secure authentication, session tokens, or API logic.
- **Storage**: All tasks are stored and validated directly inside the browser's `localStorage` namespace. If storage space is full or private browsing restricts write access, tasks persist inside the active session context instead.

---

## Implemented Bonus Features
1. **Due Dates**: Optional date picker with overdue warning badges highlighted in pulsing red text for active tasks. Tasks without a date show a clean placeholder.
2. **Theme Toggles**: Responsive toggle button (Moon/Sun icons) switching seamlessly between light and dark modes with preserved user preference settings.
3. **Pointer & Keyboard Reordering**: Mouse/touch drag-and-drop reordering, with keyboard-accessible "Move Up" / "Move Down" arrow buttons. Reordering is enabled only when search is empty and the status filter is set to "All".
