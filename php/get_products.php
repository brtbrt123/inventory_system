<?php
// 1. Open the bridge
include 'db_connect.php';

// 2. Tell the browser we are sending JSON data
header('Content-Type: application/json');

// Grab the user from the URL (sent by your JavaScript)
$user = isset($_GET['user']) ? $conn->real_escape_string($_GET['user']) : '';

// 3. Write the SQL query to get ONLY products owned by this user
$sql = "SELECT * FROM products WHERE owner_username = '$user' ORDER BY id DESC";
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