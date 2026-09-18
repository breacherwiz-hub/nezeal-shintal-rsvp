import RSVPForm from "./rsvp-form";
import FloralArt from "./floral-art";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-5 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.72),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(191,207,213,.3),transparent_32%)]" />
        <FloralArt />

        <div className="relative z-10 w-full max-w-3xl animate-rise">
          <div className="glass paper-shadow rounded-[2rem] px-7 py-12 sm:px-14 sm:py-16 text-center">
            <p className="text-[10px] tracking-[.42em] uppercase text-slate-500 mb-5">A celebration of love</p>
            <p className="font-display text-xl italic text-slate-500">Together with their families</p>
            <h1 className="font-display text-6xl sm:text-8xl leading-[.82] text-[#536b77] mt-3">
              Nezeal <span className="text-4xl sm:text-6xl align-middle text-[#b5a695]">&amp;</span> Shintal
            </h1>
            <p className="font-display text-2xl sm:text-3xl mt-5 tracking-wide">are getting married</p>

            <div className="w-16 h-px bg-[#aabcc4] mx-auto my-8" />

            <div className="grid sm:grid-cols-3 gap-5 text-center max-w-2xl mx-auto">
              <Info label="DATE" value="April 23, 2026" />
              <Info label="TIME" value="4:00 PM" />
              <Info label="VENUE" value="E&J Grand Pavilion" sub="Don Carlos, Bukidnon" />
            </div>

            <p className="mt-9 text-sm text-slate-500">Dusty Blue &amp; Beige • Formal / Semi-Formal</p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#rsvp" className="inline-flex rounded-full bg-[#718d9b] text-white px-8 py-3.5 text-xs font-semibold tracking-[.2em] uppercase shadow-lg shadow-slate-300/40 hover:-translate-y-0.5 transition">
                RSVP Now
              </a>
              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nezeal%20%26%20Shintal%20Wedding&dates=20260423T160000/20260423T180000&ctz=Asia/Manila&location=E%26J%20Grand%20Pavilion%2C%20Don%20Carlos%2C%20Bukidnon&details=Wedding%20celebration%20of%20Nezeal%20%26%20Shintal" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[#9db3c0] bg-white/60 text-[#536b77] px-7 py-3.5 text-xs font-semibold tracking-[.15em] uppercase hover:-translate-y-0.5 transition">
                📅 Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="rsvp" className="relative px-5 py-20 bg-[#f8f5f0]">
        <FloralArt subtle />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[.35em] uppercase text-slate-500">Kindly reply</p>
            <h2 className="font-display text-5xl text-[#536b77] mt-2">Will you join us?</h2>
            <p className="text-sm text-slate-500 mt-3">Please respond by March 30, 2026.</p>
          </div>
          <RSVPForm />
        </div>
      </section>

      <footer className="bg-[#536b77] text-white text-center px-5 py-10">
        <p className="font-display text-3xl">Nezeal &amp; Shintal</p>
        <p className="text-[10px] tracking-[.3em] uppercase opacity-70 mt-2">April 23, 2026 • Don Carlos, Bukidnon</p>
      </footer>
    </main>
  );
}

function Info({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[9px] tracking-[.25em] text-slate-400">{label}</p>
      <p className="font-display text-xl mt-1">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}