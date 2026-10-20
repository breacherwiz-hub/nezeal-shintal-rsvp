const basePath = process.env.NODE_ENV === "production" ? "/nezeal-shintal-rsvp" : "";

interface RainFlower {
  id: number;
  type: "stem" | "bloom";
  left: string;
  width: string;
  duration: string;
  delay: string;
  animClass: string;
  opacity: number;
}

const FLOWERS: RainFlower[] = [
  { id: 1, type: "bloom", left: "5%", width: "w-10 sm:w-14", duration: "13s", delay: "-2s", animClass: "animate-rain-1", opacity: 0.7 },
  { id: 2, type: "stem", left: "14%", width: "w-14 sm:w-20", duration: "17s", delay: "-7s", animClass: "animate-rain-2", opacity: 0.6 },
  { id: 3, type: "bloom", left: "26%", width: "w-12 sm:w-16", duration: "14s", delay: "-11s", animClass: "animate-rain-3", opacity: 0.75 },
  { id: 4, type: "stem", left: "38%", width: "w-16 sm:w-22", duration: "19s", delay: "-4s", animClass: "animate-rain-1", opacity: 0.55 },
  { id: 5, type: "bloom", left: "50%", width: "w-11 sm:w-14", duration: "12s", delay: "-9s", animClass: "animate-rain-2", opacity: 0.7 },
  { id: 6, type: "stem", left: "62%", width: "w-16 sm:w-24", duration: "18s", delay: "-14s", animClass: "animate-rain-3", opacity: 0.6 },
  { id: 7, type: "bloom", left: "74%", width: "w-12 sm:w-16", duration: "15s", delay: "-6s", animClass: "animate-rain-1", opacity: 0.75 },
  { id: 8, type: "stem", left: "85%", width: "w-14 sm:w-20", duration: "16s", delay: "-12s", animClass: "animate-rain-2", opacity: 0.55 },
  { id: 9, type: "bloom", left: "94%", width: "w-10 sm:w-12", duration: "11s", delay: "-3s", animClass: "animate-rain-3", opacity: 0.65 },
  { id: 10, type: "bloom", left: "20%", width: "w-9 sm:w-12", duration: "16s", delay: "-15s", animClass: "animate-rain-1", opacity: 0.6 },
  { id: 11, type: "stem", left: "68%", width: "w-12 sm:w-16", duration: "20s", delay: "-1s", animClass: "animate-rain-2", opacity: 0.5 },
];

export default function HydrangeaRain() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[4] select-none" aria-hidden="true">
      {FLOWERS.map((f) => (
        <div
          key={f.id}
          className={`absolute -top-32 ${f.width} ${f.animClass} mix-blend-multiply pointer-events-none`}
          style={{
            left: f.left,
            animationDuration: f.duration,
            animationDelay: f.delay,
            opacity: f.opacity,
            filter: "drop-shadow(0 8px 12px rgba(83,107,119,0.12))",
          }}
        >
          <img
            src={`${basePath}/${f.type === "stem" ? "hydrangea-single.png" : "hydrangea-bloom.png"}`}
            alt=""
            className="w-full h-auto object-contain pointer-events-none select-none"
          />
        </div>
      ))}
    </div>
  );
}
