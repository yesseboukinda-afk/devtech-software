<?php
require_once 'config.php';
requireAdmin();

$user = getCurrentUser($pdo);
$adminName = $user ? ($user['first_name'] . ' ' . $user['last_name']) : ($_SESSION['user_name'] ?? 'Administrateur');

// Fetch dashboard statistics
$totalSales = 0;
$totalOrders = 0;
$totalUsers = 0;
$recentInvoices = [];
$usersList = [];

try {
    // Total sales
    $salesStmt = $pdo->query("SELECT SUM(total) as total_sales, COUNT(*) as order_count FROM invoices");
    $salesData = $salesStmt->fetch();
    $totalSales = $salesData['total_sales'] ?? 0;
    $totalOrders = $salesData['order_count'] ?? 0;

    // Total users
    $usersCountStmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
    $totalUsers = $usersCountStmt->fetch()['user_count'] ?? 0;

    // Recent invoices
    $invoicesStmt = $pdo->query("SELECT id, invoice_number, created_at, total, billing_first_name, billing_last_name, billing_email FROM invoices ORDER BY created_at DESC LIMIT 10");
    $recentInvoices = $invoicesStmt->fetchAll();

    // Users list
    $usersStmt = $pdo->query("SELECT id, first_name, last_name, email, phone, city, role, created_at FROM users ORDER BY id DESC LIMIT 15");
    $usersList = $usersStmt->fetchAll();
} catch (Exception $e) {
    // Graceful fallback if tables or columns are not yet filled
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8"/>
    <title>Administration - Red_link Shop</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" rel="stylesheet"/>
    <link href="css/bootstrap.min.css" rel="stylesheet"/>
    <link href="css/style.css" rel="stylesheet"/>
    <style>
        .admin-sidebar {
            background: #1f2d3d;
            min-height: 100vh;
            color: #c2c7d0;
        }
        .admin-sidebar a {
            color: #c2c7d0;
            text-decoration: none;
            padding: 0.85rem 1.25rem;
            display: flex;
            align-items: center;
            border-radius: 0.5rem;
            margin-bottom: 0.25rem;
            transition: all 0.2s ease;
        }
        .admin-sidebar a:hover, .admin-sidebar a.active {
            background: #ff7f50;
            color: #ffffff;
        }
        .stat-card {
            border: none;
            border-radius: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }
        .stat-card:hover {
            transform: translateY(-3px);
        }
        .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        .badge-admin {
            background-color: #ff7f50;
            color: #fff;
        }
        .badge-user {
            background-color: #e2e8f0;
            color: #475569;
        }
    </style>
</head>
<body class="bg-light">
    <!-- Top Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white d-flex align-items-center" href="admin_dashboard.php">
                <i class="fas fa-shield-alt text-primary me-2"></i> Red_link <span class="badge bg-primary ms-2 fs-6">Admin</span>
            </a>
            <div class="d-flex align-items-center gap-3">
                <span class="text-white-50 d-none d-md-inline">Connecté en tant que <strong class="text-white"><?= htmlspecialchars($adminName) ?></strong></span>
                <a href="index.html" class="btn btn-outline-light btn-sm rounded-pill px-3" target="_blank">
                    <i class="fas fa-store me-1"></i> Voir la boutique
                </a>
                <a href="logout.php" class="btn btn-danger btn-sm rounded-pill px-3">
                    <i class="fas fa-power-off me-1"></i> Déconnexion
                </a>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-lg-2 p-3 admin-sidebar d-none d-lg-block">
                <div class="text-center py-4 border-bottom border-secondary mb-3">
                    <div class="avatar-circle bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 56px; height: 56px; font-size: 1.5rem;">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <h6 class="text-white mb-0"><?= htmlspecialchars($adminName) ?></h6>
                    <small class="text-primary fw-semibold">Super Admin</small>
                </div>
                <div class="nav flex-column">
                    <a href="#stats" class="active"><i class="fas fa-tachometer-alt me-2"></i> Vue générale</a>
                    <a href="#commandes"><i class="fas fa-shopping-bag me-2"></i> Commandes</a>
                    <a href="#clients"><i class="fas fa-users me-2"></i> Utilisateurs</a>
                    <a href="orders.php"><i class="fas fa-file-invoice me-2"></i> Mes factures</a>
                    <a href="index.html"><i class="fas fa-external-link-alt me-2"></i> Boutique Red_link</a>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-lg-10 p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="h3 fw-bold mb-1">Tableau de Bord Administrateur</h2>
                        <p class="text-muted mb-0">Supervision des ventes, des clients et des commandes de Red_link Shop</p>
                    </div>
                    <span class="badge bg-success py-2 px-3 rounded-pill"><i class="fas fa-circle me-1 small"></i> Système opérationnel</span>
                </div>

                <!-- Stats Row -->
                <div class="row g-4 mb-4" id="stats">
                    <div class="col-sm-6 col-xl-3">
                        <div class="card stat-card p-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small fw-semibold text-uppercase">Chiffre d'Affaires</span>
                                    <h3 class="fw-bold mb-0 mt-1"><?= number_format($totalSales, 0, ',', ' ') ?> <small class="fs-6 fw-normal text-muted">FCFA</small></h3>
                                </div>
                                <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card stat-card p-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small fw-semibold text-uppercase">Commandes</span>
                                    <h3 class="fw-bold mb-0 mt-1"><?= $totalOrders ?></h3>
                                </div>
                                <div class="stat-icon bg-info bg-opacity-10 text-info">
                                    <i class="fas fa-box-open"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card stat-card p-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small fw-semibold text-uppercase">Utilisateurs</span>
                                    <h3 class="fw-bold mb-0 mt-1"><?= $totalUsers ?></h3>
                                </div>
                                <div class="stat-icon bg-success bg-opacity-10 text-success">
                                    <i class="fas fa-user-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card stat-card p-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small fw-semibold text-uppercase">Statut Admin</span>
                                    <h3 class="fw-bold mb-0 mt-1 text-primary">Actif</h3>
                                </div>
                                <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Orders Section -->
                <div class="card border-0 shadow-sm rounded-4 mb-4" id="commandes">
                    <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0"><i class="fas fa-receipt text-primary me-2"></i>Dernières Commandes / Factures</h5>
                        <span class="badge bg-light text-dark"><?= count($recentInvoices) ?> affichées</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Facture N°</th>
                                        <th>Date</th>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Total</th>
                                        <th>Statut</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (!empty($recentInvoices)): ?>
                                        <?php foreach ($recentInvoices as $inv): ?>
                                            <tr>
                                                <td class="fw-semibold text-primary"><?= htmlspecialchars($inv['invoice_number']) ?></td>
                                                <td><?= htmlspecialchars($inv['created_at']) ?></td>
                                                <td><?= htmlspecialchars($inv['billing_first_name'] . ' ' . $inv['billing_last_name']) ?></td>
                                                <td><?= htmlspecialchars($inv['billing_email']) ?></td>
                                                <td class="fw-bold"><?= number_format($inv['total'], 0, ',', ' ') ?> FCFA</td>
                                                <td><span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2">Payée</span></td>
                                                <td class="text-end">
                                                    <a href="invoice.php?id=<?= $inv['id'] ?>" class="btn btn-sm btn-outline-primary rounded-pill px-3" target="_blank">
                                                        <i class="fas fa-eye me-1"></i> Facture
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="7" class="text-center py-4 text-muted">
                                                <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                Aucune commande enregistrée pour le moment.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Users Management Section -->
                <div class="card border-0 shadow-sm rounded-4" id="clients">
                    <div class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0"><i class="fas fa-users text-primary me-2"></i>Comptes Utilisateurs & Administrateurs</h5>
                        <span class="badge bg-light text-dark"><?= count($usersList) ?> comptes</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nom Complet</th>
                                        <th>Email</th>
                                        <th>Téléphone</th>
                                        <th>Ville</th>
                                        <th>Rôle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (!empty($usersList)): ?>
                                        <?php foreach ($usersList as $u): ?>
                                            <tr>
                                                <td class="text-muted">#<?= $u['id'] ?></td>
                                                <td class="fw-semibold"><?= htmlspecialchars($u['first_name'] . ' ' . $u['last_name']) ?></td>
                                                <td><?= htmlspecialchars($u['email']) ?></td>
                                                <td><?= htmlspecialchars($u['phone'] ?? '-') ?></td>
                                                <td><?= htmlspecialchars($u['city'] ?? '-') ?></td>
                                                <td>
                                                    <?php if (($u['role'] ?? '') === 'admin'): ?>
                                                        <span class="badge badge-admin rounded-pill px-3 py-2"><i class="fas fa-shield-alt me-1"></i> Administrateur</span>
                                                    <?php else: ?>
                                                        <span class="badge badge-user rounded-pill px-3 py-2">Client</span>
                                                    <?php endif; ?>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="6" class="text-center py-4 text-muted">
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
