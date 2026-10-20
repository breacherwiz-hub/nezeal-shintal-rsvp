const basePath = process.env.NODE_ENV === "production" ? "/nezeal-shintal-rsvp" : "";

export default function FloralArt({ subtle = false }: { subtle?: boolean }) {
  if (subtle) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Top-Right Soft Hydrangea accent - stays still */}
        <div
          className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-72 sm:w-96 md:w-[440px] opacity-45 mix-blend-multiply pointer-events-none"
          style={{
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

        {/* Bottom-Left Soft Hydrangea accent - stays still */}
        <div
          className="absolute -bottom-20 -left-20 sm:-bottom-28 sm:-left-28 w-80 sm:w-[460px] opacity-40 mix-blend-multiply pointer-events-none"
          style={{
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
      {/* Top Left Botanical Hydrangea Branch - stays still */}
      <div
        className="absolute -top-12 -left-12 sm:-top-20 sm:-left-20 w-64 sm:w-96 md:w-[500px] opacity-85 mix-blend-multiply pointer-events-none"
        style={{
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

      {/* Top Right Dreamy Watercolor Hydrangea Clusters - stays still */}
      <div
        className="absolute -top-10 -right-12 sm:-top-16 sm:-right-16 w-56 sm:w-80 md:w-[440px] opacity-80 mix-blend-multiply pointer-events-none"
        style={{
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

      {/* Bottom Left Dreamy Hydrangea - stays still */}
      <div
        className="absolute -bottom-16 -left-14 sm:-bottom-24 sm:-left-20 w-60 sm:w-84 md:w-[460px] opacity-75 mix-blend-multiply pointer-events-none"
        style={{
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

      {/* Bottom Right Botanical Hydrangea Branch - stays still */}
      <div
        className="absolute -bottom-14 -right-14 sm:-bottom-20 sm:-right-20 w-64 sm:w-96 md:w-[480px] opacity-85 mix-blend-multiply pointer-events-none"
        style={{
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
    </div>
  );
}