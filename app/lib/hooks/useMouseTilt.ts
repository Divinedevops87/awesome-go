import { useCallback, useRef, useState } from 'react';
import type { MouseTiltProps } from '~/types/universal-wrapper';

export interface MouseTiltState {
  rotateX: number;
  rotateY: number;
  glareOpacity: number;
  glarePosition: { x: number; y: number };
}

export function useMouseTilt(options: MouseTiltProps = {}) {
  const {
    maxRotation = 15,
    perspective = 1000,
    speed = 0.1,
    glareOpacity = 0.2,
    enableGlare = true,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [tiltState, setTiltState] = useState<MouseTiltState>({
    rotateX: 0,
    rotateY: 0,
    glareOpacity: 0,
    glarePosition: { x: 50, y: 50 },
  });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * maxRotation;
      const rotateY = -(mouseX / (rect.width / 2)) * maxRotation;

      const glareX = ((event.clientX - rect.left) / rect.width) * 100;
      const glareY = ((event.clientY - rect.top) / rect.height) * 100;

      setTiltState({
        rotateX: rotateX * speed,
        rotateY: rotateY * speed,
        glareOpacity: enableGlare ? glareOpacity : 0,
        glarePosition: { x: glareX, y: glareY },
      });
    },
    [maxRotation, speed, glareOpacity, enableGlare]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      glareOpacity: 0,
      glarePosition: { x: 50, y: 50 },
    });
  }, []);

  const getTransformStyle = useCallback(
    (additionalStyles?: React.CSSProperties): React.CSSProperties => ({
      transform: `perspective(${perspective}px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg)`,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.2s ease-out',
      ...additionalStyles,
    }),
    [perspective, tiltState.rotateX, tiltState.rotateY]
  );

  const getGlareStyle = useCallback(
    (): React.CSSProperties => ({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at ${tiltState.glarePosition.x}% ${tiltState.glarePosition.y}%, rgba(255,255,255,${tiltState.glareOpacity}) 0%, transparent 50%)`,
      borderRadius: 'inherit',
      pointerEvents: 'none' as const,
      opacity: tiltState.glareOpacity,
      transition: 'opacity 0.2s ease-out',
    }),
    [tiltState.glarePosition, tiltState.glareOpacity]
  );

  const resetTilt = useCallback(() => {
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      glareOpacity: 0,
      glarePosition: { x: 50, y: 50 },
    });
  }, []);

  return {
    elementRef,
    tiltState,
    handleMouseMove,
    handleMouseLeave,
    getTransformStyle,
    getGlareStyle,
    resetTilt,
    isActive: tiltState.rotateX !== 0 || tiltState.rotateY !== 0,
  };
}