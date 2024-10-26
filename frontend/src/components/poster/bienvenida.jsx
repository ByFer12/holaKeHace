import { useUser } from "../UserContext"; 
function WelcomeDashboard() {
    const { user } = useUser();
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <h1 className="display-4 fw-bold">¡Bienvenido! {user.user.nombre}</h1>
          <p className="lead text-muted">Estamos encantados de tenerte aquí.</p>
          <button className="btn btn-primary mt-3">Explorar</button>
        </div>
      </div>
    );
  }
  
  export default WelcomeDashboard;