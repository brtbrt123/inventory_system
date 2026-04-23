<?php
include 'db_connect.php';
header('Content-Type: application/json');

// 1. Get the ID sent from the frontend
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = (int)$data['id']; // Ensure it's a number for security
    
    // 2. Write the SQL command to delete the product
    $sql = "DELETE FROM products WHERE id = $id";

    // 3. Execute and return the result
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product deleted from database!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No Product ID provided."]);
}

$conn->close();
?>