<?php
// Simple order receiver. Save orders to a JSON lines file and generate PDF link using generate_pdf.php
header('Content-Type: application/json');
$raw = file_get_contents('php://input');
if(!$raw) { echo json_encode(['success'=>false,'error'=>'no input']); exit; }
$data = json_decode($raw, true);
if(!$data) { echo json_encode(['success'=>false,'error'=>'bad json']); exit; }


$ordersDir = __DIR__ . '/orders';
if(!file_exists($ordersDir)) mkdir($ordersDir, 0755, true);
$order_id = 'ORD' . time();
$orderFile = $ordersDir . '/' . $order_id . '.json';
$data['order_id'] = $order_id;
file_put_contents($orderFile, json_encode($data, JSON_PRETTY_PRINT));


// Optionally call PDF generator (synchronously) and return pdf_url if created
$pdfUrl = null;
$genCmd = __DIR__ . '/generate_pdf.php';
if(file_exists($genCmd)){
    // call PHP script to create PDF (passes order file path)
    // For security you should validate paths. This is a simple example.
    $outputPdf = $ordersDir . '/' . $order_id . '.pdf';
    // run generate script
    @exec("php " . escapeshellarg($genCmd) . " " . escapeshellarg($orderFile) . " " . escapeshellarg($outputPdf));
    if(file_exists($outputPdf)){
        $pdfUrl = dirname($_SERVER['REQUEST_URI']) . '/orders/' . basename($outputPdf);
    }
}


echo json_encode(['success'=>true,'order_id'=>$order_id, 'pdf_url'=>$pdfUrl]);

