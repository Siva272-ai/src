<?php
// Usage: php generate_pdf.php path/to/order.json path/to/output.pdf
// This example uses TCPDF. Make sure tcpdf is available (include path or composer autoload).
require_once __DIR__ . '/tcpdf_min/tcpdf.php'; // adapt path if you installed tcpdf


if($argc < 3){ echo "Usage: php generate_pdf.php order.json out.pdf\n"; exit; }
$orderFile = $argv[1];
$outPdf = $argv[2];
if(!file_exists($orderFile)){ echo "Order not found\n"; exit; }
$order = json_decode(file_get_contents($orderFile), true);


$pdf = new TCPDF();
$pdf->SetCreator('OrderApp');
$pdf->SetAuthor('Cafe');
$pdf->SetTitle('Order '.$order['order_id']);
$pdf->AddPage();
$pdf->SetFont('dejavusans', '', 12);


$html = "<h2>Order: " . htmlspecialchars($order['order_id']) . "</h2>";
$html .= "<p>Customer: " . htmlspecialchars($order['customer']['name'] ?? '') . "<br>Phone: " . htmlspecialchars($order['customer']['phone'] ?? '') . "</p>";
$html .= "<table border=1 cellpadding=4><tr><th>Item</th><th>Qty</th><th>Price</th></tr>";
foreach($order['cart'] as $id => $q){
    // lookup name & price from hard-coded list - for demo we'll print id
    $html .= "<tr><td>".htmlspecialchars($id)."</td><td>".htmlspecialchars($q)."</td><td>".htmlspecialchars((int)$q*10)."</td></tr>"; // placeholder total
}
$html .= "</table>";
$html .= "<p>Subtotal: ".htmlspecialchars($order['subtotal'])."</p>";


$pdf->writeHTML($html, true, false, true, false, '');
$pdf->Output($outPdf, 'F');


echo "PDF created\n";
