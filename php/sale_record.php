<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $productId = (int)$data['product_id'];
    $qtySold = (int)$data['quantity'];
    $userHandle = $conn->real_escape_string($data['username']);

    // START TRANSACTION
    $conn->begin_transaction();

    try {
        // 1. Subtract the quantity from products
        $updateSql = "UPDATE products SET quantity = quantity - $qtySold WHERE id = $productId AND quantity >= $qtySold";
        $conn->query($updateSql);

        if ($conn->affected_rows === 0) {
            throw new Exception("Insufficient stock.");
        }

        // 2. Record the history
        $historySql = "INSERT INTO stock_history (product_id, user_handle, quantity_changed, action_type) 
                       VALUES ($productId, '$userHandle', -$qtySold, 'SALE')";
        $conn->query($historySql);

        // Commit both changes
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Sale recorded successfully!"]);

    } catch (Exception $e) {
        // Rollback if anything fails
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
$conn->close();
?>