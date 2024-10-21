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

}

?>