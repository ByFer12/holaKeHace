<?php
class Usuario
{


    public $email;
    public $id;
    public $nombre;
    public $pass;
    public $rol;

    // Constructor
    
    public function __construct(
         $id,
         $email,
         $nombre,
         $pass,
         $rol
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->nombre = $nombre;
        $this->pass = $pass;
        $this->rol = $rol;
    }

    // Getters
    public function getEmail()
    {
        return $this->email;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getPass()
    {
        return $this->pass;
    }

    public function getRol()
    {
        return $this->rol;
    }

    // Setters
    public function setEmail(string $email)
    {
        $this->email = $email;
        return $this;
    }

    public function setId(int $id)
    {
        $this->id = $id;
        return $this;
    }

    public function setNombre(string $nombre)
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function setPass(string $pass)
    {
        $this->pass = $pass;
        return $this;
    }

    public function setRol(string $rol)
    {
        $this->rol = $rol;
        return $this;
    }
}
