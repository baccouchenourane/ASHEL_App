import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 200);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => onFinish?.(), 2600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div style={styles.container(phase)}>

      {/* Cercles décoratifs */}
      <div style={styles.circleTopRight} />
      <div style={styles.circleBottomLeft} />

      {/* Contenu centré */}
      <div style={styles.content(phase)}>

        {/* Logo — mixBlendMode:screen supprime le fond blanc du PNG */}
        <img
          src="/logo_ashel.png"
          alt="ASHEL"
          style={styles.logo}
        />

        <p style={styles.appName}>ASHEL</p>
        <p style={styles.tagline}>DAILY SERVICES. SIMPLIFIED.</p>
      </div>

      {/* Barre de progression */}
      <div style={styles.loaderTrack}>
        <div style={styles.loaderFill(phase)} />
      </div>
    </div>
  );
}

const BLUE = "#0A5CB8";
const TEAL = "#2D8A8A";

const styles = {
  container: (phase) => ({
    position: "fixed",
    inset: 0,
    background: `linear-gradient(150deg, ${BLUE} 0%, ${TEAL} 100%)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    overflow: "hidden",
    opacity: phase === "exit" ? 0 : 1,
    transition: phase === "exit" ? "opacity 0.6s ease" : "none",
  }),

  circleTopRight: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    top: -90,
    right: -70,
    pointerEvents: "none",
  },

  circleBottomLeft: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    bottom: 40,
    left: -70,
    pointerEvents: "none",
  },

  content: (phase) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    opacity: phase === "enter" ? 0 : 1,
    transform: phase === "enter" ? "translateY(24px) scale(0.95)" : "translateY(0) scale(1)",
    transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.4,0.64,1)",
  }),

  logo: {
    width: 170,
    height: 170,
    objectFit: "contain",
    // supprime visuellement le fond blanc du PNG sur fond coloré
    mixBlendMode: "screen",
    filter: "brightness(1.05) contrast(1.1)",
    marginBottom: 10,
  },

  appName: {
    margin: 0,
    color: "#ffffff",
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: 7,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    textShadow: "0 2px 20px rgba(0,0,0,0.15)",
  },

  tagline: {
    margin: "7px 0 0 0",
    color: "rgba(255,255,255,0.68)",
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  loaderTrack: {
    position: "absolute",
    bottom: 52,
    width: 140,
    height: 3,
    background: "rgba(255,255,255,0.18)",
    borderRadius: 99,
    overflow: "hidden",
  },

  loaderFill: (phase) => ({
    height: "100%",
    background: "rgba(255,255,255,0.9)",
    borderRadius: 99,
    width: phase === "enter" ? "0%" : phase === "hold" ? "65%" : "100%",
    transition:
      phase === "hold" ? "width 1.8s ease" :
      phase === "exit" ? "width 0.5s ease" : "none",
  }),
};