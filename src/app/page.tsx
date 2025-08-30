import Feature from "@/components/Feature";
import HeroSection from "@/components/HeroSection";
import Trending from "@/components/Trending";
import Testimonials from "@/components/Testimonial";
export default function Home() {
  return (
    <div>
      <HeroSection/>
      <Trending/>
      <Feature/>
      <Testimonials/>
    </div>
  );
}