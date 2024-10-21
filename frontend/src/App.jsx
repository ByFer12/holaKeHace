import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navegacion";
import { UserProvider } from "./components/UserContext";

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
              </Routes>
            </div>
          </div>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
