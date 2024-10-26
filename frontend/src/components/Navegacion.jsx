import { Link } from "react-router-dom";
import { useUser } from "./UserContext"; // Importa el contexto del usuario
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
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
            <strong> OlaKeTal, {user.user.nombre}</strong>
          ) : (
            <strong>OlaKeTal</strong>
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
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
              </ul>
            )}
            {user && user.user.rol === "publicador" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/publicador">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/crear">
                    Crear Publicacion
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/posts-creados">
                    Anuncios Publicados
                  </Link>
                </li>
              </ul>
            )}

            {user && user.user.rol === "admin" && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/post-aprobar">
                    Aprobar post
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/report-apribar">
                    Aprobar reporte
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
                        className="nav-link btn btn btn-info"
                        type="button"
                        onClick={handleNoti}
                      >
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

      {/* Modal para reportar */}
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
                  noti.map((notification, index) => (
                    <div
                      key={index}
                      className="list-group-item border border-info"
                    >
                      <h5 className="mb-1">{notification.titulo}</h5>
                      <p className="mb-1">
                        Fecha: {notification.fechaALlevarse}
                      </p>
                      <p>Hora: {notification.horaALlevarse}</p>

                      {tiemposRestantes[index] ? (
                        <p className="text-bg-warning">
                          Quedan {tiemposRestantes[index].dias} días,{" "}
                          {tiemposRestantes[index].horas} horas y{" "}
                          {tiemposRestantes[index].minutos} minutos.
                        </p>
                      ) : (
                        <p>Cargando tiempo restante...</p>
                      )}
                    </div>
                  ))
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
