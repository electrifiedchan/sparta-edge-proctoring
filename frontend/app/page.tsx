"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Terminal,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Send,
  Wifi,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  FileText,
  Code,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Github,
  Trash2
} from 'lucide-react';
import axios from 'axios';

// --- CUSTOM CSS (Merged: Matrix Theme + User's Glitch/Typewriter Effects) ---
const customStyles = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

:root {
  --neon-green: #00FF41;
  --neon-red: #FF1744;
  --neon-blue: #00FFFF;
  --neon-yellow: #FFFF33;
  --dark-bg: #050505;
}

body {
  background-color: var(--dark-bg);
  color: var(--neon-green);
  font-family: 'JetBrains Mono', monospace;
  overflow-x: hidden;
}

/* --- CRT & GLOBAL GLITCH EFFECTS --- */
.scanlines::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
}

@keyframes flicker {
  0% { opacity: 0.99; }
  5% { opacity: 0.98; }
  10% { opacity: 0.97; }
  15% { opacity: 0.98; }
  20% { opacity: 0.99; }
  50% { opacity: 0.98; }
  100% { opacity: 0.99; }
}

.crt-flicker {
  animation: flicker 0.2s infinite;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: #003300; border: 1px solid #00FF41; }

/* --- MORPHEUS SPECIFIC STYLES --- */
.morpheus-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* --- PREMIUM GLITCH EFFECT (User Provided) --- */
.glasses-text {
  position: absolute;
  top: 13%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  font-weight: 1000;
  letter-spacing: 3px;
  z-index: 20;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0px; 
  align-items: center;
  pointer-events: none;
}

.glitch {
  position: relative;
  color: white; 
  mix-blend-mode: hard-light;
  background: black;
  width: 100px;
  text-align: center;
  display: inline-block;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black; 
}

.glitch::before {
  left: 2px;
  text-shadow: -1px 0 red;
  animation: noise-anim 2s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  animation: noise-anim 2s infinite linear alternate-reverse;
  animation-delay: 1s; 
}

@keyframes noise-anim {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(43% 0 1% 0); }
  60% { clip-path: inset(25% 0 58% 0); }
  80% { clip-path: inset(54% 0 7% 0); }
  100% { clip-path: inset(58% 0 43% 0); }
}

.text-git {
  color: #FF1744;
}
.text-real {
  color: #00FFFF;
}

.pill-zone {
  position: absolute;
  width: 14%;
  height: 14%;
  border-radius: 50%;
  cursor: pointer;
  z-index: 30;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pill-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.pill-zone::before {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0;
  animation: pill-pulse 2s ease-out infinite;
}

.pill-zone:hover::before {
  opacity: 1;
}

.pill-red {
  top: 77%;
  left: 12%;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.3);
  animation: red-glow-idle 2s ease-in-out infinite;
}

@keyframes red-glow-idle {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 23, 68, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 23, 68, 0.5); }
}

.pill-red:hover {
  animation: none;
  box-shadow: 0 0 100px rgba(255, 23, 68, 1), 0 0 150px rgba(255, 23, 68, 0.5), inset 0 0 30px rgba(255, 23, 68, 0.3);
  background: radial-gradient(circle, rgba(255,23,68,0.5) 0%, rgba(0,0,0,0) 70%);
  transform: scale(1.15);
}

.pill-red::before {
  border-color: #FF1744;
}

.pill-blue {
  top: 77%;
  right: 11%;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  animation: cyan-glow-idle 2s ease-in-out infinite;
}

@keyframes cyan-glow-idle {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.5); }
}

.pill-blue:hover {
  animation: none;
  box-shadow: 0 0 100px rgba(0, 255, 255, 1), 0 0 150px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.3);
  background: radial-gradient(circle, rgba(0,255,255,0.5) 0%, rgba(0,0,0,0) 70%);
  transform: scale(1.15);
}

.pill-blue::before {
  border-color: #00FFFF;
}

.tooltip {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono';
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  background: rgba(0,0,0,0.95);
  border: 2px solid currentColor;
  padding: 10px 16px;
  pointer-events: none;
  z-index: 40;
  backdrop-filter: blur(10px);
}

.pill-zone:hover .tooltip {
  opacity: 1;
}

@keyframes fadeInText {
  to { opacity: 1; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.glitch-anim {
  position: relative;
}
.glitch-anim::before,
.glitch-anim::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch-anim::before {
  left: 2px;
  text-shadow: -1px 0 var(--neon-red);
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}
.glitch-anim::after {
  left: -2px;
  text-shadow: -1px 0 var(--neon-green);
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(42px, 9999px, 44px, 0); }
  5% { clip: rect(12px, 9999px, 59px, 0); }
  10% { clip: rect(48px, 9999px, 29px, 0); }
  15% { clip: rect(42px, 9999px, 73px, 0); }
  20% { clip: rect(63px, 9999px, 27px, 0); }
  25% { clip: rect(34px, 9999px, 55px, 0); }
  30% { clip: rect(86px, 9999px, 73px, 0); }
  35% { clip: rect(20px, 9999px, 20px, 0); }
  40% { clip: rect(26px, 9999px, 60px, 0); }
  45% { clip: rect(25px, 9999px, 66px, 0); }
  50% { clip: rect(57px, 9999px, 98px, 0); }
  55% { clip: rect(5px, 9999px, 46px, 0); }
  60% { clip: rect(82px, 9999px, 31px, 0); }
  65% { clip: rect(54px, 9999px, 27px, 0); }
  70% { clip: rect(28px, 9999px, 99px, 0); }
  75% { clip: rect(45px, 9999px, 69px, 0); }
  80% { clip: rect(23px, 9999px, 85px, 0); }
  85% { clip: rect(54px, 9999px, 84px, 0); }
  90% { clip: rect(45px, 9999px, 47px, 0); }
  95% { clip: rect(37px, 9999px, 20px, 0); }
  100% { clip: rect(4px, 9999px, 91px, 0); }
}
@keyframes glitch-anim2 {
  0% { clip: rect(65px, 9999px, 100px, 0); }
  100% { clip: rect(0px, 9999px, 30px, 0); }
}
@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

@keyframes matrix-fall {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}

@keyframes matrix-glow {
  0%, 100% { text-shadow: 0 0 5px #00FF41, 0 0 10px #00FF41; }
  50% { text-shadow: 0 0 20px #00FF41, 0 0 30px #00FF41, 0 0 40px #00FF41; }
}

.matrix-column {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  color: #00FF41;
  text-shadow: 0 0 10px #00FF41;
  user-select: none;
  animation: matrix-fall linear infinite;
}

.matrix-char {
  font-size: 16px;
  line-height: 1.1;
  text-align: center;
}

.matrix-char-bright {
  color: #FFFFFF !important;
  text-shadow: 0 0 20px #00FF41, 0 0 30px #FFFFFF !important;
}

.matrix-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.matrix-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 255, 65, 0.3);
}

.matrix-btn:active {
  transform: scale(0.98);
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 65, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.8), 0 0 30px rgba(0, 255, 65, 0.4); }
}

