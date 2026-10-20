<?php
require_once 'config.php';

$wasAdmin = isAdmin();
session_unset();
session_destroy();

if ($wasAdmin) {
    header('Location: admin_login.php?logged_out=1');
} else {
    header('Location: login.php');
}
exit;
