<?php


function isAuthenticated() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start(); // Inicia sesión si no está ya iniciada
    }

    error_log('Session status: ' . print_r($_SESSION, true));
    if (!isset($_SESSION['idU'])) {
        header('Content-Type: application/json');
        http_response_code(401); 
        echo json_encode(['error' => 'No está autenticadooooooooooooo']);
        exit();
    }
}

function isRole($role) {
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== $role) {
        header('Content-Type: application/json');
        http_response_code(403); // Prohibido
        echo json_encode(['error' => 'No tiene los permisos necesarios']);
        exit();
    }
}