.matrix-btn-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}

.matrix-btn-glow:hover {
  animation: none;
  box-shadow: 0 0 30px rgba(0, 255, 65, 1), 0 0 60px rgba(0, 255, 65, 0.5);
}

.matrix-btn .ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 255, 65, 0.4);
  transform: scale(0);
  animation: ripple-effect 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.matrix-btn-border {
  position: relative;
}

.matrix-btn-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  background: linear-gradient(90deg, #00FF41, #00FF41) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.matrix-btn-border:hover::before {
  opacity: 1;
  animation: border-chase 1s linear infinite;
}

@keyframes border-chase {
  0% { clip-path: inset(0 100% 100% 0); }
  25% { clip-path: inset(0 0 100% 0); }
  50% { clip-path: inset(0 0 0 100%); }
  75% { clip-path: inset(100% 0 0 0); }
  100% { clip-path: inset(0 100% 0 0); }
}

.matrix-btn-glitch:hover {
  animation: btn-glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

@keyframes btn-glitch {
  0% { transform: scale(1.05) translate(0); }
  20% { transform: scale(1.05) translate(-2px, 2px); }
  40% { transform: scale(1.05) translate(-2px, -2px); }
  60% { transform: scale(1.05) translate(2px, 2px); }
  80% { transform: scale(1.05) translate(2px, -2px); }
  100% { transform: scale(1.05) translate(0); }
}

.matrix-btn-danger {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.matrix-btn-danger:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3);
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
}

