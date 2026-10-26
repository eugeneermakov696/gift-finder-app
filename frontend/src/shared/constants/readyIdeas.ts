export interface BudgetTier {
  id: string;
  badge: string;
  subtitle: string;
  minPrice?: number;
  maxPrice?: number;
  imgName: string;
}

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-15',
    badge: 'under $15',
    subtitle: 'Small Surprises',
    minPrice: 0,
    maxPrice: 15,
    imgName: 'image1.png',
  },
  {
    id: '15-40',
    badge: '$15 to $40',
    subtitle: 'Thoughtful',
    minPrice: 15,
    maxPrice: 40,
    imgName: 'image2.png',
  },
  {
    id: '40-100',
    badge: '$40 to $100',
    subtitle: 'Sweet Spot',
    minPrice: 40,
    maxPrice: 100,
    imgName: 'image3.png',
  },
  {
    id: '100-200',
    badge: '$100 to $200',
    subtitle: 'Premium',
    minPrice: 100,
    maxPrice: 200,
    imgName: 'image4.png',
  },
  {
    id: '200-plus',
    badge: '$200+',
    subtitle: 'Special',
    minPrice: 200,
    maxPrice: undefined,
    imgName: 'image5.png',
  },
];