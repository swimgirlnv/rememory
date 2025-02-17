// Define the media types available for markers and paths.
export interface MediaItem {
  url: string;
  type: "image" | "video" | "audio";
}

// Marker data interface representing a location marker on the map.
export interface MarkerData {
  id: string;                     // Unique identifier for the marker
  name: string;                   // Marker name or title
  lat: number;                    // Latitude coordinate
  lng: number;                    // Longitude coordinate
  memory: string;                 // Memory or description associated with the marker
  year: number;                   // Year associated with the marker
  classYear: string;              // Class year (e.g., "Freshman", "Senior")
  media?: MediaItem[];            // Array of media items (optional)
  createdBy: string;              // UID of the creator
  tags: string[];                 // Tags or categories for the marker
  status: "approved" | "pending" | "rejected"; // Approval status of the marker
  dismissedBy: string[];          // List of users who dismissed the marker
  reports: string[];              // List of users who reported the marker
}

// Pin data type representing basic information for pins on the map.
export type PinData = {
  id: string;                     // Unique identifier for the pin
  lat: number;                    // Latitude coordinate
  lng: number;                    // Longitude coordinate
  name: string;                   // Pin name or title
  createdBy: string;              // UID of the creator
};

// Path data interface representing a pathway connecting multiple pins.
export interface PathData {
  id: string;                     // Unique identifier for the path
  name: string;                   // Path name or title
  pins: string[];                 // Array of pin IDs the path connects
  memory: string;                 // Memory or description associated with the path
  year: number;                   // Year associated with the path
  classYear: string;              // Class year (e.g., "Freshman", "Senior")
  media?: MediaItem[];            // Array of media items (optional)
  createdBy: string;              // UID of the creator
  tags: string[];                 // Tags or categories for the path
  status: "approved" | "pending" | "rejected"; // Approval status of the path
  dismissedBy: string[];          // List of users who dismissed the path
}

// Utility interface to define map boundaries.
export interface MapBounds {
  north: number;                  // Northernmost latitude
  south: number;                  // Southernmost latitude
  east: number;                   // Easternmost longitude
  west: number;                   // Westernmost longitude
}

// User data type for authenticated users.
export interface UserData {
  uid: string;                    // User ID
  email: string;                  // User's email address
  displayName?: string;           // Optional display name
  isAdmin: boolean;               // Whether the user has admin privileges
  friends: string[];              // Array of user IDs for friends
  myMaps: string[];                 // Array of map IDs created by the user
  invitedMaps: string[];          // Array of map IDs the user is invited to
}

export interface ActivityData {
  id: string;
  type: "new_marker" | "new_map" | "edit_marker" | "group_update";
  userId: string;                // Who performed the action
  userName: string;
  timestamp: number;
  mapId?: string;
  markerId?: string;
  groupId?: string;
  details?: string;
}