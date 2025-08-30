"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroSection() {
  const gradient = "bg-[#ED6E0A]"
  const slides = [
    {
      src: "/hello2.png",
      alt: "Premium Mobile Stand",
      title: "Style meets function",
      description:
        "Sleek mobile stands designed for style, stability, and comfort. Crafted from premium materials with precision engineering.",
      cta: "Shop Stands",
      badge: "Bestseller",
      gradient: "bg-gradient-to-br from-orange-200 via-orange-300 to-orange-100",
    },
    {
      src: "/prod2.png",
      alt: "Smart Magnetic Stand",
      title: "Next-Gen Magnetic Technology",
      description:
        "Experience the future of phone docking with our powerful magnetic precision. Perfect alignment every time with effortless placement.",
      cta: "Explore Tech",
      badge: "New",
    },
    {
      src: "/prod4.png",
      alt: "Stylish Adjustable Stand",
      title: "Style Meets Function",
      description:
        "Elegant adjustable stands for everyday use. Multiple viewing angles with a premium feel that complements any environment.",
      cta: "View Collection",
      badge: "Featured",
    },
  ];

  return (
    <section className="w-full h-[400px] sm:h-[500px] lg:h-[70vh] lg:max-h-[500px] relative overflow-hidden px-4 sm:px-10 lg:px-20 rounded-2xl mt-6 lg:mt-10">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1200}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass: "custom-bullet",
          bulletActiveClass: "custom-bullet-active",
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        className="w-full h-full rounded-2xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`relative w-full h-full flex flex-col lg:flex-row items-center justify-center overflow-hidden ${gradient} rounded-2xl py-6 sm:py-8 lg:py-0`}
            >
              {/* LEFT: CONTENT */}
              <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-4 sm:px-6 lg:px-10 py-4 lg:py-6">
                <div className="w-full text-center lg:text-left">
                  {slide.badge && (
                    <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl lg:text-[48px] font-extrabold text-white mb-3 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-[20px] text-white lg:text-[#333333] mb-5">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <button className="px-6 py-2 bg-transparent border-1 border-[#F4EFEA] text-white font-medium rounded-full transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg lg:text-[24px]">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: IMAGE */}
              <div className="relative w-full sm:w-[400px] lg:w-[500px] h-[200px] sm:h-[350px] lg:h-[400px] flex items-center justify-center">
                <div className="absolute top-0 -right-10 w-[300px] sm:w-[400px] lg:w-[450px] h-[250px] sm:h-[400px] lg:h-[500px] bg-gray-300 rounded-2xl blur-[100px] sm:blur-[150px] lg:blur-[190px]"></div>

                <div className="relative z-10">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={700}
                    height={400}
                    className="object-contain max-h-[180px] sm:max-h-[300px] lg:max-h-[400px]"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="custom-pagination absolute bottom-4 w-full flex justify-center z-10 space-x-2"></div>

      {/* Navigation Buttons - Hidden on mobile, visible on sm and up */}
      <button className="custom-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-orange-500/30 backdrop-blur-sm border border-orange-400/40 transition-all duration-300">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-orange-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="custom-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-orange-500/30 backdrop-blur-sm border border-orange-400/40 transition-all duration-300">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-orange-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Pagination Styles */}
      <style jsx global>{`
        .custom-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .custom-bullet-active {
          background: #f97316;
          width: 20px;
          border-radius: 8px;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
        }
        
        @media (min-width: 640px) {
          .custom-bullet {
            width: 10px;
            height: 10px;
            margin: 0 5px;
          }
          .custom-bullet-active {
            width: 26px;
          }
        }
      `}</style>
    </section>
  );
}