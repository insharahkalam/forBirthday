import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import yesGif from "./assets/yes.gif"
import hug from "./assets/hug.gif"
import hamza from "./assets/hamza.png"
// import photo1 from "./assets/photos/photo1"
import photo2 from "./assets/photos/photo2.jpeg"
// import photo3 from "./assets/photos/photo3"
import photo4 from "./assets/photos/photo4.jpeg"

function ThemeStyles() {
  return (
    <style>{`
      :root {
        --peach: #C7B7A3;
        --light-peach: #E8D8C4;
        --pink: #6D2932;
        --dark-pink: #561C24;
        --cream: #E8D8C4;
        --brown: #561C24;
      }
      @keyframes floatUp {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-110vh) translateX(10px); opacity: 0; }
      }
      @keyframes riseUp {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
      }
      @keyframes shakeX {
        10%, 90% { transform: translateX(-2px); }
        20%, 80% { transform: translateX(4px); }
        30%, 50%, 70% { transform: translateX(-8px); }
        40%, 60% { transform: translateX(8px); }
      }
      @keyframes popIn {
        0% { transform: scale(0.3); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  );
}

// ---------------------------------------------------------------
// PRESSABLE SCALE — press feedback wrapper
// ---------------------------------------------------------------
function PressableScale({ children, onTap, className = "", style }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className={`cursor-pointer select-none touch-manipulation transition-transform duration-150 ease-out ${pressed ? "scale-95" : "scale-100"
        } ${className}`}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => {
        setPressed(false);
        onTap && onTap();
      }}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={(e) => {
        e.preventDefault(); // stops synthetic mouse events from firing later
        setPressed(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setPressed(false);
        onTap && onTap();
      }}
      style={style}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// ROMANTIC CARD — soft glass card used on every screen
// ---------------------------------------------------------------
function RomanticCard({ children, padding = "24px 24px", radius = 34, shake, className = "" }) {
  return (
    <div
      className={`relative backdrop-blur-[18px] bg-[var(--cream)]/90 border border-white/60 shadow-[0_16px_35px_rgba(86,28,36,0.2)] max-w-[400px] w-full box-border ${shake ? "animate-[shakeX_400ms_ease-out]" : ""
        } ${className}`}
      style={{ borderRadius: radius, padding }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// ROMANTIC BACKGROUND — gradient + glow orbs + drifting hearts
// ---------------------------------------------------------------
const particles = Array.from({ length: 16 }, (_, i) => ({
  dx: ((i * 37 + 3) % 97) / 97,
  size: 10 + (((i * 29 + 7) % 60) / 60) * 16,
  glyph: i % 4 === 0 ? "✦" : i % 3 === 0 ? "✧" : "♡",
  opacity: 0.1 + (((i * 13 + 5) % 40) / 40) * 0.18,
  delay: -((i * 0.9) % 14),
}));

const glowOrbs = [
  { size: 190, top: -70, right: -50, background: "rgba(255,255,255,0.2)" },
  { size: 210, bottom: -60, right: -50, background: "rgba(86,28,36,0.1)" },
  { size: 120, top: 220, right: -40, background: "rgba(255,255,255,0.16)" },
];

function RomanticBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(135deg,var(--light-peach),var(--peach),var(--pink),var(--dark-pink))]">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.05,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "180px 180px",
        }}
      />

      {glowOrbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[40px]"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            bottom: orb.bottom,
            right: orb.right,
            background: orb.background,
          }}
        />
      ))}

      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-full pointer-events-none animate-[floatUp_14s_linear_infinite]"
          style={{
            left: `${p.dx * 100}%`,
            fontSize: p.size,
            color: `rgba(255,255,255,${p.opacity})`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.glyph}
        </span>
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------
// CENTERED SCREEN LAYOUT HELPER
// ---------------------------------------------------------------
function ScreenCenter({ children, onClick }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[22px] box-border ${onClick ? "cursor-pointer" : "cursor-default"
        }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function SketchCorner({ style, flip = false }) {
  return (
    <svg
      className="absolute pointer-events-none"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      style={{ opacity: 0.16, transform: flip ? "scaleX(-1)" : "none", ...style }}
    >
      <path
        d="M2 17 C 7 8, 13 23, 20 11 C 22.5 7, 26.5 8.5, 25.5 13.5"
        stroke="var(--dark-pink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrushStroke({ width = 84, style }) {
  return (
    <svg
      className="absolute pointer-events-none"
      width={width}
      height="10"
      viewBox="0 0 84 10"
      fill="none"
      style={{ opacity: 0.28, ...style }}
    >
      <path
        d="M2 6.5 Q 18 2, 34 6 T 82 4.5"
        stroke="var(--pink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleSwirl({ style }) {
  return (
    <svg
      className="absolute pointer-events-none"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{ opacity: 0.22, ...style }}
    >
      <path
        d="M4 12 C 2 7, 8 3, 12 6 C 16 9, 12 14, 8 12 C 5.5 10.5, 7 7.5, 10 8"
        stroke="var(--dark-pink)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaletteMark({ size = 16, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block pointer-events-none"
      style={{ opacity: 0.4, ...style }}
    >
      <path
        d="M12 3C7 3 3 6.8 3 11.4c0 2.4 1.9 3.6 3.8 3.6h1a1.6 1.6 0 011.6 1.6c0 1-.7 1.6-.7 2.6 0 1 1 1.8 2.3 1.8 5 0 9-4 9-9C21 6.8 17 3 12 3z"
        stroke="var(--dark-pink)"
        strokeWidth="1.2"
      />
      <circle cx="7.6" cy="9.6" r="1" fill="var(--dark-pink)" />
      <circle cx="11" cy="7" r="1" fill="var(--pink)" />
      <circle cx="15" cy="8" r="1" fill="var(--dark-pink)" />
      <circle cx="17" cy="11.5" r="1" fill="var(--pink)" />
    </svg>
  );
}

// ============================================================
// LOCK PAGE
// ============================================================
// CHANGE THIS PASSWORD — e.g. DOB 24 August => "2408"
const CORRECT_PIN = "2408";

function LockPage({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const addNumber = (num) => {
    if (pin.length >= 4) return;
    const next = pin + num;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          onUnlock();
        } else {
          setShake(true);
          setTimeout(() => setShake(false), 400);
          setPin("");
        }
      }, 300);
    }
  };

  const deleteNumber = () => setPin((p) => p.slice(0, -1));

  const numberButton = (num) => (
    <PressableScale onTap={() => addNumber(num)}>
      <div className="w-[66px] h-[66px] rounded-full bg-white/55 border border-white/70 shadow-[0_6px_14px_rgba(86,28,36,0.12)] flex items-center justify-center font-['Playfair_Display'] text-[21px] font-semibold text-[var(--dark-pink)]">
        {num}
      </div>
    </PressableScale>
  );

  return (
    <RomanticBackground>
      <ScreenCenter>
        <RomanticCard radius={40} padding="34px 24px 26px" shake={shake}>
          <SketchCorner style={{ top: 14, right: 18 }} />
          <div className="flex flex-col items-center">
            <div className="w-[110px] h-[110px] rounded-full bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_30px_rgba(86,28,36,0.3)] flex items-center justify-center text-[46px]">
              🔐
            </div>
            <div className="h-[22px] shrink-0" />
            <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[40px]">Our Secret</div>
            <div className="h-[4px] shrink-0" />
            <div className="font-['Poppins'] text-[var(--brown)] text-[14px] text-center">
              A tiny surprise made only for you ♡
            </div>
            <div className="h-[24px] shrink-0" />
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-[14px] h-[14px] rounded-full border-[1.4px] border-[var(--dark-pink)]/60 transition-all duration-200 ${i < pin.length
                    ? "bg-[linear-gradient(135deg,var(--pink),var(--dark-pink))] shadow-[0_0_10px_rgba(86,28,36,0.45)]"
                    : "bg-transparent"
                    }`}
                />
              ))}
            </div>
            <div className="h-[24px] shrink-0" />
            <div className="font-['Poppins'] text-[var(--brown)] text-[13px] opacity-85">
              Enter your DOB 4-digit code
            </div>
            <div className="h-[22px] shrink-0" />

            {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]].map((row, i) => (
              <div key={i} className="flex justify-evenly w-full mb-[13px]">
                {row.map(numberButton)}
              </div>
            ))}

            <div className="flex justify-evenly w-full">
              <PressableScale onTap={deleteNumber}>
                <div className="w-[66px] h-[66px] flex items-center justify-center text-[22px] text-[var(--brown)]">
                  ⌫
                </div>
              </PressableScale>
              {numberButton("0")}
              <PressableScale onTap={() => setPin("")}>
                <div className="w-[66px] h-[66px] flex items-center justify-center text-[22px] text-[var(--brown)]">
                  ✕
                </div>
              </PressableScale>
            </div>

            <div className="h-[18px] shrink-0" />
            <div className="font-['Dancing_Script'] font-semibold text-[var(--dark-pink)] text-[17px] flex items-center gap-1.5">
              Made with love ♡ <PaletteMark size={14} style={{ marginTop: 2 }} />
            </div>
          </div>
        </RomanticCard>
      </ScreenCenter>
    </RomanticBackground>
  );
}

