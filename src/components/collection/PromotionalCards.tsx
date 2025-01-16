import { Star, Rocket, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

const PromotionalCards = () => {
  const promotions = [
    {
      icon: Star,
      title: "Premium Quality",
      description: "Expert care for your garments",
    },
    {
      icon: Rocket,
      title: "Quick Service",
      description: "24-hour turnaround available",
    },
    {
      icon: Gift,
      title: "First Time Offer",
      description: "20% off your first booking",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {promotions.map((promo, index) => (
        <Card key={index} className="p-4 text-center bg-white shadow-md">
          <promo.icon className="mx-auto mb-2 text-secondary w-8 h-8" />
          <h3 className="font-semibold mb-1">{promo.title}</h3>
          <p className="text-sm text-gray-600">{promo.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default PromotionalCards;