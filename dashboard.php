<?php
require_once 'config.php';
requireLogin();
$user = getCurrentUser($pdo);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Tableau de bord - Red_link Shop</title>
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
<p class="text-primary mb-1 fw-semibold">Bienvenue sur votre espace</p>
<h2 class="mb-0">Tableau de bord client</h2>
<p class="text-muted">Connecté en tant que <?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></p>
</div>
<div class="d-flex gap-2">
<a class="btn btn-outline-primary rounded-pill" href="index.html">Retour au shop</a>
<a class="btn btn-primary rounded-pill" href="logout.php">Déconnexion</a>
</div>
</div>
<div class="row g-4">
<div class="col-lg-3">
<div class="dashboard-sidebar rounded-4 shadow-sm p-4">
<h5 class="text-primary mb-4">Menu</h5>
<div class="d-grid gap-2">
<a class="dashboard-nav-link active" href="dashboard.php"><i class="fas fa-tachometer-alt me-2"></i>Vue d'ensemble</a>
<a class="dashboard-nav-link" href="account.php"><i class="fas fa-user me-2"></i>Mon profil</a>
<a class="dashboard-nav-link" href="orders.php"><i class="fas fa-box me-2"></i>Mes commandes</a>
<a class="dashboard-nav-link" href="#"><i class="fas fa-heart me-2"></i>Wishlist</a>
<a class="dashboard-nav-link" href="#"><i class="fas fa-headset me-2"></i>Support</a>
</div>
</div>
</div>
<div class="col-lg-9">
<div class="row g-4 mb-4">
<div class="col-md-4">
<div class="metrics-card rounded-4 shadow-sm p-4">
<div class="d-flex justify-content-between align-items-center">
<div>
<p class="text-muted mb-1">Commandes</p>
<h3 class="mb-0">0</h3>
</div>
<div class="icon-box"><i class="fas fa-box"></i></div>
</div>
</div>
</div>
<div class="col-md-4">
<div class="metrics-card rounded-4 shadow-sm p-4">
<div class="d-flex justify-content-between align-items-center">
<div>
<p class="text-muted mb-1">Favoris</p>
<h3 class="mb-0">0</h3>
</div>
<div class="icon-box"><i class="fas fa-heart"></i></div>
</div>
</div>
</div>
<div class="col-md-4">
<div class="metrics-card rounded-4 shadow-sm p-4">
<div class="d-flex justify-content-between align-items-center">
<div>
<p class="text-muted mb-1">Points</p>
<h3 class="mb-0">1,250</h3>
</div>
<div class="icon-box"><i class="fas fa-star"></i></div>
</div>
</div>
</div>
</div>
<div class="row g-4">
<div class="col-lg-7">
<div class="card border-0 shadow-sm rounded-4 p-4">
<h5 class="mb-3">Activités récentes</h5>
<ul class="list-group list-group-flush">
<li class="list-group-item px-0">Bienvenue sur votre compte.</li>
</ul>
</div>
</div>
<div class="col-lg-5">
<div class="card border-0 shadow-sm rounded-4 p-4">
<h5 class="mb-3">Besoin d'aide ?</h5>
<p class="text-muted">Notre équipe support répond en moins de 24h.</p>
<a class="btn btn-secondary rounded-pill" href="#">Contacter le support</a>
</div>
</div>
</div>
</div>
</div>
</div>
<script src="js/main.js"></script>
</body>
</html>
