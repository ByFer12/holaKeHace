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
        return json_encode(["message" => "Datos incompletossssss"]);
    }

    //cambiar contrasenia
    public function updatePass($data)
    {
        try {
            if (isset($data['userId'], $data['pass'], $data['currPass'])) {
                $userId=$data['userId'];
                $pass=$data['pass'];
                $currPass=$data['currPass'];

                if ($this->controller->setPassword($userId,$currPass, $pass)) {
                    http_response_code(200);
                    return json_encode(["message" => "Contraseña cambiada correctamente"]);
                } else {
                    http_response_code(501);
                    return json_encode(["message" => "Error al cambiar cotnaseña"]);
                }
            }
        } catch (Exception $e) {
            http_response_code(502);
            return json_encode(["message" => "Error al cambiar cotnaseña".$e]);
            return false;
        }
        http_response_code(400);
        return json_encode(["message" => "Datos incompletos"]);
    }

    public function login($data)
    {
        if (isset($data['email'], $data['password'])) {

            $usuario = $this->controller->login($data);
           // echo "Usuario registradoooooooooooooo: ".$usuario;
            if ($usuario != null) {
                session_start();                 
                $_SESSION['idU'] = $usuario->getId();
                $_SESSION['email'] = $usuario->getEmail();
                $_SESSION['nombre'] = $usuario->getNombre();
                $_SESSION['rol'] = $usuario->getRol();

               // header('Content-Type: application/json');
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
        // Verifica si la sesión está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start(); // Inicia la sesión si aún no lo está
        }
    
        // Si hay una sesión iniciada, destruye la sesión
        if (isset($_SESSION)) {
            session_destroy(); // Destruye la sesión actual
            http_response_code(200); // Indica que la sesión ha sido cerrada exitosamente
            return json_encode(["message" => "Sesión cerrada", "success" => true]);
        } else {
            http_response_code(400); // Indica que no hay sesión que cerrar
            return json_encode(["message" => "No hay sesión activa", "success" => false]);
        }
    }
    
}
