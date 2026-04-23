<?php
include 'db_connect.php'; // Works fine because both are in the /php folder
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $fullname = $conn->real_escape_string($data['fullname']);
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    // Check if user exists
    $check = $conn->query("SELECT id FROM users WHERE username = '$username'");
    if ($check->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Username taken."]);
    } else {
        // Update your SQL query inside the signup logic
        $sql = "INSERT INTO users (fullname, username, password, profile_pic) 
                VALUES ('$fullname', '$username', '$password', 'profile_C.jpg')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Account created!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "DB Error: " . $conn->error]);
        }
    }
}
$conn->close();
?>