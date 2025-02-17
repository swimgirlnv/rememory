import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

interface ActivityItem {
  id: string;
  type: "new_marker" | "new_map" | "edit_marker" | "group_update";
  userId: string;
  userName: string;
  timestamp: number;
  mapId?: string;
  markerId?: string;
  details?: string;
}

const HomePage: React.FC = () => {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const activityQuery = query(collection(db, "activityFeed"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      setActivity(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ActivityItem[]);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = (item: ActivityItem) => {
    if (item.markerId) {
      navigate(`/map/${item.mapId}?marker=${item.markerId}`);
    } else if (item.mapId) {
      navigate(`/map/${item.mapId}`);
    }
  };

  return (
    <div className="home-page">
      <h1>Home Timeline</h1>
      <ul>
        {activity.map((item) => (
          <li key={item.id} onClick={() => handleClick(item)}>
            <p><strong>{item.userName}</strong> {item.details}</p>
            <span>{new Date(item.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;