import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";

function PublicadorDashboard() {
  const { user } = useUser();

  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [fech, setFech] = useState("");
  const [hora, setHora] = useState("");
  const [cupo, setCupo] = useState();
  const [url, setUrl] = useState();
  const [cat, setCat] = useState("");
  const [lugar, setLugar] = useState("");
  const [tipoPublico, setTipoPublico] = useState("");
  const [mess,setMess]=useState("");
  const [messP,setPMess]=useState("");
  
  const cate = async () => {
    try {
      const response = await axios.get(
        "http://localhost/Proyectos/olaketal/backend/public/getcat"
      );

      // Forzar el parseo si la respuesta es un string
      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      console.log("Categorias obtenidos: ", data.categoria);

      setCategorias(data.categoria);
    } catch (error) {
      console.error("Error al obtener las categorias", error);
    }
  };
  useEffect(() => {   
    cate();
  }, []);
  

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const nuevoPost = {
      titulo: titulo, // Valor del estado 'titulo'
      descripcion: desc, // Valor del estado 'desc'
      fechaALlevarse: fech, // Valor del estado 'fech'
      horaALlevarse: hora, // Valor del estado 'hora'
      idCategoria: cat, // Valor del estado 'cat'
      tipo: tipoPublico, // Valor del estado 'tipoPublico'
      cupo: cupo, // Valor del estado 'cupo'
      urlImagen: url,
      lugar:lugar,
      usuarioId:user.user.id
    };

    try {
      // Enviar el post request al backend usando axios
      const response = await axios.post(
        "http://localhost/Proyectos/olaketal/backend/public/crearpost",
        nuevoPost
      );

      // Manejo de la respuesta
      if (response.status === 200) {
        console.log("Post creado con éxito:", response);
        setPMess("Publicacion creado con exito");
        setTitulo("");
        setDesc("");
        setFech("")
        setHora("")
        setCat("")
        setTipoPublico("")
        setCupo("")
        setUrl("")
        
        // Puedes agregar aquí cualquier acción adicional, como mostrar un mensaje de éxito o redirigir al usuario
      } else {
        setPMess("Error al crear el post");
        console.error("Error al crear el post:", response.status);
      }
    } catch (error) {
      setPMess("Error al crear el post");

      console.error("Error al hacer el POST request:", error);
    }
  };

  const handleNuevaCategoria = async (e) => {
    e.preventDefault();
    if (nuevaCategoria) {

      try {
        const response = await axios.post("http://localhost/Proyectos/olaketal/backend/public/crearcat", {
          titulo: nuevaCategoria,
        });

        console.log("Categoría creada:", response.data);
        // Aquí puedes manejar la respuesta, por ejemplo, reiniciar el input
        setNuevaCategoria("");
        setMess("Categoria creado con exito");

        cate();
      } catch (error) {
        setMess("Error al crear el categoria");

        console.error("Error al crear la categoría:", error);
      }
    }
  };

  return (
    <div className="" style={{ marginTop: "90px" }}>
      <div className="container mt-5">
        {/* Formulario para crear un post */}
        <form
          onSubmit={handleSubmitPost}
          className="border p-4 rounded shadow-sm ms-auto"
        >
          <h3 className="mb-4">Crear Post</h3>

          {/* Formulario para crear una nueva categoría */}
          <div className="mt-3">
            <p className="text-info">{mess}</p>
            <label htmlFor="titulo" className="form-label">
              Nueva Categoria
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de la nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-success mt-2"
              onClick={handleNuevaCategoria}
            >
              Crear Categoría
            </button>
          </div>
          <br />
          {/* Título */}
          <p className="text-info">{messP}</p>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="form-control"
              name="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              name="descripcion"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">
              Lugar:
            </label>
            <input
              type="text"
              className="form-control"
              name="titulo"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              required
            />
          </div>
          {/* Fecha */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="fechaALlevarse" className="form-label">
                Fecha a Llevarse
              </label>
              <input
                type="date"
                className="form-control"
                name="fechaALlevarse"
                value={fech}
                onChange={(e) => {
                  setFech(e.target.value), console.log("Fecha: ", fech);
                }}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="horaALlevarse" className="form-label">
                Hora a Llevarse
              </label>
              <input
                type="time"
                className="form-control"
                name="horaALlevarse"
                value={hora}
                onChange={(e) => {
                  setHora(e.target.value);
                  console.log("Hora seleccionada: ", hora); // Aquí se mostrará la hora en formato de 24 horas
                }}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            {/* Categoría */}
            <div className="col-md-4">
              <label htmlFor="idCategoria" className="form-label">
                Categoría
              </label>
              <select
                className="form-select"
                value={cat} // Estado vinculado con el select
                onChange={(e) => setCat(e.target.value)} // Manejar el cambio
                required
              >
                <option value="">-----Selecciona-----</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.idCategoria}>
                    {categoria.titulo}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Público */}
            <div className="col-md-4">
              <label htmlFor="tipoPublico" className="form-label">
                Tipo de Público
              </label>
              <select
                className="form-select"
                value={tipoPublico} // Estado vinculado con el select
                onChange={(e) => setTipoPublico(e.target.value)} // Manejar el cambio
                required
              >
                <option value="">-----Selecciona-----</option>
                <option value="privado">Privado</option>
                <option value="publico">Público</option>
              </select>
            </div>

            {/* Cantidad de Cupos */}
            <div className="col-md-4">
              <label htmlFor="cantidadCupos" className="form-label">
                Cantidad de Cupos
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Cantidad de boletos"
                value={cupo}
                onChange={(e) => setCupo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* URL Imagen */}
          <div className="mb-3">
            <label htmlFor="urlImagen" className="form-label">
              URL Imagen
            </label>
            <input
              type="text"
              className="form-control"
              name="urlImagen"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {/* Botón para enviar */}
          <button type="submit" className="btn btn-primary">
            Crear Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublicadorDashboard;
