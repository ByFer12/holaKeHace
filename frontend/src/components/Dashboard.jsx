import { useEffect, useState } from "react";
import axios from "axios"; // Si usas axios para hacer peticiones HTTP
import { useUser } from "./UserContext";


function Dashboard() {
  const { user } = useUser();

  const [posts,setPost]=useState([]);
  const [cat,setCat]=useState([]);
  const [error, setError]= useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [reporteMotivo, setReporteMotivo] = useState("");
  const [visible,setVisible]=useState(false);

  const handleReport = (post) => {
    setSelectedPost(post); // Guardamos el post seleccionado para reportar
    setReporteMotivo(""); // Reseteamos el motivo
    const modalElement = document.getElementById("reporteModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Proyectos/olaketal/backend/public/getpost"
        );

        console.log("Posts obtenidos: ", response);

      // Forzar el parseo si la respuesta es un string
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
          console.log("PArseado: ");
       
        setPost(data.posts);
        
       
      } catch (error) {
        console.error("Error al obtener las publicaciones", error);
        setError("No se pudieron cargar las publicaciones.");
      }
    };

    const categorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Proyectos/olaketal/backend/public/getcat"
        );


      // Forzar el parseo si la respuesta es un string
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

      console.log("Categorias obtenidos: ", data.categoria);
       
        setCat(data.categoria);
        
       
      } catch (error) {
        console.error("Error al obtener las publicaciones", error);
        setError("No se pudieron cargar las publicaciones.");
      }
    };
    categorias();
    fetchPublicaciones(); // Llama a la función para obtener las publicaciones al cargar el componente
  }, []);


  const handleReporteSubmit =async () => {
    if (!reporteMotivo) {
      alert("Por favor selecciona un motivo de reporte.");
      return;
    }

    const datos={
      idU:user.user.id,
      idP:selectedPost.id,
      motivo:reporteMotivo
    }
    try {
      // Realizar el POST usando axios
      const response = await axios.post(
        'http://localhost/Proyectos/olaketal/backend/public/reportar',
        datos
      );
        setVisible(false);
      console.log("Reporte enviado:", response.data);
      alert("Reporte enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      alert("Hubo un problema al enviar el reporte.");
    }
    console.log('Reporte enviado para el post ',selectedPost,' con motivo ',reporteMotivo,' Usuario: ',user.user);
    
    
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("reporteModal"));
    modal.hide();
  };

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Anuncios </h1>
        <div className="d-flex">
          <div className="input-group me-2">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar eventos..."
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i> {/* Icono de lupa */}
            </button>
          </div>
          <select className="form-select">
            <option value="">----Categorías----</option>
            {/* Mapea las categorías aquí */}
            {cat.length > 0 ? (
              cat.map((categoria,inedx) => (
                <option key={inedx} value={categoria.titulo}>
                  {categoria.titulo}
                </option>
              ))
            ) : (
              <option value="">Cargando categorías...</option>
            )}
          </select>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
    {/* Mostrar las publicaciones */}
    <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-md-6" key={post.id}>
              <div className="card mb-4">
                <img
                  src={post.urlImagen} // La URL de la imagen del evento
                  className="card-img-top w-100 h-50"
                  alt={`Imagen del evento ${post.titulo}`}
                />
                <div className="card-body">
                  <h4 className="card-title">{post.titulo}</h4> {/* Título del evento */}
                  <p className="card-text">{post.descripcion}</p> {/* Descripción del evento */}
                  <p className="card-text">
                    <small className="text-muted">
                      Fecha del evento: {new Date(post.fechaALlevarse).toLocaleDateString()}{" "}
                      Hora: {post.horaALlevarse}
                    </small>
                  </p>
                  {user && user.user.rol === "usuarioRegular" && (
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-outline-danger" disabled={visible} onClick={() => handleReport(post)}>Reportar</button>
                      <button className="btn btn-success">Asistir</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay publicaciones disponibles en este momento.</p>
        )}
      </div>

       {/* Modal para reportar */}
       <div
        className="modal fade"
        id="reporteModal"
        tabIndex="-1"
        aria-labelledby="reporteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reporteModalLabel">Reportar Anuncio</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Selecciona el motivo del reporte para el evento: <strong>{selectedPost?.titulo}</strong></p>
              <select
                className="form-select"
                value={reporteMotivo}
                onChange={(e) => setReporteMotivo(e.target.value)}
              >
                <option value="">Selecciona un motivo</option>
                <option value="spam">Spam</option>
                <option value="violencia">Violencia</option>
                <option value="discriminacion">Discriminación</option>
                <option value="contenidoInapropiado">Contenido Inapropiado</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleReporteSubmit}>
                Enviar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
