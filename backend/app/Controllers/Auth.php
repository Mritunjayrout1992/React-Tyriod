<?php
namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use \Firebase\JWT\JWT;

class Auth extends ResourceController {
    protected $format = 'json';
    private $key;

    public function __construct(){
        $this->UserModel = new UserModel();
        $this->key = getenv('JWT_SECRET'); // Make sure to set this in .env
    }

    public function index(): string
    {
        return view('welcome_message');
    }

    public function login (){
        $request = $this->request->getJSON(true);
        $email = $request['email'] ?? null;
        $password = $request['password'] ?? null;
        $user = $this->UserModel->getUsingEmail($email);
        if($user === null){
           $ret = $this->displayResponse('User not found', 'error', 200);
        }
        else {
            $dbPassword = $user['password'];
            $checkIfPasswordValid = self::verifyPassword($password,$dbPassword);
            if($checkIfPasswordValid  === true) {
                // Remove password before sending user object
                unset($user['password'],$user['id']);
                $data['user'] = $user;
                $data ['token'] = $this->generateToken($user);
                $ret = $this->displayResponse($data, 'success', 200);
            }
            else $ret = $this->displayResponse('Invalid password', 'error', 200);
        }
        return $ret;
    }

    private static function verifyPassword($password, $dbPassword){
        return password_verify($password, $dbPassword);
    }

    private function generateToken(array $user)
    {
        $payload = [
            'iss' => base_url(), // Issuer
            'aud' => base_url(), // Audience
            'iat' => time(),     // Issued at
            'exp' => time() + 3600, // Expires in 1 hour
            'data' => $user
        ];

        return JWT::encode($payload, $this->key, 'HS256');
    }

    private function displayResponse(array|string $message, string $status, int $code){
        return $this->respond([
            'status' => $status,
            'message' => $message,
            'code' => $code
        ], $code);
    }
}
?>