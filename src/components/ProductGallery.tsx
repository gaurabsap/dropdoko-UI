"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

interface Img { url: string; }
interface ProductGalleryProps {
  mainImage: string;
  gallery: Img[];
  name?: string;
}

export default function ProductGallery({
  mainImage,
  gallery,
  name = "product",
}: ProductGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const galleryWithMain = [ { url: mainImage }, ...gallery ];

  // image / fade states
  const [selected, setSelected] = useState<string>(mainImage || "/placeholder.png");
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(true);

  // zoom states
  const [isHovering, setIsHovering] = useState(false);
  const targetRef = useRef({ x: 50, y: 50 });
  const lastRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const zoomScale = 2.0;

  function onMouseMove(e: React.MouseEvent) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    targetRef.current = { x, y };
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }

  function animate() {
    const target = targetRef.current;
    const last = lastRef.current;
    const dx = target.x - last.x;
    const dy = target.y - last.y;
    last.x += dx * 0.18;
    last.y += dy * 0.18;
    setBgPos({ x: last.x, y: last.y });
    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function changeImage(url: string) {
    if (!url || url === selected) return;
    setPrevImg(selected);
    setLoaded(false);
    setSelected(url);
  }

  function handleSelectedLoad() {
    setLoaded(true);
    setTimeout(() => setPrevImg(null), 220);
    targetRef.current = { x: 50, y: 50 };
    lastRef.current = { x: 50, y: 50 };
    setBgPos({ x: 50, y: 50 });
  }

  function handleMouseLeave() {
    setIsHovering(false);
    targetRef.current = { x: 50, y: 50 };
    lastRef.current = { x: 50, y: 50 };
    setBgPos({ x: 50, y: 50 });
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  useEffect(() => {
    if (mainImage && mainImage !== selected) {
      setSelected(mainImage);
      setPrevImg(null);
      setLoaded(true);
    }
  }, [mainImage]);

  return (
    <div className="flex flex-col relative">
      {/* Main image container */}
      <div
        className="relative w-full max-w-md aspect-square border rounded-lg overflow-hidden"
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onMouseMove}
      >
        {/* Previous image (fades out) */}
        {prevImg && (
          <Image
            src={prevImg}
            alt={name + " prev"}
            draggable={false}
            fill
            className="object-cover transition-opacity duration-200"
            style={{ opacity: loaded ? 0 : 1 }}
          />
        )}

        {/* Selected image (fades in) */}
        <Image
          src={selected}
          alt={name}
          draggable={false}
          fill
          onLoad={handleSelectedLoad}
          className="object-cover transition-opacity duration-200"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        {/* Zoom lens */}
        {isHovering && (
          <div
            aria-hidden
            style={{
              left: `${bgPos.x}%`,
              top: `${bgPos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="hidden md:block pointer-events-none absolute w-16 h-16 rounded-full border-2 border-white/70 shadow-lg bg-white/5"
          />
        )}
      </div>

      {/* Zoom preview */}
      <div
        className="absolute top-0 left-[420px] w-[700px] h-[600px] border rounded-lg hidden md:block overflow-hidden bg-orange-50 shadow-lg z-10"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: "opacity 160ms ease",
          backgroundImage: `url("${selected}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${zoomScale * 100}%`,
          backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          willChange: "background-position, opacity",
        }}
      />

      {/* Gallery thumbnails */}
      {galleryWithMain && galleryWithMain.length > 0 ? (
        <div className="flex gap-2 mt-2">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => changeImage(img.url)}
              className={`w-16 h-16 rounded-lg overflow-hidden border ${img.url === selected ? "border-orange-500" : "border-gray-200"}`}
              type="button"
            >
              <Image
                src={img.url}
                alt={`${name} thumb ${idx}`}
                width={64}
                height={64}
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No additional images available</p>
      )}
    </div>
  );
}
