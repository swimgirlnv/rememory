import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MyMapsPage from "./pages/MyMapsPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import GlobalMapPage from "./pages/GlobalMapPage";
import NavigationBar from "./components/NavigationBar";
import { AuthProvider, useAuth } from "./components/AuthContext";
import MapDetailPage from "./pages/MapDetailPage";
import AboutModal from "./pages/AboutModal";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/home" element={<Layout component={HomePage} />} />
          <Route path="/maps" element={<Layout component={MyMapsPage} />} />
          <Route path="/map/:mapId" element={<Layout component={MapDetailPage} />} />
          <Route path="/profile" element={<Layout component={ProfilePage} />} />
          <Route path="/friends" element={<Layout component={FriendsPage} />} />
          <Route path="/globalmap" element={<Layout component={GlobalMapPage} />} />
          <Route path="/about" element={<Layout component={AboutModal} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function LandingRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" /> : <LandingPage />;
}

function Layout({ component: Component }: { component: React.FC }) {
  const { currentUser } = useAuth();
  return currentUser ? (
    <div>
      <NavigationBar />
      <Component />
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default App;