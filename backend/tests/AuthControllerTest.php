<?php
use PHPUnit\Framework\TestCase;

class AuthControllerTest extends TestCase
{
    protected $auth;

    protected function setUp(): void
    {
        $this->auth = new AuthController();
    }

    public function testRegister()
    {
        $data = [
            'username' => 'testuser',
            'password' => 'password123'
        ];

        $response = $this->auth->register($data);
        $this->assertIsArray($response);
        $this->assertArrayHasKey('message', $response);
        $this->assertEquals('User registered successfully', $response['message']);
    }

    public function testLogin()
    {
        $data = [
            'username' => 'testuser',
            'password' => 'password123'
        ];

        $response = $this->auth->login($data);
        $this->assertIsArray($response);
        $this->assertArrayHasKey('token', $response);
    }
}
