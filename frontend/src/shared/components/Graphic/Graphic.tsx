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
  mTop?: string;
  mBottom?: string;
  mLeft?: string;
  mRight?: string;
  mWidth?: string;
  mOpacity?: number;
}

export const Graphic = ({
  src,
  top, bottom, left, right, width = '100px', opacity = 1,
  mTop, mBottom, mLeft, mRight, mWidth, mOpacity
}: GraphicProps) => {
  
  const dynamicStyles = {
    '--top': top,
    '--bottom': bottom,
    '--left': left,
    '--right': right,
    '--width': width,
    '--opacity': opacity,
    
    '--m-top': mTop || top,
    '--m-bottom': mBottom || bottom,
    '--m-left': mLeft || left,
    '--m-right': mRight || right,
    '--m-width': mWidth || width,
    '--m-opacity': mOpacity || opacity,
  } as React.CSSProperties;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={styles.graphic}
      style={dynamicStyles}
    />
  );
};