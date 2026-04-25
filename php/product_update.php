<?php
header('Content-Type: application/json');
include 'db_connect.php'; // Ensure this uses your cabuyao_inventory_grp8 DB

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $supplier = $_POST['supplier'] ?? '';
    $cat_id = $_POST['cat_id'] ?? null;
    $quantity = $_POST['quantity'] ?? 0;
    $price = $_POST['price'] ?? 0;

    try {
        $updateImage = "";
        $params = [$name, $supplier, $cat_id, $quantity, $price];

        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
            $fileExtension = strtolower(pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION));
            $newFileName = 'prod_' . time() . '.' . $fileExtension;
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], '../img/' . $newFileName)) {
                $updateImage = ", image_path = ?";
                $params[] = 'img/' . $newFileName;
            }
        }

        $params[] = $id;
        $sql = "UPDATE products SET name = ?, supplier = ?, cat_id = ?, quantity = ?, price = ? $updateImage WHERE id = ?";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully!']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>