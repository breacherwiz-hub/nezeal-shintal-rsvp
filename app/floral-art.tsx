const basePath = process.env.NODE_ENV === "production" ? "/nezeal-shintal-rsvp" : "";

export default function FloralArt({ subtle = false }: { subtle?: boolean }) {
  if (subtle) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Top-Right Soft Hydrangea accent */}
        <div
          className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-72 sm:w-96 md:w-[440px] opacity-45 mix-blend-multiply animate-float pointer-events-none"
          style={{
            animationDuration: "8s",
            maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
          }}
        >
          <img
            src={`${basePath}/hydrangea-watercolor.png`}
            alt=""
            className="w-full h-auto object-contain transform rotate-45 pointer-events-none"
          />
        </div>

        {/* Bottom-Left Soft Hydrangea accent */}
        <div
          className="absolute -bottom-20 -left-20 sm:-bottom-28 sm:-left-28 w-80 sm:w-[460px] opacity-40 mix-blend-multiply animate-drift pointer-events-none"
          style={{
            animationDuration: "9s",
            maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
          }}
        >
          <img
            src={`${basePath}/hydrangea-botanical.jpg`}
            alt=""
            className="w-full h-auto object-contain transform -rotate-12 pointer-events-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Top Left Botanical Hydrangea Branch */}
      <div
        className="absolute -top-12 -left-12 sm:-top-20 sm:-left-20 w-64 sm:w-96 md:w-[500px] opacity-85 mix-blend-multiply animate-float pointer-events-none"
        style={{
          animationDuration: "7s",
          maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-botanical.jpg`}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow(0 15px 25px rgba(78,93,101,0.12)) pointer-events-none transform -rotate-6"
        />
      </div>

      {/* Top Right Dreamy Watercolor Hydrangea Clusters */}
      <div
        className="absolute -top-10 -right-12 sm:-top-16 sm:-right-16 w-56 sm:w-80 md:w-[440px] opacity-80 mix-blend-multiply animate-drift pointer-events-none"
        style={{
          animationDuration: "8s",
          animationDelay: "1s",
          maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-watercolor.png`}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow(0 15px 25px rgba(78,93,101,0.10)) pointer-events-none transform rotate-12"
        />
      </div>

      {/* Bottom Left Dreamy Hydrangea */}
      <div
        className="absolute -bottom-16 -left-14 sm:-bottom-24 sm:-left-20 w-60 sm:w-84 md:w-[460px] opacity-75 mix-blend-multiply animate-drift pointer-events-none"
        style={{
          animationDuration: "8.5s",
          animationDelay: "0.5s",
          maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-watercolor.png`}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow(0 15px 25px rgba(78,93,101,0.12)) pointer-events-none transform -rotate-45"
        />
      </div>

      {/* Bottom Right Botanical Hydrangea Branch */}
      <div
        className="absolute -bottom-14 -right-14 sm:-bottom-20 sm:-right-20 w-64 sm:w-96 md:w-[480px] opacity-85 mix-blend-multiply animate-float pointer-events-none"
        style={{
          animationDuration: "7.5s",
          animationDelay: "1.5s",
          maskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 65%, transparent 100%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-botanical.jpg`}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow(0 15px 25px rgba(78,93,101,0.12)) pointer-events-none transform rotate-180"
        />
      </div>

      {/* Gentle Floating Petal & Light accents */}
      <div className="absolute left-[15%] top-[12%] w-2 h-2 rounded-full bg-white/70 animate-drift pointer-events-none" />
      <div className="absolute right-[18%] top-[18%] w-1.5 h-1.5 rounded-full bg-white/70 animate-drift pointer-events-none" />
      <div className="absolute left-[22%] bottom-[15%] w-2 h-2 rounded-full bg-white/60 animate-drift pointer-events-none" />
      <div className="absolute right-[24%] bottom-[22%] w-1.5 h-1.5 rounded-full bg-white/60 animate-drift pointer-events-none" />
    </div>
  );
}