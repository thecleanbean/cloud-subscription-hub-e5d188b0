interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

export const getCommonFeatures = (bagCount: string, isYearly: boolean) => {
  const calculateYearlyAddonPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.9).toFixed(2);
  };

  return [
    { 
      name: `${bagCount} per month`, 
      included: true,
      description: `${bagCount === '1 Bag' ? 'One' : bagCount} standard-sized laundry bag${bagCount !== '1 Bag' ? 's' : ''} that can hold up to ${parseInt(bagCount) * 8}kg of clothes total`
    },
    { 
      name: "Smart locker access", 
      included: true,
      description: "24/7 access to our secure smart lockers. Drop off and pick up your laundry at your convenience"
    },
    { 
      name: "2-day turnaround", 
      included: true,
      description: "Get your clean clothes back within 48 hours of drop-off"
    },
    { 
      name: "In-store pickup included", 
      included: true,
      description: "Free pickup from any of our store locations"
    },
    { 
      name: `Optional home delivery (${isYearly ? '£' + calculateYearlyAddonPrice(7.95) : '£7.95'})/${isYearly ? 'year' : 'month'}`, 
      included: true,
      description: "Have your clean clothes delivered right to your doorstep"
    },
    { 
      name: `Optional sorting service (${isYearly ? '£' + calculateYearlyAddonPrice(5.95) : '£5.95'})/${isYearly ? 'year' : 'month'}`, 
      included: true,
      description: "We'll sort your clothes by color, fabric type, and care instructions"
    },
  ];
};

export const calculateYearlyPrice = (monthlyPrice: string) => {
  const price = parseFloat(monthlyPrice.replace('£', ''));
  const yearlyPrice = (price * 12 * 0.9).toFixed(2);
  return `£${yearlyPrice}`;
};

export const pricingPlans = [
  {
    name: "1 Bag Plan",
    monthlyPrice: "£31.95",
    description: "Perfect for individuals with minimal laundry needs",
    icon: "1",
  },
  {
    name: "2 Bags Plan",
    monthlyPrice: "£57.95",
    description: "Ideal for couples or small households",
    icon: "2",
  },
  {
    name: "3 Bags Plan",
    monthlyPrice: "£78.95",
    description: "Perfect for families",
    isPopular: true,
    icon: "3",
  },
  {
    name: "4 Bags Plan",
    monthlyPrice: "£100.95",
    description: "Best value for large families",
    icon: "4",
  },
  {
    name: "Weekly Plan",
    monthlyPrice: "£109.95",
    description: "1 Bag collected, cleaned and returned weekly",
    icon: "W",
    customFeatures: true,
  },
  {
    name: "Bag Swap",
    monthlyPrice: "£179.95",
    description: "Drop Clean, Take Dirty - twice a week",
    icon: "↻",
    customFeatures: true,
  },
];