<?php
// send-employor-email.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Si vous utilisez Composer ou les fichiers locaux PHPMailer (comme dans Emailor)
// Ajustez les chemins selon votre structure exacte (ex: PHPMailer/src/...)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $recipient = $data['recipient'] ?? '';
    $emailBody = $data['body'] ?? '';

    if (empty($recipient) || empty($emailBody)) {
        echo json_encode(['success' => false, 'message' => 'Destinataire ou message vide.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Paramètres du serveur (à adapter selon votre configuration o2switch / SMTP habituelle)
        // $mail->isSMTP();
        // $mail->Host = 'votre_hote_smtp';
        // $mail->SMTPAuth = true;
        // $mail->Username = 'votre_utilisateur';
        // $mail->Password = 'votre_mot_de_passe';
        // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        // $mail->Port = 465;

        // Expéditeur et Destinataire
        $mail->setFrom('cmillot2004@gmail.com', 'Christophe Millot');
        $mail->addAddress($recipient);

        // Contenu
        $mail->isHTML(false);
        $mail->Subject = 'Récapitulatif de mes rendez-vous professionnels';
        $mail->Body = $emailBody;

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'E-mail envoyé avec succès !']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => "Erreur d'envoi : {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}