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
        string $id = '',
        string $email = '',
        string $nombre = '',
        string $pass = '',
        string $rol = ''
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->nombre = $nombre;
        $this->pass = $pass;
        $this->rol = $rol;
    }

    // Getters
    public function getEmail(): string
    {
        return $this->email;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function getPass(): string
    {
        return $this->pass;
    }

    public function getRol(): string
    {
        return $this->rol;
    }

    // Setters
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function setPass(string $pass): self
    {
        $this->pass = $pass;
        return $this;
    }

    public function setRol(string $rol): self
    {
        $this->rol = $rol;
        return $this;
    }
}
