<?php
class ReportController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }



    public function reportar($data)
    {
        try {

            $this->conn->beginTransaction();
            $idU = $data['idU'];
            $idP = $data['idP'];
            $motivo = $data['motivo'];
            $query = 'INSERT INTO Reportar (idU, idP, motivo) VALUES (:idU, :idP, :motivo)';
            $statement = $this->conn->prepare($query);

            $statement->bindParam(':idU', $idU);
            $statement->bindParam(':idP', $idP);
            $statement->bindParam(':motivo', $motivo);

            if (!$statement->execute()) {
                $this->conn->rollBack();
                return false;
            } 
            //Incrementar el contador de reportes
            $updatePost='UPDATE Publicacion SET contadorReportes =contadorReportes+1 WHERE id=:idP';
            $updateStatement=$this->conn->prepare($updatePost);
            $updateStatement->bindParam(':idP',$idP);
            if(!$updateStatement->execute()){
                $this->conn->rollBack();
                return false;
            }

            //Verificar si hay mas de 3 reportes quitar visibilizacion

            $checkQuery='SELECT contadorReportes FROM Publicacion WHERE id=:idP';
            $checkStatement=$this->conn->prepare($checkQuery);
            $checkStatement->bindParam(':idP',$idP);
            $result=$checkStatement->fetch(PDO::FETCH_ASSOC);

            if($result && $result['contadorReportes']>=3){
                $ocultarQuery='UPDATE Publicacion Set visible =0 where id =:idP';

                $ocultarStatement=$this->conn->prepare($ocultarQuery);

                $ocultarStatement->bindParam(':idP',$idP);

                if(!$ocultarStatement->execute()){
                    $this->conn->rollBack();
                    return false;
                }
            }


            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            // Manejar el error
            $this->conn->roolBack();
            error_log("Error al obtener publicaciones: " . $e->getMessage());
            return false;
        }
    }
}
