export enum UserRole {
  GUEST = 'GUEST',
  CLUB = 'CLUB',
  REFEREE = 'REFEREE',
}

export interface Referee {
  id: string;
  name: string;
  badgeLevel: string; // e.g., "Level 7", "Level 5"
  location: string; // Southampton area, e.g., "Shirley", "Bitterne"
  experienceYears: number;
  availableDays: string[]; // "Saturday", "Sunday"
  avatarUrl: string;
  // Compliance & Safeguarding fields
  faNumber?: string; // FA Number (FAN)
  dob?: string;
  isMinor?: boolean; // True if under 18
  parentContact?: string; // Parent email/phone if minor
}

export interface Club {
  id: string;
  name: string;
  league: string;
  location: string;
  logoUrl: string;
}

export interface Fixture {
  id: string;
  clubId: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  league: string;
  ageGroup: string; // "U14", "Adults"
  status: 'OPEN' | 'MATCHED' | 'COMPLETED';
  assignedRefereeId?: string;
  aiAnalysis?: string; // Analysis text from Gemini
}

export interface MatchRecommendation {
  refereeId: string;
  score: number; // 0-100 match score
  reasoning: string;
}