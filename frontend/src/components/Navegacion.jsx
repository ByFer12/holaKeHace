import { Link } from "react-router-dom";
import { useUser } from "./UserContext"; // Importa el contexto del usuario
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {FaBell, FaCheckCircle, FaClipboardCheck, FaEdit, FaHome, FaList, FaSignOutAlt, FaUser} from 'react-icons/fa'
function Navbar() {
  const { user, logout } = useUser(); // Obtén el usuario y la función de logout desde el contexto
  const navigate = useNavigate();
  const [noti, setNoti] = useState([]);

  const calcularTiempoRestante = (fecha, hora) => {
    const fechaEvento = new Date(`${fecha}T${hora}`);
    const ahora = new Date();

    const diferencia = fechaEvento - ahora;
    if (diferencia <= 0) {
      return { dias: 0, horas: 0, minutos: 0 };
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    return { dias, horas, minutos };
  };

  // Inicializamos tiemposRestantes como un array vacío
  const [tiemposRestantes, setTiemposRestantes] = useState([]);

  // useEffect para actualizar tiemposRestantes cada minuto
  useEffect(() => {
    const actualizarTiempos = () => {
      setTiemposRestantes(
        noti.map((n) =>
          calcularTiempoRestante(n.fechaALlevarse, n.horaALlevarse)
        )
      );
    };
    

    actualizarTiempos(); // Actualizar inmediatamente

    const intervalo = setInterval(actualizarTiempos, 60000); // Actualizar cada minuto

    return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar
  }, [noti]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost/Proyectos/olaketal/backend/public/logout",
        {
          withCredentials: true, // Asegúrate de incluir las credenciales (cookies) de la sesión
        }
      );
      console.log("Cerrando sesion: ", response.data);
      if (response.data.success) {
        console.log("hola");
        logout();
        navigate("/");
      }
    } catch (error) {}
  };
  // console.log("usuario: ",user.user);

  const getNoti = async () => {
    try {
      if (user) {
        console.log("usuario: ", user.user.id);
        const response = await axios.get(
          `http://localhost/Proyectos/olaketal/backend/public/getnoti?idU=${user.user.id}`,
          {
            withCredentials: true, // Asegúrate de incluir las credenciales (cookies) de la sesión
          }
        );
        const data =
          typeof response.data === "string"
            ? JSON.parse(response.data)
            : response.data;
        console.log("noti: ", data.noti);

        setNoti(data.noti);
      }
    } catch (error) {
      setNoti([]);
      console.log("ERROOOOR: ", error);
    }
  };

  const handleNoti = () => {
    getNoti();

    const modalElement = document.getElementById("notiModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    console.log("notificacioes: ", noti);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container">
          {user ? (
            <strong> OlaKeHace, {user.user.nombre}</strong>
          ) : (
            <strong>OlaKeHace</strong>
          )}
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
            {user && user.user.rol === "usuarioRegular" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link"  style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                     to="/">
                    <FaHome title="Inicio" style={{ fontSize: '2.5rem' }}/>
                    
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link"  style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                     to="/info">
                    <FaUser title="informacion" style={{ fontSize: '2rem' }}/>
                    
                  </Link>
                </li>
              </ul>
            )}
            {user && user.user.rol === "publicador" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" 
                  style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }}  
                  to="/publicador">
                   <FaHome title="Inicio" style={{ fontSize: '2rem' }}/>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link"
                   style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }} 
                  to="/crear">
                    <FaEdit title="Nuevo Post" style={{ fontSize: '2rem' }}/>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link"
                   style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }} 
                  to="/posts-creados">
                    <FaList title="Lista de post" style={{ fontSize: '2rem' }}/>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link"  style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                     to="/info-pub">
                    <FaUser title="informacion" style={{ fontSize: '2rem' }}/>
                    
                  </Link>
                </li>
              </ul>
            )}

            {user && user.user.rol === "admin" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link"
                  style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }}
                  to="/admin">
                  <FaHome title="Inicio" style={{ fontSize: '2.5rem' }}/>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link"
                  style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }}
                  to="/post-aprobar">
                  
                    <FaCheckCircle  title="Aprobar post" style={{ fontSize: '2.5rem' }}/>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link"
                  style={{
                    color: "#4b5563",
                    margin: "0 0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#4f46e5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4b5563";
                  }}
                  to="/report-apribar">
                    <FaClipboardCheck title="Aprobar reportes" style={{ fontSize: '2.5rem' }}/>
                   
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link"  style={{
                      color: "#4b5563",
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#4b5563";
                    }}
                     to="/admin-info">
                    <FaUser title="informacion" style={{ fontSize: '2rem' }}/>
                    
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

                  {/* Botón de notificaciones visible para cualquier usuario autenticado */}
                  {user && user.user.rol === "usuarioRegular" && (
                    <li className="nav-item">
                      <button
                        className="nav-link btn"
                        type="button"
                        onClick={handleNoti}
                        style={{
                          color: "#4b5563",
                          margin: "0 0.5rem",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#f3f4f6";
                          e.target.style.color = "#4f46e5";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "#4b5563";
                        }}

                      >
                        
                        <FaBell style={{ fontSize: '2rem', marginRight:'55px' }}/>
                        
                      </button>
                    </li>
                  )}
                  {/* Botón de logout */}
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={handleLogout}
                      style={{
                        color: "#fca5a6", // Rojo pálido
                        margin: "0 0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                        cursor: "pointer", // Agrega un cursor de mano para indicar que es interactivo
                      }}
                      onMouseOver={(e) => {
                        e.target.style.color = "#dc2626"; // Rojo más oscuro
                      }}
                      onMouseOut={(e) => {
                        e.target.style.color = "#fca5a5"; // Regresa a rojo pálido
                      }}
                    >
                      <FaSignOutAlt style={{ fontSize: '2rem', marginRight:'55px' }}/>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal De Notificaciones */}
      <div
        className="modal fade"
        id="notiModal"
        tabIndex="-1"
        aria-labelledby="reporteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title " id="reporteModalLabel">
                Eventos a asistir
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="list-group rounded-start border border-3 border-info">
                {user && noti.length > 0 ? (
                  noti.map((notification, index) => {
                    const tiempo = tiemposRestantes[index];

                    if (
                      tiempo &&
                      (tiempo.dias > 0 ||
                        tiempo.horas > 0 ||
                        tiempo.minutos > 0)
                    ) {
                      return (
                        <div
                          key={index}
                          className="list-group-item border border-info"
                        >
                          <h5 className="mb-1">{notification.titulo}</h5>
                          <p className="mb-1">
                            Fecha: {notification.fechaALlevarse}
                          </p>
                          <p>Hora: {notification.horaALlevarse}</p>
                          <p className="text-bg-warning">
                            Quedan {tiempo.dias} días, {tiempo.horas} horas y{" "}
                            {tiempo.minutos} minutos.
                          </p>
                        </div>
                      );
                    } else {
                      return null; // No mostrar si tiempo restante es cero
                    }
                  })
                ) : (
                  <div className="list-group-item">
                    <p>No hay notificaciones.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
