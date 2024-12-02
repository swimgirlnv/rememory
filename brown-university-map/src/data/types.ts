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
  status: "approved" | "pending" | "rejected";
  dismissedBy: string[];
}

export type PinData = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  createdBy: string;
};

export interface PathData {
  id: string;
  name: string;
  pins: string[];
  memory: string;
  year: number;
  classYear: string;
  media?: MediaItem[]; // Unified media array
  createdBy: string;
  tags: string[];
  status: "approved" | "pending" | "rejected";
  dismissedBy: string[];
}