<?php
// 1. Open the bridge
include 'db_connect.php';

// 2. Tell the browser we are sending JSON data
header('Content-Type: application/json');

// Grab the user from the URL (sent by your JavaScript)
$user = isset($_GET['user']) ? $conn->real_escape_string($_GET['user']) : '';

// 👉 THE BIG UPGRADE: The LEFT JOIN
// Notice the "AS category" part. This is a neat trick! It renames the column 
// right before it sends it to your JavaScript, so your frontend code 
// doesn't break and still knows exactly where to find the category name.
$sql = "SELECT p.*, c.category_name AS category 
        FROM products p 
        LEFT JOIN categories c ON p.cat_id = c.category_id 
        WHERE p.owner_username = '$user' 
        ORDER BY p.id DESC";
        
$result = $conn->query($sql);

$products = [];

// 4. Loop through the results and add them to our array
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Ensure numbers are formatted correctly for JavaScript
        $row['quantity'] = (int)$row['quantity'];
        $row['price'] = (float)$row['price'];
        $row['cat_id'] = (int)$row['cat_id']; 
        
        // Safety net: If a product somehow has no category, give it a default label
        if (empty($row['category'])) {
            $row['category'] = "Uncategorized";
        }
        
        $products[] = $row;
    }
}

// 5. Send the data back to the frontend
echo json_encode($products);

// 6. Close the bridge
$conn->close();
?>