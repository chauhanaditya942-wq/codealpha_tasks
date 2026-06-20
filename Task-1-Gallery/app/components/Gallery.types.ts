export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  dateAdded: number; // timestamp, used for "Newest" sort
  isUploaded?: boolean; // true for user-uploaded images
}

export const CATEGORIES = ["All", "Nature", "Architecture", "Travel", "Portrait"] as const;
export type Category = typeof CATEGORIES[number];

// Replace these src URLs with your own images (e.g. /images/xyz.jpg placed in /public)
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    alt: "Misty mountain range at sunrise",
    category: "Nature",
    title: "Misty Peaks",
    dateAdded: 1750000000000,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    alt: "Golden wheat field under blue sky",
    category: "Nature",
    title: "Golden Fields",
    dateAdded: 1749913600000,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
    alt: "Modern glass skyscraper facade",
    category: "Architecture",
    title: "Glass Tower",
    dateAdded: 1749827200000,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
    alt: "Spiral staircase from above",
    category: "Architecture",
    title: "Spiral Form",
    dateAdded: 1749740800000,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80",
    alt: "Narrow street in old European town",
    category: "Travel",
    title: "Old Town Alley",
    dateAdded: 1749654400000,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80",
    alt: "Tropical beach with turquoise water",
    category: "Travel",
    title: "Turquoise Shore",
    dateAdded: 1749568000000,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80",
    alt: "Close up portrait with dramatic lighting",
    category: "Portrait",
    title: "Dramatic Light",
    dateAdded: 1749481600000,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80",
    alt: "Portrait of a man smiling outdoors",
    category: "Portrait",
    title: "Candid Smile",
    dateAdded: 1749395200000,
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80",
    alt: "Forest path with sunlight streaming through trees",
    category: "Nature",
    title: "Sunlit Path",
    dateAdded: 1749308800000,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80",
    alt: "Interior of a minimalist concrete building",
    category: "Architecture",
    title: "Concrete Minimal",
    dateAdded: 1749222400000,
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&q=80",
    alt: "Aerial view of a winding mountain road",
    category: "Travel",
    title: "Winding Road",
    dateAdded: 1749136000000,
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80",
    alt: "Black and white portrait of a woman",
    category: "Portrait",
    title: "Monochrome Gaze",
    dateAdded: 1749049600000,
  },
];