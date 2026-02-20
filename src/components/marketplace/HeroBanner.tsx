import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";

const slides = [
  {
    image: heroBanner1,
    title: "Grandes Promotions",
    subtitle: "Jusqu'à -50% sur l'électronique et la mode",
    cta: "Voir les offres",
    link: "/products?discount=true",
  },
  {
    image: heroBanner2,
    title: "Livraison Gratuite",
    subtitle: "Sur toutes les commandes de plus de 50 000 FCFA",
    cta: "Commander maintenant",
    link: "/products",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-[21/9] md:aspect-[3/1]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-md space-y-3">
                <h2 className="text-2xl md:text-4xl font-display font-bold text-secondary-foreground">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg text-secondary-foreground/80">
                  {slide.subtitle}
                </p>
                <Link to={slide.link}>
                  <Button className="marketplace-gradient text-primary-foreground border-0 font-semibold mt-2">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-primary w-6" : "bg-card/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
