<?php
require_once 'config.php';
requireLogin();
$user = getCurrentUser($pdo);

$stmt = $pdo->prepare('SELECT i.id, i.invoice_number, i.created_at, i.total FROM invoices i WHERE i.user_id = ? ORDER BY i.created_at DESC');
$stmt->execute([$user['id']]);
$invoices = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Mes commandes - Red_link Shop</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container-fluid bg-light py-2">
<div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
<small class="text-muted"><i class="fas fa-phone-alt me-2"></i>+241 077058307</small>
<small class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>Libreville, Gabon</small>
<small class="text-muted"><i class="fas fa-envelope me-2"></i>yesseboukinda@gmail.com</small>
</div>
</div>
<div class="container py-5">
<div class="d-flex justify-content-between align-items-center mb-4">
<div>
<p class="text-primary mb-1 fw-semibold">Mes commandes</p>
<h2 class="mb-0">Historique des factures</h2>
</div>
<div class="d-flex gap-2">
<a class="btn btn-outline-primary rounded-pill" href="dashboard.php">Retour au dashboard</a>
<a class="btn btn-primary rounded-pill" href="logout.php">Déconnexion</a>
</div>
</div>
<div class="card shadow-sm rounded-4 p-4">
<table class="table">
<thead>
<tr>
<th>Facture</th>
<th>Date</th>
<th>Total</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<?php if ($invoices): ?>
    <?php foreach ($invoices as $invoice): ?>
        <tr>
            <td><?= htmlspecialchars($invoice['invoice_number']) ?></td>
            <td><?= htmlspecialchars($invoice['created_at']) ?></td>
            <td><?= number_format($invoice['total'], 2, ',', ' ') ?></td>
            <td>
                <div class="d-flex gap-2">
                    <a class="btn btn-sm btn-outline-primary" href="invoice.php?id=<?= $invoice['id'] ?>">Voir</a>
                    <a class="btn btn-sm btn-primary" href="invoice.php?id=<?= $invoice['id'] ?>" target="_blank">Télécharger</a>
                </div>
            </td>
        </tr>
    <?php endforeach; ?>
<?php else: ?>
    <tr><td colspan="4" class="text-center">Aucune facture trouvée.</td></tr>
<?php endif; ?>
</tbody>
</table>
</div>
</div>
<script src="js/main.js"></script>
</body>
</html>
