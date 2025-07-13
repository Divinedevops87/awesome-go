import React, { useState } from 'react';
import type { ExtensionWrapperProps } from '~/types/universal-wrapper';
import { validateExtensionManifest } from '~/utils/security';

export function ExtensionWrapper({
  manifest,
  extensionId,
  onInstall,
  onError,
}: ExtensionWrapperProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);

  const handleValidateManifest = async () => {
    setIsValidating(true);
    try {
      const result = validateExtensionManifest(manifest);
      setValidationResult(result);
      
      if (!result.isValid) {
        onError?.(result.errors.join(', '));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      onError?.(message);
      setValidationResult({ isValid: false, errors: [message] });
    } finally {
      setIsValidating(false);
    }
  };

  const handleInstallClick = () => {
    if (validationResult?.isValid) {
      onInstall?.();
    } else {
      onError?.('Cannot install: Extension manifest is invalid');
    }
  };

  React.useEffect(() => {
    handleValidateManifest();
  }, [manifest]);

  return (
    <div className="extension-wrapper" style={{
      padding: '24px',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <div className="extension-header" style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '16px',
          fontSize: '24px',
        }}>
          🧩
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {manifest.name}
          </h3>
          <p style={{ margin: '4px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
            Version {manifest.version}
          </p>
        </div>
      </div>

      {manifest.description && (
        <p style={{ 
          color: '#495057',
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '16px'
        }}>
          {manifest.description}
        </p>
      )}

      <div className="extension-details" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
          <strong>Manifest Version:</strong> {manifest.manifest_version}
        </div>
        
        {manifest.permissions && manifest.permissions.length > 0 && (
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
            <strong>Permissions:</strong> {manifest.permissions.join(', ')}
          </div>
        )}
        
        {manifest.host_permissions && manifest.host_permissions.length > 0 && (
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
            <strong>Host Permissions:</strong> {manifest.host_permissions.join(', ')}
          </div>
        )}
        
        {extensionId && (
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
            <strong>Extension ID:</strong> {extensionId}
          </div>
        )}
      </div>

      {isValidating && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #e9ecef',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
          }} />
          <span style={{ fontSize: '14px', color: '#6c757d' }}>
            Validating manifest...
          </span>
        </div>
      )}

      {validationResult && !isValidating && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          backgroundColor: validationResult.isValid ? '#d4edda' : '#f8d7da',
          border: `1px solid ${validationResult.isValid ? '#c3e6cb' : '#f5c6cb'}`,
          color: validationResult.isValid ? '#155724' : '#721c24',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {validationResult.isValid ? '✅ Valid Manifest' : '❌ Invalid Manifest'}
          </div>
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <ul style={{ margin: '4px 0 0 16px', fontSize: '14px' }}>
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="extension-actions">
        <button
          onClick={handleInstallClick}
          disabled={!validationResult?.isValid || isValidating}
          style={{
            padding: '12px 24px',
            backgroundColor: validationResult?.isValid ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: validationResult?.isValid ? 'pointer' : 'not-allowed',
            opacity: validationResult?.isValid ? 1 : 0.6,
            transition: 'all 0.2s ease',
          }}
        >
          {isValidating ? 'Validating...' : validationResult?.isValid ? 'Install Extension' : 'Cannot Install'}
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '16px' }}>
        <strong>Note:</strong> Chrome extensions cannot be directly installed from web pages. 
        This is a demonstration of the extension manifest and validation process.
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}