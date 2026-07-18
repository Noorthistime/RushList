# Rushlist
A modern, full-stack Todo & Task Tracker application built with Next.js, React, Tailwind CSS, and TypeScript, featuring secure JSON database storage, multi-list support, reminder notifications, drag-and-drop task ordering, and dynamic dark mode toggles.

## Project Structure
```text
Rushlist/
├── data/                 # JSON file-based database storage
│   ├── todos.json        # User tasks and lists database
│   └── users.json        # Registered user credentials
├── public/               # Static assets (icons, images)
├── src/
│   ├── app/              # Next.js App Router pages & APIs
│   │   ├── api/          # REST API endpoints
│   │   │   ├── auth/     # User authentication endpoints (signup, login, logout, me, password, delete)
│   │   │   │   ├── delete/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── password/
│   │   │   │   │   └── route.ts
│   │   │   │   └── signup/
│   │   │   │       └── route.ts
│   │   │   ├── lists/    # List CRUD routes
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── tasks/    # Task CRUD routes
│   │   │       ├── [id]/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── auth/         # Auth view page (Login/Signup frontend wrapper)
│   │   │   └── page.tsx
│   │   ├── dashboard/    # Dashboard layout and main view
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css   # Tailwind styles & custom animations
│   │   ├── layout.tsx    # Root layout template
│   │   └── page.tsx      # Main landing/redirect page
│   ├── backend/          # Backend server architecture
│   │   └── lib/          # Backend library utilities
│   │       ├── auth.ts       # JWT token generation/verification
│   │       ├── constants.ts  # Application themes, routes, defaults
│   │       ├── db.ts         # Atomic database CRUD with file locking
│   │       ├── utils.ts      # Class merging helpers
│   │       └── validators.ts # Zod validation schemas
│   ├── frontend/         # Frontend client architecture
│   │   ├── components/   # React components (dialogs, forms, custom grids)
│   │   ├── hooks/        # Custom React hooks (themes, tasks, auth, reminders)
│   │   └── types/        # TypeScript interfaces & types
│   └── proxy.ts          # Next.js 16 Proxy boundary for routing and authentication
├── components.json       # Shadcn UI configuration
├── package.json          # Dependency and build scripts
└── tsconfig.json         # TypeScript configurations
```

## Features
### 1. User Management
* User registration with validation
* Secure login with session management (JWT stored in HTTP-Only cookies)
* Password resetting and profile updates
* Full account deletion (clears user profile and associated tasks)
* Logout functionality

### 2. List Management
* Create custom todo lists
* Custom themes and accent colors per list
* Edit list titles
* Delete lists and all nested tasks

### 3. Task Tracking
* Add tasks to lists
* Mark tasks as completed
* Set reminder times for tasks
* Drag-and-drop sorting and reordering of tasks
* Edit task titles and reminder settings

### 4. Theme & Accent Customization
* Dynamic dark/light mode toggle
* Theme color persistence across reloads
* Support for a variety of custom accent colors

### 5. Reminders & Alerts
* custom reminder hooks for upcoming/due task alerts
* Toast notifications (using Sonner) for task completions and updates

## Technologies Used
* **Frontend:** React 19, Next.js 16 (App Router), Tailwind CSS 4, Framer Motion (for fluid transitions), @dnd-kit (for drag-and-drop sorting), Lucide React (icons), Sonner (toast notifications)
* **Backend:** Next.js API Routes (Serverless Functions)
* **Database:** Local JSON file storage with file locking (`proper-lockfile`)
* **Languages:** TypeScript, JavaScript, CSS

## Database Setup
### Prerequisites
* Node.js (v18.0 or higher)
* npm, yarn, pnpm, or bun

### Installation Steps
1. **Clone/Extract Project**
   Extract files or pull repository contents into your local workspace.
2. **Install Dependencies**
   Run the package installer in the project directory:
   ```bash
   npm install
   ```
3. **Database Initialization**
   The project uses file-based JSON storage (`data/users.json` and `data/todos.json`). These files will be automatically created and seeded when you run the application for the first time.

## Building the Project
### Using npm
```bash
# Clean and build Next.js optimized production package
npm run build

# Start the built production server locally
npm run start
```

