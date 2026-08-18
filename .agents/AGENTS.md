# Agent Rules

## 1. Git Workflows & Quality Verification

Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit. **Exception:** Do not bump the version in `package.json` if you are only updating non-application files (e.g., `README.md`, documentation, `.agents/AGENTS.md`, `api/README.md`).

1. **Pre-Commit Quality Gate**:
   - Run `npm run lint` and resolve any ESLint errors or warnings.
   - Run `npm run build` to verify that Vite bundles successfully without JSX, import, or type resolution issues.
2. **Version Bump Significance**:
   - Evaluate the significance of your changes and increment the version in `package.json` accordingly:
     - **Patch**: For small bug fixes, minor tweaks, routine data updates, or exam retirement dates.
     - **Minor**: For significant new features, substantial UI changes, builder logic, new currencies, or export features.
     - **Major**: For complete architectural overhauls or major breaking changes.
3. **Commit Messages**:
   - Use Conventional Commit format (e.g., `feat: add custom playlist export`, `fix: correct prerequisite id in az-305`, `data: update dp-700 retirement date`, `chore: bump version to 1.9.1`).
4. **Staging & Sync**:
   - Stage `package.json` along with the other modified files.
   - Proceed with the commit and push/sync process.

## 2. Certification Information Sources & Lifecycle Management

- **Primary News Source**: When looking for or updating information about changes to Microsoft certifications, always use the following as the primary information source: https://techcommunity.microsoft.com/category/skills-hub/blog/skills-hub-blog. This is the official Microsoft certification news channel.
- **Lifecycle States & Attributes**:
  - **Active (GA)**: Normal general-availability exams located in their respective pillar track in `src/data/certificationPaths.js`.
  - **Beta Exams**:
    - Set `isBeta: true` or `isBeta: 'Beta from Month YYYY'` (e.g., `'Beta from July 2026'`).
    - When an exam transitions from Beta to GA, remove `isBeta` and add `isNew: true`.
  - **New Certifications**:
    - When a new certification is added to the application, add `isNew: true` to highlight it with `<Badge variant="new">New</Badge>`.
    - **Rule of Recency**: Whenever certification updates are applied, actively scan the codebase for any certifications that previously had `isNew: true` applied and remove it from them so only the most recent certifications are highlighted as "New".
  - **Coming Soon Exams**:
    - Set `isComingSoon: true` for newly announced certifications prior to registration or beta availability.
  - **Retiring Exams**:
    - When an exam is announced as retiring, add `retirementDate: 'YYYY-MM-DD'` and set its state badge to `"Retiring"`.
    - The certification remains in its active pillar path while retiring.
  - **Retired Exams**:
    - When an exam reaches its retirement date, move the certification entry to `PILLARS.RETIRED` under the retired track in `src/data/certificationPaths.js`.
    - Set its status to `"Retired"` and clean up or update any corresponding references in `src/data/careerRoles.js`.
- **Certification Expiration & 1-Year Renewal Lifecycle**:
  - `doesCertExpire(level)` returns `true` for `Associate`, `Expert`, and `Specialty` exams (which have a 1-year validity window). `Fundamentals` exams do not expire.
  - When an expiring cert was completed more than 1 year ago (tracked in `completionDates[certId]`), `getStatus(certId)` automatically returns `CERT_STATUS.NEEDS_RENEWAL`.
  - Status cycling or renewing on a `needs_renewal` certification sets the status back to `CERT_STATUS.COMPLETED` with an updated completion timestamp.

## 3. Data Model, Schemas & Helper Functions

When modifying `src/data/certificationPaths.js` or `src/data/careerRoles.js`:

- **Certification Object Schema (`certificationPaths.js`)**:
  - Mandatory fields:
    - `id`: Lowercase kebab-case string (e.g., `'az-104'`, `'ai-102'`, `'sc-900'`).
    - `examCode`: Uppercase string (e.g., `'AZ-104'`, `'AI-102'`, `'SC-900'`).
    - `name`: Full title string (e.g., `'Azure Administrator Associate'`).
    - `level`: One of `CERT_LEVELS` (`FUNDAMENTALS`, `ASSOCIATE`, `EXPERT`, `SPECIALTY`).
    - `description`: Concise summary of the certification scope.
    - `prerequisites`: Array of lowercase kebab-case cert IDs (e.g., `['az-104']`) OR nested arrays for "1 of N" choice requirements (e.g., `[['az-104', 'az-204']]`).
    - `learnUrl`: Verified, active Microsoft Learn URL.
    - `retirementDate`: `'YYYY-MM-DD'` string or `null`.
    - `skillsMeasured`: Array of strings detailing objective domains and percentage weightings.
  - Optional fields:
    - `recommendedPrereqs`: Array of cert IDs (e.g., `['az-900']`) recommended for learning order but not required for credential award.
    - `branch`: Lowercase string matching a defined branch `id` in the parent path's `branches` array.
    - `isBeta`: `true` or `'Beta from <Month> <Year>'`.
    - `isNew`: `true`.
    - `isComingSoon`: `true`.
