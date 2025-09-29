import "./App.css";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "@/context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // todo: replace with circle loader
  if (user?.role?.name === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
