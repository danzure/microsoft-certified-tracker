// Microsoft Product Icons
import { Icon } from '@iconify/react';
import azureSvg from '../../assets/icons/azure.svg';
import azureAiSvg from '../../assets/icons/azure-ai.svg';
import defenderSvg from '../../assets/icons/defender.svg';
import powerPlatformSvg from '../../assets/icons/power-platform.svg';
import copilotSvg from '../../assets/icons/copilot.svg';
import dynamicsSvg from '../../assets/icons/dynamics.svg';
import fabricSvg from '../../assets/icons/fabric.svg';
import dashboardSvg from '../../assets/icons/dashboard.svg';
import archiveSvg from '../../assets/icons/archive.svg';

// Base component for image-based icons
const ImageIcon = ({ src, alt, size = 20, className, style, ...props }) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={className}
    style={{ ...style, objectFit: 'contain' }}
    {...props}
  />
);

// Each icon accepts: size, color, className, style props

// ─── Azure Logo ───────────────────────────────────────────────────────────────
export const AzureIcon = (props) => <ImageIcon src={azureSvg} alt="Azure" {...props} />;

// ─── Azure AI & ML ────────────────────────────────────────────────────────────
export const AzureAIIcon = (props) => <ImageIcon src={azureAiSvg} alt="Azure AI & ML" {...props} />;

// ─── Data & Analytics ─────────────────────────────────────────────────────────
export const DataAnalyticsIcon = (props) => <ImageIcon src={fabricSvg} alt="Data & Analytics" {...props} />;

// ─── Security & Identity ──────────────────────────────────────────────────────
export const SecurityIcon = (props) => <ImageIcon src={defenderSvg} alt="Microsoft Defender" {...props} />;

// ─── Microsoft 365 ────────────────────────────────────────────────────────────
export const M365Icon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="logos:microsoft-icon"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── Power Platform ──────────────────────────────────────────────────────────
export const PowerPlatformIcon = (props) => <ImageIcon src={powerPlatformSvg} alt="Power Platform" {...props} />;

// ─── Copilot & AI ─────────────────────────────────────────────────────────────
export const CopilotIcon = (props) => <ImageIcon src={copilotSvg} alt="Copilot & AI" {...props} />;

// ─── Dynamics 365 ─────────────────────────────────────────────────────────────
export const DynamicsIcon = (props) => <ImageIcon src={dynamicsSvg} alt="Dynamics 365" {...props} />;

// ─── Azure DevOps ─────────────────────────────────────────────────────────────
export const AzureDevOpsIcon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="devicon:azuredevops"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── GitHub ──────────────────────────────────────────────────────────
export const GitHubIcon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="logos:github-icon"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const DashboardIcon = (props) => <ImageIcon src={dashboardSvg} alt="Dashboard" {...props} />;

// ─── Retired / Archived ──────────────────────────────────────────────────────
export const ArchiveIcon = (props) => <ImageIcon src={archiveSvg} alt="Archive" {...props} />;

