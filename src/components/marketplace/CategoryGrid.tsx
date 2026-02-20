import { Link } from "react-router-dom";
import { Smartphone, Shirt, Home, Apple, Sparkles, Dumbbell, BookOpen, Car } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-6 w-6" />,
  Shirt: <Shirt className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Apple: <Apple className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Dumbbell: <Dumbbell className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Car: <Car className="h-6 w-6" />,
};

const CategoryGrid = () => {
  return (
    <section>
      <h2 className="font-display font-bold text-xl text-foreground mb-4">
        Parcourir par catégorie
      </h2>
      
    </section>
  );
};

export default CategoryGrid;
