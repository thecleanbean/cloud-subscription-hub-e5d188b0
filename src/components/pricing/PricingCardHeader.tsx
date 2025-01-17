import { ShoppingBag } from "lucide-react";

interface PricingCardHeaderProps {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  icon: string;
}

export const PricingCardHeader = ({
  name,
  price,
  annualPrice,
  description,
  icon,
}: PricingCardHeaderProps) => {
  return (
    <div className="text-center mb-4 md:mb-6">
      <div className="flex justify-center mb-3 md:mb-4">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <ShoppingBag className="w-full h-full text-primary" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base md:text-lg font-bold text-primary">
            {icon}
          </span>
        </div>
      </div>
      <h3 className="text-base md:text-lg font-bold text-primary mb-2">{name}</h3>
      <div className="text-2xl md:text-3xl font-black text-primary mb-1 md:mb-2">{price}</div>
      <div className="text-xs md:text-sm text-accent mb-2">{annualPrice}</div>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </div>
  );
};