// ============================================================
// LOVE QUESTION PAGE
// ============================================================

function LoveQuestionPage({ onYes }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState(null); // null = apni original jagah
  const noRef = useRef(null);
  const posRef = useRef(null);
  const lastDodge = useRef(0);

  const NO_W = 110;
  const NO_H = 48;

  const dodge = () => {
    const now = Date.now();
    if (now - lastDodge.current < 120) return; // jitter se bachne ke liye
    lastDodge.current = now;

    const PAD = 12;
    const maxX = Math.max(PAD, window.innerWidth - NO_W - PAD);
    const maxY = Math.max(PAD, window.innerHeight - NO_H - PAD);
    const prev = posRef.current;

    let x, y, tries = 0;
    do {
      x = PAD + Math.random() * (maxX - PAD);
      y = PAD + Math.random() * (maxY - PAD);
      tries++;
    } while (prev && Math.hypot(x - prev.x, y - prev.y) < 160 && tries < 12);

    posRef.current = { x, y };
    setNoPos({ x, y });
    setDodgeCount((c) => c + 1);
  };

  // cursor / ungli button ke qareeb aate hi bhaag jaye (desktop + mobile)


  const choiceButton = (text, selected, onTap, width = 120) => (
    <PressableScale onTap={onTap}>
      <div
        className={`h-[54px] rounded-full flex items-center justify-center box-border ${selected
          ? "bg-[linear-gradient(135deg,var(--pink),var(--dark-pink))] shadow-[0_6px_14px_rgba(86,28,36,0.35)]"
          : "bg-white/85 border border-[var(--pink)]/40 shadow-[0_6px_14px_rgba(86,28,36,0.12)]"
          }`}
        style={{ width }}
      >
        <span
          className={`font-['Poppins'] text-[15px] font-bold ${selected ? "text-white" : "text-[var(--brown)]"}`}
        >
          {text}
        </span>
      </div>
    </PressableScale>
  );

  // NO button: kabhi click nahi hoga, har tarah ke event par bhaagta hai
  const noButton = (
    <button
      ref={noRef}
      type="button"
      onPointerEnter={dodge}
      onPointerDown={(e) => { e.preventDefault(); dodge(); }}
      onTouchStart={dodge}
      onMouseEnter={dodge}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); dodge(); }}
      className="h-[54px] rounded-full flex items-center justify-center box-border bg-white/85 border border-[var(--pink)]/40 shadow-[0_6px_14px_rgba(86,28,36,0.12)] select-none"
      style={{
        width: NO_W,
        touchAction: "none",
        ...(noPos
          ? {
            position: "fixed",
            left: noPos.x,
            top: noPos.y,
            zIndex: 9999,
            transition: "left 0.25s ease, top 0.25s ease",
          }
          : {}),
      }}
    >
      <span className="font-['Poppins'] text-[15px] font-bold text-[var(--brown)]">NO</span>
    </button>
  );

  const message =
    dodgeCount === 0
      ? "Be honest with me... ♡"
      : dodgeCount < 4
        ? "Oops, NO bhaag gaya 😜"
        : dodgeCount < 8
          ? "Pakar ke dikhao 😝"
          : "Bas karo na, YES dabao ❤️";

  const yesScale = Math.min(1 + dodgeCount * 0.02, 1.15);

  return (
    <RomanticBackground>
      <ScreenCenter>
        <RomanticCard>
          <div className="flex flex-col items-center">
            <div
              className="w-full rounded-[26px] overflow-hidden bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_24px_rgba(86,28,36,0.18)]"
              style={{ height: 250 }}
            >
              <img
                src={hug}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-[24px] shrink-0" />
            <div className="relative text-center">
              <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[32px]">
                Do You Love Me? ❤
              </div>
              <BrushStroke width={70} style={{ left: "50%", bottom: -4, transform: "translateX(-50%)" }} />
            </div>
            <div className="h-[8px] shrink-0" />
            <div className="font-['Poppins'] text-[var(--brown)] text-[14px] text-center">{message}</div>
            <div className="h-[28px] shrink-0" />

            <div className="flex gap-[18px] items-center justify-center">
              <div
                style={{
                  transform: `scale(${yesScale})`,
                  transformOrigin: "center",
                  transition: "transform 0.3s ease",
                }}
              >
                {choiceButton("YES", true, onYes)}
              </div>

              {/* NO ki jagah khali placeholder taake layout na hile */}
              {noPos ? <div style={{ width: NO_W, height: 54 }} /> : noButton}
            </div>
          </div>
        </RomanticCard>
      </ScreenCenter>

      {/* bhaagne ke baad NO poori screen par ghoomta hai */}
      {noPos && createPortal(noButton, document.body)}
    </RomanticBackground>
  );
}

