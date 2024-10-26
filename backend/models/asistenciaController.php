<?php

class AsistenciaController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function marcarAsistencia($data)
    {
        try {
            $this->conn->beginTransaction();
            $idP = $data['idP'];
            $idU = $data['idU'];

            $asistirQuery = 'INSERT INTO Asistencia (idP, idU) VALUES(:idP, :idU)';

            $statement = $this->conn->prepare($asistirQuery);

            $statement->bindParam('idP', $idP);
            $statement->bindParam('idU', $idU);

            if ($statement->execute()) {
                $this->conn->commit();
                return true;
            } else {
                $this->conn->rollBack();
                return false;
            }
        } catch (PDOException $th) {
            $this->conn->rollBack();
            return false;
            //throw $th;
        }
    }


    public function getAsistencias($data)
    {
        try {
        $idU = $data['idU'];

        $query = "CALL obtenerAsistenciasPorUsuario(:idUsuario)";
        $statement = $this->conn->prepare($query);

        // Vincular el parámetro idUsuario
        $statement->bindParam(':idUsuario', $idU, PDO::PARAM_INT);

        $statement->execute();

        // Obtener los resultados en un array asociativo
        $asistencias = $statement->fetchAll(PDO::FETCH_ASSOC);

        // Devolver el array con los resultados
        return $asistencias;

    } catch (PDOException $e) {
        // Manejar la excepción
        error_log("Error al obtener asistencias: " . $e->getMessage());
        return null;
    }
    }
}
