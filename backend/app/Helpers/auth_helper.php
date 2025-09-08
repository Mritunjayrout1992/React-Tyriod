<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('check_access_key')) {
    function check_access_key(string $accessKey, string $secretKey)
    {
        try {
            // Decode the JWT
            $decoded = JWT::decode($accessKey, new Key($secretKey, 'HS256'));
            
            // If decoding succeeds, return success
            return ['status' => true, 'data' => (array) $decoded];
        } catch (\Exception $e) {
            // If decoding fails, return error
            return [
                'status' => false,
                'message' => 'Access key invalid: ' . $e->getMessage()
            ];
        }
    }
}