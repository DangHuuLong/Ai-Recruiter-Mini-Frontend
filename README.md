# 🤖 AI Recruiter — Mini Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

> A modern, intuitive web interface for AI-powered CV screening. Built with Next.js, TypeScript, and Tailwind CSS — helping recruiters evaluate candidate fit against job descriptions with explainable AI scoring.

📦 **Repository:** [github.com/DangHuuLong/Ai-Recruiter-Mini-Frontend](https://github.com/DangHuuLong/Ai-Recruiter-Mini-Frontend)  
🔗 **Backend Repository:** [github.com/DangHuuLong/Ai-Recruiter-Mini-Backend](https://github.com/DangHuuLong/Ai-Recruiter-Mini-Backend)

---

## ✨ Overview

**AI Recruiter Mini Frontend** is the user-facing layer of an intelligent CV screening platform. The dashboard enables recruiters to:

- **Manage Candidates** — Store candidate profiles and resumes
- **Create Job Descriptions** — Define positions with required and preferred skills
- **Submit Applications** — Link candidates to job openings
- **Run Evaluations** — Trigger AI-powered scoring against job requirements
- **Review Results** — Analyze explainable scores, matched/missing skills, and interview questions
- **Track Progress** — View application lifecycle and evaluation history

The frontend is built for clarity, consistency, and seamless integration with the NestJS backend API.

---

## 🎯 Key Features

- **📋 Dashboard Navigation** — Organized sidebar with quick access to all modules
- **👥 Candidate Management** — Create, view, and organize candidate profiles
- **📄 Resume Handling** — Upload and manage multiple resumes per candidate
- **🎯 Job Descriptions** — Define position requirements with structured skill extraction
- **📝 Applications** — Link candidates to jobs and track submission status
- **⭐ AI Evaluation** — Multi-criteria scoring with explainable breakdown
- **📊 Evaluation Results** — View scores, matched skills, and generated interview questions
- **🎨 Consistent UI** — Shared components and layouts for a cohesive experience
- **♿ Form Validation** — Client-side validation with clear error messages
- **🔔 User Feedback** — Toast notifications for action results
- **⚡ Responsive Design** — Works seamlessly on desktop and mobile devices

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14+** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **Sonner** | Toast notifications |
| **@hookform/resolvers** | Zod integration with React Hook Form |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/            # Dashboard overview page
│   │   ├── candidates/           # Candidate list & detail pages
│   │   ├── resumes/              # Resume list & detail pages
│   │   ├── job-descriptions/     # Job description pages
│   │   ├── applications/         # Application pages
│   │   └── evaluations/          # Evaluation pages
│   └── layout.tsx                # Root layout with providers
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI primitives
│   ├── common/                   # Shared components (DataTable, EmptyState, ConfirmDialog)
│   ├── layout/                   # Layout components (AppShell, Sidebar, Header)
│   ├── feedback/                 # Status components (Loading, Toast, Empty)
│   └── forms/                    # Form components (FileUploadInput)
│
├── features/                     # Business domain modules
│   ├── files/                    # File upload and management
│   ├── candidates/               # Candidate feature module
│   ├── resumes/                  # Resume feature module
│   ├── job-descriptions/         # Job description feature module
│   ├── applications/             # Application feature module
│   └── evaluations/              # Evaluation feature module
│
├── lib/                          # Shared utilities and configuration
│   ├── api/                      # API client and endpoints
│   ├── constants/                # App-wide constants
│   ├── types/                    # Shared TypeScript types
│   ├── utils/                    # Helper functions
│   └── validations/              # Zod validation schemas
│
├── config/                       # Application configuration
│   ├── routes.config.ts          # Route constants
│   ├── navigation.config.ts      # Navigation structure
│   └── env.config.ts             # Environment variables
│
├── providers/                    # Global app providers
└── hooks/                        # App-wide custom hooks
```

### Feature Module Structure

Each feature module (e.g., `features/candidates/`) follows this structure:

```
module-name/
├── api/                          # API functions for the module
├── components/                   # UI components specific to the module
├── hooks/                        # Custom hooks for data fetching
├── types/                        # TypeScript types
└── validations/                  # Zod validation schemas (if needed)
```

**Design Principle:** Business logic is organized by feature, not by layer. Each module owns its API calls, components, hooks, and types. This keeps code colocated and makes features independently maintainable.

---

## 🚀 Getting Started

### ✅ Prerequisites

- **Node.js 18+** — Runtime environment
- **npm** or **yarn** — Package manager
- **Backend API** running — The frontend requires the NestJS backend at `http://localhost:3001/api`

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/DangHuuLong/Ai-Recruiter-Mini-Frontend.git
cd Ai-Recruiter-Mini-Frontend

# Install dependencies
npm install
```

### ⚙️ Environment Configuration

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not store secrets here.

### ▶️ Run the Application

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

The application starts at `http://localhost:3000`.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |
| `npm run type-check` | Run TypeScript type checking |

---

## 🏗️ Architecture & Design

### Navigation & Routes

All route paths and navigation items are centralized in `src/config/`:

- **`routes.config.ts`** — Stores shared route constants
- **`navigation.config.ts`** — Defines dashboard navigation structure

This prevents hardcoding route strings throughout the app and keeps navigation data outside components.

### API Client

The frontend uses a shared API client in `src/lib/api/`:

- **`api-client.ts`** — Core HTTP client for API communication
- **`api-endpoints.ts`** — Backend endpoint constants
- **`api-types.ts`** — Shared API response and request types
- **`api-error.ts`** — Normalized error handling

Features call the shared API client instead of using `fetch` directly. This ensures consistent request handling, error normalization, and configuration across all modules.

### Layout Structure

The dashboard uses a consistent layout applied via `src/app/(dashboard)/layout.tsx`:

```
DashboardLayout
├── AppShell
│   ├── Sidebar (Navigation)
│   └── Content Area
│       ├── Header (Top bar)
│       ├── MainContent (Page content with shared spacing)
│       └── Page Specific Content
```

All pages within the dashboard group automatically inherit this structure.

### Form Validation

Form validation uses **React Hook Form** and **Zod**:

- **Common rules** — Stored in `src/lib/validations/` for reuse
- **Feature-specific schemas** — Stored in each feature's `validations/` folder

This keeps validation logic out of components and reusable across forms.

### Shared Components

Key shared components in `src/components/`:

| Component | Purpose |
|-----------|---------|
| `DataTable` | Displays list data in a consistent table layout |
| `DetailPageLayout` | Wraps detail/show pages with consistent structure |
| `EmptyState` | Shows when no data is available |
| `LoadingState` | Displays loading skeleton screens |
| `ConfirmDialog` | Confirms destructive actions |
| `FileUploadInput` | Reusable file upload with drag-and-drop |
| `Toast` | User feedback notifications |

---

## 🔌 API Integration

The frontend expects the backend to follow a consistent response contract:

### Success Response

```json
{
  "success": true,
  "message": "OK",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [],
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/..."
}
```

The API client automatically parses and normalizes these responses and errors.

---

## 📋 Feature Modules

### Candidates (`src/features/candidates/`)

Manage candidate profiles:

- List all candidates
- Create new candidates
- View candidate details
- Update candidate information

### Resumes (`src/features/resumes/`)

Manage resume uploads:

- Upload resume files (PDF, DOCX)
- View resume details
- Link resumes to candidates
- Validate file types and size

### Job Descriptions (`src/features/job-descriptions/`)

Define job positions:

- Create job descriptions with skill requirements
- View job details
- Update job information
- Extract and structure job requirements

### Applications (`src/features/applications/`)

Manage candidate applications:

- Create applications (link Candidate + Job + Resume)
- View application status
- Update application state
- Track application timeline

### Evaluations (`src/features/evaluations/`)

Run and view AI evaluations:

- Trigger evaluation for an application
- View evaluation results with multi-criteria scoring
- Review matched and missing skills
- View generated interview questions
- Access evaluation breakdown and explanations

---

## 🎨 UI/UX Guidelines

### Consistency

- Use shared layout components for pages
- Reuse table and detail components for data display
- Apply consistent spacing and padding via Tailwind's theme tokens
- Use shared validation error messages

### Loading States

- Use skeleton loaders when layout is stable
- Use loading spinners for overlays or uncertain layouts
- Show progress feedback for file uploads

### Error Handling

- Show form validation errors near the relevant fields
- Use toast notifications for action success/failure
- Display empty states when no data exists
- Provide clear error messages from API responses

### Feedback

- Use toast notifications for quick feedback on actions
- Confirm destructive actions (delete, reject, etc.) with dialogs
- Show loading states during API calls
- Provide clear empty states with optional action buttons

---

## 🔐 Form Validation

Forms use **React Hook Form** with **Zod** schemas for validation:

```typescript
// Define validation schema
import { z } from 'zod';

const candidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
});

// Use in form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(candidateSchema),
});
```

Frontend validation provides instant user feedback. The backend remains the source of truth for validation.

---

## 📦 File Upload

The `FileUploadInput` component handles file selection with:

- Click-to-upload
- Drag-and-drop support
- File type validation (PDF, DOCX by default)
- File size validation (5 MB maximum)
- Visual feedback

Features that need file uploads wrap this component with their own upload logic and API calls.

---

## 🧪 Testing

Current test coverage focus areas:

- API client and error handling
- Form validation schemas
- Navigation active state logic
- Component rendering and interactions

Run tests:

```bash
npm run test
npm run test:watch
```

---

## 📊 Current Status

| Area | Status |
|------|--------|
| Project setup & folder structure | ✅ Complete |
| Navigation & routing | ✅ Complete |
| Dashboard layout | ✅ Complete |
| Shared components | ✅ Complete |
| API client configuration | ✅ Complete |
| Form validation | ✅ Complete |
| Candidate feature | 🔄 In progress |
| Resume feature | 🔄 In progress |
| Job description feature | 🔄 In progress |
| Application feature | 🔄 In progress |
| Evaluation feature | 🔄 In progress |

---

## 🔮 Future Improvements

- 🔐 Authentication and authorization
- 📧 Email notifications for application updates
- 📊 Analytics and reporting dashboard
- 🌐 Multi-language support (i18n)
- 🔍 Advanced search and filtering
- 📱 Mobile app version
- 🎯 Keyboard shortcuts for power users
- ♿ Enhanced accessibility features
- 🧪 Expanded test coverage
- 🐳 Docker setup for development

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **`FRONTEND_CONFIGURATION.md`** — Routes, API, validation, components, and folder structure
- **`FRONTEND_FOLDER_STRUCTURE.md`** — Comprehensive guide to each directory

---

## 💡 Developer Quick Start

### Creating a New Feature Module

1. Create a new folder under `src/features/module-name/`
2. Add subdirectories: `api/`, `components/`, `hooks/`, `types/`
3. Create your API functions in `api/`
4. Create your custom hooks in `hooks/`
5. Create your UI components in `components/`
6. Export public interfaces from `index.ts`

### Adding a New Page

1. Create a folder under `src/app/(dashboard)/feature-name/`
2. Add a `page.tsx` file
3. Use the `DetailPageLayout` or existing layout structure
4. Import and use feature components
5. Call feature API functions via custom hooks

### Adding Form Validation

1. Create `src/features/feature-name/validations/`
2. Define Zod schemas
3. Use in form with `zodResolver`
4. Import validation from feature folder in form component

---

## 🤝 Contributing

When contributing to this project:

1. **Follow the folder structure** — Place code in the appropriate module
2. **Use TypeScript** — All code should be typed
3. **Reuse components** — Check if a shared component exists before creating new UI
4. **Keep validation centralized** — Don't write validation logic in components
5. **Normalize API calls** — Use the shared API client
6. **Run linting and formatting** before committing:

```bash
npm run lint
npm run format
```

---

## 📞 Support & Contact

For issues, questions, or feature requests:

- **GitHub Issues:** [Create an issue](https://github.com/DangHuuLong/Ai-Recruiter-Mini-Frontend/issues)
- **Backend Repo:** [Ai-Recruiter-Mini-Backend](https://github.com/DangHuuLong/Ai-Recruiter-Mini-Backend)

---

## 📄 License

This project is part of the AI Recruiter Mini suite. Refer to the LICENSE file in the repository for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/DangHuuLong">DangHuuLong</a> using Next.js, TypeScript & Tailwind CSS
  <br/>
  <a href="https://github.com/DangHuuLong/Ai-Recruiter-Mini-Frontend">Frontend Repository</a> • 
  <a href="https://github.com/DangHuuLong/Ai-Recruiter-Mini-Backend">Backend Repository</a>
</p>
