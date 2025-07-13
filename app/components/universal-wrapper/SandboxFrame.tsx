import React, { useEffect, useRef, useState } from 'react';
import type { SandboxFrameProps } from '~/types/universal-wrapper';
import { generateSandboxAttribute, sanitizeEmbedCode, containsMaliciousCode } from '~/utils/security';

export function SandboxFrame({
  src,
  embedCode,
  permissions,
  title = 'Embedded Application',
  className = '',
  onLoad,
  onError,
}: SandboxFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const sandboxAttribute = generateSandboxAttribute(permissions);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      const message = 'Failed to load embedded content';
      setErrorMessage(message);
      onError?.(message);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [onLoad, onError]);

  // Handle embed code injection
  useEffect(() => {
    if (embedCode && frameRef.current) {
      // Security check for malicious code
      if (containsMaliciousCode(embedCode)) {
        const message = 'Potentially malicious code detected in embed content';
        setHasError(true);
        setErrorMessage(message);
        onError?.(message);
        return;
      }

      const sanitizedCode = sanitizeEmbedCode(embedCode);
      const iframe = frameRef.current;
      
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body {
                    margin: 0;
                    padding: 16px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #ffffff;
                  }
                  * {
                    box-sizing: border-box;
                  }
                </style>
              </head>
              <body>
                ${sanitizedCode}
              </body>
            </html>
          `);
          doc.close();
        }
      } catch (error) {
        const message = 'Failed to inject embed code';
        setHasError(true);
        setErrorMessage(message);
        onError?.(message);
      }
    }
  }, [embedCode, onError]);

  if (hasError) {
    return (
      <div className={`sandbox-frame-error ${className}`} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        backgroundColor: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        color: '#6c757d',
        textAlign: 'center',
        padding: '24px',
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
            Failed to Load Content
          </div>
          <div style={{ fontSize: '14px' }}>
            {errorMessage || 'An error occurred while loading the embedded content.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sandbox-frame-container ${className}`} style={{ position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          zIndex: 1,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '3px solid #e9ecef',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }} />
            <div style={{ color: '#6c757d', fontSize: '14px' }}>Loading...</div>
          </div>
        </div>
      )}
      
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        sandbox={sandboxAttribute}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}
        allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb"
      />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}