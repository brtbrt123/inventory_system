<?php
include 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $po_id = (int)$data['po_id'];
    $userHandle = $conn->real_escape_string($data['username']);

    $conn->begin_transaction();

    try {
        // 1. Get the order details
        $poQuery = $conn->query("SELECT product_id, order_qty, status FROM purchase_orders WHERE po_id = $po_id");
        $po = $poQuery->fetch_assoc();

        if ($po['status'] !== 'Pending') {
            throw new Exception("Order is already received.");
        }

        $productId = (int)$po['product_id'];
        $qty = (int)$po['order_qty'];

        // 2. Change PO status to Received
        $conn->query("UPDATE purchase_orders SET status = 'Received' WHERE po_id = $po_id");

        // 3. Add the items to the main products inventory
        $conn->query("UPDATE products SET quantity = quantity + $qty WHERE id = $productId");

        // 4. Record the Audit Trail (RESTOCK)
        $conn->query("INSERT INTO stock_history (product_id, user_handle, quantity_changed, action_type) 
                      VALUES ($productId, '$userHandle', $qty, 'RESTOCK')");

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Stock received and inventory updated!"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
$conn->close();
?>