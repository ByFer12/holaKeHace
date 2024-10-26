import React, { useEffect, useState } from 'react';
import axios from 'axios';


function AprobarPost() {
  const [posts, setPosts] = useState([]);

  // Función para obtener los datos de la API
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost/Proyectos/olaketal/backend/public/getaprove');
      const data= typeof response.data ==='string'?JSON.parse(response.data):response.data;
      console.log("Post por aprobar: ",data.posts)
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // useEffect para obtener los datos cuando el componente se monta
  useEffect(() => {
    fetchPosts();
  }, []);

  // Función para manejar la aprobación de un post
  const handleAprove = async (postId) => {
    try {
      const response = await axios.put('http://localhost/Proyectos/olaketal/backend/public/aprovepost', { idPost: postId });
      if (response.status === 200) {
        alert('Publicación aprobada exitosamente');
        fetchPosts(); // Refrescar la tabla después de aprobar
      }
    } catch (error) {
      console.error('Error al aprobar publicación:', error);
      alert('Error al aprobar la publicación. Intente nuevamente.');
    }
  };

  // Función para manejar la visualización de detalles
  const handleViewDetails = (post) => {
    alert(`Detalles de la publicación:\nTítulo: ${post.titulo}\nDescripción: ${post.descripcion}`);
  };
    return (
      <div className="container" style={{ marginTop: "80px",  marginBottom: "80px" }}>
      <h2 className="text-center mb-4">Publicaciones por Aprobar</h2>
      <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Hora a llevarse</th>
              <th>Acciones</th>
              
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={index}>
                  <td>{post.titulo}</td>
                  <td>{post.descripcion}</td>
                  <td>{post.fechaALlevarse}</td>
                  <td>{post.horaALlevarse}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => handleAprove(post.id)}>
                      Aprobar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay publicaciones por aprobar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    );
  }
  
  export default AprobarPost;
  