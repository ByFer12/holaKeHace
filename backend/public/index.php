<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

header("Content-Type: application/json; charset=UTF-8");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once '../controllers/authControllers.php';
include_once '../controllers/getPostController.php';
include_once '../controllers/getCategoias.php';
include_once '../controllers/ReportApiController.php';

$auth = new AuthController();
$post=new GetPostController();
$report=new ReportApiController();
$categ= new GetCategoriaController();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $_GET['action'] === 'register') {

    $data = json_decode(file_get_contents("php://input"), true);

    $response = $auth->register($data);
    
    echo $response;
} elseif ($method === 'POST' && $_GET['action'] === 'login') {

    $data = json_decode(file_get_contents("php://input"), true);

    $response = $auth->login($data);

    echo $response;
}elseif ($method === 'POST' && $_GET['action'] === 'logout') {
    header('Content-Type: application/json');
    $response = $auth->logout(); // tu clase de autenticación
    echo $response; // ya está codificado en JSON
}elseif ($method ==='GET' && $_GET['action']==='getpost'){

    $response=$post->getPublicPost();
    
    echo json_encode($response);
}elseif ($method ==='GET' && $_GET['action']==='getcat'){

    $response=$categ->getCategorias();

    echo json_encode($response);
}elseif($method==='POST'&& $_GET['action']==='reportar'){

    $data =  json_decode(file_get_contents("php://input"),true);

    $response =$report->postReport($data);

    echo $response;
}
