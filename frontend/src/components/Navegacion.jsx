import { Link } from 'react-router-dom';
import { useUser } from './UserContext'; // Importa el contexto del usuario
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Navbar() {
  const { user, logout } = useUser(); // Obtén el usuario y la función de logout desde el contexto
  const navigate = useNavigate();
  const handleLogout=async ()=>{
    
    try {
      const response = await axios.post(
        "http://localhost/Proyectos/olaketal/backend/public/logout"
      );
        console.log("Cerrando sesion: ",response.data);
      if (response.data.success) {
        console.log("hola")
      logout();
      navigate('/');

      }
    } catch (error) {
      
    }
    
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        {user ?(        <Link className="navbar-brand" to="/">
          OlaKeTal,   <strong> {user.user.nombre}</strong>
        </Link>):(        <Link className="navbar-brand" to="/">
          OlaKeTal
        </Link>)}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
          </ul>
          {user && user.user.rol === "publicador" && (
                      <ul className="navbar-nav mx-auto">
                      <li className="nav-item">
                        <Link className="nav-link" to="/">
                          Crear Publicacion
                        </Link>
                      </li>
                    </ul>

          )}

          <ul className="navbar-nav ms-auto">
            {/* Si el usuario no está autenticado */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>


                {/* Si el rol es admin, muestra el botón de reportes */}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-reportes">
                      Reportes
                    </Link>
                  </li>
                )}

                {/* Botón de notificaciones visible para cualquier usuario autenticado */}
                {user && user.user.rol === "usuarioRegular" && (
                <li className="nav-item">
                  <button className="nav-link btn" type="button">
                    Notificaciones
                  </button>
                </li>
                )}
                {/* Botón de logout */}
                <li className="nav-item">
                  <button
                    className="nav-link btn"
                    onClick={handleLogout} // Llama a la función de logout
                  >
                    Cerrar Sesion
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
