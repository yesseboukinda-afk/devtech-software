<?php
require_once 'config.php';

$error = '';
$success = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $country = trim($_POST['country'] ?? '');
    $postcode = trim($_POST['postcode'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (!$firstName || !$lastName || !$email || !$password || !$confirmPassword) {
        $error = 'Merci de remplir tous les champs.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Les mots de passe ne correspondent pas.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'Cet email est déjà utilisé.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare('INSERT INTO users (first_name, last_name, email, password_hash, phone, address, city, country, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$firstName, $lastName, $email, $hash, $phone ?: null, $address ?: null, $city ?: null, $country ?: null, $postcode ?: null]);
            $_SESSION['user_id'] = (int)$pdo->lastInsertId();
            header('Location: dashboard.php');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<title>Inscription - Red_link Shop</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card shadow-sm rounded-4">
                <div class="card-body p-5">
                    <h2 class="mb-4">Créer un compte</h2>
                    <?php if ($error): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                    <?php elseif ($success): ?>
                        <div class="alert alert-success">Votre compte a été créé. <a href="login.php">Connectez-vous</a>.</div>
                    <?php endif; ?>
                    <form method="post" action="register.php">
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label" for="first_name">Prénom</label>
                                <input class="form-control" id="first_name" name="first_name" type="text" required value="<?= isset($_POST['first_name']) ? htmlspecialchars($_POST['first_name']) : '' ?>"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="last_name">Nom</label>
                                <input class="form-control" id="last_name" name="last_name" type="text" required value="<?= isset($_POST['last_name']) ? htmlspecialchars($_POST['last_name']) : '' ?>"/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="email">Adresse e-mail</label>
                            <input class="form-control" id="email" name="email" type="email" required value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>"/>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label" for="phone">Téléphone</label>
                                <input class="form-control" id="phone" name="phone" type="text" value="<?= isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '' ?>"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="address">Adresse</label>
                                <input class="form-control" id="address" name="address" type="text" value="<?= isset($_POST['address']) ? htmlspecialchars($_POST['address']) : '' ?>"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="city">Ville</label>
                                <input class="form-control" id="city" name="city" type="text" value="<?= isset($_POST['city']) ? htmlspecialchars($_POST['city']) : '' ?>"/>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" for="postcode">Code postal</label>
                                <input class="form-control" id="postcode" name="postcode" type="text" value="<?= isset($_POST['postcode']) ? htmlspecialchars($_POST['postcode']) : '' ?>"/>
                            </div>
                            <div class="col-12">
                                <label class="form-label" for="country">Pays</label>
                                <input class="form-control" id="country" name="country" type="text" value="<?= isset($_POST['country']) ? htmlspecialchars($_POST['country']) : '' ?>"/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="password">Mot de passe</label>
                            <input class="form-control" id="password" name="password" type="password" required/>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="confirm_password">Confirmer le mot de passe</label>
                            <input class="form-control" id="confirm_password" name="confirm_password" type="password" required/>
                        </div>
                        <button class="btn btn-primary w-100" type="submit">S'inscrire</button>
                    </form>
                    <p class="mt-4 text-center">Vous avez déjà un compte ? <a href="login.php">Se connecter</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="js/main.js"></script>
</body>
</html>
