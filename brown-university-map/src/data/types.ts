// types.ts

export interface MarkerData {
    id?: string;
    name: string;
    lat: number;
    lng: number;
    memory: string;
    media?: {
      images?: string[];
      videoUrl?: string;
      audioUrl?: string;
    };
  }
  
  export interface PathData {
    id?: string;
    name: string;
    markers: string[]; // Array of marker IDs
    memory: string;
    media?: {
      images?: string[];
      videoUrl?: string;
      audioUrl?: string;
    };
  }