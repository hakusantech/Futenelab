"use client";

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec4 position;
  varying vec2 v_uv;
  void main() {
    gl_Position = position;
    v_uv = position.xy * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  #define GLSLIFY 1

  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 v_uv;

  float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = rand(i);
      float b = rand(i + vec2(1.0, 0.0));
      float c = rand(i + vec2(0.0, 1.0));
      float d = rand(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 2.0;
      
      for(int i = 0; i < 6; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
      }
      
      return value;
  }

  void main() {
      vec2 uv = v_uv;
      vec2 aspect = vec2(u_resolution.x/u_resolution.y, 1.0);
      uv = uv * aspect;
      
      vec2 mouseInfluence = u_mouse * aspect;
      float dist = length(uv - mouseInfluence);
      float mouseFactor = smoothstep(0.5, 0.0, dist);
      
      vec2 movement = vec2(u_time * 0.1, u_time * 0.05);
      float turbulence = fbm(uv * 3.0 + movement);
      turbulence += fbm((uv + vec2(turbulence)) * 2.0 - movement);
      
      float smokeMask = fbm(uv * 1.5 + turbulence + movement);
      smokeMask = smoothstep(0.2, 0.8, smokeMask + mouseFactor * 0.3);
      
      vec3 smokeColor = vec3(0.4, 0.4, 0.5);
      vec3 backgroundColor = vec3(0.05, 0.05, 0.08);
      
      vec3 finalColor = mix(backgroundColor, smokeColor, smokeMask);
      finalColor += mouseFactor * 0.2;
      
      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up buffers
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = [
        e.clientX / canvas.width,
        1.0 - e.clientY / canvas.height,
      ];
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const render = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseRef.current[0], mouseRef.current[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
} 