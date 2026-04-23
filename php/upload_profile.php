<?php
include 'db_connect.php';
header('Content-Type: application/json');

// Ensure a file and username were sent
if (isset($_FILES['profile_image']) && isset($_POST['username'])) {
    
    $username = $conn->real_escape_string($_POST['username']);
    $file = $_FILES['profile_image'];
    
    // Security check: Make sure it's actually an image
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Only JPG, PNG, and GIF allowed."]);
        exit;
    }

    // Create a unique filename so users don't overwrite each other (e.g., "bril_167890.jpg")
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFilename = $username . '_' . time() . '.' . $ext;
    
    // Where to save it (moves back one directory, then into img/)
    $targetPath = "../img/" . $newFilename;

    // Move the uploaded file to the /img folder
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        
        // Update the database with the new filename
        $sql = "UPDATE users SET profile_pic = '$newFilename' WHERE username = '$username'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "filename" => $newFilename]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database update failed."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save file to server."]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "No file or user data received."]);
}

$conn->close();
?>