- **Path Track Schema (`certificationPaths.js`)**:
  - Fields: `id` (kebab-case), `name` (full title), `shortName` (compact display name), `code` (uppercase 2-letter prefix e.g., `'AZ'`), `pillar` (`PILLARS.*`), `color` (CSS var e.g., `'var(--line-azure)'`), `glowColor` (CSS var e.g., `'var(--glow-azure)'`), `cssVar`, `icon` (key in `IconMap.jsx`), `description`, `branches` (`[{ id, name, description }]`), and `certifications` (array of certification objects).
- **Career Roles Schema (`src/data/careerRoles.js`)**:
  - Fields: `id` (kebab-case), `title`, `description`, `icon` (key in `IconMap.jsx`), `color` (CSS var), `certs` (array of valid certification IDs).
  - **Career Roles Synchronization**: Whenever a certification ID is added, renamed, or retired in `certificationPaths.js`, you **must** review and update `src/data/careerRoles.js` to ensure the `certs: [...]` array in each role has no dangling or broken IDs.
- **Central Data Helper Functions**:
  - Always leverage and maintain centralized helper functions in `certificationPaths.js`:
    - `getCertById(id)`: Returns `{ cert, path }` or `null`.
    - `getAllCertifications()`: Returns flattened array of all certifications with path metadata.
    - `getPathById(pathId)`: Returns the path object or `undefined`.
    - `getCertificationsRequiring(certId)`: Returns array of certifications that have `certId` as a prerequisite.
    - `doesCertExpire(level)`: Returns boolean indicating if the level requires annual renewal.

## 4. Pricing & Multi-Currency System

- **Central Pricing Source of Truth (`src/utils/pricing.js`)**:
  - Supported currencies: `GBP` (£), `USD` ($), `EUR` (€). Default currency is `GBP`.
  - Base pricing tiers:
    - `Fundamentals`: GBP 69, USD 99, EUR 99.
    - `Associate`, `Expert`, `Specialty`: GBP 132, USD 165, EUR 165.
- **Helper Functions**:
  - Use `getExamCost(level, currency)` for numeric calculation and `getFormattedExamCost(level, currency)` (e.g., `"£132"`) for display.
  - Never hardcode currency symbols or exam prices directly into component JSX or styles.
- **Currency Context**:
  - Currency selection is globally managed via `CurrencyProvider` / `useCurrency()` and persisted under `localStorage` key `atozazure_currency`.

## 5. State Persistence, Storage Keys & Backup Integrity

- **Complete Storage Key Inventory**:
  - `ms-cert-tracker-progress`: Object mapping `{ [certId]: CERT_STATUS }`.
  - `ms-cert-tracker-tracked-paths`: Array of active path IDs included in the user roadmap.
  - `ms-cert-tracker-tracked-certs`: Array of active cert IDs included in learning/progress metrics.
  - `ms-cert-tracker-dismissed-certs`: Array of dismissed cert IDs.
  - `ms-cert-tracker-dates`: Object mapping `{ [certId]: ISOString }` recording completion timestamps.
  - `ms-cert-tracker-custom-playlist`: Array of ordered cert IDs representing the custom career timeline.
  - `atozazure_currency`: Selected currency code (`'GBP'`, `'USD'`, `'EUR'`).
  - `atozazure_theme`: Selected theme preference (`'light'`, `'dark'`, `'system'`).
- **Safe Parsing**: Always wrap `localStorage` access and JSON parsing in `try/catch` blocks with safe default fallbacks in `src/hooks/useProgress.js` and context providers.
- **Export, Import & Reset Parity**:
  - Any new persistent state or user preference **must** be wired into:
    1. `exportProgressJSON()` — included in the backup JSON payload.
    2. `importProgressJSON()` — safely validated, type-checked, and merged on restoration.
    3. `resetAll()` — completely cleared from state and `localStorage` upon user confirmation.

