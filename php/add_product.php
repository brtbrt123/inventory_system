<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $conn->real_escape_string($data['name']);
    $supplier = $conn->real_escape_string($data['supplier']);
    $category = $conn->real_escape_string($data['category']);
    $quantity = (int)$data['quantity'];
    $price = (float)$data['price'];
    
    // THIS IS THE NEW LINE: Catch the logged-in user
    $owner = isset($data['owner']) ? $conn->real_escape_string($data['owner']) : '';

    // Update the SQL to include the owner_username column
    $sql = "INSERT INTO products (name, supplier, category, quantity, price, owner_username) 
            VALUES ('$name', '$supplier', '$category', $quantity, $price, '$owner')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product added!"]);
    } else {
        // This will print the exact MySQL error to your Network tab if it fails again
        echo json_encode(["status" => "error", "message" => "DB Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}
$conn->close();
?>