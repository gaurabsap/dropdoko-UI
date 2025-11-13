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
  const galleryWithMain = [{ url: mainImage }, ...gallery];

  const [selected, setSelected] = useState<string>(mainImage || "/placeholder.png");
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(true);

  const [isHovering, setIsHovering] = useState(false);
  const targetRef = useRef({ x: 50, y: 50 });
  const lastRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const zoomScale = 2.0;

  // Mobile state
  const [isMobileView, setIsMobileView] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    if (isMobileView) return; // Disable hover effects on mobile
    
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

  // Touch events for mobile
  function handleTouchStart() {
    if (isMobileView) {
      setIsHovering(false); // Ensure hover effects are disabled on touch devices
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
    <div className="flex flex-col w-full max-w-lg mx-auto relative">
      {/* Main image container with relative positioning */}
      <div className="relative">
        <div
          className="relative w-full aspect-square border rounded-lg overflow-hidden"
          ref={containerRef}
          onMouseEnter={() => !isMobileView && setIsHovering(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={onMouseMove}
          onTouchStart={handleTouchStart}
        >
          {prevImg && (
            <Image
              src={prevImg}
              alt={name + " prev"}
              fill
              draggable={false}
              className="object-cover transition-opacity duration-200"
              style={{ opacity: loaded ? 0 : 1 }}
            />
          )}
          <Image
            src={selected}
            alt={name}
            fill
            draggable={false}
            onLoad={handleSelectedLoad}
            className="object-cover transition-opacity duration-200"
            style={{ opacity: loaded ? 1 : 0 }}
          />
          {/* Zoom lens - only on desktop */}
          {isHovering && (
            <div
              aria-hidden
              className="hidden md:block pointer-events-none absolute w-16 h-16 rounded-full border-2 border-white/70 shadow-lg bg-white/5"
              style={{
                left: `${bgPos.x}%`,
                top: `${bgPos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>

        {/* Zoom preview - positioned to the right, only on desktop */}
        {isHovering && (
          <div
            className="hidden md:block pointer-events-none absolute top-0 left-full ml-4 w-120 h-120 border rounded-lg bg-white shadow-xl z-50 overflow-hidden"
            style={{
              backgroundImage: `url("${selected}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${zoomScale * 100}%`,
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
            }}
          />
        )}
      </div>

      {/* Gallery thumbnails - responsive sizing */}
      <div className="flex gap-2 md:gap-3 mt-4 md:mt-6 overflow-x-auto px-1 md:px-2">
        {galleryWithMain.map((img, idx) => (
          <button
            key={idx}
            onClick={() => changeImage(img.url)}
            type="button"
            className={`flex-shrink-0 rounded-lg overflow-hidden border transition-colors ${
              img.url === selected 
                ? "border-orange-500 ring-2 ring-orange-200" 
                : "border-gray-200 hover:border-gray-300"
            } 
            /* Mobile first sizing */
            w-20 h-20 
            /* Tablet sizing */
            md:w-16 md:h-16
            /* Large screens */
            lg:w-18 lg:h-18`}
          >
            <Image
              src={img.url}
              alt={`${name} thumb ${idx}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Mobile indicator (optional - for debugging) */}
      {isMobileView && (
        <div className="md:hidden text-xs text-gray-500 text-center mt-2">
          Tap thumbnails to change image
        </div>
      )}
    </div>
  );
}