## Running the Application
1. Install dependencies (`npm install`).
2. Run the Next.js development server:
   ```bash
   npm run dev
   ```
3. Access the application in your browser:
   [http://localhost:3000/](http://localhost:3000/)

## Default Login Credentials
* No pre-configured login credentials are required. 
* Navigate to the `/auth` page to register a new account instantly.

## API Endpoints
### Authentication
* `POST /api/auth/signup` - Register a new user
* `POST /api/auth/login` - Authenticate user credentials & issue cookie session
* `POST /api/auth/logout` - Clear session cookies
* `GET /api/auth/me` - Get active session user details
* `POST /api/auth/password` - Update user account password
* `DELETE /api/auth/delete` - Remove user account and all tasks

### Lists
* `GET /api/lists` - Fetch all todo lists for active user
* `POST /api/lists` - Create a new todo list
* `PUT /api/lists/[id]` - Update list title or theme
* `DELETE /api/lists/[id]` - Delete list and all nested tasks

### Tasks
* `POST /api/tasks` - Create a new task under a list
* `PUT /api/tasks/[id]` - Update task status, title, reminder, or ordering
* `DELETE /api/tasks/[id]` - Delete a specific task

## Database Structure (JSON Schema)
### Users (`data/users.json`)
* `id` (Primary Key - UUID)
* `name` (Display Name)
* `email` (Unique Email)
* `passwordHash` (Bcrypt Hashed Password)
* `createdAt` (ISO Timestamp)

### Todos (`data/todos.json`)
* `userId` (Foreign Key - links to User)
* `lists` (Array of Todo Lists):
  * `id` (List Key - UUID)
  * `title` (List Name)
  * `theme` (Accent color identifier)
  * `createdAt` (ISO Timestamp)
  * `tasks` (Array of Tasks):
    * `id` (Task Key - UUID)
    * `title` (Task Content)
    * `completed` (Boolean status)
    * `reminderTime` (ISO Timestamp or null)
    * `createdAt` (ISO Timestamp)
    * `order` (Numeric ordering index)

## Themes & Accent Colors Supported
* `blue`
* `purple`
* `green`
* `orange`
* `red`
* `pink`
* `cyan`
* `amber`
* `rose_pink`
* `warmer_orange`
* `nothing_red`
* `ethereal_blue`
* `emerald_green`
* `contrast_grey`
* `match_accent`

## Security Features
* **Password Encryption:** Hashed with `bcryptjs` before storage.
* **Session-based Authentication:** Token validation via secure HTTP-only cookies.
* **Routing Protection:** Custom edge-runtime `proxy.ts` middleware protects dashboard routes.
* **Input Validation:** Validation schemas enforced using `zod` on backend routers.

## Future Enhancements
* Email verification for user registration.
* Push and SMS alerts for upcoming task reminders.
* Shared collaborative lists between multiple accounts.
* Offline capability (Progressive Web App support).
* Two-factor authentication (2FA).

## Troubleshooting
### Local Database Issues
* Check file read/write permissions on the `data/` directory.
* If a JSON database file becomes corrupted, rename it or delete it; the server will re-initialize it cleanly upon restart.

### Session Issues
* Ensure your browser accepts cookies.
* Clear cookies and restart the browser to resolve stale session states.

### Package Issues
* Delete `node_modules` and `package-lock.json` and reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```

## Performance Optimization
* Implemented file-based concurrency locks (`proper-lockfile`) to avoid write collision.
* Built using Next.js Turbopack compilation for faster dev reloads and optimized production bundling.
* Handled React key indices and hooks states dynamically to reduce unnecessary DOM re-renders.

## License
This project is open source and available under the MIT License.

## Author
* **Developed by:** Noor Mohammad

## Support
For issues, bug reports, and features request, please open a pull request or contact support.

## Deployment Checklist
- [x] Node.js environment configured (v18+)
- [x] Project dependencies installed (`package.json` resolved)
- [x] tsconfig.json and components.json set up
- [x] Next.js build compilation tested
- [x] Local JSON databases initialized
- [x] Next.js Proxy middleware working
- [x] Registration and login functionality active
- [x] JWT secure cookie session verified
