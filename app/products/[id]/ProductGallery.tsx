"use client";

import { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <img
        src={selectedImage}
        className="w-full object-contain transition-all duration-200"
      />

      <div className="flex gap-3 mt-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setSelectedImage(img)}
            className={`w-30 border rounded cursor-pointer hover:scale-105 transition ${
              selectedImage === img ? "ring-2 ring-blue-600" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
