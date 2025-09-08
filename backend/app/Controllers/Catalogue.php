<?php
namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use App\Models\CatalogueModel;
use App\Models\ItemModel;
use App\Models\SizeModel;

class Catalogue extends ResourceController {

    protected $format = 'json';
    private $key;
    private $catalogueModel;
    private $itemModel;
    private $sizeModel;
    private $accessKey;

    public function __construct(){
        $this->catalogueModel = new CatalogueModel();
        $this->itemModel = new ItemModel();
        $this->sizeModel = new SizeModel();
        $this->accessKey = getenv('JWT_SECRET'); // Make sure to set this in .env
    }

    public function getAllList(){
        helper('auth');
        $headerValue = $this->request->getHeaderLine('access-key');
        $authResult = check_access_key($headerValue, $this->accessKey);
        if (!$authResult['status']) {
            $ret = $this->errorResponse($authResult['message'],401);
        } else {
            $result = $this->catalogueModel->getAll();
            if ($result) {
                $ret =  $this->respondCreated([
                    'status' => 200,
                    'message' => 'Catalogue item list fetched successfully.',
                    'data' => $result
                ]);
            } else {
                $ret =  $this->errorResponse('Failed to retrieve catalogue list.',500);
            }
        }
        return $ret;
    }

    public function getItemWithID(){
        helper('auth');
        $headerValue = $this->request->getHeaderLine('access-key');
        $authResult = check_access_key($headerValue, $this->accessKey);
        if (!$authResult['status']) {
            $ret = $this->errorResponse($authResult['message'],401);
        } else {
            $request = $this->request->getJSON();
            $id = $request->id ?? null;
            $result = $this->catalogueModel->getCatalogueWithItemAndSize($id);
            if ($result) {
                if (isset($result['items']) && is_array($result['items'])) {
                    foreach ($result['items'] as &$item) {
                        if (!empty($item->image_path)) {
                            $filename = basename($item->image_path);
                            $source = WRITEPATH . 'uploads/' . $filename;
                            $dest = FCPATH . 'uploads/' . $filename;
                            if (!file_exists($dest) && file_exists($source)) {
                                copy($source, $dest);
                            }
                            $item->image_url = base_url('uploads/' . $filename);
                        } else {
                            $item->image_url = null; // or default image
                        }
                    }
            }
                $ret =  $this->respondCreated([
                    'status' => 200,
                    'message' => 'Catalogue item fetched successfully.',
                    'data' => $result
                ]);
            } else {
                $ret =  $this->errorResponse('Failed to retrieve catalogue list.',500);
            }
        }
        return $ret;
    }

    public function create(){
        helper('auth');
        $headerValue = $this->request->getHeaderLine('access-key');
        $authResult = check_access_key($headerValue, $this->accessKey);
        if (!$authResult['status']) {
            $ret = $this->errorResponse($authResult['message'],401);
        } else {
            $request = $this->request->getPost();  // Gets all POST data as an array
            if($this->prepareData($request) === null){
                $ret =  $this->errorResponse('Cannot process as Required fields are missing',422);
            } else {
                $uploadRes = $this->uploadFiles($request);
                if ($uploadRes['status'] === false) {
                    $ret =  $this->errorResponse("Please upload at least one file to create a catalogue",422);
                } else {
                    $request['id' ] = $this->getCatalogueId($request);
                    $ret = $this->processInsertOps($request,$uploadRes['files']);
                }
            }
        }
        return $ret;
    }

    public function update($id = null) {
        // Check if it's a PUT request
        if (!$this->request->is('put')) {
            return $this->response->setStatusCode(405)->setJSON([
                'message' => 'Method Not Allowed'
            ]);
        }
        helper('auth');
        $headerValue = $this->request->getHeaderLine('access-key');
        $authResult = check_access_key($headerValue, $this->accessKey);
        if (!$authResult['status']) {
            $ret = $this->errorResponse($authResult['message'],401);
        } else {
            $request = $this->request->getPost();// Gets all POST data as an array
            if($this->prepareData($request) === null){
                $ret =  $this->errorResponse('Cannot process as Required fields are missing',422);
            } else {
                $uploadRes = $this->uploadFiles($request);
                if ($uploadRes['status'] === false) {
                    $ret =  $this->errorResponse("Please upload at least one file to create a catalogue",422);
                } else {
                    $ret =  $this->processUpdateOps($id, $request, $uploadRes['files']);
                }
            }
        }
        return $ret;
    }

