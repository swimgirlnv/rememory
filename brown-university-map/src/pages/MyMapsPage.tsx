import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ShareMapModal from "../components/ShareMapModal";
import { db } from "../../firebaseConfig";
import "../styles/MyMapsPage.css";

interface MapData {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  createdBy: string;
  visibility: "public" | "private" | "collaborative";
  invitedUsers?: Record<string, boolean>;
  lastUpdated?: Timestamp;
}

const MyMapsPage: React.FC = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [filteredMaps, setFilteredMaps] = useState<MapData[]>([]);
  const [filter, setFilter] = useState<"all" | "public" | "private" | "collaborative">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "lastUpdated">("lastUpdated");
  const [newMapName, setNewMapName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Fetch maps with real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "maps"), (snapshot) => {
      const user = auth.currentUser;

      if (user) {
        const fetchedMaps = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as MapData))
          .filter(
            (map) =>
              map.createdBy === user.uid || // Owner
              map.visibility === "public" || // Public maps
              map.invitedUsers?.[user.uid] || // Invited by UID
              map.invitedUsers?.[user.email!] // Invited by email
          );

        setMaps(fetchedMaps);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Filter and sort maps
  useEffect(() => {
    let filtered = maps;

    if (filter !== "all") {
      filtered = maps.filter((map) => map.visibility === filter);
    }

    filtered.sort((a, b) =>
      (b[sortBy]?.toMillis() || 0) - (a[sortBy]?.toMillis() || 0)
    );

    setFilteredMaps(filtered);
  }, [maps, filter, sortBy]);

  const handleViewMap = (mapId: string) => {
    navigate(`/map/${mapId}`);
  };

  const handleAddMap = async () => {
    if (!newMapName.trim()) return;
    setIsAdding(true);

    const newMap: Omit<MapData, "id"> = {
      name: newMapName.trim(),
      description: "New map created",
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      createdBy: auth.currentUser?.uid || "",
      visibility: "private",
      invitedUsers: {},
    };

    try {
      await addDoc(collection(db, "maps"), newMap);
      setNewMapName("");
    } catch (error) {
      console.error("Error adding map:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteMap = async (mapId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this map? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "maps", mapId));
    } catch (error) {
      console.error("Error deleting map:", error);
      alert("Failed to delete the map. Please try again.");
    }
  };

  const openShareModal = (mapId: string) => {
    setCurrentMapId(mapId);
    setIsShareModalOpen(true);
  };

  return (
    <div className="my-maps-page">
      <h1>My Maps</h1>

      {/* Tabs for filtering */}
      <div className="map-filter-tabs">
        {["all", "public", "private", "collaborative"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type as "all" | "public" | "private" | "collaborative")}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Sorting Dropdown */}
      <div className="sort-section">
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "createdAt" | "lastUpdated")}>
          <option value="lastUpdated">Last Updated</option>
          <option value="createdAt">Created At</option>
        </select>
      </div>

      {/* Create New Map Section */}
      <div className="add-map-section">
        <input
          type="text"
          placeholder="Enter new map name"
          value={newMapName}
          onChange={(e) => setNewMapName(e.target.value)}
          disabled={isAdding}
        />
        <button onClick={handleAddMap} className="add-map-button" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add Map"}
        </button>
      </div>

      {/* Map List */}
      <div className="map-list">
        {filteredMaps.length === 0 ? (
          <p className="no-maps-message">No maps available in this category.</p>
        ) : (
          filteredMaps.map((map) => (
            <div key={map.id} className="map-item">
              <button className="map-button" onClick={() => handleViewMap(map.id)}>
                {map.name}
              </button>
              <p className="map-description">{map.description}</p>
              <span className="map-visibility">Visibility: {map.visibility}</span>
              <button className="share-map-button" onClick={() => openShareModal(map.id)}>
                Share
              </button>
              <button className="delete-map-button" onClick={() => handleDeleteMap(map.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Share Map Modal */}
      {currentMapId && (
        <ShareMapModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} mapId={currentMapId} />
      )}
    </div>
  );
};

export default MyMapsPage;