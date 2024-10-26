<?php
//session_start();
include_once '../config/database.php';
include_once '../models/asistenciaController.php';
class MarcarAsistencia
{

    private $db;
    private $controller;
    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->controller = new AsistenciaController($this->db);
    }

    public function asistir($data){

        if(isset($data['idP'],$data['idU'])){

            if($this->controller->marcarAsistencia($data)){
                http_response_code(200);

                return json_encode(["message"=>"Asistencia marcada"]);
            }else{
                http_response_code(501);
                return json_encode(["message"=>"No se marco asistencia"]);
            }

            http_response_code(400);
            return json_encode(["message"=>"No se pudo enviar Asistencia"]);

        }

    }


    public function getnoti($data){

        if(isset($data['idU'])){
            $noti=$this->controller->getAsistencias($data);

            if($noti!=null){
                http_response_code(200);

                return json_encode(["message"=>"notificaciones encontradas ", "noti"=>$noti]);
            }else{
                http_response_code(401);
                return json_encode(["message" => "No se pudo obtener notificaciones"]);
            
            }
        }

    }
}
