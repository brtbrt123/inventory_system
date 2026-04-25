<?php
$host = "localhost";
$user = "root";
$pass = ""; // Default XAMPP password is empty
$dbname = "cabuyao_inventory_grp8";

// 1. This line actually CREATES the $conn variable!
$conn = new mysqli($host, $user, $pass, $dbname);

// 2. Check if the connection worked
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>