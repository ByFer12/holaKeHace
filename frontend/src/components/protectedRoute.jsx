import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Asegúrate de que tienes tu contexto de usuario

function ProtectedRoute({ children, roleRequired }) {
  const { user } = useUser();

  if (!user) {
    // Si no hay usuario logueado, redirige a login
    return <Navigate to="/login" />;
  }

  if (user.user.rol !== roleRequired) {

    console.log("Protected: ",user);
    // Si el usuario no tiene el rol adecuado, redirige a una página de no autorizado
    return <Navigate to="/" />;
  }

  // Si el usuario tiene el rol adecuado, renderiza el componente
  return children;
}

export default ProtectedRoute;
