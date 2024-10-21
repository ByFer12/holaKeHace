<?php

//session_start();
include_once '../models/postController.php';
include_once '../config/database.php';

class GetPostController{
    private $db;
    private $postController;

    public function __construct()
    {
        $database=new Database();
        $this->db=$database->getConnection();
        $this->postController=new PostController($this->db);
    }


    public function getPublicPost(){
        $posts=$this->postController->obtenerPost();

        if($posts!=null){
            http_response_code(200);

            return json_encode(["message"=>"Post obtenidos","posts"=>$posts]);
        } else {
            http_response_code(401);
            return json_encode(["message" => "No se pudo obtener los post: ".$posts]);
        }
    }
}

?>