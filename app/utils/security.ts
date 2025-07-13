import type { SandboxPermission, SecurityConfig, ChromeExtensionManifest } from '~/types/universal-wrapper';

/**
 * Default sandbox permissions for iframe security
 */
export const DEFAULT_SANDBOX_PERMISSIONS: SandboxPermission[] = [
  {
    name: 'allow-scripts',
    enabled: true,
    description: 'Allows the iframe to run scripts',
  },
  {
    name: 'allow-same-origin',
    enabled: true,
    description: 'Allows access to same-origin resources',
  },
  {
    name: 'allow-forms',
    enabled: true,
    description: 'Allows form submissions',
  },
  {
    name: 'allow-popups',
    enabled: false,
    description: 'Allows popups to be opened',
  },
  {
    name: 'allow-modals',
    enabled: false,
    description: 'Allows modal dialogs',
  },
  {
    name: 'allow-orientation-lock',
    enabled: false,
    description: 'Allows locking screen orientation',
  },
  {
    name: 'allow-pointer-lock',
    enabled: false,
    description: 'Allows pointer lock API',
  },
  {
    name: 'allow-presentation',
    enabled: false,
    description: 'Allows presentation API',
  },
  {
    name: 'allow-top-navigation',
    enabled: false,
    description: 'Allows navigation of top-level browsing context',
  },
];

/**
 * Generate sandbox attribute string from permissions
 */
export function generateSandboxAttribute(permissions: SandboxPermission[]): string {
  const enabledPermissions = permissions
    .filter(permission => permission.enabled)
    .map(permission => permission.name);
  
  return enabledPermissions.join(' ');
}

/**
 * Validate if a URL is allowed based on security config
 */
export function isUrlAllowed(url: string, securityConfig: SecurityConfig): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check if domain is in allowed list
    return securityConfig.allowedDomains.some(allowedDomain => {
      if (allowedDomain === '*') return true;
      if (allowedDomain.startsWith('*')) {
        return domain.endsWith(allowedDomain.slice(1));
      }
      return domain === allowedDomain;
    });
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML content for safe embedding
 */
export function sanitizeEmbedCode(embedCode: string): string {
  // Remove potentially dangerous elements and attributes
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<iframe[^>]*src=['"](?!https?:\/\/)[^'"]*['"][^>]*>/gi,
    /on\w+=['"][^'"]*['"]/gi, // Remove inline event handlers
    /javascript:/gi,
    /<object[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>/gi,
    /<form[\s\S]*?<\/form>/gi,
  ];
  
  let sanitized = embedCode;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

/**
 * Validate Chrome extension manifest
 */
export function validateExtensionManifest(manifest: ChromeExtensionManifest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Required fields
  if (!manifest.manifest_version) {
    errors.push('manifest_version is required');
  } else if (![2, 3].includes(manifest.manifest_version)) {
    errors.push('manifest_version must be 2 or 3');
  }
  
  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('name is required and must be a string');
  }
  
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('version is required and must be a string');
  }
  
  // Validate permissions format
  if (manifest.permissions && !Array.isArray(manifest.permissions)) {
    errors.push('permissions must be an array');
  }
  
  if (manifest.host_permissions && !Array.isArray(manifest.host_permissions)) {
    errors.push('host_permissions must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate Content Security Policy (CSP) header
 */
export function generateCSP(securityConfig: SecurityConfig): string {
  if (securityConfig.customCSP) {
    return securityConfig.customCSP;
  }
  
  const allowedDomains = securityConfig.allowedDomains.join(' ');
  
  const defaultCSP = [
    `default-src 'self' ${allowedDomains}`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${allowedDomains}`,
    `style-src 'self' 'unsafe-inline' ${allowedDomains}`,
    `img-src 'self' data: blob: ${allowedDomains}`,
    `connect-src 'self' ${allowedDomains}`,
    `frame-src 'self' ${allowedDomains}`,
    `media-src 'self' ${allowedDomains}`,
  ];
  
  return defaultCSP.join('; ');
}

/**
 * Create a secure iframe element with proper sandbox attributes
 */
export function createSecureIframe(
  src: string,
  permissions: SandboxPermission[],
  options: {
    title?: string;
    className?: string;
    width?: string;
    height?: string;
  } = {}
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  
  iframe.src = src;
  iframe.sandbox.value = generateSandboxAttribute(permissions);
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  
  if (options.title) iframe.title = options.title;
  if (options.className) iframe.className = options.className;
  if (options.width) iframe.style.width = options.width;
  if (options.height) iframe.style.height = options.height;
  
  // Security headers
  iframe.setAttribute('csp', generateCSP({
    allowedDomains: ['*'],
    defaultSandboxPermissions: permissions,
    blockPopups: true,
    enableCSP: true,
  }));
  
  return iframe;
}

/**
 * Validate and extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if code contains potentially malicious patterns
 */
export function containsMaliciousCode(code: string): boolean {
  const maliciousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /document\.write/gi,
    /innerHTML\s*=/gi,
    /outerHTML\s*=/gi,
    /\[\'constructor\'\]/gi,
    /\['constructor'\]/gi,
    /window\[/gi,
    /location\s*=/gi,
    /location\.href/gi,
    /document\.location/gi,
    /XMLHttpRequest/gi,
    /fetch\s*\(/gi,
    /import\s*\(/gi,
    /require\s*\(/gi,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(code));
}