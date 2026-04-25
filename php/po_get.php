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

// Grab the current user from the URL
$user = $_GET['user'] ?? '';

try {
    // UPDATED: Joined with products to get the name and supplier
    // Uses the 'owner' column to filter records
    $sql = "SELECT po.*, p.name as product_name, p.supplier 
            FROM purchase_orders po
            JOIN products p ON po.product_id = p.id
            WHERE p.owner = ? 
            ORDER BY po.po_id DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user]);
    $pos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($pos);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $e->getMessage()]);
}
?>