# Agent Rules

## Git Workflows

Whenever you are asked to commit and sync changes, you **must** automatically bump the version in `package.json` before creating the commit. **Exception:** Do not bump the version in `package.json` if you are only updating non-application files (e.g., `README.md`, documentation, `.agents/AGENTS.md`).

1. Evaluate the significance of your changes and increment the version accordingly:
   - **Patch**: For small bug fixes, minor tweaks, or routine data updates.
   - **Minor**: For significant new features, substantial UI changes, or logic updates.
   - **Major**: For complete architectural overhauls or major breaking changes.
2. Stage `package.json` along with the other modified files.
3. Proceed with the commit and push/sync process.

## Certification Information Sources

When looking for or updating information about changes to Microsoft certifications, always use the following as the primary information source: https://techcommunity.microsoft.com/category/skills-hub/blog/skills-hub-blog. This is the official Microsoft certification news channel.

## UI Design Language & Component Standards

### 🚨 CSS Architecture & Methodology
To maintain a unified Fluent 2 design language, the following rules are **STRICTLY FORBIDDEN**:
- **Tailwind CSS**: Do not use Tailwind classes (e.g., `bg-white`, `flex`, `p-4`). The project uses Vanilla CSS with BEM (Block Element Modifier) methodology.
- **Hardcoded & Generic Colors**: Do not use raw hex colors in component CSS. Always use the corresponding CSS variables defined in `src/index.css`.
- **Inline Styles**: Avoid direct inline styles for theming (e.g., `style={{ color: '#fff' }}`). However, **passing dynamic CSS variables via inline styles** (e.g., `style={{ '--badge-color': dynamicColor }}`) is explicitly permitted and encouraged for components that require dynamic theming from props or data.

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
- **Z-Index Management**: Never use hardcoded arbitrary z-indexes (e.g., `z-index: 9999`). Always use the standardized z-index tokens defined in `index.css` (e.g., `--z-sidebar`, `--z-modal`, `--z-toast`).
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

### 10. Icons & Imagery
- **Standardisation & IconMap**: Prioritize official Microsoft icons or Fluent UI System Icons where possible to maintain alignment with the Azure portal experience. Do not import `@fluentui/react-icons` directly into random components. Instead, always use the central abstraction `src/components/common/IconMap.jsx`. If a new icon is needed, add it to `IconMap.jsx` first.
- **Consistent Usage**: Ensure that the same icon is used consistently for the same function or meaning across the entire application (e.g., always use `AlertTriangle` for warnings or retiring elements, `CheckCircle2` for completions).
- **Icon Backgrounds**: When displaying full-color product or service icons (e.g., Azure services), set the container background to `transparent` so the icon stands on its own. Solid category backgrounds are reserved for monochrome structural icons.

### 11. Microsoft Certification Badges & Links
- **Official Assets**: Always use official Microsoft certification badge images when representing certifications (e.g., Azure Fundamentals, Azure Administrator Associate).
- **Badge Verification Step**: Before adding or updating a certification badge, you **must** verify that it is the most current, accurate representation of the badge as provided by Microsoft. Check the official Microsoft Learn documentation or training portal to ensure the badge design, title, and visual status are completely up-to-date and accurate.
- **Link Verification Step**: When adding Microsoft Learn links to exam or certification pages, you **must** perform a verification step to ensure the link is correct, active, and successfully resolves to the intended Microsoft page without broken redirects.
- **Highlighting New Certifications**: When a new certification is added to the application, you **must** add a "New" badge (using `<Badge variant="new">New</Badge>`) to highlight it. Furthermore, when certification updates are applied, you must actively scan the codebase for any certifications that previously had the "New" badge applied and remove it from them. This ensures that only the absolute most recent certifications are highlighted as "New".
- **Badge Placement Strategy**: On certification overview cards, specific badges must be placed in specific locations to maintain a clean hierarchy:
  - **Header (Next to Exam Code)**: Only display state-based informational badges such as "Beta", "Retiring", "Retired", "Optional", or "Coming soon".
  - **Footer (Bottom of Card)**: Display structural and requirement badges, such as the Certification Level (e.g., "Expert") and any Prerequisite requirements (e.g., "Prereq: AZ-104"). Do not place prerequisite badges in the header.

### 12. Fixed-Height Node Overflow Prevention
- **Line Clamping & Dynamic Text**: When building or modifying UI components that sit inside strict, fixed-dimension layout nodes (such as React Flow nodes sized by Dagre), you must ensure that variable-length text (like long certification titles or descriptions) does not push footer content out of bounds or cause clipping.
- **Validation Constraints**: If you increase line limits (e.g., via `-webkit-line-clamp`), always mathematically or visually validate that the worst-case scenario (e.g., a 3-line title combined with maximum description lines) will comfortably fit within the fixed height (e.g., `210px`) without overflowing. Keep clamps conservative if the parent height cannot scale automatically.