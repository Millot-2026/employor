<?php
/**
 * Script d'export statique pour GitHub Pages
 * Lit le index.php (sans exécuter le code PHP serveur pour l'instant) et génère un index.html propre.
 */

$sourceFile = __DIR__ . '/../index.php';
$destDir = __DIR__ . '/../dist/'; // Dossier de sortie pour GitHub

if (!file_exists($destDir)) {
    mkdir($destDir, 0777, true);
}

if (file_exists($sourceFile)) {
    $content = file_get_contents($sourceFile);
    
    // Nettoyage basique des balises PHP pour en faire du HTML pur
    $htmlContent = str_replace('<?php', '<!-- PHP BLOCK -->', $content);
    
    file_put_contents($destDir . 'index.html', $htmlContent);
    echo "Export réussi vers /dist/index.html !";
} else {
    echo "Fichier index.php introuvable.";
}