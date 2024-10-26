import { useEffect, useState } from "react";
import axios from "axios";
function AprobarReport() {
  const [rep, setRep] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const obtenerReport = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Proyectos/olaketal/backend/public/getreport"
      );

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;
      console.log("Reportes Obtenidos: ", data.report);

      setRep(data.report);
    } catch (error) {
      console.error("Error al obtener los reportes", error);
    }
  };
  useEffect(() => {
    obtenerReport();
  }, []);

  const handleDetalles = async (reporte) => {
    console.log("Id post: ",reporte.idPost);
    try {
      // Hacer una solicitud GET para obtener los detalles del post usando el idPost
      const response = await axios.get(
        `http://localhost/Proyectos/olaketal/backend/public/getdetalles?idPost=${reporte.idPost}`
      );
      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      console.log("Detalles: ",data);
      setSelectedPost(data.posts); // Guardar el post en el estado
      // Mostrar el modal usando Bootstrap
      const modal = new window.bootstrap.Modal(
        document.getElementById("postDetailsModal")
      );
      modal.show();
    } catch (error) {
      console.error("Error al obtener los detalles del post:", error);
    }
  };
  const handleAprove = async (reporte) => {
    console.log(
      "Aprobar:  ",
      reporte.idReport,
      "    ",
      reporte.idPost,
      "  ",
      reporte
    );
    try {
      const response = await axios.put(
        "http://localhost/Proyectos/olaketal/backend/public/aprove",
        {
          idReport: reporte.idReport, // Enviar ID del reporte
          idPost: reporte.idPost, // Enviar ID de la publicación
          idUs: reporte.idUs, // Enviar ID del usuario que realizó el reporte
        }
      );
      console.log("Aprobador: ", response.data);
      if (response.status === 200) {
        console.log("Aprobador: ", response.data);

        handleIgnore(reporte);
        obtenerReport(); // Actualizar la lista de reportes después de aprobar
        alert("Reporte aprobado exitosamente");
      }
    } catch (error) {
      console.error("Error al aprobar reporte:", error);
      alert("Error al aprobar el reporte. Por favor intente nuevamente.");
    }
  };

  const handleIgnore = async (reporte) => {
    console.log("Reporte: ", reporte.idReport);
    try {
      const response = await axios.put(
        "http://localhost/Proyectos/olaketal/backend/public/ignore",
        { idReport: reporte.idReport } // Enviamos el ID del reporte
      );

      if (response.status === 200) {
        obtenerReport();
        alert("Reporte ignorado exitosamente");
      }
    } catch (error) {
      console.error("Error al ignorar reporte:", error);
      alert("Error al ignorar el reporte. Por favor intente nuevamente.");
    }
  };
  return (
    <div>
      <div className="container " style={{ marginTop: "80px" }}>
        <h2 className="text-center m-5">Reportes pendientes de aprobar</h2>
        <div className="card shadow">
          <div className="card-body">
            <div className="table-responsive" style={{ maxHeight: "500px" }}>
              <table className="table table-hover">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Título de Publicación</th>
                    <th>Usuario Publicador</th>
                    <th>Motivo de Reporte</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rep.length > 0 ? (
                    rep.map((reporte, index) => (
                      <tr key={index}>
                        <td>{reporte.titulo_publicacion}</td>
                        <td>{reporte.nombre_usuario}</td>
                        <td>{reporte.motivo_reporte}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-info btn-sm"
                              title="Ver detalles"
                              onClick={() => handleDetalles(reporte)}
                            >
                              Ver detalles
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              title="Aprobar reporte"
                              onClick={() => handleAprove(reporte)}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              title="Ignorar reporte"
                              onClick={() => handleIgnore(reporte)}
                            >
                              Ignorar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <h2>No hay reportes por aprobar</h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Bootstrap para mostrar los detalles del post */}
      <div
        className="modal fade"
        id="postDetailsModal"
        tabIndex="-1"
        aria-labelledby="postDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postDetailsModalLabel">
                Detalles del Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedPost ? (
                <div>
                  {/* Mostrar los detalles del post */}
                  <img
                    src={selectedPost.imagen}
                    alt="Post"
                    className="img-fluid mb-3"
                  />
                  <h3>{selectedPost.titulo}</h3>
                  <p>{selectedPost.descripcion}</p>
                  <p>
                    <strong>Lugar:</strong> {selectedPost.lugar}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {selectedPost.fechaALlevarse}
                  </p>
                  <p>
                    <strong>Hora:</strong> {selectedPost.horaALlevarse}
                  </p>
                  <strong>Imagen de referencia</strong>
                  <img
                  src={selectedPost.urlImagen} // La URL de la imagen del evento
                  className="card-img-top w-100 h-50"
                  alt={`Imagen del evento ${selectedPost.titulo}`}
                />
                </div>
              ) : (
                <p>Cargando...</p>
              )}
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
    </div>
  );
}

export default AprobarReport;
