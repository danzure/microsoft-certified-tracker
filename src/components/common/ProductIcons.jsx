// Microsoft Product Icons
import { Icon } from '@iconify/react';
import azureSvg from '../../assets/icons/azure.svg';
import azureAiSvg from '../../assets/icons/azure-ai.svg';
import sqlDatabaseSvg from '../../assets/icons/sql-database.svg';
import securitySvg from '../../assets/icons/security.svg';
import powerPlatformSvg from '../../assets/icons/power-platform.svg';
import m365Svg from '../../assets/icons/m365-icon.svg';
import copilotSvg from '../../assets/icons/copilot.svg';

// Each icon accepts: size, color, className, style props

// ─── Azure Logo ───────────────────────────────────────────────────────────────
export const AzureIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={azureSvg} 
      alt="Azure" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Azure AI & ML ────────────────────────────────────────────────────────────
export const AzureAIIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={azureAiSvg} 
      alt="Azure AI & ML" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

import fabricSvg from '../../assets/icons/fabric.svg';

// ─── Data & Analytics ─────────────────────────────────────────────────────────
export const DataAnalyticsIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={fabricSvg} 
      alt="Data & Analytics" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Security & Identity ──────────────────────────────────────────────────────
export const SecurityIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={securitySvg} 
      alt="Security" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Microsoft 365 ────────────────────────────────────────────────────────────
export const M365Icon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={m365Svg} 
      alt="Microsoft 365" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Power Platform ──────────────────────────────────────────────────────────
export const PowerPlatformIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={powerPlatformSvg} 
      alt="Power Platform" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Copilot & AI ─────────────────────────────────────────────────────────────
export const CopilotIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={copilotSvg} 
      alt="Copilot & AI" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Dynamics 365 ─────────────────────────────────────────────────────────────
export const DynamicsIcon = ({ size = 20, className, style, color, ...props }) => {
  return (
    <Icon 
      icon="streamline-logos:microsoft-dynamics-logo" 
      color={color || "#0066CC"}
      width={size} 
      height={size} 
      className={className} 
      style={style} 
      {...props} 
    />
  );
};

// ─── Azure DevOps ─────────────────────────────────────────────────────────────
export const AzureDevOpsIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <Icon 
      icon="devicon:azuredevops" 
      width={size} 
      height={size} 
      className={className} 
      style={style} 
      {...props} 
    />
  );
};

// ─── GitHub ──────────────────────────────────────────────────────────
export const GitHubIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <Icon 
      icon="logos:github-icon" 
      width={size} 
      height={size} 
      className={className} 
      style={style} 
      {...props} 
    />
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
import dashboardSvg from '../../assets/icons/dashboard.svg';
export const DashboardIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={dashboardSvg} 
      alt="Dashboard" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};

// ─── Retired / Archived ──────────────────────────────────────────────────────
import archiveSvg from '../../assets/icons/archive.svg';
export const ArchiveIcon = ({ size = 20, className, style, ...props }) => {
  return (
    <img 
      src={archiveSvg} 
      alt="Archive" 
      width={size} 
      height={size} 
      className={className} 
      style={{ ...style, objectFit: 'contain' }} 
      {...props} 
    />
  );
};