.matrix-btn-cyan {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.matrix-btn-cyan:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

@keyframes scan-line {
  0% { top: -10%; }
  100% { top: 110%; }
}

.animate-scan-line {
  animation: scan-line 3s linear infinite;
}

.hover-card {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.hover-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 40px rgba(0, 255, 65, 0.2);
}

@keyframes card-slide-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-animate {
  animation: card-slide-in 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes list-item-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.list-item-animate {
  animation: list-item-in 0.3s ease-out forwards;
  opacity: 0;
}
`;

// --- HELPER COMPONENTS ---

const MatrixButton = ({
  children,
  onClick,
  className = "",
  variant = "default",
  disabled = false
}: {
  children: React.ReactNode,
  onClick?: () => void,
  className?: string,
  variant?: "default" | "danger" | "cyan" | "glow",
  disabled?: boolean
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = btnRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onClick?.();
  };

  const variantClasses = {
    default: "matrix-btn",
    danger: "matrix-btn matrix-btn-danger",
    cyan: "matrix-btn matrix-btn-cyan",
    glow: "matrix-btn matrix-btn-glow"
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const AnimatedCounter = ({ target, duration = 2000, className = "" }: { target: number, duration?: number, className?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span className={className}>{count}</span>;
};

const TypewriterText = ({ text, speed = 30, className = "" }: { text: string, speed?: number, className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">▌</span>}
    </span>
  );
};

const MatrixRain = ({ opacity = 0.7 }: { opacity?: number }) => {
  const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const columns = 40; 

  const columnData = useMemo(() => {
    return [...Array(columns)].map((_, colIndex) => {
      const charCount = 10 + Math.floor(Math.random() * 15);
      const duration = 4 + Math.random() * 6; 
      const delay = Math.random() * 8;
      const left = (colIndex / columns) * 100 + (Math.random() - 0.5) * 3; 
      const chars = Array.from({ length: charCount }, () =>
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      );
      return { charCount, duration, delay, left, chars };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {columnData.map((col, colIndex) => (
        <div
          key={colIndex}
          className="matrix-column"
          style={{
            left: `${col.left}%`,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.chars.map((char, charIndex) => (
            <span
              key={charIndex}
              className={`matrix-char ${charIndex === col.chars.length - 1 ? 'matrix-char-bright' : ''}`}
              style={{
                opacity: 0.2 + (charIndex / col.chars.length) * 0.8,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const MatrixLoader = ({
  title = "PROCESSING...",
  subtitle = "PLEASE WAIT...",
  showRain = true
}: {
  title?: string,
  subtitle?: string,
  showRain?: boolean
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {showRain && <MatrixRain opacity={0.4} />}

      <div className="relative z-10 text-[#00FF41] font-mono flex flex-col items-center gap-6">
        <div className="relative">
          <Terminal size={64} className="animate-pulse" />
          <div className="absolute inset-0 border-2 border-[#00FF41] rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        </div>

        <div className="text-2xl md:text-3xl font-bold tracking-wider text-center drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">
          <span className="animate-pulse">{title}</span>
        </div>

        <div className="text-sm text-green-500 tracking-widest">
          {subtitle}
        </div>

        <div className="w-64 h-2 bg-[#003300] overflow-hidden border border-[#00FF41]/30">
          <div
            className="h-full bg-[#00FF41]"
            style={{
              width: '100%',
              animation: 'loading-bar 2s ease-in-out infinite',
              boxShadow: '0 0 10px #00FF41, 0 0 20px #00FF41'
            }}
          ></div>
        </div>

        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#00FF41] rounded-full"
              style={{
                animationDelay: `${i * 0.15}s`,
                animation: 'pulse 1s ease-in-out infinite',
                boxShadow: '0 0 5px #00FF41'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Typewriter = ({ text, speed = 50, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayText(''); 
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      <span
        className="cursor-blink inline-block bg-[#00FF41] ml-1 align-middle mb-2"
        style={{ width: '12px', height: '40px', display: 'inline-block' }}
      ></span>
    </span>
  );
};

// --- VIEW 1: UPLOAD LANDING ---
const UploadLanding = ({ onUploadComplete, isValidating = false }: { onUploadComplete: (file: File) => void; isValidating?: boolean }) => {
  const [file, setFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = () => {
    if (!file) return;
    onUploadComplete(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20">
      <div className="mb-12 text-center max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.5)] mb-8">
          <Typewriter
            text="RECRUITERS ARE LYING TO YOU. WAKE UP."
            speed={75}
            onComplete={() => setShowUpload(true)}
          />
        </h1>
      </div>

      {showUpload && (
        <>
          <div className="w-full max-w-xl mx-auto border-2 border-[#00FF41] bg-black p-8 animate-slide-up-fade animate-glow-pulse-in opacity-0"
               style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <h3 className="text-xl mb-8 border-b-2 border-[#00FF41] pb-3 flex items-center gap-3 animate-glitch-in"
                style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
              <Terminal size={24} /> UPLOAD_CANDIDATE_DATA
            </h3>

            <div className="space-y-8">
              <div className="space-y-3 animate-slide-up-fade opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <label className="text-sm uppercase flex items-center gap-2 text-gray-300 font-bold">
                  <FileText size={16} /> Upload Resume (PDF)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#0a0a0a] border-2 border-[#003300] p-4 text-sm focus:border-[#00FF41] outline-none text-gray-300 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00FF41] file:text-black hover:file:bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isValidating || !file}
                className="w-full bg-[#00FF41] text-black font-bold py-4 text-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,65,0.5)] hover:shadow-[0_0_50px_rgba(0,255,65,0.8)] animate-slide-up-fade opacity-0"
                style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
              >
                {isValidating ? (
                  <span className="flex items-center gap-3">
                    <span className="animate-spin">⟳</span> 🛡️ GATEKEEPER SCANNING...
                  </span>
                ) : (
                  <>INITIALIZE SYSTEM <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </div>
          <div className="absolute bottom-8 font-mono text-xs text-green-900 tracking-widest animate-slide-up-fade opacity-0"
               style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
            SYSTEM VERSION 4.2.4 // UNAUTHORIZED ACCESS DETECTED
          </div>
        </>
      )}
    </div>
  );
};

// --- VIEW 2: MORPHEUS CHOICE ---
const MorpheusChoice = ({ onNavigate, onModeSelect }: { onNavigate: (view: string) => void, onModeSelect: (mode: 'roast' | 'rewrite') => void }) => {

  const handleRoast = () => {
    onModeSelect('roast');
    onNavigate('project-select');
  };

  const handleRewrite = () => {
    onModeSelect('rewrite');
    onNavigate('project-select');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20 overflow-hidden">
      <MatrixRain opacity={0.15} />

      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 text-[#00FF41] hover:text-white transition-colors text-sm font-mono flex items-center gap-2 border border-[#003300] hover:border-[#00FF41] px-3 py-2 z-30"
      >
        ← BACK
      </button>

      <div className="mb-6 text-center text-[#00FF41] animate-pulse font-mono text-sm md:text-base tracking-[0.2em] relative z-20">
        CHOOSE YOUR REALITY
      </div>

      <div className="morpheus-container relative z-20">
        <img
          src="/morpheus.png"
          alt="Morpheus"
          className="w-full h-auto object-contain opacity-90 drop-shadow-[0_0_30px_rgba(0,255,65,0.3)]"
        />

        <div className="glasses-text">
          <span className="text-git glitch-anim" data-text="GIT">GIT</span>
          <span className="text-real glitch-anim" data-text="REAL">REAL</span>
        </div>

        <div
          className="pill-zone pill-red"
          onClick={handleRoast}
        >
          <div className="tooltip text-red-500 border-red-500 shadow-[0_0_20px_red]">
            [ ROAST ME ]
            <br />
            <span className="text-[10px] text-gray-400">See the harsh truth</span>
          </div>
        </div>

        <div
          className="pill-zone pill-blue"
          onClick={handleRewrite}
        >
          <div className="tooltip text-cyan-400 border-cyan-400 shadow-[0_0_20px_cyan]">
            [ REWRITE ME ]
            <br />
            <span className="text-[10px] text-gray-400">Upgrade your career</span>
          </div>
        </div>
      </div>

      <div className="mt-8 font-mono text-xs text-green-900 relative z-20">
        HOVER OVER A PILL TO SEE OPTIONS...
      </div>
    </div>
  );
};

// --- VIEW 2.5: PROJECT SELECTION ---
interface Project {
  name: string;
  description: string;
  github_url: string | null;
  technologies: string[];
}

const generateFileKey = (file: File | null): string => {
  if (!file) return '';
  return `resume_${file.name}_${file.size}`;
};

const getCachedProjects = (fileKey: string): Project[] | null => {
  if (!fileKey || typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(`projects_${fileKey}`);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return data.projects;
      }
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }
  return null;
};

const setCachedProjects = (fileKey: string, projects: Project[]) => {
  if (!fileKey || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`projects_${fileKey}`, JSON.stringify({
      projects,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Cache write error:', e);
  }
};

const generateProjectKey = (project: Project | null): string => {
  if (!project) return 'unknown_project';
  if (project.github_url) {
    return project.github_url.replace(/[^a-zA-Z0-9]/g, '_');
  }
  return `project_${project.name}`.replace(/[^a-zA-Z0-9]/g, '_');
};

const getCachedAnalysis = (projectKey: string): { data?: any; initial_chat?: string } | null => {
  if (!projectKey || typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(`analysis_${projectKey}`);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Date.now() - parsedCache.timestamp < 60 * 60 * 1000) {
        return parsedCache.analysis;
      }
    }
  } catch (e) {
    console.error('Analysis cache read error:', e);
  }
  return null;
};

const setCachedAnalysis = (projectKey: string, analysis: { data?: any; initial_chat?: string }) => {
  if (!projectKey || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`analysis_${projectKey}`, JSON.stringify({
      analysis,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Analysis cache write error:', e);
  }
};

const clearProjectCaches = () => {
  if (typeof window === 'undefined') return;
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('projects_') || key.startsWith('analysis_')) {
      localStorage.removeItem(key);
    }
  });
};

const ProjectSelection = ({
  onNavigate,
  uploadedFile,
  onProjectSelect,
  mode = 'roast',
  cachedProjects = null,
  onProjectsExtracted
}: {
  onNavigate: (view: string) => void,
  uploadedFile: File | null,
  onProjectSelect: (project: Project) => void,
  mode?: 'roast' | 'rewrite',
  cachedProjects?: Project[] | null,
  onProjectsExtracted?: (projects: Project[]) => void
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [manualUrl, setManualUrl] = useState('');

  const isRoast = mode === 'roast';

  useEffect(() => {
    const extractProjects = async () => {
      if (!uploadedFile) {
        setLoading(false);
        return;
      }

      if (cachedProjects && cachedProjects.length > 0) {
        setProjects(cachedProjects);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const res = await axios.post("http://localhost:8000/extract_projects", formData);
        if (res.data.status === "success") {
          const extractedProjects = res.data.projects || [];
          setProjects(extractedProjects);
          if (onProjectsExtracted) {
            onProjectsExtracted(extractedProjects);
          }
        }
      } catch (e: any) {
        console.error("Error extracting projects:", e);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    extractProjects();
  }, [uploadedFile, cachedProjects]);

  const handleContinue = () => {
    const targetView = isRoast ? 'dashboard' : 'chat';
    if (selectedProject) {
      onProjectSelect(selectedProject);
      onNavigate(targetView);
    } else if (manualUrl) {
      onProjectSelect({
        name: "Manual Entry",
        description: "User provided GitHub URL",
        github_url: manualUrl,
        technologies: []
      });
      onNavigate(targetView);
    }
  };

  if (loading) {
    return (
      <MatrixLoader
        title="SCANNING RESUME..."
        subtitle="EXTRACTING PROJECTS WITH GEMINI OCR"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className={`text-2xl md:text-3xl mb-2 flex items-center gap-3 ${isRoast ? 'text-red-500' : 'text-cyan-400'}`}>
          <Code className="w-8 h-8" />
          {isRoast ? 'SELECT PROJECT TO ROAST' : 'SELECT PROJECT TO REWRITE'}
        </h2>
        <p className="text-green-700 text-sm mb-8">
          {isRoast
            ? 'Choose which project you want GitReal to analyze and critique'
            : 'Choose which project you want to update/improve on your resume'}
        </p>

        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedProject(project)}
                className={`card-animate p-4 border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  selectedProject?.name === project.name
                    ? 'border-[#00FF41] bg-[#00FF41]/10 shadow-[0_0_30px_rgba(0,255,65,0.4)] scale-[1.02]'
                    : 'border-[#003300] bg-black hover:border-[#00FF41]/70 hover:bg-[#001100] hover:translate-x-1'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                  selectedProject?.name === project.name ? 'bg-[#00FF41]' : 'bg-transparent group-hover:bg-[#00FF41]/50'
                }`} />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF41]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className="flex justify-between items-start relative z-10">
                  <div className="pl-2">
                    <h3 className={`font-bold text-lg transition-colors ${
                      selectedProject?.name === project.name ? 'text-[#00FF41]' : 'text-[#00FF41]/80 group-hover:text-[#00FF41]'
                    }`}>{project.name}</h3>
                    <p className="text-green-700 text-sm mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#003300] text-green-400 px-2 py-1 rounded hover:bg-[#00FF41]/20 transition-colors cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {project.github_url ? (
                    <span className="text-xs text-green-500 bg-[#001100] px-2 py-1 rounded border border-green-800 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      GitHub ✓
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-600 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-800 flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      No Link
                    </span>
                  )}
                </div>
                {project.github_url && (
                  <p className="text-xs text-green-800 mt-2 truncate pl-2">{project.github_url}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-green-700 card-animate">
              <p>No projects found in resume.</p>
              <p className="text-sm mt-2">Enter a GitHub URL manually below.</p>
            </div>
          )}
        </div>

        <div className="border-t border-[#003300] pt-6 mb-6">
          <label className="text-sm text-green-700 mb-2 block">Or enter GitHub URL manually:</label>
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => {
              setManualUrl(e.target.value);
              setSelectedProject(null);
            }}
            placeholder="https://github.com/username/repo"
            className="w-full bg-[#0a0a0a] border-2 border-[#003300] p-3 text-sm focus:border-[#00FF41] outline-none text-gray-300"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('morpheus')}
            className="flex-1 border-2 border-[#003300] text-green-700 py-3 hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
          >
            ← BACK
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedProject && !manualUrl}
            className={`flex-1 text-black font-bold py-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isRoast
                ? 'bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.5)]'
                : 'bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]'
            }`}
          >
            {isRoast ? 'ROAST THIS PROJECT →' : 'REWRITE THIS PROJECT →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- VIEW 3: DASHBOARD (ROAST) ---
const Dashboard = ({ onNavigate, uploadedFile, selectedProject }: { onNavigate: (view: string) => void, uploadedFile: File | null, selectedProject: Project | null }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!uploadedFile) {
        setData({
          matches: ["No resume uploaded"],
          red_flags: ["Unable to verify"],
          missing_gems: ["Please upload a resume"],
          summary: "No data available."
        });
        return;
      }

      const projectKey = generateProjectKey(selectedProject);
      const cachedResult = getCachedAnalysis(projectKey);
      
      if (cachedResult?.data) {
        setData(cachedResult.data);
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("file", uploadedFile);

      if (selectedProject?.github_url) {
        formData.append("github_url", selectedProject.github_url);
      }
      if (selectedProject?.name) {
        formData.append("project_name", selectedProject.name);
      }

      try {
        const res = await axios.post("http://localhost:8000/analyze", formData);
        const responseData = res.data.data;
        const parsedData = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
        const initialChat = res.data.initial_chat || '';
        setData(parsedData);
        setCachedAnalysis(projectKey, { data: parsedData, initial_chat: initialChat });
      } catch (e) {
        console.error(e);
        setData({
          matches: [],
          red_flags: ["Error analyzing project - Could not verify claims."],
          missing_gems: [],
          summary: "Analysis failed. Try again with a different project."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uploadedFile, selectedProject]);

  if (loading || !data) {
    return (
      <MatrixLoader
        title={`ROASTING: ${selectedProject?.name || "PROJECT"}...`}
        subtitle={selectedProject?.github_url ? `FETCHING FROM GITHUB...` : "ANALYZING RESUME DATA..."}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative z-20">
      <header className="flex justify-between items-center mb-12 border-b border-[#003300] pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('project-select')}
            className="text-xs hover:text-[#00FF41] border border-[#003300] hover:border-[#00FF41] px-3 py-1 transition-colors"
          >
            ← PROJECTS
          </button>
          <h2 className="text-xl md:text-2xl text-[#00FF41] flex items-center gap-3">
            <Lock className="w-5 h-5 animate-pulse" />
            FORENSIC AUDIT: <span className="text-red-500">{selectedProject?.name || "PROJECT"}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <MatrixButton onClick={() => onNavigate('morpheus')} className="text-xs text-[#00FF41] border border-[#003300] px-3 py-1">[ MENU ]</MatrixButton>
          <MatrixButton onClick={() => onNavigate('landing')} variant="danger" className="text-xs text-red-500 border border-red-900 px-3 py-1">[ DISCONNECT ]</MatrixButton>
        </div>
      </header>

      <div className="mb-8 p-6 bg-black border-2 border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.3)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FF41] to-transparent opacity-50 animate-scan-line" />
        </div>

        {data.credibility_score !== undefined && (
          <div className="flex items-center justify-center gap-4 mb-4 relative z-10">
            <span className="text-gray-400 font-mono text-sm tracking-wider">CREDIBILITY SCORE:</span>
            <div className="relative w-48 h-5 bg-gray-800 border border-gray-600 overflow-hidden">
              <div
                className={`h-full transition-all duration-[2000ms] ease-out ${
                  data.credibility_score >= 70 ? 'bg-[#00FF41]' :
                  data.credibility_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${data.credibility_score}%`,
                  boxShadow: data.credibility_score >= 70
                    ? '0 0 20px #00FF41, 0 0 40px #00FF41'
                    : data.credibility_score >= 40
                      ? '0 0 20px #eab308, 0 0 40px #eab308'
                      : '0 0 20px #ef4444, 0 0 40px #ef4444'
                }}
              />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse" style={{ left: `${data.credibility_score}%` }} />
            </div>
            <div className={`font-mono text-3xl font-bold ${
              data.credibility_score >= 70 ? 'text-[#00FF41]' :
              data.credibility_score >= 40 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              <AnimatedCounter target={data.credibility_score} duration={2000} /><span className="text-gray-500">/100</span>
            </div>
          </div>
        )}

        {data.verdict && (
          <div className="text-[#00FF41] font-mono text-center text-lg border-t border-gray-700 pt-4 relative z-10">
            <span className="text-2xl mr-2">⚖️</span>
            <span className="font-bold text-white">VERDICT:</span>{" "}
            <TypewriterText text={data.verdict} speed={25} className="text-[#00FF41]" />
          </div>
        )}

        {!data.verdict && data.summary && (
          <div className="text-[#00FF41] font-mono text-center text-lg relative z-10">
            <span className="text-2xl mr-2">📋</span>
            <span className="font-bold text-white">SUMMARY:</span>{" "}
            <TypewriterText text={data.summary} speed={20} className="text-[#00FF41]" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="hover-card card-animate bg-black border border-[#00FF41] p-6 shadow-[0_0_15px_rgba(0,255,65,0.1)]" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#00FF41]">
            <CheckCircle className="w-5 h-5 animate-pulse" /> VERIFIED SKILLS
          </h3>
          <ul className="space-y-2 text-sm text-green-300/80 font-mono">
            {data.matches?.length > 0 ? data.matches.map((m: string, i: number) => (
              <li key={i} className="list-item-animate flex items-start gap-2 hover:bg-[#00FF41]/10 p-1 transition-colors" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div className="w-2 h-2 bg-[#00FF41] mt-1.5 rounded-full"></div>
                <span>{m}</span>
              </li>
            )) : <li className="text-gray-500">No verified matches found.</li>}
          </ul>
        </div>

        <div className="hover-card card-animate bg-black border-2 border-red-600 p-6 shadow-[0_0_20px_rgba(255,50,50,0.3)]" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500 glitch-anim" data-text="🚩 RED FLAGS">
            <ShieldAlert className="w-5 h-5 animate-bounce" /> 🚩 RED FLAGS
          </h3>
          <ul className="space-y-3 text-sm text-red-300 font-mono">
            {data.red_flags?.length > 0 ? data.red_flags.map((m: string, i: number) => (
              <li key={i} className="list-item-animate flex items-start gap-2 bg-red-900/20 p-2 border-l-2 border-red-500 hover:bg-red-900/40 transition-colors cursor-pointer" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <div className="w-2 h-2 bg-red-500 mt-1.5 rounded-full animate-pulse"></div>
                <span>{m}</span>
              </li>
            )) : <li className="text-green-500">✅ No red flags detected! Clean record.</li>}
          </ul>
        </div>

        <div className="hover-card card-animate bg-black border border-yellow-400 p-6 shadow-[0_0_15px_rgba(255,255,50,0.1)]" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" /> 💎 HIDDEN GEMS
          </h3>
          <ul className="space-y-2 text-sm text-yellow-200/80 font-mono">
            {data.missing_gems?.length > 0 ? data.missing_gems.map((m: string, i: number) => (
              <li key={i} className="list-item-animate flex items-start gap-2 hover:bg-yellow-500/10 p-1 transition-colors" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="w-2 h-2 bg-yellow-500 mt-1.5 rounded-full"></div>
                <span>{m}</span>
              </li>
            )) : <li className="text-gray-500">No hidden gems found.</li>}
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <MatrixButton
          onClick={() => onNavigate('chat')}
          variant="cyan"
          className="relative px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-500 font-bold text-lg flex items-center gap-2"
        >
          <Wifi className="w-5 h-5" />
          REWRITE RESUME
        </MatrixButton>

        <MatrixButton
          onClick={() => onNavigate('voice-interview')}
          variant="danger"
          className="relative px-8 py-4 bg-gradient-to-r from-[#FF1744] to-purple-600 text-white font-bold text-lg flex items-center gap-2"
        >
          <Mic className="w-5 h-5 animate-pulse" />
          🎤 VOICE INTERVIEW
          <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">LIVE</span>
        </MatrixButton>
      </div>
    </div>
  );
};


