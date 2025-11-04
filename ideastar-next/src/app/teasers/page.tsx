"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 0,
    subtitle: "Welcome to Idea Star!",
  },
  {
    id: 1,
    subtitle:
      "Track the scalability of your ideas and monitor the success rate of your projects effortlessly with Idea Star",
  },
  {
    id: 2,
    subtitle:
      "Idea Star offers the best features to help you test the success rate of your project using AI (Capella) and provides valuable insights to guide your decision-making.",
  },
];

export default function Teasers() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, []);
  useEffect(() => {
    if (index === slides.length - 1) {
      stopInterval();
    } else {
      startInterval();
    }
  }, [index]);

  const startInterval = () => {
    if (intervalRef.current != null) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((s) => {
        if (s + 1 >= slides.length - 1) {
          stopInterval();
          return slides.length - 1;
        }
        return s + 1;
      });
    }, 2000);
  };

  const stopInterval = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goTo = (i: number) => {
    setIndex(i);
  };

  const next = () =>
    setIndex((s) => Math.min(s + 1, slides.length - 1)); 
  const prev = () => setIndex((s) => Math.max(s - 1, 0)); 

  const inknutStyle: React.CSSProperties = {
    fontFamily: "var(--font-inknut, 'Inknut Antiqua'), serif",
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Lamp.jpg"
          alt="Lamp background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(47,90,43,0.5), rgba(47,90,43,0.5))",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-2 border-[#111111] z-30" />
      <div className="relative z-40 flex items-center justify-center h-full px-6">
        <div className="w-full max-w-4xl relative">
          <div className="relative h-[420px] flex items-center justify-center">
            {slides.map((s, i) => {
              const isActive = i === index;
              return (
                <section
                  key={s.id}
                  aria-hidden={!isActive}
                  className={`absolute left-0 right-0 mx-auto w-full max-w-[900px] px-4 pt-70
                    transition-transform transition-opacity duration-700
                    will-change-transform
                  `}
                  style={{
                    transform: isActive ? "translateY(0px)" : "translateY(12px)",
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 20 : 10,
                  }}
                >
                  <div className="mx-auto bg-[#efefef]/98 rounded-2xl px-10 py-10 text-center shadow-sm">
                    <div className="flex justify-center">
                      <img
                        src="/images/idea.svg"
                        alt="Idea Star"
                        className="w-[320px] h-auto"
                      />
                    </div>

                    <p
                      className="mt-6 text-[#c9860a] text-lg leading-relaxed max-w-3xl mx-auto"
                      style={inknutStyle}
                    >
                      {s.subtitle}
                    </p>
                    {i === 2 && isActive && (
                      <div className="mt-8 flex justify-center">
                        <Link
                          href="/signup-page"
                          aria-label="Go to next page"
                          className="text-white font-medium"
                          style={{
                            backgroundColor: "#2F5A2B",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            display: "inline-block",
                            minWidth: "120px",
                            textAlign: "center",
                          }}
                        >
                          Next
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          <div className="mt-90 flex items-center justify-center gap-4">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={
                  "w-3.5 h-3.5 rounded-full focus:outline-none transition-transform " +
                  (i === index
                    ? "bg-[#c9860a] shadow-md scale-105"
                    : "bg-white/95 ring-0")
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div className="sr-only" aria-hidden>
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
      <style jsx>{`
        /* stronger easing for smoother motion */
        section {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </main>
  );
}