<?php
include 'db_connect.php';
header('Content-Type: application/json');

$user = isset($_GET['user']) ? $conn->real_escape_string($_GET['user']) : '';

// We JOIN with the products table so we can see the product name and supplier!
$sql = "SELECT po.*, p.name AS product_name, p.supplier 
        FROM purchase_orders po
        JOIN products p ON po.product_id = p.id
        WHERE p.owner_username = '$user'
        ORDER BY po.po_id DESC";
        
$result = $conn->query($sql);
$pos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $pos[] = $row;
    }
}
echo json_encode($pos);
$conn->close();
?>