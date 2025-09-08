<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return env('JWT_SECRET', 'env not working');
    }
    public function options()
    {

        return $this->response
                    ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                    ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access-key');
    }
}
