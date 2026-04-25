<?php
header('Content-Type: application/json');

// --- 1. DATABASE CONNECTION ---
// Using the exact database name from your screenshot
$host = '127.0.0.1';
$dbname = 'cabuyao_inventory_grp8';
$db_username = 'root'; // Default XAMPP username
$db_password = '';     // Default XAMPP password (blank)

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $db_username, $db_password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
// ------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $username = $_POST['username'] ?? '';

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        
        $fileTmpPath = $_FILES['profile_pic']['tmp_name'];
        $fileName = $_FILES['profile_pic']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Security Check: Only allow image files
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($fileExtension, $allowedExtensions)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed.']);
            exit;
        }

        $newFileName = $username . '_' . time() . '.' . $fileExtension;
        $uploadFileDir = '../img/';
        
        // Create the img folder if it doesn't exist
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0777, true);
        }

        $dest_path = $uploadFileDir . $newFileName;

        // Move the file to the img folder
        if(move_uploaded_file($fileTmpPath, $dest_path)) {
            
            $filepathForDb = 'img/' . $newFileName;

            try {
                // Update the 'users' table exactly as seen in your database
                $stmt = $conn->prepare("UPDATE users SET profile_pic = ? WHERE username = ?");
                $stmt->execute([$filepathForDb, $username]);
                
                echo json_encode(['status' => 'success', 'filepath' => $filepathForDb]);
                
            } catch (Exception $e) {
                echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            }
            
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Could not move the uploaded file.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file received or upload error.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>