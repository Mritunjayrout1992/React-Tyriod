<?php


namespace App\Models;
use CodeIgniter\Model;


class UserModel extends Model {

    protected $table = 'user';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['name', 'email', 'password', 'role', 'created_at', 'updated_at'];
    protected $useTimestamps = true;

    // In your UserModel
    public function getUsingEmail($email){
        $user = $this->where('email', $email)->first();
        return $user ?: null;
    }
}