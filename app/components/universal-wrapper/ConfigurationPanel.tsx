import React, { useState } from 'react';
import type { ConfigurationPanelProps, SandboxPermission } from '~/types/universal-wrapper';
import { DEFAULT_SANDBOX_PERMISSIONS } from '~/utils/security';

export function ConfigurationPanel({
  config,
  isOpen,
  onClose,
  onSave,
}: ConfigurationPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const [activeTab, setActiveTab] = useState<'brand' | 'security' | 'ui'>('brand');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const handleBrandChange = (key: keyof typeof localConfig.brand, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      brand: { ...prev.brand, [key]: value },
    }));
  };

  const handleSecurityChange = (key: keyof typeof localConfig.security, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value },
    }));
  };

  const handleUIChange = (key: keyof typeof localConfig.ui, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      ui: { ...prev.ui, [key]: value },
    }));
  };

  const handlePermissionChange = (index: number, enabled: boolean) => {
    const updatedPermissions = localConfig.security.defaultSandboxPermissions.map((perm, i) =>
      i === index ? { ...perm, enabled } : perm
    );
    handleSecurityChange('defaultSandboxPermissions', updatedPermissions);
  };

  const addAllowedDomain = () => {
    const domain = prompt('Enter domain (e.g., example.com or *.example.com):');
    if (domain && domain.trim()) {
      const domains = [...localConfig.security.allowedDomains, domain.trim()];
      handleSecurityChange('allowedDomains', domains);
    }
  };

  const removeAllowedDomain = (index: number) => {
    const domains = localConfig.security.allowedDomains.filter((_, i) => i !== index);
    handleSecurityChange('allowedDomains', domains);
  };

  return (
    <div className="configuration-panel-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="configuration-panel" style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e1e5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Configuration
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c757d',
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e1e5e9',
        }}>
          {(['brand', 'security', 'ui'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : '#6c757d',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'ui' ? 'Interface' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
        }}>
          {activeTab === 'brand' && (
            <div className="brand-config">
              <h3 style={{ marginTop: 0 }}>Brand Settings</h3>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Brand Name
                </label>
                <input
                  type="text"
                  value={localConfig.brand.name}
                  onChange={(e) => handleBrandChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Logo URL
                </label>
                <input
                  type="url"
                  value={localConfig.brand.logo || ''}
                  onChange={(e) => handleBrandChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div className="color-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={localConfig.brand.primaryColor}
                    onChange={(e) => handleBrandChange('primaryColor', e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={localConfig.brand.secondaryColor}
                    onChange={(e) => handleBrandChange('secondaryColor', e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={localConfig.brand.accentColor}
                    onChange={(e) => handleBrandChange('accentColor', e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #e1e5e9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Theme
                </label>
                <select
                  value={localConfig.brand.theme}
                  onChange={(e) => handleBrandChange('theme', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="checkbox-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.brand.showHeader}
                    onChange={(e) => handleBrandChange('showHeader', e.target.checked)}
                  />
                  Show Header
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.brand.showFooter}
                    onChange={(e) => handleBrandChange('showFooter', e.target.checked)}
                  />
                  Show Footer
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Custom CSS
                </label>
                <textarea
                  value={localConfig.brand.customCSS || ''}
                  onChange={(e) => handleBrandChange('customCSS', e.target.value)}
                  placeholder="/* Custom CSS styles */&#10;.my-class { color: red; }"
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-config">
              <h3 style={{ marginTop: 0 }}>Security Settings</h3>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Allowed Domains
                </label>
                <div style={{ marginBottom: '12px' }}>
                  {localConfig.security.allowedDomains.map((domain, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}>
                      <span style={{ flex: 1, fontSize: '14px' }}>{domain}</span>
                      <button
                        onClick={() => removeAllowedDomain(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addAllowedDomain}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Add Domain
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Default Sandbox Permissions
                </label>
                <div className="permissions-list">
                  {localConfig.security.defaultSandboxPermissions.map((permission, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>
                          {permission.name}
                        </div>
                        {permission.description && (
                          <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                            {permission.description}
                          </div>
                        )}
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={permission.enabled}
                          onChange={(e) => handlePermissionChange(index, e.target.checked)}
                          style={{ marginLeft: '8px' }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkbox-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.security.blockPopups}
                    onChange={(e) => handleSecurityChange('blockPopups', e.target.checked)}
                  />
                  Block Popups
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.security.enableCSP}
                    onChange={(e) => handleSecurityChange('enableCSP', e.target.checked)}
                  />
                  Enable Content Security Policy
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ui' && (
            <div className="ui-config">
              <h3 style={{ marginTop: 0 }}>Interface Settings</h3>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  View Mode
                </label>
                <select
                  value={localConfig.ui.viewMode}
                  onChange={(e) => handleUIChange('viewMode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Cards Per Row
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={localConfig.ui.cardsPerRow}
                  onChange={(e) => handleUIChange('cardsPerRow', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div className="checkbox-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.ui.showSearch}
                    onChange={(e) => handleUIChange('showSearch', e.target.checked)}
                  />
                  Show Search Bar
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.ui.enableMouseTilt}
                    onChange={(e) => handleUIChange('enableMouseTilt', e.target.checked)}
                  />
                  Enable Mouse Tilt Effects
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e1e5e9',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}