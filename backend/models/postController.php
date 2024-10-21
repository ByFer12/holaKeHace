<?php
    class PostController{
        private $conn;

        public function __construct($db){
            $this->conn=$db;
        }

        

        public function obtenerPost() {
            try {
                // Consulta para obtener todas las publicaciones
                $query = 'SELECT * FROM Publicacion';  // Cambia a la estructura de tu tabla
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

    }

?>