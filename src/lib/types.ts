export interface Experience {
  title: string;
  shortDescription: string;
  location: string;
  slug: string;
  category: string;
  overview: string;
  activities: string[];
  includes: string[];
  whatToBring: string[];
  featuredImage: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  price1to2: string;
  price3to6: string;
  price7: string;
  groupPrice: string;
  groups: boolean;
  halfDay: boolean;
  threeQuartersDay: boolean;
  fullDay: boolean;
  thrilling: boolean;
  hike: boolean;
  floraAndFauna: boolean;
  relax: boolean;
  water: boolean;
  cultural: boolean;
  gourmet: boolean;
  status: boolean;
  videoLink: string;
  difficulty: string;
  createdAt: string;
}

export interface HomePageContent {
  title: string;
  subtitle: string;
  description: string;
  background: string;
}

export interface CancellationPolicy {
  title: string;
  description: string;
}
