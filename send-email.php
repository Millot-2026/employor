<?php
/**
 * send-email.php - Script d'envoi d'e-mail HTML pour Employor
 */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recipient = trim($_POST['recipient'] ?? '');
    $messageHtml = $_POST['message'] ?? '';

    if (empty($recipient) || empty($messageHtml)) {
        echo json_encode(['success' => false, 'message' => 'Destinataire ou message manquant.']);
        exit;
    }

    // Ajout de la structure HTML complète avec lang="fr" pour que Gmail identifie le français
    $fullHtmlMessage = '
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Récapitulatif Employor</title>
    </head>
    <body>
        ' . $messageHtml . '
    </body>
    </html>';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'pool.o2switch.net';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'newsletter@mich8332.odns.fr';
        $mail->Password   = 'KB?R5c-+(Odh89v4';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('newsletter@mich8332.odns.fr', 'Christophe Millot');
        $mail->addAddress($recipient);
        $mail->addReplyTo('newsletter@mich8332.odns.fr');

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Récapitulatif de mes rendez-vous professionnels (Employor)';
        $mail->Body    = $fullHtmlMessage;
        $mail->AltBody = strip_tags(str_replace(['<br>', '</p>', '</div>'], "\n", $messageHtml));

        $mail->send();
        echo json_encode(['success' => true, 'message' => "E-mail envoyé avec succès à {$recipient} !"]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => "Erreur d'envoi : {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}