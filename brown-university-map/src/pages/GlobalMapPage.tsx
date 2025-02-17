import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import InteractiveMap from "../components/InteractiveMap";
import "../styles/GlobalMapPage.css";
import { MarkerData, PathData } from "../data/types";

const GlobalMapPage: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser
  ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email ?? "unknown@domain.com", // ✅ Provide a default email
    }
  : { uid: "anonymous", email: "anonymous@domain.com" };
  // **Real-time Marker & Path Listener**
  useEffect(() => {
    const unsubscribeMarkers = onSnapshot(collection(db, "markers"), (snapshot) => {
      setMarkers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MarkerData[]);
    });

    const unsubscribePaths = onSnapshot(collection(db, "paths"), (snapshot) => {
      setPaths(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as PathData[]);
    });

    return () => {
      unsubscribeMarkers();
      unsubscribePaths();
    };
  }, []);

  // **Add New Marker**
  const handleAddMarker = async (newMarker: Omit<MarkerData, "id" | "reports">) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "markers"), {
        ...newMarker,
        createdBy: currentUser.uid,
        reports: [], // ✅ Initialize reports array
      });
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  // **Delete Marker (Only if User is the Creator)**
  const handleDeleteMarker = async (markerId: string) => {
    const marker = markers.find((m) => m.id === markerId);
    if (!marker || marker.createdBy !== currentUser?.uid) {
      alert("You can only delete your own markers.");
      return;
    }

    try {
      await deleteDoc(doc(db, "markers", markerId));
      setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  // **Report Marker**
  const handleReportMarker = async (markerId: string) => {
    if (!currentUser) return;

    const marker = markers.find((m) => m.id === markerId);
    if (!marker) return;

    // ✅ Prevent duplicate reports
    if (marker.reports.includes(currentUser.uid)) {
      alert("You've already reported this marker.");
      return;
    }

    try {
      const updatedReports = [...marker.reports, currentUser.uid];

      // **Auto-delete if 5 reports**
      if (updatedReports.length >= 5) {
        await deleteDoc(doc(db, "markers", markerId));
        setMarkers((prev) => prev.filter((m) => m.id !== markerId));
      } else {
        await updateDoc(doc(db, "markers", markerId), { reports: updatedReports });
      }
    } catch (error) {
      console.error("Error reporting marker:", error);
    }
  };

  return (
    <div className="global-map-page">
      <InteractiveMap
        isEditingMode={false}
        isPathEditMode={false}
        viewMode="both"
        markers={markers}
        paths={paths}
        selectedPins={[]}
        setSelectedPins={() => {}}
        onAddMarker={handleAddMarker}
        onDeleteMarker={handleDeleteMarker}
        onReportMarker={handleReportMarker} // ✅ Pass report function
        onAddPath={() => {}}
        onDeletePath={() => {}}
        onEditMarker={() => {}}
        onEditPath={() => {}}
        currentUser={currentUser || { uid: "anonymous", email: "anonymous@domain.com" }}
        onBoundsChange={() => {}}
        panTo={null}
        mapId="global"
      />
    </div>
  );
};

export default GlobalMapPage;