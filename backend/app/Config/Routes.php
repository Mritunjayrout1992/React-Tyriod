<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->options('(:any)', 'Home::options');
$routes->get('/', 'Home::index');
$routes->post('/auth/refresh', 'Auth::refresh');
$routes->post('/api/login', 'Auth::login');
$routes->post('/api/catalogue', 'Catalogue::create');
$routes->put('/api/catalogue/(:any)', 'Catalogue::update/$1');
$routes->post('/api/catalogueList', 'Catalogue::getAllList');
$routes->post('/api/catalogue/id', 'Catalogue::getItemWithID');

/////
