<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $product_id = (int)$data['product_id'];
    $qty = (int)$data['quantity'];
    
    $sql = "INSERT INTO purchase_orders (product_id, order_qty, status) 
            VALUES ($product_id, $qty, 'Pending')";
            
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Purchase Order created!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}
$conn->close();
?>