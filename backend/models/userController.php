<?php
include_once 'user.php';
class UserController
{

    private $conn;
    private $user;

    public function __construct($db)
    {

        $this->conn = $db;
    }

    public function register($data)
    {

 
            $this->conn->beginTransaction();

            $rol = !empty($data['rol']) ? $data['rol'] : 'PUBLICADOR';
            $email =   $data['email'];
            $nombre = $data['nombre'];
            $pass = $data['password']; // Asegúrate de hashear la contraseña
            $rol = $rol;


            $query = 'INSERT INTO usuarios (email,nombre,password,rol) VALUES(:email, :nombre, :pass, :rol)';
            $statement = $this->conn->prepare($query);

            $statement->bindParam(':email', $email);
            $statement->bindParam(':nombre', $nombre);

            $pass = password_hash($pass, PASSWORD_DEFAULT);
            $statement->bindParam(':pass', $pass);

            $statement->bindParam(':rol', $rol);

            if ($statement->execute()) {
                $this->conn->commit();
                return true;
            } else {

                $this->conn->rollBack();
                return false;
            }
   
    }


    public function login($data){
        try {
        $email =   $data['email'];
        $pass= $data['password'];
        $query= 'SELECT *FROM usuarios where email=:email AND baneado = 0';
        $statement =$this->conn->prepare($query);
        $statement->bindParam(':email',$email);

        $statement->execute();

        $us=$statement->fetch(PDO::FETCH_ASSOC);
       // print $us;
        if($us && password_verify($pass,$us['password'])){
            $this->user=new Usuario($us['id'], $us['email'],$us['nombre'],$us['password'],$us['rol']);
       
            return $this->user;
        }else{
            return null;
        }

    } catch (PDOException $e) {
        // Manejar el error
        error_log("Error en login: " . $e->getMessage());
        return null;
    }
    }
}
