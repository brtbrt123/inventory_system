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
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';

    if ($id) {
        try {
            // Start a transaction
            $conn->beginTransaction();

            // 1. Clear out the stock history records for this product
            $stmtHistory = $conn->prepare("DELETE FROM stock_history WHERE product_id = ?");
            $stmtHistory->execute([$id]);

            // 2. Clear out the purchase orders for this product
            $stmtPO = $conn->prepare("DELETE FROM purchase_orders WHERE product_id = ?");
            $stmtPO->execute([$id]);

            // 3. NOW it is fully safe to delete the product itself
            $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$id]);
            
            // Apply the changes
            $conn->commit();
            
            echo json_encode(['status' => 'success', 'message' => 'Product and all related history deleted!']);
            
        } catch (Exception $e) {
            // Cancel if anything fails
            $conn->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No product ID provided.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>