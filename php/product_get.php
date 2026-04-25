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

// Grab the user from the URL (sent by your JavaScript)
$user = $_GET['user'] ?? '';

try {
    // FIXED: Changed 'owner_username' to 'owner' to match your database
    // We also select 'image_path' so your thumbnails finally show up!
    $sql = "SELECT p.*, c.category_name AS category 
            FROM products p 
            LEFT JOIN categories c ON p.cat_id = c.category_id 
            WHERE p.owner = ? 
            ORDER BY p.id DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $products = [];
    foreach ($results as $row) {
        $row['quantity'] = (int)$row['quantity'];
        $row['price'] = (float)$row['price'];
        $row['cat_id'] = (int)$row['cat_id']; 
        
        // Safety net: If a product somehow has no category
        if (empty($row['category'])) {
            $row['category'] = "Uncategorized";
        }
        
        $products[] = $row;
    }

    echo json_encode($products);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $e->getMessage()]);
}
?>