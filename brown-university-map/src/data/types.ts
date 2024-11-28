export interface MediaItem {
  url: string;
  type: "image" | "video" | "audio";
}

export interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  memory: string;
  year: number;
  classYear: string;
  media?: MediaItem[]; // Unified media array
  createdBy: string;
  tags: string[];
}

export interface PathData {
  id: string;
  name: string;
  markers: string[];
  memory: string;
  year: number;
  classYear: string;
  media?: MediaItem[]; // Unified media array
  createdBy: string;
  tags: string[];
}