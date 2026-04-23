<?php
include 'db_connect.php';
header('Content-Type: application/json');

// 1. Get the JSON data sent from the JavaScript frontend
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    // 2. Clean the data to prevent SQL Injection errors
    $name = $conn->real_escape_string($data['name']);
    $supplier = $conn->real_escape_string($data['supplier']);
    $category = $conn->real_escape_string($data['category']);
    $quantity = (int)$data['quantity'];
    $price = (float)$data['price'];
    $description = $conn->real_escape_string($data['description']);

    // 3. Write the SQL INSERT command
    $sql = "INSERT INTO products (name, supplier, category, quantity, price, description) 
            VALUES ('$name', '$supplier', '$category', $quantity, $price, '$description')";

    // 4. Execute the command and tell the frontend if it worked
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product added to database!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}

$conn->close();
?>