## 6. Interactive Architecture, Layouts & Routing

- **React Flow + Dagre Graph Layout (`PathMap.jsx` & `CertNode.jsx`)**:
  - Graph layout is calculated using Dagre with `nodesep: 40`, `ranksep: 80` and `direction: 'TB'`.
  - Node dimensions are fixed at `400px` width x `230px` height.
  - Custom nodes (`CertNode.jsx`) must contain handles (`Position.Top` target, `Position.Bottom` source with `opacity: 0`) and fit within the fixed dimensions without scrollbars or text overflow.
  - Viewport preservation: Leverage the `lastFittedPath` pattern to avoid jarring canvas re-centering when toggling node statuses within the same path.
- **Drag-and-Drop Reordering (`CareerPathBuilder.jsx` & `SortableCertItem.jsx`)**:
  - Custom track sorting utilizes `@dnd-kit/core` and `@dnd-kit/sortable` with `verticalListSortingStrategy`.
  - Accessibility: Must bind both `PointerSensor` and `KeyboardSensor` (`sortableKeyboardCoordinates`).
  - Reordering invokes `arrayMove` and persists immediately to `customPlaylist`.
  - Custom tracks must support Markdown export (`# My Custom Career`).
- **Global Search & Keyboard Shortcuts**:
  - `SearchBar.jsx`: Debounced (250ms), searches across name, code, path name, and description.
  - Global shortcuts:
    - `Ctrl+K` / `Cmd+K`: Focus global search input.
    - `Ctrl+B` / `Cmd+B`: Toggle navigation sidebar.
    - In `CertDetail`: `Escape` closes panel, `S` cycles status, `E` toggles tracked state, `Enter` opens official Learn link.
  - Shortcut collision guard: Always check `if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;` before executing single-key shortcuts.
- **Routing & Code Splitting (`App.jsx`)**:
  - Routes: `/` (Dashboard), `/career-paths` (CareerPathBuilder), `/path/:pathId` (PathMap), `*` (Redirect to `/`).
  - Query parameters: Support deep linking via `?cert=<certId>` on `/path/:pathId` and `?role=<roleId>` on `/career-paths`.
  - Suspense fallback: Use `.loading-skeleton` with Fluent shimmer for lazy route components.

## 7. UI Design Language & Component Standards

### 🚨 CSS Architecture & Methodology
To maintain a unified Fluent 2 design language, the following rules are **STRICTLY FORBIDDEN**:
- **Tailwind CSS**: Do not use Tailwind classes (e.g., `bg-white`, `flex`, `p-4`). The project uses Vanilla CSS with BEM (Block Element Modifier) methodology.
- **Hardcoded & Generic Colors**: Do not use raw hex colors in component CSS. Always use the corresponding CSS variables defined in `src/index.css`.
- **Inline Styles**: Avoid direct inline styles for theming (e.g., `style={{ color: '#fff' }}`). However, **passing dynamic CSS variables via inline styles** (e.g., `style={{ '--card-color': path.color }}`) is explicitly permitted and encouraged for components that require dynamic theming from props or data.

When creating or modifying UI components, you **must** adhere to the following conventions:

### 1. BEM Methodology
- Structure component classes using BEM format: `.Block__Element--Modifier` (e.g., `.dashboard`, `.dashboard__hero`, `.dashboard__update-btn--active`).
- Create dedicated `.css` files for each component (e.g., `Dashboard.css`) and import them directly into the `.jsx` file.

### 2. Fluent 2 Design Tokens (CSS Variables)
Always use the variables defined in `src/index.css` to ensure consistent theming across light and dark modes:
- **Backgrounds/Surfaces**: Use `--colorNeutralBackground1` (cards), `--colorNeutralBackground2` (app background), or semantic aliases like `--bg-app`, `--bg-surface-1`, `--bg-surface-hover`.
- **Text/Foreground**: Use `--colorNeutralForeground1` (primary text), `--colorNeutralForeground2` (secondary/subtitle text), `--colorNeutralForeground3` (tertiary text). Aliases available: `--text-primary`, `--text-secondary`.
- **Borders**: Use `--colorNeutralStroke1` (strong), `--colorNeutralStroke2` (default), `--colorNeutralStroke3` (subtle).
- **Brand Accents**: Use `--colorBrandBackground` and `--colorBrandForeground1` for primary actions.
- **Path Colors & Glows**: Use `--line-<track>` (e.g., `--line-azure`, `--line-ai`, `--line-security`) and `--glow-<track>` for ambient highlights.
- **Shadows**: Use standard Fluent elevation: `--shadow-2` (soft), `--shadow-4` (medium), `--shadow-8` (flyout/modal).

