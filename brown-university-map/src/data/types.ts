export interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  memory: string;
  year: number;
  classYear: string;
  media?: {
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
  };
}

export interface PathData {
  id: string;
  name: string;
  markers: string[];
  memory: string;
  year: number;
  classYear: string;
  media?: {
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
  };
}