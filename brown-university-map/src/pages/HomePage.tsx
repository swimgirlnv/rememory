import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  FaMapMarkerAlt,
  FaRoute,
  FaUserPlus,
  FaUserFriends,
} from "react-icons/fa"; // Icons for updates
import { db } from "../../firebaseConfig";
import "../styles/HomePage.css";

interface Activity {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  type: "new_marker" | "new_path" | "friend_request" | "friend_accepted";
  details: string;
  mapId?: string;
  friendId?: string;
}

const HomePage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "activityFeed"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[];

      setActivities(updates);
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "new_marker":
        return <FaMapMarkerAlt className="activity-icon marker" />;
      case "new_path":
        return <FaRoute className="activity-icon path" />;
      case "friend_request":
        return <FaUserPlus className="activity-icon friend-request" />;
      case "friend_accepted":
        return <FaUserFriends className="activity-icon friend-accepted" />;
      default:
        return null;
    }
  };

  return (
    <div className="home-page">
      <h1 className="title">Home Timeline</h1>
      <div className="activity-feed">
        {activities.length === 0 ? (
          <p>No recent updates.</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="activity-item"
              onClick={() => {
                if (
                  activity.type === "new_marker" ||
                  activity.type === "new_path"
                ) {
                  window.location.href = `/map/${activity.mapId}`;
                } else if (
                  activity.type === "friend_request" ||
                  activity.type === "friend_accepted"
                ) {
                  window.location.href = `/profile/${activity.friendId}`;
                }
              }}
            >
              {getIcon(activity.type)}
              <p>{activity.details}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
