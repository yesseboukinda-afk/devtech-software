<?php
require_once 'config.php';
requireLogin();

$user = getCurrentUser($pdo);
if (!$user) {
    header('Location: login.php');
    exit;
}

$cartItemsJson = $_POST['cart_items'] ?? '[]';
$cartItems = json_decode($cartItemsJson, true);
$preferredCurrency = strtolower(trim((string)($_POST['preferred_currency'] ?? 'fcfa')));
if (!in_array($preferredCurrency, ['fcfa', 'eur', 'usd'], true)) {
    $preferredCurrency = 'fcfa';
}

if (!is_array($cartItems) || count($cartItems) === 0) {
    header('Location: cart.html');
    exit;
}

$billingFirstName = trim((string)($user['first_name'] ?? ''));
$billingLastName = trim((string)($user['last_name'] ?? ''));
$billingEmail = trim((string)($user['email'] ?? ''));
$billingPhone = trim((string)($user['phone'] ?? ''));
$billingAddress = trim((string)($user['address'] ?? ''));
$billingCity = trim((string)($user['city'] ?? ''));
$billingCountry = trim((string)($user['country'] ?? ''));
$billingPostcode = trim((string)($user['postcode'] ?? ''));

// If the user has no profile address, use placeholders so invoice still saves.
if (!$billingFirstName) {
    $billingFirstName = 'Client';
}
if (!$billingLastName) {
    $billingLastName = 'inconnu';
}
if (!$billingEmail) {
    $billingEmail = 'client@inconnu.local';
}
if (!$billingAddress) {
    $billingAddress = 'Adresse non fournie';
}
if (!$billingCity) {
    $billingCity = 'Ville non fournie';
}
if (!$billingCountry) {
    $billingCountry = 'Pays non fourni';
}

function parseCurrencyValue($priceText) {
    $text = trim((string)$priceText);
    $normalized = str_replace(' ', '', $text);
    $number = str_replace(',', '.', preg_replace('/[^0-9,\.\-]/', '', $normalized));
    $amount = (float)$number;
    if (strpos($text, '€') !== false) {
        return ['amount' => $amount, 'currency' => 'eur'];
    }
    if (strpos($text, '$') !== false) {
        return ['amount' => $amount, 'currency' => 'usd'];
    }
    return ['amount' => $amount, 'currency' => 'fcfa'];
}

$rates = [
    'fcfa' => 1,
    'eur' => 655.957,
    'usd' => 600,
];

$subtotal = 0;
foreach ($cartItems as $item) {
    $quantity = max(1, (int)($item['quantity'] ?? 1));
    $priceInfo = parseCurrencyValue($item['price'] ?? '0');
    $basePrice = $priceInfo['currency'] === 'fcfa' ? $priceInfo['amount'] : ($priceInfo['currency'] === 'eur' ? $priceInfo['amount'] * $rates['eur'] : $priceInfo['amount'] * $rates['usd']);
    $unitPrice = $preferredCurrency === 'fcfa' ? $basePrice : $basePrice / $rates[$preferredCurrency];
    $lineTotal = $unitPrice * $quantity;
    $subtotal += $lineTotal;
}
$shipping = 1800;
if ($preferredCurrency !== 'fcfa') {
    $shipping = $shipping / $rates[$preferredCurrency];
}
$total = $subtotal + $shipping;

$invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);

$stmt = $pdo->prepare('INSERT INTO invoices (user_id, invoice_number, currency, subtotal, shipping, total, billing_first_name, billing_last_name, billing_company_name, billing_address, billing_city, billing_country, billing_postcode, billing_phone, billing_email, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([
    $user['id'],
    $invoiceNumber,
    strtoupper($preferredCurrency),
    $subtotal,
    $shipping,
    $total,
    $billingFirstName,
    $billingLastName,
    null,
    $billingAddress,
    $billingCity,
    $billingCountry,
    $billingPostcode,
    $billingPhone,
    $billingEmail,
    null,
]);

$invoiceId = (int)$pdo->lastInsertId();
foreach ($cartItems as $item) {
    $quantity = max(1, (int)($item['quantity'] ?? 1));
    $unitPrice = (float)preg_replace('/[^0-9,\.-]/', '', (string)($item['price'] ?? '0'));
    $unitPrice = str_replace(',', '.', (string)$unitPrice);
    $lineTotal = $unitPrice * $quantity;
    $stmt = $pdo->prepare('INSERT INTO invoice_items (invoice_id, product_name, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $invoiceId,
        (string)($item['name'] ?? 'Produit'),
        $quantity,
        $unitPrice,
        $lineTotal,
    ]);
}

header('Location: invoice.php?id=' . $invoiceId . '&print=1');
exit;
