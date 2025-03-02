"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BackgroundCurvesProps {
  className?: string;
}

export const BackgroundCurves = ({ className }: BackgroundCurvesProps) => {
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
    const curves = 5;
    const colors = [
      "rgba(200, 200, 255, 0.03)",
      "rgba(200, 255, 200, 0.02)",
      "rgba(255, 200, 200, 0.02)",
      "rgba(255, 255, 200, 0.01)",
      "rgba(200, 255, 255, 0.01)",
    ];
    
    let time = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each curve
      for (let i = 0; i < curves; i++) {
        const curveOffset = (i + 1) * (canvas.height / (curves + 1));
        
        ctx.beginPath();
        ctx.moveTo(0, curveOffset);
        
        // Draw a bezier curve
        const cp1x = canvas.width * 0.25;
        const cp1y = curveOffset + Math.sin(time + i) * (canvas.height / 8);
        const cp2x = canvas.width * 0.75;
        const cp2y = curveOffset - Math.sin(time + i + 1) * (canvas.height / 8);
        const x = canvas.width;
        const y = curveOffset;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      
      time += 0.005;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full", className)} />;
};

export default BackgroundCurves; 