<?php
require_once 'config.php';
requireLogin();

$message = '';
$messageType = '';
$user = getCurrentUser($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $country = trim($_POST['country'] ?? '');
    $postcode = trim($_POST['postcode'] ?? '');

    if (!$firstName || !$lastName || !$email) {
        $message = 'Veuillez renseigner votre prénom, nom et email.';
        $messageType = 'danger';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stmt->execute([$email, $user['id']]);
        if ($stmt->fetch()) {
            $message = 'Cet email est déjà utilisé par un autre compte.';
            $messageType = 'danger';
        } else {
            $stmt = $pdo->prepare('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, postcode = ? WHERE id = ?');
            $stmt->execute([$firstName, $lastName, $email, $phone ?: null, $address ?: null, $city ?: null, $country ?: null, $postcode ?: null, $user['id']]);
            $user = getCurrentUser($pdo);
            $message = 'Vos coordonnées ont bien été mises à jour.';
            $messageType = 'success';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Mon profil - Red_link Shop</title>
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
<p class="text-primary mb-1 fw-semibold">Mon profil</p>
<h2 class="mb-0"><?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></h2>
</div>
<div class="d-flex gap-2">
<a class="btn btn-outline-primary rounded-pill" href="dashboard.php">Retour au dashboard</a>
<a class="btn btn-primary rounded-pill" href="logout.php">Déconnexion</a>
</div>
</div>
<div class="card shadow-sm rounded-4 p-4">
<h5 class="mb-4">Informations utilisateur</h5>
<?php if ($message): ?>
    <div class="alert alert-<?= htmlspecialchars($messageType) ?>"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>
<form method="post" action="account.php">
<div class="row g-4">
<div class="col-md-6">
<label class="form-label">Prénom</label>
<input class="form-control" name="first_name" type="text" required value="<?= htmlspecialchars(isset($_POST['first_name']) ? $_POST['first_name'] : ($user['first_name'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Nom</label>
<input class="form-control" name="last_name" type="text" required value="<?= htmlspecialchars(isset($_POST['last_name']) ? $_POST['last_name'] : ($user['last_name'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Email</label>
<input class="form-control" name="email" type="email" required value="<?= htmlspecialchars(isset($_POST['email']) ? $_POST['email'] : ($user['email'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Téléphone</label>
<input class="form-control" name="phone" type="text" value="<?= htmlspecialchars(isset($_POST['phone']) ? $_POST['phone'] : ($user['phone'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Adresse</label>
<input class="form-control" name="address" type="text" value="<?= htmlspecialchars(isset($_POST['address']) ? $_POST['address'] : ($user['address'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Ville</label>
<input class="form-control" name="city" type="text" value="<?= htmlspecialchars(isset($_POST['city']) ? $_POST['city'] : ($user['city'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Code postal</label>
<input class="form-control" name="postcode" type="text" value="<?= htmlspecialchars(isset($_POST['postcode']) ? $_POST['postcode'] : ($user['postcode'] ?? '')) ?>"/>
</div>
<div class="col-md-6">
<label class="form-label">Pays</label>
<input class="form-control" name="country" type="text" value="<?= htmlspecialchars(isset($_POST['country']) ? $_POST['country'] : ($user['country'] ?? '')) ?>"/>
</div>
</div>
<div class="mt-4">
<button class="btn btn-primary rounded-pill" type="submit">Enregistrer</button>
</div>
</form>
</div>
</div>
<script src="js/main.js"></script>
</body>
</html>
