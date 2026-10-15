export interface FeatureCardProps {
  imgName: string;
  title: string;
  desc: string;
  w: string;
  h: string;
}

export const FEATURES_DATA: Record<string, FeatureCardProps> = {
  life: {
    imgName: 'lifestyle.png',
    title: 'Personality & Lifestyle Matching',
    desc: 'Target their actual vibe — from Cozy Homebodies and Tech Geeks to Foodies and Outdoor Explorers.',
    w: '410',
    h: '406',
  },
  context: {
    imgName: 'context.png',
    title: 'Relationship Context',
    desc: "Calibrate risk and tone for any dynamic — whether it's for a romantic partner, parent, distant cousin, or coworker.",
    w: '411',
    h: '271',
  },
  budget: {
    imgName: 'budget.png',
    title: 'Strict Budget Limits',
    desc: 'Set precise spending brackets from under $15 to $200+. We never push products outside what you plan to spend.',
    w: '411',
    h: '271',
  },
  occasion: {
    imgName: 'occasion.png',
    title: 'Cover Every Occasion',
    desc: 'Curated collections ready for Birthdays, Housewarmings, Anniversaries, Holidays, or just because.',
    w: '411',
    h: '404',
  },
  quality: {
    imgName: 'quality.png',
    title: 'Verified 4★+ Amazon Quality',
    desc: 'We filter out sponsored junk and low-tier knockoffs. Every item comes backed by proven reviews and high ratings.',
    w: '411',
    h: '402',
  },
  checkout: {
    imgName: 'checkout.png',
    title: 'Frictionless Prime Checkout',
    desc: 'Save your favorite ideas with one tap or buy directly on Amazon with standard Prime perks, fast delivery, and simple returns.',
    w: '411',
    h: '271',
  },
};

export const DESKTOP_ORDER = ['life', 'context', 'budget', 'occasion', 'quality', 'checkout'];
export const MOBILE_ORDER = ['life', 'context', 'occasion', 'budget', 'quality', 'checkout'];