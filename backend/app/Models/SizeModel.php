<?php

namespace App\Models;

use CodeIgniter\Model;

class SizeModel extends Model
{
    protected $table = 'size';
    protected $primaryKey = 'id';

    // Fields allowed for insert/update
    protected $allowedFields = [
        'series_code',
        'type',
        'price',
        'dateadded',
    ];

    protected $useAutoIncrement = true;

    // Optional: return results as array
    protected $returnType = 'array';

    /**
     * Get all size entries.
     */
    public function getAll()
    {
        return $this->findAll();
    }

    /**
     * Get a size entry by its ID.
     */
    public function getById($id)
    {
        return $this->where('id', $id)->first();
    }

    /**
     * Get all sizes for a specific series_code.
     */
    public function getBySeriesCode($seriesCode)
    {
        return $this->where('series_code', $seriesCode)->findAll();
    }

    public function deleteBySeriesCode($series_code)
    {
        return $this->where('series_code', $series_code)->delete();
    }
}
