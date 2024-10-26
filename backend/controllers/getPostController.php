<?php

//session_start();
include_once '../models/postController.php';
include_once '../config/database.php';

class GetPostController
{
    private $db;
    private $postController;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->postController = new PostController($this->db);
    }


    public function getPublicPost()
    {
        $posts = $this->postController->obtenerPost();

        if ($posts != null) {
            http_response_code(200);

            return json_encode(["message" => "Post obtenidos", "posts" => $posts]);
        } else {
            http_response_code(401);
            return json_encode(["message" => "No se pudo obtener los post: " . $posts]);
        }
    }

    public function obtenerPostId($data) {
        if(isset($data['idPost'])){

            $idPost=$data['idPost'];
        $posts = $this->postController->obtenerPostPorId($idPost);

        if ($posts != null) {
            http_response_code(200);

            return json_encode(["message" => "Detalles Post obtenidos", "posts" => $posts]);
        } else {
            http_response_code(401);
            return json_encode(["message" => "No se pudo obtener detalles de los post: " . $posts]);
        }

    }

    }

    public function getPostAprove()
    {
        $posts = $this->postController->obtenerPostAprobar();

        if ($posts != null) {
            http_response_code(200);

            return json_encode(["message" => "Post por aprobar", "posts" => $posts]);
        } else {
            http_response_code(401);
            return json_encode(["message" => "No se pudo obtener los post por aprobar: " . $posts]);
        }
    }

    public function aprovePost($data)
    {
        if (isset($data['idPost'])) {

            if ($this->postController->aprobarPost($data)) {
                http_response_code(200);

                return json_encode(["message" => "Post aprobado correctamente"]);
            } else {
                http_response_code(401);
                return json_encode(["message" => "No se pudo aprobar el post: "]);
            }


            return json_encode(["message" => "No se pudo aprobar la publicacion, datos incompletos"]);
        }
    }

    public function postPublication($data)
    {

        if (isset($data['titulo'], $data['descripcion'], $data['fechaALlevarse'], $data['horaALlevarse'], $data['usuarioId'], $data['idCategoria'], $data['tipo'], $data['cupo'], $data['urlImagen'], $data['lugar'])) {

            if ($this->postController->crearPublicacion($data)) {

                http_response_code(200);
                return json_encode(["message" => "Post Creado Correctamente"]);
            } else {
                http_response_code(501);
                return json_encode(["message" => "Error al crear Publicacion"]);
            }

            http_response_code(400);
            return json_encode(["message" => "No se pudo crear la publicacion, datos incompletos"]);
        }
    }
}
