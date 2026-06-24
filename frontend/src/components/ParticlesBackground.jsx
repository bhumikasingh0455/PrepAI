import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '../context/ThemeContext';

const initFn = async (engine) => {
  await loadSlim(engine);
};

const ParticlesBackgroundComponent = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  const particlesLoaded = useCallback(async (container) => {
    containerRef.current = container;
    // Initial color application based on the current theme
    updateThemeColors(container, theme);
  }, []);

  const updateThemeColors = (container, currentTheme) => {
    const colors = currentTheme === 'dark' 
      ? ['#38bdf8', '#8b5cf6', '#a78bfa', '#0ea5e9'] 
      : ['#4f46e5', '#6366f1', '#4338ca', '#0ea5e9'];
    
    // Update options directly for newly spawned particles
    if (container.options?.particles?.color) {
      container.options.particles.color.value = colors;
    }
    
    // Update links color
    if (container.options?.particles?.links) {
      container.options.particles.links.color = currentTheme === 'dark' ? '#8b5cf6' : '#6366f1';
      container.options.particles.links.opacity = currentTheme === 'dark' ? 0.08 : 0.18;
    }
    
    // Update grab line color
    if (container.options?.interactivity?.modes?.grab?.links) {
      container.options.interactivity.modes.grab.links.color = currentTheme === 'dark' ? '#0ea5e9' : '#4f46e5';
      container.options.interactivity.modes.grab.links.opacity = currentTheme === 'dark' ? 0.35 : 0.45;
    }

    // Safely update already active particles' colors
    if (container.particles && typeof container.particles.filter === 'function') {
      const activeParticles = container.particles.filter(() => true);
      activeParticles.forEach((particle, idx) => {
        try {
          const colorHex = colors[idx % colors.length];
          const r = parseInt(colorHex.slice(1, 3), 16);
          const g = parseInt(colorHex.slice(3, 5), 16);
          const b = parseInt(colorHex.slice(5, 7), 16);
          
          if (particle.color) {
            if (particle.color.value) {
              particle.color.value.rgb = { r, g, b };
            } else {
              particle.color.value = { rgb: { r, g, b } };
            }
          }
        } catch (err) {
          // Silent catch to prevent errors if internal structure differs
        }
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      updateThemeColors(container, theme);
    }
  }, [theme]);

  const options = useMemo(() => ({
    fullScreen: {
      enable: false, // Sizing controlled via wrapper div
    },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60, // Target 60 FPS for performance
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 0.2,
            color: "rgba(148, 163, 184, 0.4)",
          },
        },
      },
    },
    particles: {
      color: {
        value: ['#38bdf8', '#8b5cf6', '#a78bfa', '#0ea5e9'], // default dark colors on first mount
      },
      links: {
        color: '#8b5cf6',
        distance: 110,
        enable: true,
        opacity: 0.08,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.6, // Elegant and minimal smooth floating movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 100, // Increased density for premium visual richness
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2.5 },
        animation: {
          enable: true,
          speed: 1.2,
          sync: false,
        },
      },
    },
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 30, // Optimized mobile density
            },
            links: {
              enable: false, // Disable connecting lines on mobile
            },
          },
        },
      },
    ],
    detectRetina: true,
  }), []); // Empty deps array means options object reference is stable, preventing canvas resets

  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
      <ParticlesProvider init={initFn}>
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          className="w-full h-full"
        />
      </ParticlesProvider>
    </div>
  );
};

export const ParticlesBackground = React.memo(ParticlesBackgroundComponent);

