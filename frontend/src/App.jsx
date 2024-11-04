import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navegacion";
import { UserProvider } from "./components/UserContext";
import ProtectedRoute from "./components/protectedRoute";
import PublicadorDashboard from "./components/poster/posterDashboard";
import WelcomeDashboard from "./components/poster/bienvenida";
import Posts from "./components/poster/posts";
import AdminDashboard from "./components/admin/adminDashboard";
import BienvenidaA from "./components/admin/bienvenida";
import AprobarPost from "./components/admin/adminDashboard";
import AprobarReport from "./components/admin/aprobarReporte";
import InfoPorfile from "./components/Info";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserProvider>
        <Router>
          <div>
            {/* Barra de navegación */}
            <Navbar />

            {/* Definir las rutas */}
            <div className="m-5">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <BienvenidaA />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-apribar"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <AprobarReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post-aprobar"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <AprobarPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crear"
                  element={
                    <ProtectedRoute roleRequired="publicador">
                      <PublicadorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/publicador"
                  element={
                    <ProtectedRoute roleRequired="publicador">
                      <WelcomeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/info"
                  element={
                    <ProtectedRoute roleRequired="usuarioRegular">
                      <InfoPorfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/info-pub"
                  element={
                    <ProtectedRoute roleRequired="publicador">
                      <InfoPorfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-info"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <InfoPorfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/posts-creados"
                  element={
                    <ProtectedRoute roleRequired="publicador">
                      <Posts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
