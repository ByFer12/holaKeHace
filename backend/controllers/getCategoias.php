<?php

//session_start();
include_once '../models/catController.php';
include_once '../config/database.php';

class GetCategoriaController{
    private $db;
    private $cate;

    public function __construct()
    {
        $database=new Database();
        $this->db=$database->getConnection();
        $this->cate=new CategoriaController($this->db);
    }


    public function getCategorias(){
        $categoria=$this->cate->obtenerCategorias();

        if($categoria!=null){
            http_response_code(200);

            return json_encode(["message"=>"Post obtenidos","categoria"=>$categoria]);
        } else {
            http_response_code(401);
            return json_encode(["message" => "No se pudo obtener los post: ".$categoria]);
        }
    }

    public function postCategoria($data){

        if(isset($data['titulo'])){
            if($this->cate->insertarCategoria($data)){
                http_response_code(200);
                return json_encode(["message"=>"Categoria creado con exito"]);
            }else{
                http_response_code(501);
                return json_encode(["message"=>"No se pudo crear la categoria"]);
            }

            http_response_code(400);
            return json_encode(["message"=>"Datos incompletos"]);
        }

    }
}

?>