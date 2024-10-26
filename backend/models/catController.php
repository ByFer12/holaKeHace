<?php
class CategoriaController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }



    public function obtenerCategorias()
    {
        try {
            // Consulta para obtener todas las publicaciones
            $query = 'SELECT * FROM Categoria';  // Cambia a la estructura de tu tabla
            $statement = $this->conn->prepare($query);
            $statement->execute();

            // Fetch all devuelve un array de todas las filas
            $cate = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cate;
        } catch (PDOException $e) {
            // Manejar el error
            error_log("Error al obtener publicaciones: " . $e->getMessage());
            return null;
        }
    }


    public function insertarCategoria($data)
    {
        try {
            $this->conn->beginTransaction();

            $titulo = $data['titulo'];

            $insertarQuery = 'INSERT INTO Categoria (titulo) VALUES (:titulo)';

            $statement = $this->conn->prepare($insertarQuery);

            $statement->bindParam(':titulo', $titulo);

            if ($statement->execute()) {

                $this->conn->commit();
                return true;
            } else {

                $this->conn->rollBack();
                return false;
            }
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error al insertar categoría: " . $e->getMessage());
            return false;
        }
    }
}
