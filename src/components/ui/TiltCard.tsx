"use client";

import React, { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: any;
  children: React.ReactNode;
}

export function TiltCard({ options, children, className, ...rest }: TiltCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 5,
        speed: 400,
        glare: false,
        "max-glare": 0.2,
        ...options,
      });
    }
  }, [options]);

  return (
    <div ref={tiltRef} className={`transform-style-3d ${className || ""}`} {...rest}>
      {children}
    </div>
  );
}
