<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$dbname = 'cabuyao_inventory_grp8';
$db_username = 'root'; 
$db_password = '';     

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $db_username, $db_password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Because we are sending FormData, we use $_POST instead of file_get_contents('php://input')
    $name = $_POST['name'] ?? '';
    $supplier = $_POST['supplier'] ?? '';
    $cat_id = $_POST['cat_id'] ?? null;
    $quantity = $_POST['quantity'] ?? 0;
    $price = $_POST['price'] ?? 0;
    $owner = $_POST['owner'] ?? '';
    
    // DEFAULT TO NULL if no image is uploaded
    $imagePathForDb = null; 

    // Handle the Image Upload if one exists
    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
        $fileExtension = strtolower(pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = 'prod_' . time() . '_' . rand(100, 999) . '.' . $fileExtension;
            $uploadFileDir = '../img/';
            
            if (!is_dir($uploadFileDir)) mkdir($uploadFileDir, 0777, true);
            
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $uploadFileDir . $newFileName)) {
                $imagePathForDb = 'img/' . $newFileName;
            }
        }
    }

    if ($name && $cat_id) {
        try {
            // Include the new image_path column in our insert statement
            $stmt = $conn->prepare("INSERT INTO products (image_path, name, supplier, cat_id, quantity, price, owner) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$imagePathForDb, $name, $supplier, $cat_id, $quantity, $price, $owner]);
            
            echo json_encode(['status' => 'success', 'message' => 'Product added successfully!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
    }
}
?>