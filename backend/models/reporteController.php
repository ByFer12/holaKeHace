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
            $idU = $data['idU'];  // Usuario que hace el reporte
            $idP = $data['idP'];  // ID de la publicación que se está reportando
    
            // Verificar si el usuario ya ha reportado la publicación antes
            $queryCheck = 'SELECT COUNT(*) FROM Reportar WHERE idU = :idU AND idP = :idP';
            $statementCheck = $this->conn->prepare($queryCheck);
            $statementCheck->bindParam(':idU', $idU);
            $statementCheck->bindParam(':idP', $idP);
            $statementCheck->execute();
            $count = $statementCheck->fetchColumn();
    
            if ($count > 0) {
                return false;  // El usuario ya ha reportado esta publicación
            }
    
            $motivo = $data['motivo'];
    
            // Iniciar la transacción
            $this->conn->beginTransaction();
    
            // Insertar el reporte en la tabla 'Reportar'
            $query = 'INSERT INTO Reportar (idU, idP, motivo) VALUES (:idU, :idP, :motivo)';
            $statement = $this->conn->prepare($query);
            $statement->bindParam(':idU', $idU);
            $statement->bindParam(':idP', $idP);
            $statement->bindParam(':motivo', $motivo);
    
            if (!$statement->execute()) {
                $this->conn->rollBack();
                return false;
            }
    
            // Incrementar el contador de reportes en la tabla 'Publicacion'
            $updatePost = 'UPDATE Publicacion SET contadorReportes = contadorReportes + 1 WHERE id = :idP';
            $updateStatement = $this->conn->prepare($updatePost);
            $updateStatement->bindParam(':idP', $idP);
    
            if (!$updateStatement->execute()) {
                $this->conn->rollBack();
                return false;
            }
    
            // Obtener el usuario que hizo la publicación desde la tabla 'Publicacion'
            $getUserQuery = 'SELECT usuarioId FROM Publicacion WHERE id = :idP';
            $getUserStatement = $this->conn->prepare($getUserQuery);
            $getUserStatement->bindParam(':idP', $idP);
            $getUserStatement->execute();
            $postOwner = $getUserStatement->fetch(PDO::FETCH_ASSOC);
    
            if (!$postOwner) {
                $this->conn->rollBack();
                return false;  // No se encontró el usuario de la publicación
            }
    
            $usuarioIdPost = $postOwner['usuarioId'];  // ID del usuario que hizo la publicación
    
            // Incrementar el contador de reportes en la tabla 'Usuarios' para el dueño de la publicación
            $updateUser = 'UPDATE usuarios SET contadorReport = contadorReport + 1 WHERE id = :idUsuario';
            $updateUserStatement = $this->conn->prepare($updateUser);
            $updateUserStatement->bindParam(':idUsuario', $usuarioIdPost);
    
            if (!$updateUserStatement->execute()) {
                $this->conn->rollBack();
                return false;
            }
    
            // Confirmar la transacción
            $this->conn->commit();
            return true;
    
        } catch (PDOException $e) {
            // Manejar el error
            $this->conn->rollBack();
            error_log("Error al realizar el reporte: " . $e->getMessage());
            return false;
        }
    }
    


    public function aproveReport($data)
    {

        try {
        } catch (PDOException $th) {
        }
    }

    public function obtenerDetalleReporte()
    {
        try {
            $query = "CALL obtenerDetallesReporte()";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $resultados;
        } catch (PDOException $e) {


            return null;
        }
    }
    public function ignorarReportes($data)
    {
        try {
            $idReport = $data['idReport'];
            $this->conn->beginTransaction();
            $query = 'UPDATE Reportar SET visible =0 WHERE id =:idReport';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':idReport', $idReport);

            if ($stmt->execute()) {
                $this->conn->commit();
                return true;
            } else {
                $this->conn->rollBack();
                return false;
            }
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }


    public function aprobarReport($data)
    {
        try {
            $idReport = $data['idReport'];
            $idPost = $data['idPost'];
            $idUs = $data['idUs'];
    
            // Iniciar transacción
            $this->conn->beginTransaction();
    
            // Verificar el contador de reportes del usuario
            $queryUsuario = 'SELECT contadorReport, postAutomaticas FROM usuarios WHERE id = :idUs';
            $stmtUsuario = $this->conn->prepare($queryUsuario);
            $stmtUsuario->bindParam(':idUs', $idUs);
            $stmtUsuario->execute();
            $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
    
            if ($usuario) {
                // Verificar si tiene postAutomaticas en true
                if ($usuario['postAutomaticas']) {
                    // Si postAutomaticas es true, modificarlo a false
                    $queryUpdatePostAuto = 'UPDATE usuarios SET postAutomaticas = 0 WHERE id = :idUs';
                    $stmtUpdatePostAuto = $this->conn->prepare($queryUpdatePostAuto);
                    $stmtUpdatePostAuto->bindParam(':idUs', $idUs);
    
                    if (!$stmtUpdatePostAuto->execute()) {
                        $this->conn->rollBack();
                        return false;
                    }
                } elseif ($usuario['contadorReport'] >= 3) {
                    // Si postAutomaticas es false y el contadorReport es mayor o igual a 3, banear al usuario
                    $queryBaneo = 'UPDATE usuarios SET baneado = 1 WHERE id = :idUs';
                    $stmtBaneo = $this->conn->prepare($queryBaneo);
                    $stmtBaneo->bindParam(':idUs', $idUs);
    
                    if (!$stmtBaneo->execute()) {
                        $this->conn->rollBack();
                        return false;
                    }
                }
            } else {
                $this->conn->rollBack();
                return false; // Usuario no encontrado
            }
    
            // Verificar el contador de reportes de la publicación
            $queryPost = 'SELECT contadorReportes FROM Publicacion WHERE id = :idPost';
            $stmtPost = $this->conn->prepare($queryPost);
            $stmtPost->bindParam(':idPost', $idPost);
            $stmtPost->execute();
            $publicacion = $stmtPost->fetch(PDO::FETCH_ASSOC);
    
            if ($publicacion) {
                if ($publicacion['contadorReportes'] >= 3) {
                    // Si contadorReportes de la publicación es mayor o igual a 3, ocultar la publicación
                    $queryUpdateVisible = 'UPDATE Publicacion SET visible = 0 WHERE id = :idPost';
                    $stmtUpdateVisible = $this->conn->prepare($queryUpdateVisible);
                    $stmtUpdateVisible->bindParam(':idPost', $idPost);
    
                    if (!$stmtUpdateVisible->execute()) {
                        $this->conn->rollBack();
                        return false;
                    }
                }
    
                // Actualizar la columna reportes a true
                $queryUpdateReportes = 'UPDATE Publicacion SET reportes = 1 WHERE id = :idPost';
                $stmtUpdateReportes = $this->conn->prepare($queryUpdateReportes);
                $stmtUpdateReportes->bindParam(':idPost', $idPost);
    
                if (!$stmtUpdateReportes->execute()) {
                    $this->conn->rollBack();
                    return false;
                }
            } else {
                $this->conn->rollBack();
                return false; // Publicación no encontrada
            }
    
            // Confirmar la transacción
            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            // Manejar error y revertir transacción
            $this->conn->rollBack();
            error_log("Error al aprobar el reporte: " . $e->getMessage());
            return false;
        }
    }
    
}