### 3. Spacing & Typography
- **Spacing**: Use Fluent 2 base-4 spacing variables for padding, margins, and gaps: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-6` (24px), `--space-8` (32px).
- **Corner Radii**: Use `--radius-sm` (2px), `--radius-md` (4px for buttons/inputs), `--radius-lg` (8px for cards), `--radius-xl` (12px).
- **Typography**: Use standard font size variables: `--fs-body1` (14px), `--fs-body2` (16px), `--fs-subtitle2` (18px), `--fs-title3` (24px). Font weight variables: `--fw-regular`, `--fw-medium`, `--fw-semibold`.

### 4. Theming & Dark Mode Validation
- **Automatic Theme Switching**: The CSS variables automatically adapt when the `[data-theme="dark"]` attribute is toggled on the root element.
- **No Media Queries for Theme**: Do not use `@media (prefers-color-scheme: dark)` in component CSS. Rely purely on the CSS variables to handle the color switch.
- **Opacity**: Use CSS `color-mix` or `rgba()` with variables carefully. Native CSS variables with hex values do not support opacity directly unless pre-defined. Use the dedicated hover/active variables (e.g., `--colorNeutralBackground1Hover`).

### 5. Layout, Animations, Z-Index & Accessibility
- **Transitions**: Use the standard snappy Fluent timing: `transition: all var(--duration-normal) var(--curve-easy-ease);`.
- **Animations**: Use the pre-defined keyframes in `index.css` such as `fadeIn`, `fadeInUp`, `slideInFromRight`, or `pulse` for loading states.
- **Z-Index Management**: Never use hardcoded arbitrary z-indexes (e.g., `z-index: 9999`). Always use the standardized z-index tokens defined in `index.css` (e.g., `--z-dropdown`, `--z-sidebar`, `--z-header`, `--z-overlay`, `--z-modal`, `--z-toast`).
- **Focus Rings**: Ensure keyboard accessibility by leveraging the global `:focus-visible` styles, or manually applying `outline: 2px solid var(--border-focus); outline-offset: 2px; border-radius: var(--radius-md);`.
- **Semantic HTML**: Always use appropriate semantic elements (`<button>`, `<nav>`, `<main>`).

### 6. Interactive Micro-animations (Push Effect)
- **Buttons & Cards**: To make the UI feel alive, apply a "push" effect to interactive elements when clicked. In your CSS, use the `:active` pseudo-class with `transform: scale(0.96);`.
- **Consistency**: Combine this with the standard Fluent transition so the push effect is smooth but snappy.

### 7. Responsive Design & Breakpoints
- **Media Queries**: Do not use Tailwind prefixes. Use standard CSS media queries for responsive layouts.
- **Standard Breakpoints**: Use `@media (max-width: 768px)` for mobile/tablet adjustments and `@media (min-width: 1024px)` for desktop-specific layouts.

### 8. Standard Component Sizing & Geometry
- **Heights**: Maintain consistent heights for standard interactive elements. Buttons, text inputs, and selects should generally have a height of `32px`. Compact icon buttons can be `26px`.
- **Corner Radii Constraints**: Badges, status tags, toggles, and segmented controls must use standard rounded corners (e.g., `var(--radius-md)` or `var(--radius-sm)`). **Strictly avoid fully rounded pill shapes** (`var(--radius-full)`) unless they are small indicator dots.

### 9. Common States (Disabled, Success, Error, Warning)
- **Disabled State**: Apply `opacity: 0.5`, `cursor: not-allowed`, and `pointer-events: none` for inactive interactive elements.
- **Semantic Colors**: Use the specific state variables from `index.css`:
  - **Success**: `--status-completed` or `--badge-completed-fg`.
  - **Warning/In-Progress**: `--status-in-progress` or `--badge-inprogress-fg`.
  - **Danger/Error**: `--line-security` or `--badge-retiring-fg` depending on context.

### 10. Icons & Imagery (IconMap vs ProductIcons)
- **Standardisation & IconMap**: Prioritize official Microsoft icons or Fluent UI System Icons where possible to maintain alignment with the Azure portal experience. Do not import `@fluentui/react-icons` directly into random components. Instead, always use the central abstraction `src/components/common/IconMap.jsx`. If a new icon is needed, import the `...Regular` variant from `@fluentui/react-icons` and wrap it with `withSize(...)` in `IconMap.jsx`.
- **Microsoft Product Icons (`ProductIcons.jsx`)**: Full-color product or service icons (e.g., Azure services, Copilot, GitHub, Power Platform) must be defined as SVG components in `src/components/common/ProductIcons.jsx` and mapped in `IconMap.jsx`.
- **Icon Backgrounds**: When displaying full-color product or service icons, set the container background to `transparent` so the icon stands on its own. Solid category backgrounds are reserved for monochrome structural icons.
- **Consistent Usage**: Ensure that the same icon is used consistently for the same function or meaning across the entire application (e.g., always use `AlertTriangle` for warnings or retiring elements, `CheckCircle2` for completions).

### 11. Microsoft Certification Badges & Links
- **Official Assets**: Always use official Microsoft certification badge images when representing certifications (e.g., Azure Fundamentals, Azure Administrator Associate).
- **Badge URL Resolution (`src/utils/helpers.js`)**: Use `getBadgeUrl(level, certId)` which points to official Microsoft Learn SVG badge assets, falling back gracefully to `IconMap.Award` when no image exists. Include `loading="lazy"` on all badge `<img>` elements.
- **Badge Verification Step**: Before adding or updating a certification badge, you **must** verify that it is the most current, accurate representation of the badge as provided by Microsoft. Check the official Microsoft Learn documentation or training portal to ensure the badge design, title, and visual status are completely up-to-date and accurate.
- **Link Verification Step**: When adding or updating Microsoft Learn links for exams or certifications, you **must** always look for the correct link and perform a verification step to ensure the link is correct, active, and successfully resolves to the intended Microsoft page without broken redirects or a 404 error.
- **Badge Placement Strategy**: On certification overview cards, specific badges must be placed in specific locations to maintain a clean hierarchy:
  - **Header (Next to Exam Code)**: Only display state-based informational badges such as "Beta", "Retiring", "Retired", "Optional", "New", or "Coming soon".
  - **Footer (Bottom of Card)**: Display structural and requirement badges, such as the Certification Level (e.g., "Expert") and any Prerequisite requirements (e.g., "Prereq: AZ-104", "Prereq: AZ-104 OR AZ-204"). Do not place prerequisite badges in the header.

### 12. Fixed-Height Node Overflow Prevention
- **Line Clamping & Dynamic Text**: When building or modifying UI components that sit inside strict, fixed-dimension layout nodes (such as React Flow nodes sized by Dagre at `400px` x `230px`), you must ensure that variable-length text (like long certification titles or descriptions) does not push footer content out of bounds or cause clipping.
- **Validation Constraints**: If you increase line limits (e.g., via `-webkit-line-clamp`), always mathematically or visually validate that the worst-case scenario (e.g., a 3-line title combined with maximum description lines) will comfortably fit within the fixed height without overflowing. Keep clamps conservative if the parent height cannot scale automatically.

### 13. Modals, Drawers & Overlays UX
- **Escape Key Dismissal**: Modals and slide-over drawers (e.g., `DataModal.jsx`, `CertDetail.jsx`) must listen for the `Escape` key and invoke `onClose()`.
- **Backdrop Click**: Clicking the overlay/backdrop outside the modal container must dismiss the view.
- **Scroll Locking**: Modals and full drawers should prevent background body scrolling while active.

### 14. Toast Notifications & User Feedback
- **Feedback on Actions**: Use the central `useToast()` hook (`addToast(message, type)`) to provide clear visual feedback whenever a user performs explicit actions:
  - Successful or failed progress backup export (`exportProgressJSON`).
  - Successful or failed backup restoration (`importProgressJSON`).
  - Progress reset confirmation (`resetAll`).
  - Including or excluding certifications from tracked learning.
  - Cycling or setting certification progress status.
  - Copying shareable links or path URLs to clipboard.
- **Toast Types**: Use `'success'`, `'error'`, `'info'`, or `'warning'` appropriately.