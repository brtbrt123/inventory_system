<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = (int)$data['id'];
    $name = $conn->real_escape_string($data['name']);
    $supplier = $conn->real_escape_string($data['supplier']);
    
    // 👉 CHANGE 1: We look for 'cat_id' from the JavaScript and ensure it's an integer
    $cat_id = (int)$data['cat_id']; 
    
    $quantity = (int)$data['quantity'];
    $price = (float)$data['price'];
    $description = $conn->real_escape_string($data['description']);

    // 👉 CHANGE 2: Update the 'cat_id' column instead of 'category', and remove the quotes around the number
    $sql = "UPDATE products SET 
            name='$name', supplier='$supplier', cat_id=$cat_id, 
            quantity=$quantity, price=$price, description='$description' 
            WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product updated successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed: " . $conn->error]);
    }
} else {
    // It's always good practice to add an 'else' here just in case the ID is missing!
    echo json_encode(["status" => "error", "message" => "No product ID received."]);
}
$conn->close();
?>