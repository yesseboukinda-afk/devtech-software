<?php
require_once 'config.php';

if (isLoggedIn()) {
    if (isAdmin()) {
        header('Location: admin_dashboard.php');
    } else {
        header('Location: dashboard.php');
    }
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        $error = 'Veuillez renseigner une adresse email valide et un mot de passe.';
    } else {
        $stmt = $pdo->prepare('SELECT id, first_name, last_name, password_hash, role FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'] ?? 'user';
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            if (($user['role'] ?? '') === 'admin') {
                header('Location: admin_dashboard.php');
            } else {
                header('Location: dashboard.php');
            }
            exit;
        }
        $error = 'Email ou mot de passe incorrect.';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Connexion - Red_link Shop</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" rel="stylesheet"/>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card shadow-sm rounded-4 border-0">
                <div class="card-body p-5">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="mb-0">Connexion</h2>
                        <a href="index.html" class="btn btn-outline-primary btn-sm rounded-pill">Accueil</a>
                    </div>
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                    <?php endif; ?>
                    <form method="post" action="login.php">
                        <div class="mb-3">
                            <label class="form-label" for="email">Adresse e-mail</label>
                            <input class="form-control" id="email" name="email" type="email" required value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>"/>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="password">Mot de passe</label>
                            <input class="form-control" id="password" name="password" type="password" required/>
                        </div>
                        <button class="btn btn-primary w-100 rounded-pill py-2" type="submit">Se connecter</button>
                    </form>
                    <p class="mt-4 text-center">Pas encore de compte ? <a href="register.php">Créer un compte</a></p>
                    <div class="text-center mt-3 pt-3 border-top">
                        <a href="admin_login.php" class="text-muted small text-decoration-none">
                            <i class="fas fa-user-shield me-1 text-primary"></i> Accès réservé aux administrateurs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="js/main.js"></script>
</body>
</html>
