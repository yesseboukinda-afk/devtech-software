<?php
require_once 'config.php';

if (isAdmin()) {
    header('Location: admin_dashboard.php');
    exit;
}

$error = '';
$loggedOut = isset($_GET['logged_out']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        $error = 'Veuillez saisir votre adresse email administrateur et votre mot de passe.';
    } else {
        $authenticated = false;
        $adminUser = null;

        try {
            $stmt = $pdo->prepare('SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = ?');
            $stmt->execute([$email]);
            $adminUser = $stmt->fetch();

            if ($adminUser && password_verify($password, $adminUser['password_hash'])) {
                if ($adminUser['role'] === 'admin') {
                    $authenticated = true;
                } else {
                    $error = "Accès refusé : ce compte ne dispose pas des privilèges d'administrateur.";
                }
            } else {
                $error = 'Identifiants administrateur incorrects.';
            }
        } catch (Exception $e) {
            // Fallback for default admin credentials if DB connection issue or user not yet in DB
            if ($email === 'admin@redlink.com' && $password === 'admin123') {
                $authenticated = true;
                $adminUser = [
                    'id' => 1,
                    'first_name' => 'Admin',
                    'last_name' => 'RedLink',
                    'email' => 'admin@redlink.com',
                    'role' => 'admin'
                ];
            } else {
                $error = 'Erreur lors de la vérification : ' . $e->getMessage();
            }
        }

        if ($authenticated && $adminUser) {
            $_SESSION['user_id'] = $adminUser['id'];
            $_SESSION['user_role'] = 'admin';
            $_SESSION['user_name'] = $adminUser['first_name'] . ' ' . $adminUser['last_name'];
            header('Location: admin_dashboard.php');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8"/>
    <title>Connexion Administration - Red_link Shop</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&amp;family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" rel="stylesheet"/>
    <link href="css/bootstrap.min.css" rel="stylesheet"/>
    <link href="css/style.css" rel="stylesheet"/>
    <style>
        .admin-login-card {
            border: none;
            border-radius: 1.25rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.08);
            overflow: hidden;
        }
        .admin-header-badge {
            background: linear-gradient(135deg, #1f2d3d 0%, #111a24 100%);
            color: #fff;
            padding: 2.5rem 2rem 2rem;
            text-align: center;
        }
        .admin-shield-icon {
            width: 72px;
            height: 72px;
            background: rgba(255, 127, 80, 0.15);
            border: 2px solid #ff7f50;
            color: #ff7f50;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .credentials-box {
            background-color: #f8f9fa;
            border-left: 4px solid #ff7f50;
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
        }
    </style>
</head>
<body class="bg-light d-flex flex-column min-vh-100">
    <div class="container-fluid bg-light py-2 border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
            <span class="text-muted small"><i class="fas fa-shield-alt text-primary me-2"></i>Espace sécurisé d'administration</span>
            <a href="index.html" class="text-muted small text-decoration-none"><i class="fas fa-arrow-left me-1"></i> Retour au site</a>
        </div>
    </div>

    <div class="container my-auto py-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5">
                <div class="admin-login-card bg-white">
                    <div class="admin-header-badge">
                        <div class="admin-shield-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3 class="text-white mb-1">Panneau d'Administration</h3>
                        <p class="text-white-50 mb-0 small">Red_link Shop - Gestion & Supervision</p>
                    </div>

                    <div class="card-body p-4 p-md-5">
                        <?php if ($loggedOut): ?>
                            <div class="alert alert-success d-flex align-items-center mb-4" role="alert">
                                <i class="fas fa-check-circle me-2"></i>
                                <div>Vous avez été déconnecté avec succès.</div>
                            </div>
                        <?php endif; ?>

                        <?php if ($error): ?>
                            <div class="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <div><?= htmlspecialchars($error) ?></div>
                            </div>
                        <?php endif; ?>

                        <form method="post" action="admin_login.php">
                            <div class="mb-3">
                                <label class="form-label fw-semibold" for="email">Email Administrateur</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light"><i class="fas fa-envelope text-muted"></i></span>
                                    <input class="form-control" id="email" name="email" type="email" placeholder="admin@redlink.com" required value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : 'admin@redlink.com' ?>"/>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold" for="password">Mot de passe</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light"><i class="fas fa-lock text-muted"></i></span>
                                    <input class="form-control" id="password" name="password" type="password" placeholder="••••••••" required value="admin123"/>
                                </div>
                            </div>

                            <button class="btn btn-primary w-100 py-2 rounded-pill fw-semibold shadow-sm" type="submit">
                                <i class="fas fa-sign-in-alt me-2"></i> Connexion Administration
                            </button>
                        </form>

                        <div class="credentials-box mt-4">
                            <strong class="d-block text-dark mb-1"><i class="fas fa-info-circle me-1 text-primary"></i> Identifiants par défaut :</strong>
                            <div class="text-muted">
                                <div><strong>Email :</strong> <code>admin@redlink.com</code></div>
                                <div><strong>Mot de passe :</strong> <code>admin123</code></div>
                            </div>
                        </div>

                        <div class="text-center mt-4 pt-3 border-top">
                            <a class="text-muted small text-decoration-none" href="login.php">
                                <i class="fas fa-user me-1"></i> Vous êtes client ? Connexion espace client
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="py-3 bg-white border-top text-center text-muted small mt-auto">
        &copy; <?= date('Y') ?> Red_link Shop - Système d'administration sécurisé
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
