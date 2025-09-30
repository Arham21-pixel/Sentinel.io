import React, { useState, useRef } from "react";
import { cn } from "../lib/utils";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: any;
  duration?: number;
  clockwise?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  const updateGradientPosition = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={updateGradientPosition}
      ref={ref}
      className={cn(
        "relative flex rounded-2xl border content-center bg-slate-800/30 backdrop-blur border-slate-700/50 hover:bg-slate-800/50 transition duration-500 dark:bg-black/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 z-0 flex-none rounded-2xl",
          hovered &&
            "bg-gradient-conic from-blue-500 via-purple-500 to-indigo-500 opacity-75 blur-sm"
        )}
        style={{
          background: hovered
            ? `conic-gradient(from 0deg at var(--mouse-x, 50%) var(--mouse-y, 50%), #3b82f6, #8b5cf6, #6366f1, #3b82f6)`
            : undefined,
          animation: hovered
            ? `spin ${duration}s linear infinite ${clockwise ? "" : "reverse"}`
            : undefined,
        }}
      />
    </Tag>
  );
};
