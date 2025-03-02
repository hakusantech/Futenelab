"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VerticalWaveAnimationProps {
  className?: string;
}

export const VerticalWaveAnimation = ({ className }: VerticalWaveAnimationProps) => {
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
    const waves = 3;
    const amplitude = canvas.height / 20;
    const frequency = 0.01;
    const colors = ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.02)"];
    
    let phase = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each wave
      for (let i = 0; i < waves; i++) {
        const yOffset = (i + 1) * (canvas.height / (waves + 1));
        const waveFrequency = frequency * (i + 1);
        const waveAmplitude = amplitude * (waves - i);
        
        ctx.beginPath();
        ctx.moveTo(0, yOffset);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = yOffset + Math.sin(x * waveFrequency + phase) * waveAmplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2;
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

export default VerticalWaveAnimation; 