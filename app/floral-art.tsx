const basePath = process.env.NODE_ENV === "production" ? "/nezeal-shintal-rsvp" : "";

export default function FloralArt({ subtle = false }: { subtle?: boolean }) {
  if (subtle) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Top-Right corner hydrangea */}
        <div
          className="absolute -top-20 -right-16 sm:-top-28 sm:-right-20 w-56 sm:w-72 md:w-[360px] opacity-50 mix-blend-multiply pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle at 60% 30%, black 45%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at 60% 30%, black 45%, transparent 75%)",
          }}
        >
          <img
            src={`${basePath}/hydrangea-single.png`}
            alt=""
            className="w-full h-auto object-contain transform rotate-15 pointer-events-none"
          />
        </div>

        {/* Bottom-Left corner hydrangea */}
        <div
          className="absolute -bottom-20 -left-16 sm:-bottom-28 sm:-left-20 w-56 sm:w-72 md:w-[360px] opacity-45 mix-blend-multiply pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle at 40% 70%, black 45%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at 40% 70%, black 45%, transparent 75%)",
          }}
        >
          <img
            src={`${basePath}/hydrangea-single.png`}
            alt=""
            className="w-full h-auto object-contain transform -rotate-160 scale-x-[-1] pointer-events-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Top Left hydrangea */}
      <div
        className="absolute -top-24 -left-16 sm:-top-32 sm:-left-20 w-60 sm:w-80 md:w-[420px] opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at 40% 35%, black 50%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 40% 35%, black 50%, transparent 78%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-single.png`}
          alt=""
          className="w-full h-auto object-contain pointer-events-none transform -rotate-12 scale-x-[-1]"
        />
      </div>

      {/* Top Right hydrangea */}
      <div
        className="absolute -top-24 -right-16 sm:-top-32 sm:-right-20 w-60 sm:w-80 md:w-[420px] opacity-65 mix-blend-multiply pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at 60% 35%, black 50%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 60% 35%, black 50%, transparent 78%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-single.png`}
          alt=""
          className="w-full h-auto object-contain pointer-events-none transform rotate-12"
        />
      </div>

      {/* Bottom Left hydrangea */}
      <div
        className="absolute -bottom-24 -left-16 sm:-bottom-32 sm:-left-20 w-60 sm:w-80 md:w-[420px] opacity-60 mix-blend-multiply pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at 40% 65%, black 50%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 40% 65%, black 50%, transparent 78%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-single.png`}
          alt=""
          className="w-full h-auto object-contain pointer-events-none transform rotate-180 scale-x-[-1]"
        />
      </div>

      {/* Bottom Right hydrangea */}
      <div
        className="absolute -bottom-24 -right-16 sm:-bottom-32 sm:-right-20 w-60 sm:w-80 md:w-[420px] opacity-65 mix-blend-multiply pointer-events-none"
        style={{
          maskImage: "radial-gradient(circle at 60% 65%, black 50%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 60% 65%, black 50%, transparent 78%)",
        }}
      >
        <img
          src={`${basePath}/hydrangea-single.png`}
          alt=""
          className="w-full h-auto object-contain pointer-events-none transform rotate-180"
        />
      </div>
    </div>
  );
}
