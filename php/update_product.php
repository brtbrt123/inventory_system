<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = (int)$data['id'];
    $name = $conn->real_escape_string($data['name']);
    $supplier = $conn->real_escape_string($data['supplier']);
    $category = $conn->real_escape_string($data['category']);
    $quantity = (int)$data['quantity'];
    $price = (float)$data['price'];
    $description = $conn->real_escape_string($data['description']);

    $sql = "UPDATE products SET 
            name='$name', supplier='$supplier', category='$category', 
            quantity=$quantity, price=$price, description='$description' 
            WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product updated successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
    }
}
$conn->close();
?>