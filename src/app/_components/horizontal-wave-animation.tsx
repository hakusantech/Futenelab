"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HorizontalWaveAnimationProps {
  className?: string;
}

export const HorizontalWaveAnimation = ({ className }: HorizontalWaveAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation parameters
    const waves = 5;
    const amplitude = canvas.width / 30;
    const frequency = 0.005;
    const colors = ["rgba(200, 200, 200, 0.03)", "rgba(200, 200, 200, 0.02)", "rgba(200, 200, 200, 0.01)"];
    
    let phase = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each wave
      for (let i = 0; i < waves; i++) {
        const xOffset = (i + 1) * (canvas.width / (waves + 1));
        const waveFrequency = frequency * (i + 1);
        const waveAmplitude = amplitude * (waves - i);
        
        ctx.beginPath();
        ctx.moveTo(xOffset, 0);
        
        for (let y = 0; y < canvas.height; y++) {
          const x = xOffset + Math.sin(y * waveFrequency + phase) * waveAmplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      
      phase += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />;
};

export default HorizontalWaveAnimation; 