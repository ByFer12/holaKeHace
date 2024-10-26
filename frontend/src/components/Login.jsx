import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import axios from 'axios';
import {useState} from 'react'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();
    const [message,setMessage]=useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Aquí haces la petición a tu backend
        try {
          const response = await axios.post('http://localhost/Proyectos/olaketal/backend/public/login', {
            email,
            password,
          });
    
          const userData = response.data; // Esto depende de la respuesta de tu backend
          login(userData);  // Guardar el usuario en el contexto
          console.log('Usuario Sesion ',typeof userData.user.rol);
    
          // Redirigir según el rol del usuario
          if (userData.user.rol === 'admin') {
            console.log("ADMIIIIIIIIIN");
            navigate('/admin');
          } else if (userData.user.rol === 'publicador') {
            console.log("PUBLICADOOOOOOOOOOOOOOOOOOOR");
            navigate('/publicador');
          } else {
            console.log("Regulaaaaaaaaaaaaaaaar");
            navigate('/');
          }
        } catch (error) {
          setMessage("Credenciales invalidas")
          console.error('Error en el login', error);
        }
      };
    

  return (
    <div className='container' style={{ marginTop: '150px' }}>
    <div className="container mt-5">
      <div className="row justify-content-center">
       
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
              <p className='text-danger'>{message}</p>
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
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
