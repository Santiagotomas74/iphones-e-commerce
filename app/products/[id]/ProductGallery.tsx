"use client";

import { useState, useRef } from "react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);



  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
   if (!isZoomed) return;

    const { left, top, width, height } =
    imageRef.current!.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  return (
    <div className="w-full">

      {/* Imagen principal con zoom */}
      <div
        ref={imageRef}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-square overflow-hidden rounded-xl cursor-zoom-in"
        style={{
          backgroundImage: `url(${selectedImage})`,
          backgroundSize: "200%",
          backgroundRepeat: "no-repeat",
          ...zoomStyle,
        }}
      />

      {/* Thumbnails */}
      <div className="flex gap-3 mt-4 justify-center">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => { 
            setSelectedImage(img)
             setIsZoomed(false);   

            }}
            className={`w-20 h-20 rounded border overflow-hidden cursor-pointer transition ${
              selectedImage === img
                ? "ring-2 ring-blue-600"
                : "hover:scale-105"
            }`}
          >
            <img
              src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}