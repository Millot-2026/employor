<?php
// Configuration de la base de données (pour plus tard)
$host = 'localhost';
$dbname = 'employor_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Création automatique de la base et de la table si elles n'existent pas
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `$dbname`;");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );");

} catch (PDOException $e) {
    // En mode local, on laisse un message discret si la BDD n'est pas encore active
    // echo "Erreur de connexion : " . $e->getMessage();
}