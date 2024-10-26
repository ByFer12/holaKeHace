<?php
//session_start();
include_once '../config/database.php';
include_once '../models/reporteController.php';

class ReportApiController{

    private $db;
    private $controller;
    public function __construct()
    {
        $database=new Database();
        $this->db=$database->getConnection();
        $this->controller=new ReportController($this->db);
    }


    public function postReport($data){
        if(isset($data['idU'],$data['idP'],$data['motivo'])){
            if($this->controller->reportar($data)){
                http_response_code(200);

                return json_encode(["message"=>"Reporte enviado"]);
            }else{

                http_response_code(501);
                return json_encode(["message"=>"Error al enviar reporte"]);
            }

            http_response_code(400);
            return json_encode(["message"=>"No se pudo enviar el reporte"]);
        }
    }

    public function getDetailReport(){

            $results=$this->controller->obtenerDetalleReporte();
            if($results!=null){
                http_response_code(200);

                return json_encode(["message"=>"Reportes Obtenidos","report"=>$results]);
            }else{

                http_response_code(501);
                return json_encode(["message"=>"Error al obtener reportes"]);
            }

            http_response_code(400);
            return json_encode(["message"=>"No se pudo obtener los reportes"]);
        
    }

    public function ignorarReporte($data){
        try {
            if(isset($data['idReport'])){
            if ($this->controller->ignorarReportes($data)) {
                http_response_code(200);
                return ["message" => "Reporte ignorado exitosamente"];
            } else {
                http_response_code(404);
                return ["message" => "Reporte no encontrado"];
            }
        }
        } catch (PDOException $e) {
            http_response_code(500);
            return ["message" => "Error al ignorar el reporte: " . $e->getMessage()];
        }
    }

    public function aproveReportes($data){

        if(isset($data['idReport'], $data['idPost'], $data['idUs'])){

            if($this->controller->aprobarReport($data)){

                http_response_code(200);
                return json_encode(["message"=>"Reporte aprobado"]);
            }else{
                http_response_code(501);
                return json_encode(["message"=>"Error al aprobar reporte"]);
            }

            http_response_code(400);
            return json_encode(["message"=>"No se pudo aprobar el reportes"]);
        

        }

    }

}

?>