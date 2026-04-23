<?php
include 'db_connect.php';
header('Content-Type: application/json');

// 1. Get the data typed into the login form
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username']) && isset($data['password'])) {
    
    // 2. Clean the inputs for security
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    // 3. Ask MySQL if this user exists with this password
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    // 4. Send the result back to the frontend
    if ($result && $result->num_rows > 0) {
        $user_data = $result->fetch_assoc();
        echo json_encode([
            "status" => "success", 
            "message" => "Welcome back, " . $user_data['username'] . "!",
            "username" => $user_data['username']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing credentials."]);
}

$conn->close();
?>