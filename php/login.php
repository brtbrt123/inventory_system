<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    // Check if user exists
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch the specific row data from the database
        $userRow = $result->fetch_assoc(); 

        // MATCH FOUND! Send the username, fullname, AND profile_pic back to JavaScript
       echo json_encode([
            "status" => "success", 
            "message" => "Login successful",
            "username" => $username,
            "fullname" => $userRow['fullname'],
            "profile_pic" => $userRow['profile_pic'] // Ensure this matches your DB column name
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received"]);
}
$conn->close();
?>