// --- VIEW 4: S.P.A.R.T.A. LIVE WIRE (Sub-Second Streaming) ---
const VoiceInterview = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [status, setStatus] = useState('SYSTEM READY. AWAITING CONNECTION.');
  const [messages, setMessages] = useState<{type: string, text: string}[]>([]);
  const [isAIActive, setIsAIActive] = useState(false);

  // Streaming Refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const startCall = async () => {
    setIsCallActive(true);
    setStatus('ESTABLISHING WEBSOCKET CONNECTION...');

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass({ sampleRate: 16000 });
      nextPlayTimeRef.current = audioCtxRef.current.currentTime;

      wsRef.current = new WebSocket('ws://localhost:8000/ws/sparta-interview');
      wsRef.current.binaryType = 'arraybuffer';

      wsRef.current.onopen = async () => {
        setStatus('LINK ESTABLISHED. SECURING AUDIO FEED...');
        
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } 
        });

        const source = audioCtxRef.current!.createMediaStreamSource(streamRef.current);
        processorRef.current = audioCtxRef.current!.createScriptProcessor(4096, 1, 1);
        
        processorRef.current.onaudioprocess = (e) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              let s = Math.max(-1, Math.min(1, inputData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            wsRef.current.send(pcm16.buffer); 
          }
        };

        source.connect(processorRef.current);
        processorRef.current.connect(audioCtxRef.current!.destination);
        setStatus('LIVE WIRE ACTIVE. SPEAK NORMALLY.');
      };

      wsRef.current.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          setIsAIActive(true);
          const pcm16 = new Int16Array(event.data);
          const audioBuffer = audioCtxRef.current!.createBuffer(1, pcm16.length, 16000);
          const channelData = audioBuffer.getChannelData(0);
          
          for (let i = 0; i < pcm16.length; i++) {
            channelData[i] = pcm16[i] / 32768.0;
          }
          
          const source = audioCtxRef.current!.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtxRef.current!.destination);
          
          const playTime = Math.max(audioCtxRef.current!.currentTime, nextPlayTimeRef.current);
          source.start(playTime);
          nextPlayTimeRef.current = playTime + audioBuffer.duration;

          source.onended = () => { setIsAIActive(false); };
        } 
        else if (typeof event.data === 'string') {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'transcript') {
              setMessages(prev => [...prev.slice(-4), { type: msg.role, text: msg.text }]);
            } else if (msg.type === 'interruption') {
              nextPlayTimeRef.current = audioCtxRef.current!.currentTime;
            }
          } catch(e) {}
        }
      };

      wsRef.current.onerror = () => {
        setStatus('CONNECTION SEVERED.');
        endCall();
      };

    } catch (e) {
      console.error(e);
      setStatus('HARDWARE OVERRIDE FAILED. CHECK MIC PERMISSIONS.');
      setIsCallActive(false);
    }
  };

  const endCall = () => {
    if (processorRef.current && audioCtxRef.current) {
      processorRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    setIsCallActive(false);
    setIsAIActive(false);
    setStatus('CONNECTION TERMINATED.');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 relative z-20">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-30">
        <button onClick={() => onNavigate('dashboard')} className="text-[#00FF41] hover:text-white transition-colors text-sm font-mono flex items-center gap-2 border border-[#003300] hover:border-[#00FF41] px-3 py-2">
          ← DASHBOARD
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FF1744] glitch-anim mb-2" data-text="🎤 ADVERSARIAL AUDIO LINK">🎤 ADVERSARIAL AUDIO LINK</h1>
        <p className="text-gray-500 text-sm">Real-time Streaming. Prepare to be interrupted.</p>
      </div>

      <div className="w-full max-w-2xl bg-black/80 border-2 border-[#FF1744] rounded-lg p-8 shadow-[0_0_50px_rgba(255,23,68,0.3)]">
        
        <div className="text-center mb-6">
          <div className={`text-lg font-mono ${isCallActive ? 'text-[#00FF41] animate-pulse' : 'text-gray-400'}`}>
            {status}
          </div>
        </div>

        <div className="flex justify-center items-center gap-1 h-16 mb-6">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-2 rounded-full transition-all duration-75 ${
                isAIActive ? 'bg-red-500 shadow-[0_0_10px_red]' : isCallActive ? 'bg-[#00FF41]' : 'bg-gray-700'
              }`}
              style={{ height: isAIActive || isCallActive ? `${Math.random() * 50 + 15}px` : '8px' }}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-6 mt-12">
          {!isCallActive ? (
            <MatrixButton onClick={startCall} variant="danger" className="flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full">
              <Phone className="w-6 h-6" /> INITIATE LINK
            </MatrixButton>
          ) : (
            <button onClick={endCall} className="p-6 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-[0_0_30px_red] animate-pulse">
              <PhoneOff className="w-8 h-8" />
            </button>
          )}
        </div>
        
        {isCallActive && (
          <div className="mt-8 text-center text-xs text-red-500 font-bold tracking-widest animate-pulse">
            MIC IS HOT. SPEAK IMMEDIATELY.
          </div>
        )}
      </div>
    </div>
  );
};

// --- VIEW 5: CHAT (TEXT MODE) ---
const ChatInterface = ({ onNavigate, uploadedFile, mode, selectedProject }: { onNavigate: (view: string) => void, uploadedFile: File | null, mode: string, selectedProject: Project | null }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRepoInput, setShowRepoInput] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [repoLoading, setRepoLoading] = useState(false);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const interviewInitialized = useRef(false);
  const previousMode = useRef(mode);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const loading = typeof window !== 'undefined' ? localStorage.getItem('interview_loading') : null;
    setIsInterviewLoading(loading === 'true');
  }, [messages]);

  useEffect(() => {
    if (previousMode.current !== mode) {
      setMessages([]);
      setInitialized(false);
      interviewInitialized.current = false;
      previousMode.current = mode;
    }
  }, [mode]);

  const chatInitialized = useRef(false);

  useEffect(() => {
    const interviewQuestion = typeof window !== 'undefined' ? localStorage.getItem('interview_intro') : null;
    if (interviewQuestion && !interviewInitialized.current) {
      interviewInitialized.current = true;
      chatInitialized.current = true;
      setInitialized(true);
      setMessages([
        { id: 1, type: 'system', text: '⚠️ DEFENSE MODE INITIATED. INTERROGATION LOGGED.' },
        { id: 2, type: 'ai', text: interviewQuestion }
      ]);
      localStorage.removeItem('interview_intro');
    } else if (uploadedFile && !initialized && !chatInitialized.current && !interviewQuestion && mode === 'chat') {
      chatInitialized.current = true;
      handleInit(uploadedFile, selectedProject?.github_url || "");
    }
  }, [uploadedFile, mode, selectedProject]);

  useEffect(() => {
    const handleStorageChange = () => {
      const interviewQuestion = localStorage.getItem('interview_intro');
      if (interviewQuestion && mode === 'interview' && !interviewInitialized.current) {
        interviewInitialized.current = true;
        setInitialized(true);
        setMessages([
          { id: 1, type: 'system', text: '⚠️ DEFENSE MODE INITIATED. INTERROGATION LOGGED.' },
          { id: 2, type: 'ai', text: interviewQuestion }
        ]);
        localStorage.removeItem('interview_intro');
        localStorage.removeItem('interview_loading');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mode]);

  useEffect(scrollToBottom, [messages]);

  const handleInit = async (file: File, url: string) => {
    if (initialized) return;

    const projectKey = generateProjectKey(selectedProject);
    const projectInfo = selectedProject ? `📁 PROJECT: ${selectedProject.name}` : '';
    const cachedResult = getCachedAnalysis(projectKey);

    if (cachedResult?.initial_chat) {
      setMessages(prev => {
        if (prev.length > 0 && prev.some(m => m.type === 'user')) return prev;
        return [
          { id: 1, type: 'system', text: 'ENCRYPTED CHANNEL ESTABLISHED.' },
          ...(projectInfo ? [{ id: 1.5, type: 'system', text: projectInfo }] : []),
          { id: 2, type: 'system', text: '⚡ CACHED DATA LOADED.' },
          { id: 3, type: 'ai', text: cachedResult.initial_chat }
        ];
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("github_url", url);
        await axios.post("http://localhost:8000/analyze", formData);
      } catch (e) {}

      setInitialized(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("github_url", url);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData);
      setInitialized(true);
      const starAnalysis = res.data.initial_chat || "Analysis complete.";
      const responseData = res.data.data;
      const parsedData = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;

      setCachedAnalysis(projectKey, { data: parsedData, initial_chat: starAnalysis });

      setMessages(prev => {
        if (prev.length > 0 && prev.some(m => m.type === 'user')) return prev;
        return [
          { id: 1, type: 'system', text: 'ENCRYPTED CHANNEL ESTABLISHED.' },
          ...(projectInfo ? [{ id: 1.5, type: 'system', text: projectInfo }] : []),
          { id: 2, type: 'system', text: 'ASSETS ANALYZED. MEMORY LOADED.' },
          { id: 3, type: 'ai', text: starAnalysis }
        ];
      });
    } catch (e: any) {
      setMessages(prev => [...prev, { id: 3, type: 'system', text: `❌ ERROR: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent | null, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const currentMessages = messagesRef.current;
      const history = currentMessages.filter(m => m.type !== 'system').map(m => ({ type: m.type, text: m.text }));
      const res = await axios.post("http://localhost:8000/chat", {
        message: textToSend,
        history: history
      });
      const aiResponse = res.data.response;
      const aiMsg = { id: Date.now() + 1, type: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now(), type: 'system', text: 'CONNECTION DROPPED. RETRY.' }]);
    } finally {
      setIsTyping(false); 
    }
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    setRepoLoading(true);
    setShowRepoInput(false);
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Scanning Repo: ${newRepoUrl}` }]);

    try {
      const res = await axios.post("http://localhost:8000/add_repo", { github_url: newRepoUrl });
      const bullets = res.data.bullets;
      const msgText = `Extracted Data:\n\n${bullets}\n\nAdd this to 'Projects'?`;
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: msgText }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'system', text: "FAILED TO ACCESS REPO." }]);
    } finally {
      setRepoLoading(false);
      setNewRepoUrl("");
    }
  }

  const handleCompile = async () => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: "COMPILE FINAL ATS DRAFT" }]);
    setMessages(prev => [...prev, { id: Date.now() + 1, type: 'system', text: "COMPILING DATA STREAMS... PLEASE WAIT..." }]);

    try {
      const res = await axios.post("http://localhost:8000/generate_resume");
      const resumeText = res.data.resume;
      setMessages(prev => [...prev, { id: Date.now() + 2, type: 'ai', isResume: true, text: resumeText }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 3, type: 'system', text: "COMPILATION FAILED." }]);
    }
  };

  if (loading && !initialized) {
    return (
      <MatrixLoader
        title={`ANALYZING: ${selectedProject?.name || "PROJECT"}...`}
        subtitle={selectedProject?.github_url ? "FETCHING CODE FROM GITHUB..." : "LOADING RESUME DATA..."}
      />
    );
  }

  return (
    <div className="h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6 relative z-20">
      <div className="w-full md:w-1/2 bg-[#0a0a0a] border border-[#003300] flex flex-col relative overflow-hidden hidden md:flex">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41]/50"></div>
        <div className="bg-[#0f0f0f] p-3 border-b border-[#003300] flex justify-between items-center">
          <span className="text-xs text-[#00FF41] font-mono flex items-center gap-2">
            <Code className="w-4 h-4" /> PROJECT INTEL
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {isInterviewLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MatrixRain opacity={0.3} />
              <div className="text-[#00FF41] text-center space-y-6 relative z-10">
                <div className="text-2xl font-bold animate-pulse">ANALYZING CODE...</div>
                <div className="text-sm opacity-70">GENERATING INTERROGATION PROTOCOL</div>
                <div className="w-48 h-2 bg-[#001100] mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF41] to-transparent animate-[loading-bar_1.5s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {selectedProject && (
                <div className="hover-card border border-[#00FF41]/30 bg-[#001100] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[#00FF41] font-bold text-lg">{selectedProject.name}</h3>
                    {selectedProject.github_url && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        <Github className="w-3 h-3" /> View
                      </a>
                    )}
                  </div>
                  <p className="text-green-700 text-sm mb-3">{selectedProject.description}</p>
                  {selectedProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-[#003300] text-green-400 px-2 py-1 rounded hover:bg-[#00FF41]/20 transition-colors">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border border-yellow-500/30 bg-yellow-900/10 p-4">
                <h4 className="text-yellow-400 font-bold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> QUICK IMPROVEMENT TIPS
                </h4>
                <ul className="space-y-2 text-xs text-yellow-200/80">
                  <li className="flex items-start gap-2 list-item-animate" style={{ animationDelay: '0.1s' }}><span className="text-yellow-500">→</span>Quantify achievements with metrics</li>
                  <li className="flex items-start gap-2 list-item-animate" style={{ animationDelay: '0.2s' }}><span className="text-yellow-500">→</span>Use action verbs: Built, Designed, Implemented</li>
                  <li className="flex items-start gap-2 list-item-animate" style={{ animationDelay: '0.3s' }}><span className="text-yellow-500">→</span>Include tech stack in project descriptions</li>
                  <li className="flex items-start gap-2 list-item-animate" style={{ animationDelay: '0.4s' }}><span className="text-yellow-500">→</span>Add GitHub links to verify claims</li>
                </ul>
              </div>

              <div className="border border-cyan-500/30 bg-cyan-900/10 p-4">
                <h4 className="text-cyan-400 font-bold text-sm mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4" /> ATS POWER KEYWORDS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Agile', 'CI/CD', 'REST API', 'Microservices', 'Cloud', 'Docker', 'Git', 'Testing'].map((keyword, i) => (
                    <span key={i} className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded border border-cyan-700/30 hover:bg-cyan-500/20 cursor-pointer transition-colors" onClick={() => navigator.clipboard.writeText(keyword)}>{keyword}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent animate-scan-line"></div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col border border-[#00FF41] bg-black/90 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        {showRepoInput && (
          <div className="absolute bottom-20 left-4 right-4 bg-black border border-[#00FF41] p-4 shadow-[0_0_20px_rgba(0,255,65,0.2)] z-50 animate-fade-in">
            <div className="text-xs text-[#00FF41] mb-2 font-bold">PASTE REPOSITORY LINK:</div>
            <form onSubmit={handleAddRepo} className="flex gap-2">
              <input type="text" value={newRepoUrl} onChange={(e) => setNewRepoUrl(e.target.value)} placeholder="https://github.com/..." className="flex-1 bg-[#0a0a0a] border border-[#003300] p-2 text-sm text-white focus:border-[#00FF41] outline-none" autoFocus />
              <button type="submit" className="bg-[#003300] text-[#00FF41] px-4 py-2 text-xs hover:bg-[#00FF41] hover:text-black transition-colors">{repoLoading ? "SCANNING..." : "SCAN"}</button>
              <button type="button" onClick={() => setShowRepoInput(false)} className="text-red-500 text-xs px-2">X</button>
            </form>
          </div>
        )}

        <div className="p-4 border-b border-[#00FF41] flex justify-between items-center bg-[#001100]">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('project-select')} className="text-xs hover:text-[#00FF41] border border-[#003300] hover:border-[#00FF41] px-2 py-1 transition-colors">← PROJECTS</button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
              <span className="text-sm font-bold tracking-widest">{mode === 'interview' ? 'INTERVIEW MODE' : 'REWRITE MODE'}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onNavigate('dashboard')} className="text-xs hover:text-[#00FF41] transition-colors border border-[#003300] hover:border-[#00FF41] px-2 py-1">[ DASHBOARD ]</button>
            <button onClick={() => onNavigate('morpheus')} className="text-xs hover:text-[#00FF41] border border-[#003300] hover:border-[#00FF41] px-2 py-1 transition-colors">[ MENU ]</button>
            <button onClick={() => onNavigate('landing')} className="text-xs text-red-500 hover:text-white border border-red-900 hover:border-red-500 px-2 py-1 transition-colors">[ EXIT ]</button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[95%] p-4 ${msg.type === 'user'
                ? 'border border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : msg.isResume
                  ? 'bg-white text-black font-sans border-4 border-green-500 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                  : msg.type === 'system'
                    ? 'border-none text-gray-500 italic text-xs w-full text-center'
                    : 'border-[#00FF41] text-[#00FF41] bg-[#001100]'
                }`}>
                {!msg.isResume && (
                  <span className="font-bold opacity-50 mr-2 block mb-2">
                    {msg.type === 'user' ? '> USER' : msg.type === 'ai' ? '> GITREAL' : ''}
                  </span>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[95%] p-4 border border-[#00FF41] bg-[#001100]">
                <span className="font-bold opacity-50 mr-2 block mb-2">&gt; GITREAL</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#00FF41]">PROCESSING</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#00FF41] bg-black">
          <form onSubmit={(e) => handleSend(e)} className="flex gap-2 items-center">
            <ChevronRight className="w-5 h-5 text-[#00FF41]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command..."
              className="flex-1 bg-transparent border-none outline-none text-[#00FF41] placeholder-green-900 font-mono h-10"
              autoFocus
            />
            <button type="submit" className="text-[#00FF41] hover:text-white">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [enableEffects, setEnableEffects] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMode, setSelectedMode] = useState<'roast' | 'rewrite'>('roast');
  const [cachedProjects, setCachedProjectsState] = useState<Project[] | null>(null);
  const [currentFileKey, setCurrentFileKey] = useState<string>('');
  const [gateError, setGateError] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [validatingFile, setValidatingFile] = useState(false);

  const getGateErrorMessage = (aiReason: string) => {
    const reasonLower = aiReason.toLowerCase();
    if (reasonLower.includes('menu') || reasonLower.includes('food') || reasonLower.includes('restaurant')) return { title: '🍕 WRONG PILL DETECTED', message: `Morpheus ordered a Resume, not a menu.\n\n"${aiReason}"\n\nUpload your actual Resume/CV.` };
    if (reasonLower.includes('job description') || reasonLower.includes('job posting') || reasonLower.includes('hiring')) return { title: '🔄 WRONG SIDE, NEO', message: `This is a Job Description, not YOUR resume.\n\n"${aiReason}"\n\nWe need YOUR skills, not the employer's wishlist.` };
    if (reasonLower.includes('invoice') || reasonLower.includes('receipt') || reasonLower.includes('bill')) return { title: '💰 WRONG DOCUMENT', message: `This looks like a financial document.\n\n"${aiReason}"\n\nUpload your Resume, not your expenses.` };
    if (reasonLower.includes('book') || reasonLower.includes('article') || reasonLower.includes('story')) return { title: '📚 NICE TRY, NEO', message: `This appears to be a book or article.\n\n"${aiReason}"\n\nMorpheus needs your RESUME.` };
    return { title: '🔴 INVALID DOCUMENT', message: `This doesn't look like a Resume/CV.\n\n"${aiReason}"\n\nPlease upload a valid Resume.` };
  };

  const handleUploadComplete = async (file: File) => {
    const newFileKey = generateFileKey(file);

    if (currentFileKey && currentFileKey !== newFileKey) {
      clearProjectCaches();
      setCachedProjectsState(null);
    }

    const cached = getCachedProjects(newFileKey);
    if (cached) {
      setCachedProjectsState(cached);
      setCurrentFileKey(newFileKey);
      setUploadedFile(file);
      setCurrentView('morpheus');
      return;
    }

    setValidatingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/validate_resume", formData);

      if (!res.data.valid) {
        const errorMsg = getGateErrorMessage(res.data.reason);
        setGateError({ show: true, ...errorMsg });
        setValidatingFile(false);
        return; 
      }
    } catch (e: any) {
      const reason = e.response?.data?.reason || 'Failed to validate document';
      const errorMsg = getGateErrorMessage(reason);
      setGateError({ show: true, ...errorMsg });
      setValidatingFile(false);
      return;
    }
    setValidatingFile(false);
    setCurrentFileKey(newFileKey);
    setUploadedFile(file);
    setCurrentView('morpheus');
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectsExtracted = (projects: Project[]) => {
    if (currentFileKey) {
      setCachedProjects(currentFileKey, projects);
      setCachedProjectsState(projects);
    }
  };

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      setSelectedMode('roast');
      setCurrentView('project-select');
    } else if (view === 'chat') {
      setSelectedMode('rewrite');
      setCurrentView('project-select');
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black ${enableEffects ? 'crt-flicker' : ''}`}>
      <style>{customStyles}</style>

      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      {enableEffects && <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>}

      <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
        <button
          onClick={() => {
            clearProjectCaches();
            setCachedProjectsState(null);
            const toast = document.createElement('div');
            toast.className = 'fixed top-16 right-4 bg-[#00FF41] text-black px-4 py-2 text-xs font-bold z-[100] animate-slide-up-fade';
            toast.textContent = '🗑️ CACHE PURGED';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
          }}
          className="text-xs flex items-center gap-2 border border-red-900 px-2 py-1 hover:border-red-500 hover:text-red-500 transition-colors text-red-900"
        >
          <Trash2 className="w-3 h-3" /> CLEAR CACHE
        </button>

        <button onClick={() => setEnableEffects(!enableEffects)} className="text-xs flex items-center gap-2 border border-[#003300] px-2 py-1 hover:border-[#00FF41] hover:text-[#00FF41] transition-colors text-[#003300]">
          {enableEffects ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {enableEffects ? 'DISABLE FX' : 'ENABLE FX'}
        </button>
      </div>

      {gateError.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="animate-error-glitch relative max-w-md w-full mx-4 border-2 border-red-500 bg-black/95 p-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)' }} />
            <div className="absolute left-0 right-0 h-[2px] bg-red-500/50 pointer-events-none" style={{ animation: 'scanlineError 3s linear infinite' }} />

            <div className="relative z-10">
              <h3 className="text-red-500 text-xl font-bold mb-4 tracking-wider" style={{ textShadow: '0 0 10px rgba(255,0,0,0.5)' }}>{gateError.title}</h3>
              <p className="text-red-400 text-sm leading-relaxed whitespace-pre-line mb-6 font-mono">{gateError.message}</p>
              <button onClick={() => setGateError({ show: false, title: '', message: '' })} className="w-full py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 font-bold tracking-wider">
                ↩ TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10">
        {currentView === 'landing' && <UploadLanding onUploadComplete={handleUploadComplete} isValidating={validatingFile} />}
        {currentView === 'morpheus' && <MorpheusChoice onNavigate={setCurrentView} onModeSelect={setSelectedMode} />}
        {currentView === 'project-select' && (
          <ProjectSelection
            onNavigate={setCurrentView}
            uploadedFile={uploadedFile}
            onProjectSelect={handleProjectSelect}
            mode={selectedMode}
            cachedProjects={cachedProjects}
            onProjectsExtracted={handleProjectsExtracted}
          />
        )}
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} uploadedFile={uploadedFile} selectedProject={selectedProject} />}
        {currentView === 'voice-interview' && <VoiceInterview onNavigate={setCurrentView} />}
        {(currentView === 'chat' || currentView === 'interview') && <ChatInterface onNavigate={setCurrentView} uploadedFile={uploadedFile} mode={currentView} selectedProject={selectedProject} />}
      </main>
    </div>
  );
}