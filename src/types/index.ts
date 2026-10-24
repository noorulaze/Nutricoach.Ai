export interface Program {
  id: string;
  title: string;
  category: 'Hypertrophy' | 'Strength' | 'HIIT' | 'Athletics' | 'Recovery' | 'Women';
  tagline: string;
  description: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  durationWeeks: number;
  sessionsPerWeek: number;
  targetFocus: string;
  coach: string;
  coachRole: string;
  image: string;
  features: string[];
  curriculum: { phase: string; focus: string; duration: string }[];
  caloriesBurnEstimate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  category: 'Master' | 'Strength' | 'Conditioning' | 'Nutrition' | 'Rehab';
  experienceYears: number;
  bio: string;
  image: string;
  certifications: string[];
  achievements: string[];
  quote: string;
  rating: number;
  reviewCount: number;
  clientsTrained: number;
  socials: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  popular?: boolean;
  features: { name: string; included: boolean }[];
  highlightPerks: string[];
  idealFor: string;
}

export interface FacilityZone {
  id: string;
  name: string;
  subtitle: string;
  sqft: string;
  description: string;
  image: string;
  equipmentHighlights: string[];
  amenities: string[];
  hours: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  profession: string;
  category: 'Fat Loss' | 'Hypertrophy' | 'Strength' | 'Rehab';
  achievement: string;
  quote: string;
  duration: string;
  trainer: string;
  image: string;
  stats: { label: string; value: string }[];
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}
