# atozazure | Certification Tracker

Track your Microsoft certification progress across **9 certification paths** with an interactive metro-line map visualisation. Built with React and deployed to Azure Static Web Apps.

## ✨ Features

- **Metro Map Visualisation** — Each certification path is rendered as an interactive metro line with stations representing individual exams, connected by branches and prerequisite relationships.
- **Progress Tracking** — Mark certifications as _Not Started_, _In Progress_, or _Completed_. Progress is persisted to `localStorage`.
- **Dashboard Overview** — A central dashboard displaying overall stats, currently studying certs, and personalised recommendations for what to tackle next.
- **Path Filtering** — Toggle certification paths on/off to focus only on the paths relevant to your career goals.
- **Dark / Light Theme** — Fully themed UI with system preference detection and a manual toggle.
- **Responsive Design** — Collapsible sidebar and adaptive layouts for desktop and mobile.
- **Direct Links to Microsoft Learn** — Every certification station links directly to the official Microsoft Learn exam page.

## 🗺️ Certification Paths

| Path | Code | Pillar | Certifications |
|------|------|--------|:--------------:|
| Azure Infrastructure | AZ | Cloud & AI Platforms | 6 |
| AI & Machine Learning | AI | Cloud & AI Platforms | 4 |
| Data Engineering & Analytics | DP | Cloud & AI Platforms | 7 |
| DevOps & GitHub | AZ/GH | Cloud & AI Platforms | 8 |
| Security, Compliance & Identity | SC | Security | 7 |
| Microsoft 365 | MS | AI Business Solutions | 4 |
| Power Platform | PL | AI Business Solutions | 4 |
| AI & Copilot | AB | AI Business Solutions | 7 |
| Dynamics 365 | MB | AI Business Solutions | 6 |

## 🛠️ Tech Stack

- **Framework** — [React 19](https://react.dev/) with [Vite 8](https://vite.dev/)
- **Routing** — [React Router v7](https://reactrouter.com/)
- **Icons** — [Lucide React](https://lucide.dev/)
- **Styling** — Vanilla CSS with CSS custom properties design system
- **State** — React Context + `localStorage` persistence
- **CI/CD** — GitHub Actions → Azure Static Web Apps

## 📁 Project Structure

```
src/
├── components/
│   ├── CertDetail/       # Certification detail panels
│   ├── Dashboard/        # Main dashboard view
│   ├── Layout/           # Header & Sidebar
│   ├── MetroMap/         # Metro line & station visualisations
│   └── common/           # Shared UI components (Badge, etc.)
├── context/
│   ├── ProgressContext   # Certification progress state
│   └── ThemeContext      # Dark/light theme state
├── data/
│   └── certificationPaths.js  # All certification path definitions
├── hooks/
│   └── useProgress       # Progress persistence hook
├── utils/                # Utility functions
├── App.jsx               # Root component & routing
├── index.css             # Global styles & design tokens
└── main.jsx              # Entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/danzure/ms-certification-app.git
cd ms-certification-app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` directory.

## ☁️ Deployment

This project is configured for automatic deployment to **Azure Static Web Apps** via GitHub Actions. Pushes to `main` trigger the CI/CD pipeline defined in:

```
.github/workflows/azure-static-web-apps-brave-tree-034dbef03.yml
```

The workflow builds the Vite project and deploys the `dist/` output to Azure.

## 📄 Licence

This project is not currently published under a specific licence. All rights reserved.
