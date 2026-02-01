import { Club, Referee } from "./types";

export const SOUTHAMPTON_AREAS = [
  "Bargate", "Bassett", "Bevois", "Bitterne", "Bitterne Park", "Coxford", 
  "Freemantle", "Harefield", "Millbrook", "Peartree", "Portswood", 
  "Redbridge", "Shirley", "Sholing", "Swaythling", "Woolston"
];

export const MOCK_CLUBS: Club[] = [
  {
    id: "c1",
    name: "Southampton City FC",
    league: "Southampton Saturday League",
    location: "Millbrook",
    logoUrl: "https://picsum.photos/id/10/100/100"
  },
  {
    id: "c2",
    name: "Bitterne Park United",
    league: "Tyro League (Sunday)",
    location: "Bitterne Park",
    logoUrl: "https://picsum.photos/id/12/100/100"
  },
  {
    id: "c3",
    name: "Shirley Rangers",
    league: "Hampshire Premier",
    location: "Shirley",
    logoUrl: "https://picsum.photos/id/14/100/100"
  }
];

export const MOCK_REFEREES: Referee[] = [
  {
    id: "r1",
    name: "John Whistle",
    badgeLevel: "Level 5 (Senior)",
    location: "Portswood",
    experienceYears: 12,
    availableDays: ["Saturday", "Sunday"],
    avatarUrl: "https://picsum.photos/id/1005/100/100",
    isMinor: false
  },
  {
    id: "r2",
    name: "Sarah Flags",
    badgeLevel: "Level 7 (Junior)",
    location: "Totton",
    experienceYears: 2,
    availableDays: ["Sunday"],
    avatarUrl: "https://picsum.photos/id/1011/100/100",
    isMinor: true,
    parentContact: "parent@example.com"
  },
  {
    id: "r3",
    name: "Mike Card",
    badgeLevel: "Level 6",
    location: "Woolston",
    experienceYears: 5,
    availableDays: ["Saturday"],
    avatarUrl: "https://picsum.photos/id/1025/100/100",
    isMinor: false
  },
  {
    id: "r4",
    name: "Davina Rule",
    badgeLevel: "Level 4",
    location: "Bassett",
    experienceYears: 15,
    availableDays: ["Saturday", "Sunday"],
    avatarUrl: "https://picsum.photos/id/1027/100/100",
    isMinor: false
  }
];