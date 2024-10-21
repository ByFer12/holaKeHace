import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRole] = useState(""); // Estado para el rol
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(""); // Para manejar errores

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      nombre,
      password,
      rol,
    };

    try {
      const response = await axios.post(
        "http://localhost/Proyectos/olaketal/backend/public/register",
        data
      );

      console.log("Registro exitoso: ", response.data);
      navigate("/login");
    } catch (error) {
      console.error(
        "Error en el registro:",
        error.response ? error.response.data : error.message
      );
      setError("Error al registrar usuario, verifica los datos");
    }
    console.log(email, password, rol);
  };

  return (
    <div className="container" style={{ marginTop: "150px" }}>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Registro</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingresa tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Selecciona tu tipo de Usuario
                  </label>
                  <select
                    className="form-select"
                    value={rol}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">----------Selecciona--------</option>
                    <option value="usuarioRegular">Usuario</option>
                    <option value="PUBLICADOR">Publicador</option>
                  </select>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}{" "}
                {/* Mostrar error si existe */}
                <button type="submit" className="btn btn-success w-100">
                  Registrarse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
