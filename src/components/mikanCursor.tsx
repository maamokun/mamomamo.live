"use client";
import { useEffect, useRef } from "react";
import Mikan from "@/assets/mikan.png";
import Image from "next/image";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a global style to hide cursor on all elements
    const styleElement = document.createElement("style");
    styleElement.id = "custom-cursor-style";
    styleElement.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleElement);

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Use requestAnimationFrame for smooth rendering without flickering
        requestAnimationFrame(() => {
          if (cursorRef.current) {
            // Center the cursor on the mouse position
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
          }
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Remove the global cursor style
      const style = document.getElementById("custom-cursor-style");
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: 0,
        top: 0,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Image
        src={Mikan}
        alt="Custom Cursor"
        className="w-8 h-8"
        width={32}
        height={32}
        priority
        draggable={false}
      />
    </div>
  );
}
