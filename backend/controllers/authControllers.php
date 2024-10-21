<?php

//session_start();

include_once '../config/database.php';
include_once '../models/userController.php';

class AuthController
{

    private $db;
    private $controller;
    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->controller = new UserController($this->db);
    }


    public function register($data)
    {
        try {
            if (isset($data['email'], $data['nombre'], $data['password'])) {


                if ($this->controller->register($data)) {
                    http_response_code(200);
                    return json_encode(["message" => "Usuario Registrado Correctamente"]);
                } else {
                    http_response_code(501);
                    return json_encode(["message" => "Error al registrar el usuario"]);
                }
            }
        } catch (Exception $e) {
            http_response_code(502);
            return json_encode(["message" => "Error al registrar el usuario".$e]);
            return false;
        }
        http_response_code(400);
        return json_encode(["message" => "Datos incompletos"]);
    }


    public function login($data)
    {
        if (isset($data['email'], $data['password'])) {

            $usuario = $this->controller->login($data);

            if ($usuario != null) {

                $_SESSION['email'] = $usuario->getEmail();
                $_SESSION['nombre'] = $usuario->getNombre();
                $_SESSION['rol'] = $usuario->getRol();
                http_response_code(200);
                return json_encode(["message" => "Sesion Iniciada Correctamente", "user" => $usuario]);
            } else {
                http_response_code(401);
                return json_encode(["message" => "Credenciales inválidas"]);
            }
        }
        http_response_code(400);
        return json_encode(["message" => "Datos incompletos"]);
    }

    public function logout()
{
    session_destroy();
    http_response_code(200); // Sesión cerrada
    return json_encode(["message" => "Sesión cerrada","success"=>true]);
}
}
