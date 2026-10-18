<?php
// La connexion à la base, à un seul endroit.
// Les identifiants sont dans identifiants.php, à côté.
require __DIR__ . '/identifiants.php';

try {
    $pdo = new PDO(
        "mysql:host=$hote;port=$port;dbname=$base;charset=utf8mb4",
        $utilisateur,
        $mot_de_passe,
        array(
            // Une erreur SQL lève une exception au lieu de passer inaperçue
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            // Chaque ligne arrive en tableau à étiquettes : $oeuvre['titre']
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Requêtes préparées par MySQL lui-même : les entiers arrivent en
            // entiers, et non en chaînes, même en PHP 7.4
            PDO::ATTR_EMULATE_PREPARES   => false,
        )
    );
} catch (PDOException $e) {
    // Sans ce try, PHP afficherait une page d'erreur HTML au milieu du JSON,
    // et en PHP 7.4 elle contiendrait le mot de passe en clair.
    http_response_code(500);
    echo json_encode(array(
        'erreur' => 'Base de données injoignable',
        // Utile en local pour comprendre ; à retirer avant la mise en ligne
        
    ), JSON_UNESCAPED_UNICODE);
    exit;
}
