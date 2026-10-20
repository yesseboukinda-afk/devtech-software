<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = '127.0.0.1';
$db = 'redlinkshop';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    ensureUserProfileColumns($pdo);
    ensureAdminUser($pdo);
} catch (PDOException $e) {
    die('Erreur de connexion à la base de données : ' . $e->getMessage());
}

function ensureUserProfileColumns(PDO $pdo)
{
    $columns = [
        'phone' => 'ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL',
        'address' => 'ALTER TABLE users ADD COLUMN address VARCHAR(255) DEFAULT NULL',
        'city' => 'ALTER TABLE users ADD COLUMN city VARCHAR(100) DEFAULT NULL',
        'country' => 'ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT NULL',
        'postcode' => 'ALTER TABLE users ADD COLUMN postcode VARCHAR(20) DEFAULT NULL',
        'role' => "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'",
    ];

    foreach ($columns as $sql) {
        try {
            $pdo->exec($sql);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') === false && strpos($e->getMessage(), 'already exists') === false) {
                // If the error is not about an existing column, don't crash
            }
        }
    }
}

function ensureAdminUser(PDO $pdo)
{
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE role = 'admin' OR email = 'admin@redlink.com' LIMIT 1");
        $stmt->execute();
        $admin = $stmt->fetch();

        if (!$admin) {
            $hash = password_hash('admin123', PASSWORD_DEFAULT);
            $insert = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role, phone, city, country) VALUES (?, ?, ?, ?, 'admin', ?, ?, ?)");
            $insert->execute(['Admin', 'RedLink', 'admin@redlink.com', $hash, '+241 077058307', 'Libreville', 'Gabon']);
        }
    } catch (Exception $e) {
        // Table may not exist yet or column created
    }
}

function isLoggedIn()
{
    return !empty($_SESSION['user_id']);
}

function isAdmin()
{
    return !empty($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function requireLogin()
{
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function requireAdmin()
{
    if (!isLoggedIn() || !isAdmin()) {
        header('Location: admin_login.php');
        exit;
    }
}

function getCurrentUser(PDO $pdo)
{
    if (!isLoggedIn()) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT id, email, first_name, last_name, phone, address, city, country, postcode, role FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}
