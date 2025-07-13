import React, { useState, useEffect } from 'react';
import type { 
  UniversalWrapperConfig, 
  AppConfig, 
  AppStoreFilters,
  LoadingState,
  ErrorState 
} from '~/types/universal-wrapper';
import { DEFAULT_SANDBOX_PERMISSIONS } from '~/utils/security';
import { AppStore } from './AppStore';
import { ConfigurationPanel } from './ConfigurationPanel';
import { SandboxFrame } from './SandboxFrame';
import { CustomAppRenderer } from './CustomAppRenderer';
import { ExtensionWrapper } from './ExtensionWrapper';
import { SAMPLE_APPLICATIONS } from './sampleApps';

const DEFAULT_CONFIG: UniversalWrapperConfig = {
  brand: {
    name: 'KN3AUX-CODE™ Universal Wrapper',
    logo: undefined,
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    accentColor: '#28a745',
    theme: 'light',
    showHeader: true,
    showFooter: true,
  },
  security: {
    allowedDomains: ['*'],
    defaultSandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
    blockPopups: true,
    enableCSP: true,
  },
  ui: {
    viewMode: 'grid',
    showSearch: true,
    enableMouseTilt: true,
    cardsPerRow: 3,
  },
  apps: SAMPLE_APPLICATIONS,
};

export function UniversalWrapper() {
  const [config, setConfig] = useState<UniversalWrapperConfig>(DEFAULT_CONFIG);
  const [selectedApp, setSelectedApp] = useState<AppConfig | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [filters, setFilters] = useState<AppStoreFilters>({});
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false });
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.brand.primaryColor);
    root.style.setProperty('--secondary-color', config.brand.secondaryColor);
    root.style.setProperty('--accent-color', config.brand.accentColor);
    
    if (config.brand.theme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  }, [config.brand]);

  // Apply custom CSS
  useEffect(() => {
    const existingStyle = document.getElementById('universal-wrapper-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (config.brand.customCSS) {
      const style = document.createElement('style');
      style.id = 'universal-wrapper-custom-css';
      style.textContent = config.brand.customCSS;
      document.head.appendChild(style);
    }
  }, [config.brand.customCSS]);

  const handleAppSelect = (app: AppConfig) => {
    setSelectedApp(app);
    setLoadingState({ isLoading: true, message: `Loading ${app.name}...` });
    setErrorState({ hasError: false });
  };

  const handleAppLoad = () => {
    setLoadingState({ isLoading: false });
  };

  const handleAppError = (error: string) => {
    setLoadingState({ isLoading: false });
    setErrorState({ hasError: true, message: error });
  };

  const handleBackToStore = () => {
    setSelectedApp(null);
    setLoadingState({ isLoading: false });
    setErrorState({ hasError: false });
  };

  const handleConfigSave = (newConfig: UniversalWrapperConfig) => {
    setConfig(newConfig);
    // In a real application, you would persist this to storage
    localStorage.setItem('universal-wrapper-config', JSON.stringify(newConfig));
  };

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('universal-wrapper-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch (error) {
        console.warn('Failed to load saved config:', error);
      }
    }
  }, []);

  const renderSelectedApp = () => {
    if (!selectedApp) return null;

    switch (selectedApp.type) {
      case 'website':
      case 'webapp':
        return (
          <SandboxFrame
            src={selectedApp.url}
            permissions={config.security.defaultSandboxPermissions}
            title={selectedApp.name}
            className="selected-app-frame"
            onLoad={handleAppLoad}
            onError={handleAppError}
          />
        );
      
      case 'custom':
        return (
          <CustomAppRenderer
            embedCode={selectedApp.embed_code || ''}
            sandboxPermissions={config.security.defaultSandboxPermissions}
            onLoad={handleAppLoad}
            onError={handleAppError}
          />
        );
      
      case 'extension':
        return (
          <ExtensionWrapper
            manifest={selectedApp.extension_manifest!}
            extensionId={selectedApp.id}
            onInstall={handleAppLoad}
            onError={handleAppError}
          />
        );
      
      default:
        return (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#6c757d',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
            <h3>Unsupported Application Type</h3>
            <p>This application type is not yet supported.</p>
          </div>
        );
    }
  };

  return (
    <div className="universal-wrapper" style={{
      minHeight: '100vh',
      backgroundColor: config.brand.theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: config.brand.theme === 'dark' ? '#ffffff' : '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      {config.brand.showHeader && (
        <header style={{
          padding: '16px 24px',
          backgroundColor: config.brand.primaryColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {config.brand.logo && (
              <img 
                src={config.brand.logo} 
                alt="Logo" 
                style={{ height: '32px', width: 'auto' }}
              />
            )}
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold',
              cursor: selectedApp ? 'pointer' : 'default',
            }}
            onClick={selectedApp ? handleBackToStore : undefined}>
              {config.brand.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedApp && (
              <button
                onClick={handleBackToStore}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ← Back to Store
              </button>
            )}
            
            <button
              onClick={() => setShowConfig(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main style={{ minHeight: config.brand.showHeader ? 'calc(100vh - 80px)' : '100vh' }}>
        {loadingState.isLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e9ecef',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }} />
              <div style={{ fontSize: '16px', color: '#333' }}>
                {loadingState.message || 'Loading...'}
              </div>
            </div>
          </div>
        )}

        {errorState.hasError && (
          <div style={{
            margin: '24px',
            padding: '20px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              ❌ Error Loading Application
            </div>
            <div>{errorState.message}</div>
            <button
              onClick={() => setErrorState({ hasError: false })}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#721c24',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {selectedApp ? (
          <div style={{ height: '100%', padding: '24px' }}>
            <div style={{
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: config.brand.theme === 'dark' ? '#2d3748' : '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>
                {selectedApp.icon || '📱'}
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                  {selectedApp.name}
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
                  {selectedApp.description}
                </p>
              </div>
            </div>
            
            <div style={{
              height: 'calc(100% - 80px)',
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {renderSelectedApp()}
            </div>
          </div>
        ) : (
          <AppStore
            apps={config.apps}
            filters={filters}
            viewMode={config.ui.viewMode}
            onAppSelect={handleAppSelect}
            onFiltersChange={setFilters}
            mouseTiltEnabled={config.ui.enableMouseTilt}
          />
        )}
      </main>

      {/* Footer */}
      {config.brand.showFooter && (
        <footer style={{
          padding: '16px 24px',
          backgroundColor: config.brand.theme === 'dark' ? '#2d3748' : '#f8f9fa',
          borderTop: '1px solid #e1e5e9',
          textAlign: 'center',
          fontSize: '14px',
          color: config.brand.theme === 'dark' ? '#a0aec0' : '#6c757d',
        }}>
          <p style={{ margin: 0 }}>
            Powered by {config.brand.name} • Secure application embedding platform
          </p>
        </footer>
      )}

      {/* Configuration Panel */}
      <ConfigurationPanel
        config={config}
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        onSave={handleConfigSave}
      />

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .dark-theme {
          --bg-primary: #1a1a1a;
          --bg-secondary: #2d3748;
          --text-primary: #ffffff;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
        }
        
        .universal-wrapper button:hover {
          transform: translateY(-1px);
          transition: transform 0.2s ease;
        }
        
        .universal-wrapper input:focus,
        .universal-wrapper select:focus,
        .universal-wrapper textarea:focus {
          outline: 2px solid ${config.brand.primaryColor};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}