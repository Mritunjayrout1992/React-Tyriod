<?php

namespace App\Models;

use CodeIgniter\Model;

class ItemModel extends Model
{
    protected $table = 'item';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'series_code',
        'type',
        'colour',
        'image_path',
        'dateadded',
    ];

    protected $useAutoIncrement = true;

    public function getAll()
    {
        return $this->findAll();
    }

    public function getById($id)
    {
        return $this->where('id', $id)->first();
    }
    
    public function deleteBySeriesCode($series_code)
    {
        return $this->where('series_code', $series_code)->delete();
    }
}
