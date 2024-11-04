<?php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Tu URL del frontend
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST,PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configura las opciones de sesión
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);


header("Content-Type: application/json; charset=UTF-8");



//var_dump($_SESSION);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include_once 'Middleware.php';
include_once '../controllers/authControllers.php';
include_once '../controllers/getPostController.php';
include_once '../controllers/getCategoias.php';
include_once '../controllers/ReportApiController.php';
include_once '../controllers/asistirApi.php';

$auth = new AuthController();
$post = new GetPostController();
$report = new ReportApiController();
$categ = new GetCategoriaController();
$asistencia = new MarcarAsistencia();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && $_GET['action'] === 'register') {

    $data = json_decode(file_get_contents("php://input"), true);

    $response = $auth->register($data);

    echo $response;
} elseif ($method === 'POST' && $_GET['action'] === 'login') {

    $data = json_decode(file_get_contents("php://input"), true);

    $response = $auth->login($data);

    echo $response;
} elseif ($method === 'POST' && $_GET['action'] === 'logout') {
    //isAuthenticated();
    header('Content-Type: application/json');
    $response = $auth->logout(); // tu clase de autenticación
    echo $response; // ya está codificado en JSON
} elseif ($method === 'GET' && $_GET['action'] === 'getpost') {

    $response = $post->getPublicPost();

    echo json_encode($response);
} elseif ($method === 'GET' && $_GET['action'] === 'getAllpost') {

    $response = $post->getAllPost();

    echo json_encode($response);
} elseif ($method === 'GET' && $_GET['action'] === 'getreport') {

    $response = $report->getDetailReport();

    echo json_encode($response);
} elseif ($method === 'GET' && $_GET['action'] === 'getcat') {

    $response = $categ->getCategorias();

    echo json_encode($response);
} elseif ($method === 'POST' && $_GET['action'] === 'reportar') {
    //isAuthenticated();
    //isRole("usuarioRegular");
    $data =  json_decode(file_get_contents("php://input"), true);

    $response = $report->postReport($data);

    echo $response;
} elseif ($method === 'POST' && $_GET['action'] === 'asistir') {
    //isAuthenticated();
    //isRole("usuarioRegular");
    $data =  json_decode(file_get_contents("php://input"), true);

    $response = $asistencia->asistir($data);

    echo $response;
} elseif ($method === 'GET' && $_GET['action'] === 'getnoti') {
    //isAuthenticated();
    //isRole("usuarioRegular");

    if (isset($_GET['idU'])) {
        $data = ['idU' => $_GET['idU']];
        $response = $asistencia->getnoti($data);
        echo json_encode($response);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Acción o idU no proporcionados."]);
    }
} elseif ($method === 'POST' && $_GET['action'] === 'crearpost') {

    $data =  json_decode(file_get_contents("php://input"), true);

    $response = $post->postPublication($data);

    echo $response;
} elseif ($method === 'POST' && $_GET['action'] === 'crearcat') {

    $data =  json_decode(file_get_contents("php://input"), true);

    $response = $categ->postCategoria($data);

    echo $response;
}elseif ($method === 'PUT' && $_GET['action'] === 'ignore'){

    $data = json_decode(file_get_contents('php://input'), true);
    $response = $report->ignorarReporte($data);
        
    echo json_encode($response);
}elseif ($method === 'PUT' && $_GET['action'] === 'editPost') {
    // Obtén el cuerpo de la solicitud primero
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Luego verifica si $data tiene contenido
    if ($data) {
        $response = $post->editPost($data);
        echo json_encode($response);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Datos no válidos."]);
    }
}
elseif ($method === 'PUT' && $_GET['action'] === 'aprove'){

    $data = json_decode(file_get_contents('php://input'), true);
    $response = $report->aproveReportes($data);
        
    echo json_encode($response);
} elseif ($method === 'GET' && $_GET['action'] === 'getaprove') {

    $response = $post->getPostAprove();

    echo json_encode($response);
}elseif ($method === 'PUT' && $_GET['action'] === 'aprovepost'){

    $data = json_decode(file_get_contents('php://input'), true);
    $response = $post->aprovePost($data);
        
    echo json_encode($response);
}elseif ($method === 'PUT' && $_GET['action'] === 'setpass'){

    $data = json_decode(file_get_contents('php://input'), true);
    $response = $auth->updatePass($data);
        
    echo json_encode($response);
} elseif ($method === 'GET' && $_GET['action'] === 'getdetalles') {

    if (isset($_GET['idPost'])) {
        $data = ['idPost' => $_GET['idPost']];
        $response = $post->obtenerPostId($data);
        echo json_encode($response);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Acción o idU no proporcionados."]);
    }
}

elseif ($method === 'GET' && $_GET['action'] === 'getInfoPost') {

    if (isset($_GET['userId'])) {
        $data = ['userId' => $_GET['userId']];
        $response = $post->getInfoPost($data);
        echo json_encode($response);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["message" => "Acción o idU no proporcionados."]);
    }
}
