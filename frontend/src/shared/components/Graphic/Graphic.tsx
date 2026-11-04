import React from 'react';
import styles from './Graphic.module.scss';

interface GraphicProps {
  src: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
  opacity?: number;
  rotate?: string;
  zIndex?: number;
  hideOnMobile?: boolean;
  className?: string;
  mTop?: string;
  mBottom?: string;
  mLeft?: string;
  mRight?: string;
  mWidth?: string;
  mOpacity?: number;
  mRotate?: string;
}

export const Graphic = ({
  src,
  top,
  bottom,
  left,
  right,
  width = '100px',
  opacity = 1,
  rotate,
  zIndex = -5,
  hideOnMobile = false,
  className,
  mTop,
  mBottom,
  mLeft,
  mRight,
  mWidth,
  mOpacity,
  mRotate,
}: GraphicProps) => {
  const dynamicStyles = {
    '--top': top,
    '--bottom': bottom,
    '--left': left,
    '--right': right,
    '--width': width,
    '--opacity': opacity,
    '--rotate': rotate,
    '--z-index': zIndex,

    '--m-top': mTop || top,
    '--m-bottom': mBottom || bottom,
    '--m-left': mLeft || left,
    '--m-right': mRight || right,
    '--m-width': mWidth || width,
    '--m-opacity': mOpacity || opacity,
    '--m-rotate': mRotate || rotate,
  } as React.CSSProperties;

  return (
    <img
      src={src}
      className={`${styles.graphic} ${hideOnMobile ? styles.hiddenMobile : ''} ${className || ''}`}
      alt=""
      aria-hidden="true"
      style={dynamicStyles}
    />
  );
};
