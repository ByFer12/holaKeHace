<?php
class PostController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }



    public function obtenerPost()
    {
        try {
            // Consulta para obtener todas las publicaciones
            $query = 'SELECT * FROM Publicacion where tipo="publico" and visible =1';  // Cambia a la estructura de tu tabla
            $statement = $this->conn->prepare($query);
            $statement->execute();

            // Fetch all devuelve un array de todas las filas
            $publicaciones = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $publicaciones;
        } catch (PDOException $e) {
            // Manejar el error
            error_log("Error al obtener publicaciones: " . $e->getMessage());
            return null;
        }
    }

    public function obtenerPostPorId($idPost)
{
    try {
        // Consulta para obtener los detalles de la publicación basada en idPost
        $query = 'SELECT * FROM Publicacion WHERE id = :idPost';
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':idPost', $idPost, PDO::PARAM_INT);
        $statement->execute();

        // Obtener una sola fila con los detalles de la publicación
        $publicacion = $statement->fetch(PDO::FETCH_ASSOC);

        if ($publicacion) {
            return $publicacion; // Retornar los detalles del post
        } else {
            return null; // Si no encuentra la publicación, retornar null
        }
    } catch (PDOException $e) {
        // Manejar el error
        error_log("Error al obtener la publicación: " . $e->getMessage());
        return null;
    }
}


    public function obtenerPostAprobar()
    {
        try {
            // Consulta para obtener todas las publicaciones
            $query = 'SELECT * FROM Publicacion where visible =0';  // Cambia a la estructura de tu tabla
            $statement = $this->conn->prepare($query);
            $statement->execute();

            // Fetch all devuelve un array de todas las filas
            $publicaciones = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $publicaciones;
        } catch (PDOException $e) {
            // Manejar el error
            error_log("Error al obtener publicaciones: " . $e->getMessage());
            return null;
        }
    }

    public function aprobarPost($data)
{
    try {
        $idPost = $data['idPost'];

        // Iniciar la transacción
        $this->conn->beginTransaction();

        // Consulta para actualizar la visibilidad de la publicación
        $query = 'UPDATE Publicacion SET visible = 1 WHERE id = :idPost';
        $statement = $this->conn->prepare($query);
        $statement->bindParam(':idPost', $idPost, PDO::PARAM_INT);

        // Ejecutar la actualización
        if ($statement->execute()) {
            // Confirmar la transacción si la consulta fue exitosa
            $this->conn->commit();
            return true;
        } else {
            // Revertir la transacción si hubo un error
            $this->conn->rollBack();
            return false;
        }
    } catch (PDOException $e) {
        // Manejar el error
        $this->conn->rollBack();
        error_log("Error al aprobar la publicación: " . $e->getMessage());
        return false;
    }
}



    public function crearPublicacion($data)
    {
        try {
            // Iniciar la transacción
            $this->conn->beginTransaction();

            // Asignar los valores que recibimos desde el array $data
            $titulo = $data['titulo'];
            $descripcion = $data['descripcion'];
            $fechaALlevarse = $data['fechaALlevarse'];
            $horaALlevarse = $data['horaALlevarse'];
            $idCategoria = $data['idCategoria'];
            $tipo = $data['tipo'];  // Privado/Publico
            $cupo = $data['cupo'];
            $urlImagen = $data['urlImagen'];
            $usuarioID = $data['usuarioId'];
            $lugar = $data['lugar'];

            // Verificar el contador de publicaciones del usuario es igual o mayor a 3 para post automaticas
            $queryContador = 'SELECT contadorPost FROM usuarios WHERE id = :usuarioId';
            $stmtContador = $this->conn->prepare($queryContador);
            $stmtContador->bindParam(':usuarioId', $usuarioID);
            $stmtContador->execute();
            $resultadoContador = $stmtContador->fetch(PDO::FETCH_ASSOC);
            $contadorPost = $resultadoContador['contadorPost'] ?? 0;

            // Si el contadorPost es mayor o igual a 3, la publicación será visible, de lo contrario no
            $visible = $contadorPost >= 3 ? true : false;

            // Consulta SQL para insertar una nueva publicación
            $insertQuery = '
            INSERT INTO Publicacion 
            (idCategoria, titulo, descripcion, fechaALlevarse, horaALlevarse, tipo, usuarioId, urlImagen, visible, cupo, lugar) 
            VALUES 
            (:idCategoria, :titulo, :descripcion, :fechaALlevarse, :horaALlevarse, :tipo, :usuarioId, :urlImagen, :visible, :cupo, :lugar)';

            // Preparar la consulta
            $statement = $this->conn->prepare($insertQuery);

            // Asignar valores a los parámetros
            $statement->bindParam(':titulo', $titulo);
            $statement->bindParam(':descripcion', $descripcion);
            $statement->bindParam(':fechaALlevarse', $fechaALlevarse);
            $statement->bindParam(':horaALlevarse', $horaALlevarse);
            $statement->bindParam(':idCategoria', $idCategoria);
            $statement->bindParam(':tipo', $tipo);
            $statement->bindParam(':cupo', $cupo);
            $statement->bindParam(':urlImagen', $urlImagen);
            $statement->bindParam(':usuarioId', $usuarioID);
            $statement->bindParam(':lugar', $lugar);
            $statement->bindParam(':visible', $visible, PDO::PARAM_BOOL);

            // Ejecutar la consulta y verificar si se inserta correctamente
            if ($statement->execute()) {
                // Actualizar el contador de publicaciones del usuario
                $updateQuery = 'UPDATE usuarios SET contadorPost = contadorPost + 1 WHERE id = :usuarioId';
                $stmtUpdate = $this->conn->prepare($updateQuery);
                $stmtUpdate->bindParam(':usuarioId', $usuarioID);
                $stmtUpdate->execute();

                // Confirmar la transacción si todo va bien
                $this->conn->commit();
                return true;
            } else {
                // Revertir la transacción en caso de error
                $this->conn->rollBack();
                return false;
            }
        } catch (PDOException $e) {
            // En caso de error, revertir la transacción y registrar el error
            $this->conn->rollBack();
            error_log("Error al crear la publicación: " . $e->getMessage());
            return false;
        }
    }
}
