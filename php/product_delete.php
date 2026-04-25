<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = (int)$data['id']; 
    
    // START TRANSACTION
    $conn->begin_transaction();

    try {
        // 1. Delete the sales history first (Referential Integrity Fix!)
        $conn->query("DELETE FROM stock_history WHERE product_id = $id");

        // 2. Now it is safe to delete the product
        $sql = "DELETE FROM products WHERE id = $id";
        $conn->query($sql);

        // Commit the changes
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Product deleted completely!"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No Product ID provided."]);
}

$conn->close();
?>