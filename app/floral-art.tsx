export default function FloralArt({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${subtle ? "opacity-60" : ""}`}>
      <div className="stem animate-drift" style={{ left: "9%", top: "-5%", height: 260, transform: "rotate(8deg)" }} />
      <div className="leaf" style={{ left: "8%", top: "22%", transform: "rotate(20deg)" }} />
      <div className="leaf" style={{ left: "10%", top: "16%", transform: "rotate(-35deg)" }} />
      <div className="flower small animate-float flower-shadow" style={{ left: "7%", top: "18%" }} />
      <div className="flower animate-float flower-shadow" style={{ left: "4%", top: "28%", animationDelay: ".7s" }} />
      <div className="flower big animate-float flower-shadow" style={{ left: "1%", bottom: "10%", animationDelay: "1.2s" }} />

      <div className="stem animate-drift" style={{ right: "8%", bottom: "-3%", height: 240, transform: "rotate(-12deg)" }} />
      <div className="leaf" style={{ right: "9%", bottom: "23%", transform: "rotate(150deg)" }} />
      <div className="leaf" style={{ right: "11%", bottom: "30%", transform: "rotate(195deg)" }} />
      <div className="flower small animate-float flower-shadow" style={{ right: "8%", bottom: "30%", animationDelay: ".4s" }} />
      <div className="flower big animate-float flower-shadow" style={{ right: "2%", bottom: "13%", animationDelay: "1.5s" }} />

      <div className="absolute left-[17%] top-[9%] w-2 h-2 rounded-full bg-white/70 animate-drift" />
      <div className="absolute right-[20%] top-[17%] w-1.5 h-1.5 rounded-full bg-white/70 animate-drift" />
      <div className="absolute left-[20%] bottom-[16%] w-1.5 h-1.5 rounded-full bg-white/60 animate-drift" />
    </div>
  );
}