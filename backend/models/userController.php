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

    //cambiar contrasenia

    public function setPassword($id, $currentPassword, $newPassword)
    {
        try {
            // Iniciar una transacción
            $this->conn->beginTransaction();

            // Obtener la contraseña actual del usuario desde la base de datos
            $query = 'SELECT password FROM usuarios WHERE id = :id';
            $statement = $this->conn->prepare($query);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();

            $result = $statement->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $storedPassword = $result['password'];

                // Verificar si la contraseña actual es correcta
                if (password_verify($currentPassword, $storedPassword)) {
                    // Hashear la nueva contraseña
                    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

                    // Preparar la consulta de actualización
                    $updateQuery = 'UPDATE usuarios SET password = :password WHERE id = :id';
                    $updateStatement = $this->conn->prepare($updateQuery);
                    $updateStatement->bindParam(':password', $hashedPassword);
                    $updateStatement->bindParam(':id', $id, PDO::PARAM_INT);

                    // Ejecutar la actualización
                    if ($updateStatement->execute()) {
                        // Confirmar la transacción
                        $this->conn->commit();
                        return true;
                    } else {
                        // Revertir la transacción si hay un error
                        $this->conn->rollBack();
                        return false;
                    }
                } else {
                    // Contraseña actual incorrecta
                    $this->conn->rollBack();
                    return false;
                }
            } else {
                // Usuario no encontrado
                $this->conn->rollBack();
                return false;
            }
        } catch (Exception $e) {
            // Manejar excepciones y revertir la transacción
            $this->conn->rollBack();
            return false;
        }
    }

    public function login($data)
    {
        try {
            $email =   $data['email'];
            $pass = $data['password'];
            $query = 'SELECT *FROM usuarios where email=:email AND baneado = 0';
            $statement = $this->conn->prepare($query);
            $statement->bindParam(':email', $email);

            $statement->execute();

            $us = $statement->fetch(PDO::FETCH_ASSOC);
            // print $us;
            if ($us && password_verify($pass, $us['password'])) {
                $this->user = new Usuario($us['id'], $us['email'], $us['nombre'], $us['password'], $us['rol']);

                return $this->user;
            } else {
                return null;
            }
        } catch (PDOException $e) {
            // Manejar el error
            error_log("Error en login: " . $e->getMessage());
            return null;
        }
    }
}
