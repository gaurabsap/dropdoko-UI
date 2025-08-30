import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#f9f5f2] py-16 px-4 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/bg.png"
          alt="Background Watermark"
          width={800}
          height={800}
          className="opacity-10 object-contain max-w-full h-auto"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-gray-900 mb-4 leading-tight w-full max-w-none">
            Nepal’s Everyday Essentials Delivered
           </p>


          <p className="text-lg font-semibold text-orange-800 mb-4">
            Rooted in <span className="text-orange-500">tradition</span>.{" "}
            <span className="text-orange-500">Delivered</span> with care.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            DropDoko is a modern Nepali store dedicated to making everyday
            shopping simple, fast, and reliable.
          </p>

          <p className="text-gray-700 mb-8 leading-relaxed">
            Inspired by the traditional doko — a symbol of hard work and community — 
            we’ve reimagined how daily essentials reach your home. From household 
            items to lifestyle products, we source from trusted local and global 
            suppliers to bring quality goods right to your doorstep. At DropDoko, 
            we blend tradition with technology to deliver convenience you can count on.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-5 z-50">
            <Link href="/shop">
              <button className="!bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2">
                Shop Now →
              </button>
            </Link>

            <Link href="/about">
              <button className="border font-bold border-orange-500 text-orange-500 hover:bg-orange-100 px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2">
                Learn More →
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center">
          <Image
            src="/doko.png"
            alt="DropDoko Basket Icon"
            width={550}
            height={600}
            className="max-w-full h-auto rotate-12"
          />
        </div>
      </div>
    </section>
  );
}
