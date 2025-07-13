import React from 'react';
import type { CustomAppRendererProps } from '~/types/universal-wrapper';
import { SandboxFrame } from './SandboxFrame';

export function CustomAppRenderer({
  embedCode,
  sandboxPermissions,
  onLoad,
  onError,
}: CustomAppRendererProps) {
  return (
    <div className="custom-app-renderer">
      <SandboxFrame
        embedCode={embedCode}
        permissions={sandboxPermissions}
        title="Custom Application"
        className="custom-app-frame"
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}