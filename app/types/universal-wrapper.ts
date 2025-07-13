// Universal Wrapper Types and Interfaces

export interface AppConfig {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'webapp' | 'extension' | 'custom';
  category: string;
  icon?: string;
  url?: string;
  embed_code?: string;
  extension_manifest?: ChromeExtensionManifest;
  sandbox_permissions?: SandboxPermission[];
  metadata?: {
    author?: string;
    version?: string;
    tags?: string[];
    featured?: boolean;
  };
}

export interface SandboxPermission {
  name: string;
  enabled: boolean;
  description?: string;
}

export interface BrandConfig {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark' | 'auto';
  customCSS?: string;
  showHeader: boolean;
  showFooter: boolean;
}

export interface SecurityConfig {
  allowedDomains: string[];
  defaultSandboxPermissions: SandboxPermission[];
  blockPopups: boolean;
  enableCSP: boolean;
  customCSP?: string;
}

export interface UniversalWrapperConfig {
  brand: BrandConfig;
  security: SecurityConfig;
  ui: {
    viewMode: 'grid' | 'list';
    showSearch: boolean;
    enableMouseTilt: boolean;
    cardsPerRow: number;
  };
  apps: AppConfig[];
}

export interface ChromeExtensionManifest {
  manifest_version: number;
  name: string;
  version: string;
  description?: string;
  permissions?: string[];
  host_permissions?: string[];
  content_scripts?: {
    matches: string[];
    js?: string[];
    css?: string[];
  }[];
  action?: {
    default_popup?: string;
    default_title?: string;
    default_icon?: { [key: string]: string };
  };
}

export interface AppStoreFilters {
  category?: string;
  type?: 'website' | 'webapp' | 'extension' | 'custom';
  search?: string;
  featured?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: string;
}

export interface MouseTiltProps {
  maxRotation?: number;
  perspective?: number;
  speed?: number;
  glareOpacity?: number;
  enableGlare?: boolean;
}

export interface SandboxFrameProps {
  src?: string;
  embedCode?: string;
  permissions: SandboxPermission[];
  title?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export interface ConfigurationPanelProps {
  config: UniversalWrapperConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: UniversalWrapperConfig) => void;
}

export interface AppStoreProps {
  apps: AppConfig[];
  filters: AppStoreFilters;
  viewMode: 'grid' | 'list';
  onAppSelect: (app: AppConfig) => void;
  onFiltersChange: (filters: AppStoreFilters) => void;
  mouseTiltEnabled?: boolean;
}

export interface CustomAppRendererProps {
  embedCode: string;
  sandboxPermissions: SandboxPermission[];
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export interface ExtensionWrapperProps {
  manifest: ChromeExtensionManifest;
  extensionId?: string;
  onInstall?: () => void;
  onError?: (error: string) => void;
}