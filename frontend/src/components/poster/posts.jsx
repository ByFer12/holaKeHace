import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { Modal, Button } from "react-bootstrap"; // Asegúrate de tener react-bootstrap instalado

const Posts = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [lugar, setLugar] = useState("");
  const [fech, setFech] = useState("");
  const [hora, setHora] = useState("");
  const [cupo, setCupo] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/Proyectos/olaketal/backend/public/getInfoPost?userId=${user.user.id}`
        );
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user.user.id]);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setTitulo(post.titulo);
    setDesc(post.descripcion || "");
    setLugar(post.lugar);
    setFech(post.fechaALlevarse);
    setHora(post.horaALlevarse);
    setCupo(post.cupo || 0);
    setUrl(post.urlImagen || "");
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedPost = {
        id: selectedPost.id,
        titulo:titulo,
        descripcion: desc,
        lugar:lugar,
        fechaALlevarse: fech,
        horaALlevarse: hora,
        cantidadCupos: cupo,
        urlImagen: url,
      };
      console.log("Datos a enviar:", updatedPost);

     const response= await axios.put(`http://localhost/Proyectos/olaketal/backend/public/editPost`, updatedPost);
     console.log("Respuest edit ",response.data)

      setShowModal(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <>
      <div className="container" style={{ marginTop: "90px" }}>
        <h2 className="text-center bg">Publicaciones realizadas</h2>
        <br />
        <hr />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Título</th>
              <th>Lugar</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Reporte Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={index}>
                <td>{post.titulo}</td>
                <td>{post.lugar}</td>
                <td>{post.fechaALlevarse}</td>
                <td>{post.horaALlevarse}</td>
                <td>{post.reporte_estado}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    disabled={post.reporte_estado === "true"}
                    onClick={() => handleEditClick(post)}
                    title={post.reporte_estado === "true" ? "Este post ha sido reportado" : ""}
                  >
                    Editar
                  </button>
                  <button className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">
                Título
              </label>
              <input
                type="text"
                className="form-control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="lugar" className="form-label">
                Lugar
              </label>
              <input
                type="text"
                className="form-control"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaALlevarse" className="form-label">
                Fecha a Llevarse
              </label>
              <input
                type="date"
                className="form-control"
                value={fech}
                onChange={(e) => setFech(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="horaALlevarse" className="form-label">
                Hora a Llevarse
              </label>
              <input
                type="time"
                className="form-control"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cantidadCupos" className="form-label">
                Cantidad de Cupos
              </label>
              <input
                type="number"
                className="form-control"
                value={cupo}
                onChange={(e) => setCupo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="urlImagen" className="form-label">
                URL Imagen
              </label>
              <input
                type="text"
                className="form-control"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Posts;