    private function prepareData($request){
        $ret = true;
        $requiredFields = ['category', 'series_code','design','fabric_type'];
        foreach ($requiredFields as $field){
            if (empty($request[$field])) {
                $ret = false;
            }
        }
        // Check if colour data is present and valid
        if (empty($request['color']) || !is_array($request['color'])) {
            $ret = false;
        }
        // Check if size data is present and valid
        if (empty($request['size']) || !is_array($request['size'])) {
            $ret = false;
        }
        return $ret;
    }

    private function getCatalogueId($request){
        // Generate ID: e.g. CP-CPE-14
        $prefix = strtoupper(substr($request['design'], 0, 1) . substr($request['category'], 0, 1));
        $seriesCode = strtoupper($request['series_code']);
        $generatedId = $prefix . '-' . $seriesCode;
        return $generatedId;
    }

    private function uploadFiles($request = []) {
        $uploadedFiles = [];
        $files = $this->request->getFiles();
        
        // Check if no files were uploaded, use existing files from request
        if (empty($files) || !isset($files['color']) || !is_array($files['color'])) {
            foreach ($request['color'] ?? [] as $index => $color) {
                $uploadedFiles[$index][] = [
                    'image_name' => $color['image_name'] ?? '',  // Use existing image name
                    'image_path' => $color['image'] ?? '',  // Use existing image path
                ];
            }
        } else {
            // Process uploaded files
            foreach ($files['color'] as $index => $entry) {
                $uploadedFiles[$index] = [];
                if (isset($entry['image'])) {
                    $images = $entry['image'];
                    // Normalize: wrap single file in array for uniform handling
                    if (!is_array($images)) {
                        $images = [$images];
                    }

                    foreach ($images as $imgFile) {
                        if ($imgFile->isValid() && !$imgFile->hasMoved()) {
                            $newName = $imgFile->getRandomName();
                            $uploadPath = WRITEPATH . 'uploads/';
                            $imgFile->move($uploadPath, $newName);
                            
                            // Save the new file details
                            $uploadedFiles[$index][] = [
                                'image_name' => $newName,
                                'image_path' => $uploadPath . $newName,
                            ];
                        }
                    }
                }
            }
        }

        return [
            'status' => true,
            'files' => $uploadedFiles
        ];
    }


    private function processUpdateOps($id, $data, $uploadedFiles) {
        $db = \Config\Database::connect();
        $db->transStart(); // Start the transaction
        $ret = null;
        
        // Step 1: Update the catalogue table
        $updateResult = $this->catalogueModel->update($id, $data);
        if (!$updateResult) {
            $db->transRollback();  // Rollback if catalogue update fails
            $ret = $this->errorResponse('Failed to update catalogue item.', 500);
            return $ret;
        }

        // Step 2: Update the item data (colors)
        $itemUpdateResult = $this->updateItemData($data, $uploadedFiles);
        if (!$itemUpdateResult) {
            $db->transRollback();  // Rollback if item data update fails
            $ret = $this->errorResponse('Failed to update item data (colors).', 500);
            return $ret;
        }

        // Step 3: Update the size data
        $sizeUpdateResult = $this->updateSizeData($data);
        if (!$sizeUpdateResult) {
            $db->transRollback();  // Rollback if size data update fails
            $ret = $this->errorResponse('Failed to update size data.', 500);
            return $ret;
        }

        $db->transComplete(); // Commit the transaction

        if ($db->transStatus() === false) {
            return $this->errorResponse('Transaction failed during catalogue update.', 500);
        }

        // **Final Success Response**:
        // After all updates have been completed successfully, return the success response
        return $this->respondCreated([
            'status' => 200,
            'message' => 'Catalogue item updated successfully.',
            'data' => $data  // Optionally, include updated data in the response
        ]);
    }

