'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [step, setStep] = useState("start");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [detail, setDetail] = useState("");

  const [roast, setRoast] = useState("");
  const [displayedRoast, setDisplayedRoast] = useState("");

  const [error, setError] = useState("");
  const [loadingText, setLoadingText] = useState("");

  const loadingMessages = [
    "SCANNING FOR WEAKNESSES...",
    "CONSULTING THE ARCADE OF SHAME...",
    "SUMMONING A MEAN COMEDIAN...",
    "GENERATING PUBLIC HUMILIATION...",
    "TARGET LOCKED..."
  ];

  function resetKiosk() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDetail("");
    setRoast("");
    setDisplayedRoast("");
    setError("");
    setLoadingText("");
    setStep("start");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  useEffect(() => {
    let timer;

    if (step === "result") {
      timer = setTimeout(() => {
        resetKiosk();
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    let timer;

    if (step === "form") {
      timer = setTimeout(() => {
        resetKiosk();
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [step, firstName, lastName, email, detail]);

  useEffect(() => {
    if (step !== "result" || !roast) return;

    setDisplayedRoast("");
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setDisplayedRoast(roast.slice(0, index));

      if (index >= roast.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [step, roast]);

  async function getRoast() {
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("ENTER FIRST NAME, LAST NAME, AND EMAIL.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("ENTER A VALID EMAIL ADDRESS.");
      return;
    }

    setLoadingText(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );

    setStep("loading");

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          detail
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setTimeout(() => {
        setRoast(data.roast);
        setStep("result");
      }, 1400);

    } catch (err) {
      setError("SYSTEM ERROR. TRY AGAIN.");
      setStep("form");
    }
  }

  const styles = {
    main: {
      minHeight: "100vh",
      background: `
        radial-gradient(circle at 50% 20%, rgba(255,0,153,.18), transparent 22%),
        radial-gradient(circle at 20% 80%, rgba(0,255,255,.12), transparent 25%),
        radial-gradient(circle at 80% 70%, rgba(255,255,0,.10), transparent 20%),
        linear-gradient(180deg, #09030f 0%, #12051b 35%, #05060b 100%)
      `,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: '"Arial Black", "Trebuchet MS", Arial, sans-serif',
      overflow: "hidden",
      position: "relative"
    },

    scanlines: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,255,255,.035) 0px, rgba(255,255,255,0) 2px)",
      backgroundSize: "100% 6px",
      opacity: 0.22
    },

    crtFlicker: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "rgba(255,255,255,.03)",
      mixBlendMode: "soft-light",
      animation: "crtFlicker 0.18s infinite alternate"
    },

    cabinet: {
      width: "100%",
      maxWidth: "860px",
      minHeight: "620px",
      borderRadius: "28px",
      border: "4px solid rgba(255,255,255,.12)",
      background: "linear-gradient(180deg, rgba(20,15,35,.94), rgba(10,8,20,.96))",
      boxShadow: `
        0 0 20px rgba(255,0,128,.25),
        0 0 50px rgba(0,255,255,.12),
        inset 0 0 25px rgba(255,255,255,.04)
      `,
      padding: "30px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative"
    },

    bezel: {
      width: "100%",
      minHeight: "560px",
      borderRadius: "22px",
      border: "3px solid rgba(0,255,255,.35)",
      boxShadow: "inset 0 0 22px rgba(0,255,255,.12), 0 0 18px rgba(255,0,153,.18)",
      background: "linear-gradient(180deg, rgba(4,10,18,.96), rgba(8,4,18,.98))",
      padding: "30px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    },

    cabinetGlowRing: {
      position: "absolute",
      inset: "-6px",
      borderRadius: "34px",
      pointerEvents: "none",
      border: "3px solid transparent",
      boxShadow: `
        0 0 14px rgba(255,0,140,.35),
        0 0 30px rgba(0,255,255,.20),
        0 0 44px rgba(255,230,0,.12)
      `,
      animation: "cabinetPulse 8s linear infinite"
    },

    bezelGlowRing: {
      position: "absolute",
      inset: "8px",
      borderRadius: "26px",
      pointerEvents: "none",
      border: "2px solid rgba(255,255,255,.06)",
      boxShadow: `
        inset 0 0 12px rgba(255,255,255,.04),
        0 0 18px rgba(255,0,140,.18)
      `,
      animation: "bezelPulse 6s linear infinite"
    },

    screen: {
      width: "100%",
      maxWidth: "720px",
      position: "relative",
      zIndex: 2
    },

    title: {
      fontSize: "clamp(48px, 8vw, 92px)",
      letterSpacing: "4px",
      lineHeight: 0.95,
      marginBottom: "16px",
      color: "#ffe600",
      textShadow: `
        0 0 8px rgba(255,230,0,.85),
        0 0 18px rgba(255,120,0,.65),
        0 0 34px rgba(255,0,140,.35)
      `
    },

    blinkingStart: {
      fontSize: "26px",
      color: "#ff3b3b",
      letterSpacing: "3px",
      marginTop: "16px",
      animation: "blinkStart 1s steps(2, start) infinite"
    },

    button: {
      marginTop: "18px",
      fontSize: "30px",
      fontWeight: "900",
      letterSpacing: "2px",
      padding: "18px 40px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(180deg, #ff4db8 0%, #ff2d55 45%, #b1003d 100%)",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 0 16px rgba(255,0,140,.45)",
      animation: "buttonGlow 1.8s ease-in-out infinite"
    },

    panel: {
      margin: "24px auto 0",
      padding: "20px",
      borderRadius: "18px",
      border: "2px solid rgba(255,0,153,.35)",
      background: "rgba(255,255,255,.03)",
      position: "relative"
    },

    backRow: {
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: "10px"
    },

    backButton: {
      fontSize: "14px",
      padding: "8px 14px",
      borderRadius: "10px",
      border: "1px solid rgba(0,255,255,.4)",
      background: "rgba(0,0,0,.45)",
      color: "#7df9ff",
      cursor: "pointer",
      fontWeight: "900",
      letterSpacing: "1px"
    },

    input: {
      width: "100%",
      padding: "18px",
      fontSize: "20px",
      margin: "10px 0",
      borderRadius: "14px",
      border: "2px solid rgba(0,255,255,.35)",
      background: "rgba(0,0,0,.45)",
      color: "#fff",
      boxSizing: "border-box"
    },

    roast: {
      fontSize: "clamp(28px, 4vw, 44px)",
      lineHeight: 1.35,
      minHeight: "140px"
    },

    loading: {
      fontSize: "clamp(24px, 4vw, 42px)",
      color: "#7df9ff",
      letterSpacing: "2px",
      textShadow: "0 0 14px rgba(0,255,255,.25)"
    },

    error: {
      color: "#ff7d7d",
      marginTop: "8px",
      fontSize: "15px",
      letterSpacing: "1px"
    }
  };

  return (
    <main style={styles.main}>
      <style>{`
        @keyframes blinkStart {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.2; }
        }

        @keyframes buttonGlow {
          0% { box-shadow: 0 0 10px rgba(255,0,140,.30); }
          50% { box-shadow: 0 0 22px rgba(255,0,140,.55); }
          100% { box-shadow: 0 0 10px rgba(255,0,140,.30); }
        }

        @keyframes crtFlicker {
          0% { opacity: 0.04; }
          100% { opacity: 0.11; }
        }

        @keyframes cabinetPulse {
          0% {
            box-shadow:
              0 0 14px rgba(255,0,140,.30),
              0 0 30px rgba(0,255,255,.12),
              0 0 44px rgba(255,230,0,.10);
            filter: hue-rotate(0deg);
          }
          25% {
            box-shadow:
              0 0 18px rgba(0,255,255,.34),
              0 0 34px rgba(255,230,0,.16),
              0 0 52px rgba(255,0,140,.16);
            filter: hue-rotate(45deg);
          }
          50% {
            box-shadow:
              0 0 16px rgba(255,230,0,.28),
              0 0 32px rgba(255,0,140,.18),
              0 0 50px rgba(0,255,255,.14);
            filter: hue-rotate(90deg);
          }
          75% {
            box-shadow:
              0 0 18px rgba(255,0,140,.34),
              0 0 36px rgba(0,255,255,.16),
              0 0 54px rgba(255,230,0,.12);
            filter: hue-rotate(135deg);
          }
          100% {
            box-shadow:
              0 0 14px rgba(255,0,140,.30),
              0 0 30px rgba(0,255,255,.12),
              0 0 44px rgba(255,230,0,.10);
            filter: hue-rotate(180deg);
          }
        }

        @keyframes bezelPulse {
          0% {
            box-shadow:
              inset 0 0 12px rgba(255,255,255,.04),
              0 0 16px rgba(255,0,140,.12);
            filter: hue-rotate(0deg);
          }
          50% {
            box-shadow:
              inset 0 0 14px rgba(255,255,255,.05),
              0 0 24px rgba(0,255,255,.18);
            filter: hue-rotate(90deg);
          }
          100% {
            box-shadow:
              inset 0 0 12px rgba(255,255,255,.04),
              0 0 16px rgba(255,230,0,.12);
            filter: hue-rotate(180deg);
          }
        }
      `}</style>

      <div style={styles.scanlines}></div>

      <div style={styles.cabinet}>
        <div style={styles.cabinetGlowRing}></div>

        <div style={styles.bezel}>
          <div style={styles.crtFlicker}></div>
          <div style={styles.bezelGlowRing}></div>

          <div style={styles.screen}>
            {step === "start" && (
              <div>
                <div style={styles.title}>
                  GET<br />ROASTED
                </div>

                <button
                  onClick={() => setStep("form")}
                  style={styles.button}
                >
                  START
                </button>

                <div style={styles.blinkingStart}>
                  PRESS START
                </div>
              </div>
            )}

            {step === "form" && (
              <div style={styles.panel}>
                <div style={styles.backRow}>
                  <button
                    onClick={resetKiosk}
                    style={styles.backButton}
                  >
                    ← BACK
                  </button>
                </div>

                <input
                  placeholder="FIRST NAME"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="LAST NAME"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="Tell me about yourself."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  style={styles.input}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button
                  onClick={getRoast}
                  style={styles.button}
                >
                  ROAST ME
                </button>
              </div>
            )}

            {step === "loading" && (
              <h1 style={styles.loading}>{loadingText}</h1>
            )}

            {step === "result" && (
              <div style={styles.roast}>
                {displayedRoast}
                <span>|</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}