// ============================================================
// YAY PAGE
// ============================================================
function HeartsOverlay() {
  const glyphs = Array.from({ length: 22 }, (_, i) => (i % 5 === 0 ? "✦" : i % 3 === 0 ? "♡" : "♥"));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="absolute bottom-[-30px] text-white/50 [text-shadow:0_0_6px_rgba(86,28,36,0.3)] animate-[riseUp_2s_linear_infinite]"
          style={{
            left: `${(i * 37 + 5) % 100}%`,
            fontSize: 14 + ((i * 11) % 20),
            animationDelay: `${-(i * 0.09)}s`,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

function YayPage({ onContinue }) {
  return (
    <RomanticBackground>
      <div className="relative">
        <HeartsOverlay />
        <ScreenCenter onClick={onContinue}>
          <RomanticCard>
            <div className="flex flex-col items-center">
              <div
                className="w-full rounded-[26px] overflow-hidden bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_24px_rgba(86,28,36,0.18)]"
                style={{ height: 220 }}
              >
                <img src={yesGif} alt="yes" className="w-full h-full object-cover" />
              </div>
              <div className="h-[18px] shrink-0" />
              <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[28px]">Hayeeeee!</div>
              <div className="h-[8px] shrink-0" />
              <div className="italic uppercase text-[var(--dark-pink)] font-serif text-[30px]">
                I knew it❤️
              </div>
              <div className="h-[8px] shrink-0" />
              <div className="font-['Poppins'] text-[var(--brown)] text-[16px] text-center">
                You just made me the happiest person! ♡
              </div>
              <div className="h-[8px] shrink-0" />
              <div className="font-['Poppins'] text-[var(--dark-pink)] text-[10px] font-semibold">
                Tap anywhere to continue
              </div>
            </div>
          </RomanticCard>
        </ScreenCenter>
      </div>
    </RomanticBackground>
  );
}

// ============================================================
// BIRTHDAY PAGE
// ============================================================
function BirthdayPage({ onNext }) {
  return (
    <RomanticBackground>
      <ScreenCenter onClick={onNext}>
        <RomanticCard>
          <SketchCorner style={{ top: 12, left: 16 }} flip />
          <div className="flex flex-col items-center">
            <div
              className="w-full rounded-[26px] overflow-hidden bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_26px_rgba(86,28,36,0.2)]"
              style={{ height: 280 }}
            >
              <img
                src={hamza}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 10%" }}
              />
            </div>
            <div className="h-[26px] shrink-0" />
            <div className="relative">
              <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[28px]">
                Happy Birthday
              </div>
              <BrushStroke width={64} style={{ left: "50%", bottom: -3, transform: "translateX(-50%)" }} />
            </div>
            <div className="h-[6px] shrink-0" />
            <div className="font-['Great_Vibes'] text-[var(--dark-pink)] text-[30px] font-medium">
              Hamza!
            </div>
            <div className="h-[10px] shrink-0" />
            <div className="font-['Poppins'] text-[var(--brown)] text-[15px]">Today is all about you ♡</div>
            <div className="h-[15px] shrink-0" />
            <div className="font-['Poppins'] text-[var(--dark-pink)] text-[10px] font-semibold">
              Tap anywhere to continue
            </div>
          </div>
        </RomanticCard>
      </ScreenCenter>
    </RomanticBackground>
  );
}

// ============================================================
// MOMENTS PAGE — Polaroid scrapbook carousel
// ============================================================
const moments = [
  // { image: photo1, title: "Our First Memory", text: "One little moment that became a beautiful memory ❤️" },
  { image: photo2, title: "Your Smile", text: "Honestly, your smile is one of my favorite things ♡" },
  // { image: photo3, title: "Us", text: "Some moments are simple, but they mean everything 💗" },
  { image: photo4, title: "My Favorite Person", text: "Life feels a little more beautiful with you 💕" },
];

function MomentsPage({ onFinish }) {
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    if (currentPage < moments.length - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      onFinish();
    }
  };

  const moment = moments[currentPage];
  const tilt = currentPage % 2 === 0 ? -0.018 : 0.018;

  return (
    <RomanticBackground>
      <div className="flex flex-col items-center min-h-screen pt-[18px] pb-[16px] box-border">
        <div className="font-['Playfair_Display'] text-[var(--dark-pink)] text-[30px] font-medium">
          Our Best Moments
        </div>
        <div className="h-[4px] shrink-0" />
        <div className="font-['Poppins'] text-[var(--brown)] text-[14px]">♡ Little Memories, Big Feelings ♡</div>
        <div className="h-[16px] shrink-0" />

        <div className="flex-1 w-full max-w-[440px] px-[22px] box-border">
          <div
            className="relative bg-[var(--cream)] rounded-[18px] shadow-[0_12px_22px_rgba(86,28,36,0.2)] px-4 pt-4 pb-[14px] flex flex-col items-center"
            style={{ transform: `rotate(${tilt}rad)` }}
          >
            <DoodleSwirl style={{ top: 8, right: 14 }} />
            <div className="[transform:rotate(-0.05rad)] w-[70px] h-[22px] mb-[6px] rounded-[3px] bg-[rgba(255,225,218,0.85)] border border-white/60" />
            <div className="w-full aspect-square rounded-[10px] border-[6px] border-white overflow-hidden bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_12px_rgba(86,28,36,0.15)]">
              <img src={moment.image} alt={moment.title} className="w-full h-full object-cover" />
            </div>
            <div className="h-[14px] shrink-0" />
            <div className="font-['Dancing_Script'] font-semibold text-[var(--dark-pink)] text-[26px]">
              {moment.title}
            </div>
            <div className="h-[6px] shrink-0" />
            <div className="font-['Lora'] text-[var(--brown)] leading-[1.5] text-[14px] text-center">
              {moment.text}
            </div>
            <div className="h-[14px] shrink-0" />
            <div className="flex justify-center gap-2">
              {moments.map((_, i) => (
                <div
                  key={i}
                  className={`h-[7px] rounded-[10px] transition-[width] duration-[250ms] ${i === currentPage
                    ? "bg-[linear-gradient(135deg,var(--pink),var(--dark-pink))]"
                    : "bg-[var(--peach)]"
                    }`}
                  style={{ width: i === currentPage ? 22 : 7 }}
                />
              ))}
            </div>
            <div className="h-[14px] shrink-0" />
            <PressableScale onTap={next} className="w-full">
              <div className="w-full h-[50px] rounded-full bg-[linear-gradient(135deg,var(--pink),var(--dark-pink))] shadow-[0_6px_14px_rgba(86,28,36,0.3)] flex items-center justify-center box-border">
                <span className="font-['Poppins'] text-white text-[15px] font-bold">
                  {currentPage === moments.length - 1 ? "Open My Letter 💌" : "Next Memory →"}
                </span>
              </div>
            </PressableScale>
          </div>
        </div>
      </div>
    </RomanticBackground>
  );
}

// ============================================================
// LETTER OPENING — sealed envelope
// ============================================================
function LetterOpeningPage({ onOpen }) {
  return (
    <RomanticBackground>
      <ScreenCenter onClick={onOpen}>
        <div className="animate-[popIn_700ms_cubic-bezier(0.34,1.56,0.64,1)]">
          <RomanticCard padding="40px 25px">
            <div className="flex flex-col items-center">
              <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[38px] text-center">
                Letter For You!
              </div>
              <div className="h-[34px] shrink-0" />
              <div className="relative w-[170px] h-[120px]">
                <div className="absolute inset-0 rounded-[14px] bg-[linear-gradient(135deg,var(--light-peach),var(--peach))] shadow-[0_0_18px_rgba(86,28,36,0.25)]" />
                <SketchCorner style={{ top: -6, left: -6, width: 22, height: 22 }} />
                <svg width="170" height="120" className="absolute inset-0">
                  <polygon
                    points="0,0 85,66 170,0"
                    fill="rgba(255,255,255,0.55)"
                    stroke="rgba(86,28,36,0.35)"
                    strokeWidth="1.4"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-[var(--dark-pink)] shadow-[0_0_12px_rgba(86,28,36,0.5)] flex items-center justify-center">
                  <span className="text-[20px] text-white">❤</span>
                </div>
              </div>
              <div className="h-[28px] shrink-0" />
              <div className="font-['Poppins'] text-[var(--brown)] text-[14px]">Opening...</div>
              <div className="h-[16px] shrink-0" />
              <div className="font-['Poppins'] text-[var(--pink)] text-[15px] font-bold">Tap the letter ♡</div>
            </div>
          </RomanticCard>
        </div>
      </ScreenCenter>
    </RomanticBackground>
  );
}

// ============================================================
// FINAL LOVE LETTER
// ============================================================

function LetterPage() {
  return (
    <RomanticBackground>
      <div className="min-h-screen flex justify-center px-5 pt-6 pb-[34px] box-border">
        <div className="relative max-w-[440px] w-full">
          <RomanticCard radius={30} padding="34px 26px 32px">
            <div className="flex flex-col">
              <div className="relative text-center">
                <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[40px]">
                  Dear Hamza,
                </div>
                <BrushStroke width={100} style={{ left: "50%", bottom: -10, transform: "translateX(-45%)" }} />
              </div>

              <div className="h-[16px] shrink-0" />
              <div className="relative">

                <DoodleSwirl style={{ top: -4, right: -2 }} />
              </div>
              <div className="h-[14px] shrink-0" />
              <div className="font-['Lora'] text-[var(--brown)] leading-[1.8] text-[15px] ">

                <p>I don't think you realize how important you are to me.
                  You're not just my best friend; you're someone I'm genuinely grateful to have in my life. Thank you for all the laughs, stupid jokes, random talks, and unforgettable memories.

                  No matter where life takes us, I hope our bond stays the same. I hope your smile never fades, your dreams come true, and your heart always finds reasons to be happy.

                  I wish I could give you the biggest hug right now and remind you how precious you are to me.

                  May this year bring you beautiful memories, endless laughter, and all the love you deserve.
                  And selfishly, I hope I get to be part of many more of your birthdays.</p>

                <h1 className="py-2 font-serif italic text-lg font-semibold">A Few Things About You!</h1>

                <ul>
                  <li>♡ Your smile is literally my weakness.</li>
                  <li>♡ Your voice could fix my worst mood.</li>
                  <li>♡ Your texts are my favorite notifications.</li>
                  <li>♡ You annoy me, but somehow I still want your attention 24/7.</li>
                  <li>♡ You're dangerously good at making me blush.</li>
                  <li>♡ And the worst part? I think I'm getting more attached to you every day.</li>
                </ul>

                <h6 className="py-2 font-serif italic text-lg font-semibold"> One last thing before you leave...</h6>
                <p>
                  If I had to choose one person to annoy, laugh with, share my secrets with, and make a million memories with, I'd choose you every single time.
                  I don't know what the future holds, but I know that right now, you're someone I never want to lose.
                  So here's to you, my favorite boy. To your beautiful smile, your silly heart, and the little bond we share that means more to me than words can say
                  I hope you know just how special you are to me.
                </p>
                <div className="h-[16px] shrink-0" />
                <h1 className="text-center font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[45px] text-center">Happy Birthday, my pretty boy!</h1>
              </div>

              <div className="h-[20px] shrink-0" />
              <div className="font-['Great_Vibes'] leading-[1.1] text-[var(--dark-pink)] text-[29px] text-center">
                With all my love
              </div>
              <div className="h-[7px] shrink-0" />
              <div className="font-['Poppins'] text-[var(--brown)] text-[10px] text-center">
                ♡ from your frined Umiya ♡
              </div>
              <div className="text-[var(--pink)] text-[20px] text-center">♡ ♡ ♡</div>
            </div>
          </RomanticCard>
          <span className="absolute text-[var(--pink)]/50" style={{ top: -10, left: 10, fontSize: 20 }}>♡</span>
          <span className="absolute text-[var(--pink)]/50" style={{ top: 267, left: 370, fontSize: 20 }}>♡</span>
          <SketchCorner style={{ bottom: -8, left: 26 }} flip />
        </div>
      </div>
    </RomanticBackground>
  );
}

// ============================================================
// APP ROOT — screen router (mirrors Navigator.pushReplacement flow)
// ============================================================
export default function BirthdayLoveApp() {
  const [screen, setScreen] = useState("lock");

  const page = (() => {
    switch (screen) {
      case "lock":
        return <LockPage onUnlock={() => setScreen("question")} />;
      case "question":
        return <LoveQuestionPage onYes={() => setScreen("yay")} />;
      case "yay":
        return <YayPage onContinue={() => setScreen("birthday")} />;
      case "birthday":
        return <BirthdayPage onNext={() => setScreen("moments")} />;
      case "moments":
        return <MomentsPage onFinish={() => setScreen("letterOpening")} />;
      case "letterOpening":
        return <LetterOpeningPage onOpen={() => setScreen("letter")} />;
      case "letter":
        return <LetterPage />;
      default:
        return <LockPage onUnlock={() => setScreen("question")} />;
    }
  })();

  return (
    <>
      <ThemeStyles />
      {page}
    </>
  );
}