    private function updateItemData($data, $uploadedFiles) {
        $deleteResult = $this->itemModel->deleteBySeriesCode($data['series_code']);
        if (!$deleteResult) {
            return $this->errorResponse('Failed to delete existing items for series_code: ' . $data['series_code'], 500);
        }
        return $this->insertItemData($data['series_code'],$data['color'] ?? [],$uploadedFiles);
    }

    private function updateSizeData($data) {
        $deleteResult = $this->sizeModel->deleteBySeriesCode($data['series_code']);
        if (!$deleteResult) {
            return $this->errorResponse('Failed to delete existing items for series_code: ' . $data['series_code'], 500);
        }
        return $this->insertSizeData($data['series_code'],$data['size'] ?? []);
    }

    private function processInsertOps($data,$uploadedFiles){
        $db = \Config\Database::connect();
        $db->transStart(); // Begin transaction
        $ret = null;
        // Step 1: Insert into catalogue table
        $insertResult = $this->catalogueModel->insert($data);
        if (!$insertResult) {
            $db->transRollback();
            $ret = $this->errorResponse('Failed to create catalogue item.', 500);
        } else {
            // Step 2: Insert into item and size tables
            $itemInsRes = $this->insertItemData($data['series_code'],$data['color'],$uploadedFiles);
            $sizeInsRes = $this->insertSizeData($data['series_code'],$data['size']);
            if ($itemInsRes && $sizeInsRes) {
                $db->transComplete(); // Commit transaction
                if ($db->transStatus() === false) {
                    $ret = $this->errorResponse('Transaction failed.', 500);
                } else {
                    $ret = $this->respondCreated([
                        'status' => 200,
                        'message' => 'Catalogue item created successfully.',
                        'data' => $data
                    ]);
                }
            } else {
                $db->transRollback(); // Rollback if either insert fails
                $ret = $this->errorResponse('Failed to insert item or size data.', 500);
            }
        }
        return $ret;
    }

    private function insertItemData($seriesCode,$colourData, $uploadedFiles) {
        $insertSuccessCount = 0;
        if (!empty($uploadedFiles) && is_array($uploadedFiles)) {
            foreach ($colourData as $index => $entries) {
                // Check if this color index has uploaded files
                if (!empty($uploadedFiles[$index]) && isset($uploadedFiles[$index][0]['image_path'])) {
                    $colourData[$index]['image'] = $uploadedFiles[$index][0]['image_path'];
                }
            }
        }
        // Now insert each color entry
        foreach ($colourData as $key => $entry) {
            $data = [
                'series_code' => $seriesCode,
                'type'  => $entry['colourID'] ?? null,
                'colour'  => $entry['colourName'] ?? null,
                'image_path'       => $entry['image'] ?? null,
                'created_at'  => date('Y-m-d H:i:s'),
            ];            // Insert into DB
            $inserted = $this->itemModel->insert($data);
            if ($inserted) {
                $insertSuccessCount++;
            }
        }
        return $insertSuccessCount;
    }

    private function insertSizeData($seriesCode,$sizeData) {
        $insertSuccessCount = 0;
        if (!empty($sizeData) && is_array($sizeData)) {
            foreach ($sizeData as $sizeEntry) {
                $sizeData = [
                    'series_code' => $seriesCode,
                    'type'        => $sizeEntry['sizeType'],
                    'price'       => $sizeEntry['sizePrice'],
                    'dateadded'   => date('Y-m-d H:i:s'),
                ];
                if ($this->sizeModel->insert($sizeData)) {
                    $insertSuccessCount++;
                }
            }
        }
        return $insertSuccessCount > 0 ? true : false;
    }

    
    private function errorResponse(string $message, int $code = 200, string $status = 'error')
    {
        return $this->respond([
            'status' => $status,
            'message' => $message,
            'code' => $code
        ], $code);
    }
}