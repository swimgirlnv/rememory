import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import InteractiveMap from "../components/InteractiveMap";
import ControlPanel from "../components/ControlPanel";
import EditMarkerModal from "../components/EditMarkerModal";
import EditPathModal from "../components/EditPathModal";
import ViewDetailsModal from "../components/ViewDetails";
import { db } from "../../firebaseConfig";
import { MarkerData, MediaItem, PathData, PinData } from "../data/types";
import "../styles/MapDetailPage.css";

const MapDetailPage: React.FC = () => {
  const { mapId } = useParams<{ mapId?: string }>();
  const [mapName, setMapName] = useState<string>("");
  const [mapVisibility, setMapVisibility] = useState<"public" | "private">("private");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [pins, setPins] = useState<PinData[]>([]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isPathEditMode, setIsPathEditMode] = useState(false);
  const [selectedPins, setSelectedPins] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);
  const [editingPath, setEditingPath] = useState<PathData | null>(null);
  const [viewMode, setViewMode] = useState<"markers" | "paths" | "both">("both");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!mapId) return;

    const markersQuery = query(collection(db, "markers"), where("mapId", "==", mapId));
    const pathsQuery = query(collection(db, "paths"), where("mapId", "==", mapId));

    const unsubscribeMarkers = onSnapshot(markersQuery, (snapshot) => {
      setMarkers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          media: (doc.data().media ?? []) as MediaItem[],
        })) as MarkerData[]
      );
    });

    const unsubscribePaths = onSnapshot(pathsQuery, (snapshot) => {
      setPaths(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          media: (doc.data().media ?? []) as MediaItem[],
        })) as PathData[]
      );
    });

    const fetchMapData = async () => {
      const mapDoc = await getDoc(doc(db, "maps", mapId));
      if (mapDoc.exists()) {
        setMapName(mapDoc.data().name);
        setMapVisibility(mapDoc.data().visibility || "private");
      }
    };

    fetchMapData();

    return () => {
      unsubscribeMarkers();
      unsubscribePaths();
    };
  }, [mapId]);

  // Toggle editing modes
  const toggleEditingMode = () => setIsEditingMode((prev) => !prev);
  const togglePathEditMode = () => setIsPathEditMode((prev) => !prev);

  // Toggle map visibility & log activity
  const toggleVisibility = async () => {
    if (!mapId || !currentUser) return;
    const newVisibility = mapVisibility === "private" ? "public" : "private";

    try {
      await updateDoc(doc(db, "maps", mapId), { visibility: newVisibility });
      setMapVisibility(newVisibility);

      // Log activity
      await addDoc(collection(db, "activityFeed"), {
        type: "visibility_change",
        userId: currentUser.uid,
        userName: currentUser.displayName || "Unknown User",
        timestamp: Date.now(),
        mapId: mapId,
        details: `${currentUser.displayName} made the map ${newVisibility}`,
      });
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  return (
    <div className="map-detail-page">
      <div className="map-header">
        <h1>{mapName}</h1>
      </div>

      <ControlPanel
        isEditingMode={isEditingMode}
        isPathEditMode={isPathEditMode}
        selectedPins={selectedPins}
        pins={pins}
        markers={markers}
        mapVisibility={mapVisibility}
        onFilter={() => {}}
        onEditModeToggle={toggleEditingMode}
        onPathEditModeToggle={togglePathEditMode}
        onCreatePath={() => {}}
        onToggleVisibility={toggleVisibility}
      />

      <InteractiveMap
        isEditingMode={isEditingMode}
        isPathEditMode={isPathEditMode}
        viewMode={viewMode}
        markers={markers}
        paths={paths}
        selectedPins={selectedPins}
        setSelectedPins={setSelectedPins}
        onAddMarker={() => {}}
        onDeleteMarker={() => {}}
        onEditMarker={() => {}}
        onAddPath={() => {}}
        onDeletePath={() => {}}
        onEditPath={() => {}}
        onBoundsChange={() => {}}
        currentUser={currentUser}
        panTo={null}
        mapId={mapId || ""}
      />

      <EditMarkerModal
        isOpen={!!editingMarker}
        onClose={() => setEditingMarker(null)}
        onSave={() => {}}
        data={editingMarker}
      />

      <EditPathModal
        isOpen={!!editingPath}
        onClose={() => setEditingPath(null)}
        data={editingPath}
        onSave={() => {}}
        onDelete={() => {}}
      />

      <ViewDetailsModal isOpen={false} data={null} onClose={() => {}} />
    </div>
  );
};

export default MapDetailPage;