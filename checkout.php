<?php
require_once 'config.php';
requireLogin();

$user = getCurrentUser($pdo);
$message = '';
$messageType = '';

$cartItems = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = trim($_POST['billing_first_name'] ?? '');
    $lastName = trim($_POST['billing_last_name'] ?? '');
    $companyName = trim($_POST['billing_company_name'] ?? '');
    $address = trim($_POST['billing_address'] ?? '');
    $city = trim($_POST['billing_city'] ?? '');
    $country = trim($_POST['billing_country'] ?? '');
    $postcode = trim($_POST['billing_postcode'] ?? '');
    $phone = trim($_POST['billing_phone'] ?? '');
    $email = filter_input(INPUT_POST, 'billing_email', FILTER_VALIDATE_EMAIL);
    $notes = trim($_POST['notes'] ?? '');
    $cartItemsJson = $_POST['cart_items'] ?? '[]';
    $decodedCartItems = json_decode($cartItemsJson, true);
    if (is_array($decodedCartItems)) {
        $cartItems = $decodedCartItems;
    }

    if (!$firstName || !$lastName || !$address || !$city || !$country || !$phone || !$email) {
        $message = 'Veuillez remplir les champs obligatoires du formulaire.';
        $messageType = 'danger';
    } else {
        $stmt = $pdo->prepare('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, postcode = ? WHERE id = ?');
        $stmt->execute([$firstName, $lastName, $email, $phone, $address, $city, $country, $postcode, $user['id']]);

        $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);
        $subtotal = 0;
        foreach ($cartItems as $item) {
            $quantity = max(1, (int)($item['quantity'] ?? 1));
            $price = (float)preg_replace('/[^0-9,.-]/', '', (string)($item['price'] ?? '0'));
            $price = str_replace(',', '.', (string)$price);
            $subtotal += $price * $quantity;
        }
        $shipping = 1800;
        $total = $subtotal + $shipping;

        $stmt = $pdo->prepare('INSERT INTO invoices (user_id, invoice_number, currency, subtotal, shipping, total, billing_first_name, billing_last_name, billing_company_name, billing_address, billing_city, billing_country, billing_postcode, billing_phone, billing_email, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $user['id'],
            $invoiceNumber,
            'FCFA',
            $subtotal,
            $shipping,
            $total,
            $firstName,
            $lastName,
            $companyName,
            $address,
            $city,
            $country,
            $postcode,
            $phone,
            $email,
            $notes,
        ]);

        $invoiceId = (int)$pdo->lastInsertId();
        foreach ($cartItems as $item) {
            $quantity = max(1, (int)($item['quantity'] ?? 1));
            $unitPrice = (float)preg_replace('/[^0-9,.-]/', '', (string)($item['price'] ?? '0'));
            $unitPrice = str_replace(',', '.', (string)$unitPrice);
            $lineTotal = $unitPrice * $quantity;
            $stmt = $pdo->prepare('INSERT INTO invoice_items (invoice_id, product_name, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$invoiceId, (string)($item['name'] ?? 'Produit'), $quantity, $unitPrice, $lineTotal]);
        }
        $user = getCurrentUser($pdo);
        $message = 'Commande enregistrée avec succès.';
        $messageType = 'success';
        header('Location: invoice.php?id=' . $invoiceId);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Checkout - Red_link Shop</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container py-5">
    <h1 class="mb-4">Informations de livraison</h1>
    <?php if ($message): ?>
        <div class="alert alert-<?= htmlspecialchars($messageType) ?>"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>
    <form method="post" action="checkout.php">
        <div class="row g-4">
            <div class="col-lg-7">
                <div class="card shadow-sm rounded-4 p-4">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label" for="billing-first-name">Prénom *</label>
                            <input class="form-control" id="billing-first-name" name="billing_first_name" required type="text" value="<?= htmlspecialchars(isset($_POST['billing_first_name']) ? $_POST['billing_first_name'] : ($user['first_name'] ?? '')) ?>"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="billing-last-name">Nom *</label>
                            <input class="form-control" id="billing-last-name" name="billing_last_name" required type="text" value="<?= htmlspecialchars(isset($_POST['billing_last_name']) ? $_POST['billing_last_name'] : ($user['last_name'] ?? '')) ?>"/>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="billing-company-name">Nom de l’entreprise</label>
                            <input class="form-control" id="billing-company-name" name="billing_company_name" type="text" value="<?= htmlspecialchars(isset($_POST['billing_company_name']) ? $_POST['billing_company_name'] : '') ?>"/>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="billing-address">Adresse *</label>
                            <input class="form-control" id="billing-address" name="billing_address" required type="text" value="<?= htmlspecialchars(isset($_POST['billing_address']) ? $_POST['billing_address'] : ($user['address'] ?? '')) ?>"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="billing-city">Ville *</label>
                            <input class="form-control" id="billing-city" name="billing_city" required type="text" value="<?= htmlspecialchars(isset($_POST['billing_city']) ? $_POST['billing_city'] : ($user['city'] ?? '')) ?>"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="billing-country">Pays *</label>
                            <input class="form-control" id="billing-country" name="billing_country" required type="text" value="<?= htmlspecialchars(isset($_POST['billing_country']) ? $_POST['billing_country'] : ($user['country'] ?? '')) ?>"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="billing-postcode">Code postal</label>
                            <input class="form-control" id="billing-postcode" name="billing_postcode" type="text" value="<?= htmlspecialchars(isset($_POST['billing_postcode']) ? $_POST['billing_postcode'] : ($user['postcode'] ?? '')) ?>"/>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="billing-phone">Téléphone *</label>
                            <input class="form-control" id="billing-phone" name="billing_phone" required type="tel" value="<?= htmlspecialchars(isset($_POST['billing_phone']) ? $_POST['billing_phone'] : ($user['phone'] ?? '')) ?>"/>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="billing-email">Email *</label>
                            <input class="form-control" id="billing-email" name="billing_email" required type="email" value="<?= htmlspecialchars(isset($_POST['billing_email']) ? $_POST['billing_email'] : ($user['email'] ?? '')) ?>"/>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="notes">Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="4"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="card shadow-sm rounded-4 p-4">
                    <h5 class="mb-3">Résumé</h5>
                    <p class="mb-0">Les coordonnées saisies seront enregistrées pour la facture.</p>
                    <input id="cart-items-input" name="cart_items" type="hidden" value="[]"/>
                    <button class="btn btn-primary w-100 mt-4" type="submit">Valider la commande</button>
                </div>
            </div>
        </div>
    </form>
</div>
<script>
(function () {
    var cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart-items') || '[]');
    } catch (e) {
        cart = [];
    }
    document.getElementById('cart-items-input').value = JSON.stringify(cart);
})();
</script>
</body>
</html>
