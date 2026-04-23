<?php
// 1. Open the bridge
include 'db_connect.php';

// 2. Tell the browser we are sending JSON data
header('Content-Type: application/json');

// 3. Write the SQL query to get all products
$sql = "SELECT * FROM products ORDER BY id DESC";
$result = $conn->query($sql);

$products = [];

// 4. Loop through the results and add them to our array
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Ensure numbers are formatted correctly for JavaScript
        $row['quantity'] = (int)$row['quantity'];
        $row['price'] = (float)$row['price'];
        $products[] = $row;
    }
}

// 5. Send the data back to the frontend
echo json_encode($products);

// 6. Close the bridge
$conn->close();
?>