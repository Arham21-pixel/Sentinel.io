import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        className
      )}
    >
      {/* Animated Beams */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <g clipPath="url(#clip)">
          <g opacity="0.5">
            <circle
              cx="100"
              cy="100"
              r="10"
              fill="url(#gradient)"
              className="animate-pulse"
            />
            <circle
              cx="300"
              cy="300"
              r="10"
              fill="url(#gradient)"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />
            <circle
              cx="200"
              cy="200"
              r="10"
              fill="url(#gradient)"
              className="animate-pulse"
              style={{ animationDelay: "4s" }}
            />
          </g>
          <g opacity="0.8">
            <path
              d="m249.645 25.8073c.87.8799 1.425 2.0774 1.425 3.3077v8.8845c0 1.2303-.555 2.4278-1.425 3.3077-.87.8799-2.074 1.425-3.307 1.425h-8.885c-1.2303 0-2.4278-.5451-3.3077-1.425-.8799-.8799-1.425-2.0774-1.425-3.3077v-8.8845c0-1.2303.5451-2.4278 1.425-3.3077.8799-.8799 2.0774-1.425 3.3077-1.425h8.885c1.233 0 2.437.5451 3.307 1.425z"
              fill="url(#gradient)"
              className="animate-pulse"
            />
          </g>
        </g>
        <defs>
          <radialGradient
            id="gradient"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(200 200) rotate(90) scale(200)"
          >
            <stop stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="0.5" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="1" stopColor="#6366F1" stopOpacity="0.1" />
          </radialGradient>
          <clipPath id="clip">
            <rect width="400" height="400" />
          </clipPath>
        </defs>
      </svg>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive Light Beams */}
      <div
        className="absolute w-96 h-96 opacity-30 pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)`,
          transition: "all 0.3s ease",
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated Beams */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
