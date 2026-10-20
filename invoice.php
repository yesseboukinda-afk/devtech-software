<?php
require_once 'config.php';
requireLogin();
$user = getCurrentUser($pdo);

$invoiceId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$invoiceId) {
    header('Location: orders.php');
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM invoices WHERE id = ? AND user_id = ?');
$stmt->execute([$invoiceId, $user['id']]);
$invoice = $stmt->fetch();
if (!$invoice) {
    header('Location: orders.php');
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM invoice_items WHERE invoice_id = ?');
$stmt->execute([$invoiceId]);
$items = $stmt->fetchAll();

$billingFirstName = trim((string)($invoice['billing_first_name'] ?? ''));
$billingLastName = trim((string)($invoice['billing_last_name'] ?? ''));
$billingCompanyName = trim((string)($invoice['billing_company_name'] ?? ''));
$billingAddress = trim((string)($invoice['billing_address'] ?? ''));
$billingCity = trim((string)($invoice['billing_city'] ?? ''));
$billingPostcode = trim((string)($invoice['billing_postcode'] ?? ''));
$billingCountry = trim((string)($invoice['billing_country'] ?? ''));
$billingPhone = trim((string)($invoice['billing_phone'] ?? ''));
$billingEmail = trim((string)($invoice['billing_email'] ?? ''));

$userFirstName = trim((string)($user['first_name'] ?? ''));
$userLastName = trim((string)($user['last_name'] ?? ''));
$userEmail = trim((string)($user['email'] ?? ''));
$userPhone = trim((string)($user['phone'] ?? ''));
$userAddress = trim((string)($user['address'] ?? ''));
$userCity = trim((string)($user['city'] ?? ''));
$userPostcode = trim((string)($user['postcode'] ?? ''));
$userCountry = trim((string)($user['country'] ?? ''));

if (!$billingFirstName && !$billingLastName) {
    $billingFirstName = $userFirstName;
    $billingLastName = $userLastName;
}
if (!$billingEmail) {
    $billingEmail = $userEmail;
}
if (!$billingAddress) {
    $billingAddress = $userAddress;
}
if (!$billingCity && !$billingPostcode && !$billingCountry) {
    $billingCity = $userCity;
    $billingPostcode = $userPostcode;
    $billingCountry = $userCountry;
}
if (!$billingPhone) {
    $billingPhone = $userPhone;
}

$customerName = trim($billingFirstName . ' ' . $billingLastName);
$customerAddress = trim($billingAddress);
$customerLocation = trim(implode(' ', array_filter([$billingCity, $billingPostcode, $billingCountry])));
$customerPhone = trim($billingPhone);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Facture <?= htmlspecialchars($invoice['invoice_number']) ?> - Red_link Shop</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3">Facture <?= htmlspecialchars($invoice['invoice_number']) ?></h1>
            <p class="text-muted">Date : <?= htmlspecialchars($invoice['created_at']) ?></p>
        </div>
        <div class="d-flex gap-2">
            <a class="btn btn-outline-primary rounded-pill" href="orders.php">Retour</a>
            <button class="btn btn-primary rounded-pill" type="button" onclick="window.print()">Télécharger</button>
        </div>
    </div>
    <div class="card shadow-sm rounded-4 p-4 mb-4">
        <div class="row">
            <div class="col-md-6">
                <h5>Facturé à</h5>
                <p class="mb-1"><strong><?= htmlspecialchars($customerName ?: 'Client inconnu') ?></strong></p>
                <?php if ($billingCompanyName): ?>
                    <p class="mb-1"><?= htmlspecialchars($billingCompanyName) ?></p>
                <?php endif; ?>
                <?php if ($customerAddress): ?>
                    <p class="mb-1"><?= htmlspecialchars($customerAddress) ?></p>
                <?php endif; ?>
                <?php if ($customerLocation): ?>
                    <p class="mb-1"><?= htmlspecialchars($customerLocation) ?></p>
                <?php endif; ?>
                <?php if ($customerPhone): ?>
                    <p class="mb-1">Tél : <?= htmlspecialchars($customerPhone) ?></p>
                <?php endif; ?>
                <?php if ($billingEmail): ?>
                    <p class="mb-1">Email : <?= htmlspecialchars($billingEmail) ?></p>
                <?php else: ?>
                    <p class="mb-1 text-danger">Email client non enregistré</p>
                <?php endif; ?>
            </div>
            <div class="col-md-6 text-md-end">
                <h5>Red_link Shop</h5>
                <p class="mb-1">Libreville, Gabon</p>
                <p class="mb-1">Email : Red_link-shop@gmail.com</p>
                <p class="mb-1">Tel : +241 077058307</p>
                <p class="mb-1">Site : redlinkshop.com</p>
            </div>
        </div>
    </div>
    <div class="card shadow-sm rounded-4 p-4 mb-4">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Qté</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($items as $item): ?>
                        <tr>
                            <td><?= htmlspecialchars($item['product_name']) ?></td>
                            <td><?= htmlspecialchars($item['quantity']) ?></td>
                            <td><?= number_format($item['unit_price'], 2, ',', ' ') ?> <?= htmlspecialchars($invoice['currency']) ?></td>
                            <td><?= number_format($item['line_total'], 2, ',', ' ') ?> <?= htmlspecialchars($invoice['currency']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <div class="row mt-4">
            <div class="col-md-6"></div>
            <div class="col-md-6">
                <div class="d-flex justify-content-between mb-2">
                    <span>Sous-total</span>
                    <strong><?= number_format($invoice['subtotal'], 2, ',', ' ') ?> <?= htmlspecialchars($invoice['currency']) ?></strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Livraison</span>
                    <strong><?= number_format($invoice['shipping'], 2, ',', ' ') ?> <?= htmlspecialchars($invoice['currency']) ?></strong>
                </div>
                <div class="d-flex justify-content-between fs-5 fw-semibold">
                    <span>Total</span>
                    <strong><?= number_format($invoice['total'], 2, ',', ' ') ?> <?= htmlspecialchars($invoice['currency']) ?></strong>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="js/main.js"></script>
<?php if (isset($_GET['print']) && $_GET['print'] == '1'): ?>
<script>
    window.addEventListener('load', function () {
        window.print();
    });
</script>
<?php endif; ?>
</body>
</html>
