import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { Testimonials } from "@/components/home/Testimonials";
import { BrandsSection } from "@/components/home/BrandsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrendingProducts />
      <Testimonials />
      <BrandsSection />
      <WhyChooseUs />
      <NewsletterSection />
    </main>
  );
}
