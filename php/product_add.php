<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $conn->real_escape_string($data['name']);
    $supplier = $conn->real_escape_string($data['supplier']);
    
    // 👉 CHANGE 1: We now grab the 'cat_id' number sent from JavaScript, not the word
    $cat_id = (int)$data['cat_id']; 
    
    $quantity = (int)$data['quantity'];
    $price = (float)$data['price'];
    
    // Catch the logged-in user
    $owner = isset($data['owner']) ? $conn->real_escape_string($data['owner']) : '';

    // 👉 CHANGE 2: The SQL now inserts into the 'cat_id' column without quotes (because it's a number)
    $sql = "INSERT INTO products (name, supplier, cat_id, quantity, price, owner_username) 
            VALUES ('$name', '$supplier', $cat_id, $quantity, $price, '$owner')";

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