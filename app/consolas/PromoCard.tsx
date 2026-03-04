"use client";

interface PromoCardProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export default function PromoCard({
  title,
  subtitle,
  backgroundImage,
}: PromoCardProps) {
  return (
    <div className="relative group w-full max-w-sm h-[520px] rounded-3xl overflow-hidden cursor-pointer">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
        
        {/* Top Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            {title}
          </h2>
        </div>

        {/* Bottom Subtitle */}
        <div>
          <p className="text-lg font-medium text-white/90">
            {subtitle}
          </p>
        </div>

      </div>
    </div>
  );
}