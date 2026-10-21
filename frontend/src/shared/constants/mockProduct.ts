export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  rating: number;
  title: string;
  date: string;
  location: string;
  purchased_options?: string;
  text: string;
  image?: string;
  helpful_count: number;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ExtendedProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count: number;
  amazon_url?: string;
  image_url: string;
  options: {
    colors: string[];
    sizes: string[];
  };
  features: ProductFeature[];
  specifications: Record<string, string>;
  care_instructions: string[];
  reviews: Review[];
}

export const mockPantsProduct: ExtendedProduct = {
  id: 102,
  title: 'Hiking Pants Women Quick Dry',
  category: 'Gifts for Mom',
  price: 14.99,
  original_price: 18.88,
  rating: 5,
  reviews_count: 1,
  amazon_url: '#',
  image_url: 'https://m.media-amazon.com/images/I/71p-example.jpg',
  options: {
    colors: ['Gray', 'Black', 'Khaki'],
    sizes: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18'],
  },
  features: [
    {
      title: '【Quick Dry Fabric】:',
      description:
        "These Womens Hiking Pants Are Made With Lightweight Fabric That Repels Light Moisture And Dries Quickly, Helping You Stay Comfortable In Changing Conditions. Designed For Easy Movement And All-Day Wear, They're Perfect For Hiking, Travel, And Everyday Outdoor Adventures.",
    },
    {
      title: '【Straight Fit】:',
      description:
        "Designed For All Body Types, These Women'S Work Pants Feature A Flattering Straight Leg Silhouette That Elongates Your Frame.Give You Best Wear Experience, Made Specifically To Adapt To Your Look And Lifestyle.",
    },
    {
      title: '【Elastic Waist】:',
      description:
        "The Elastic Waistband With An Adjustable Drawstring Gives A Secure Yet Flexible Fit That Adapts To Different Body Types. Designed For All-Day Ease, It Provides Reliable Support And Comfort Whether You're Relaxing Casually Or Staying Active Outdoors. 4 Way Stretch Fabric Increases Mobility And Flexibility.",
    },
    {
      title: '【Versatile For Any Adventure】:',
      description:
        'Womens Wide Leg Pants Are Suitable For Workout, Hiking, Running, Going Out, Mountain Climbing, Travel, Gym, Daily Wear, Casual, And Sports.',
    },
    {
      title: '【Tips】:',
      description:
        'Our Quick Dry Hiking Pants Are Machine Washable (Cold Water, Tumble Dry Low) And Wrinkle-Resistant, They Stay Looking Fresh After Heavy Use.',
    },
  ],
  specifications: {
    'Fabric type': 'Nylon, Spandex',
    'Care instructions': 'Machine Wash',
    'Closure type': 'Pull On',
    'Leg style': 'Wide',
  },
  care_instructions: [
    'Our Quick Dry Hiking Pants Are Machine Washable (Cold Water, Tumble Dry Low) And Wrinkle-Resistant, They Stay Looking Fresh After Heavy Use. Ideal For Work, Hiking, Camping, Or Everyday Wear.',
  ],
  reviews: [
    {
      id: 'r1',
      reviewer_name: 'Om Hun',
      reviewer_avatar: '/placeholder-avatar.jpg',
      rating: 5,
      title: 'best yet hiking pants quick dry!',
      location: 'Canada',
      date: 'July 13, 2026',
      purchased_options: 'Colour Name: Gray | Size: XX-Large',
      text: "I ordered these pants in Gray in 2X-Large, which is my usual/recommended size. I'm about 6'3\" 155-160 and they fit just right. The length is perfect. The material is the thin, stretchy kind that I know will dry fast.",
      image: '/placeholder-review.jpg',
      helpful_count: 2,
    },
  ],
};