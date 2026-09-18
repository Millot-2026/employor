# Méthode d'envoi d'e-mails - Projet Employor / Emailor

Ce document récapitule la solution technique mise en place pour l'envoi d'e-mails depuis l'application, basée sur l'utilisation de **PHPMailer** et d'un script de traitement PHP (`send-email.php`).

## 1. Architecture technique

L'architecture repose sur un flux asynchrone entre le client (JavaScript) et le serveur (PHP) :
1. **Frontend (`js/script.js`)** : Récupère les données ou le récapitulatif sélectionné, construit le corps du message au format HTML/CSS, puis envoie une requête `fetch` de type `POST` vers le script PHP.
2. **Backend (`send-email.php`)** : Reçoit les données via `$_POST`, initialise **PHPMailer**, configure les paramètres SMTP (ou l'envoi local selon l'environnement de déploiement, par exemple sur o2switch), injecte le destinataire et le message, puis retourne une réponse au format JSON (`success: true/false`).

---

## 2. Implémentation Front-End (JavaScript)

Le déclenchement s'effectue via un bouton dédié (`sendEmailActionBtn`) dans la modale de prévisualisation :

```javascript
const formData = new FormData();
formData.append('recipient', recipientEmail);
formData.append('message', emailBodyHtml);

const response = await fetch('send-email.php', {
    method: 'POST',
    body: formData
});

const result = await response.json();
if (result.success) {
    // Succès de l'envoi
}

3. Implémentation Back-End (PHP / PHPMailer)
Le script de traitement (send-email.php) doit inclure PHPMailer et configurer l'envoi de manière sécurisée :

Récupération sécurisée du destinataire ($_POST['recipient']).

Récupération du contenu HTML du message ($_POST['message']).

Configuration de l'expéditeur et du sujet.

Gestion des erreurs et retour d'un flux JSON propre pour rassurer l'utilisateur.

4. Règle d'or pour les futurs développements
Pour toute modification ou réutilisation de ce module, s'assurer que :

Le corps du message transmis en AJAX est toujours un conteneur HTML proprement stylisé en inline CSS (pour garantir la compatibilité avec les clients mail).

Le script PHP de réception gère correctement les en-têtes CORS / retours JSON.