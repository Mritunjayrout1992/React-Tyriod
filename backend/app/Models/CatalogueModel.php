<?php

namespace App\Models;

use CodeIgniter\Model;

class CatalogueModel extends Model
{
    protected $table = 'catalogue';
    protected $primaryKey = 'id';

    // Fillable fields for insert/update
    protected $allowedFields = [
        'category',
        'series_code',
        'design',
        'fabric_type',
        'remarks',
    ];

    // If you're using the auto-increment for `id`, you can set this to true
    protected $useAutoIncrement = false;

    public function getAll()
    {
        return $this->findAll(); // or use find($id) if only one record
    }

    public function getById($id)
    {
        return $this->where('id', $id)->first(); // returns a single row or null
    }

    public function getCatalogueWithItemAndSize($catalogueId)
    {
        // Query to get the catalogue data
        $catalogueQuery = $this->db->table('catalogue')
            ->select('catalogue.id, catalogue.category, catalogue.series_code, catalogue.design, catalogue.fabric_type, catalogue.remarks')
            ->where('catalogue.id', $catalogueId)
            ->get(); // Fetch the catalogue data

        // Check if catalogue exists
        $catalogueResult = $catalogueQuery->getRowArray();

        if (!$catalogueResult) {
            return null; // If catalogue not found, return null
        }

        // Query to get the associated items based on the catalogue series_code
        $itemsQuery = $this->db->table('item')
            ->select('item.type, item.colour, item.image_path')
            ->where('item.series_code', $catalogueResult['series_code'])
            ->get(); // Fetch all items related to this catalogue

        // Query to get the associated sizes based on the catalogue series_code
        $sizesQuery = $this->db->table('size')
            ->select('size.type, size.price')
            ->where('size.series_code', $catalogueResult['series_code'])
            ->get(); // Fetch all sizes related to this catalogue

        // Process the result into structured data
        $catalogueData = [
            'id' => $catalogueResult['id'],
            'category' => $catalogueResult['category'],
            'series_code' => $catalogueResult['series_code'],
            'design' => $catalogueResult['design'],
            'fabric_type' => $catalogueResult['fabric_type'],
            'remarks' => $catalogueResult['remarks'],
            'items' => [], // Initialize empty items array
            'sizes' => [], // Initialize empty sizes array
        ];

        // Map the item query results into structured objects
        foreach ($itemsQuery->getResultArray() as $item) {
            $catalogueData['items'][] = (object)[
                'type' => $item['type'],
                'colour' => $item['colour'],
                'image_path' => $item['image_path']
            ];
        }

        // Map the size query results into structured objects
        foreach ($sizesQuery->getResultArray() as $size) {
            $catalogueData['sizes'][] = (object)[
                'type' => $size['type'],
                'price' => $size['price']
            ];
        }

        return $catalogueData; // Return the structured catalogue data
    }



}