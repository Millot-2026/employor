<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employor - Suivi de Candidatures</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="container">
        <header>
            <h1>Employor - Suivi de Candidatures</h1>
            <button id="openModalBtn" class="btn">+ Nouvelle Candidature</button>
        </header>

        <!-- Section 1 : Tableau de bord (Cartes Kanban) -->
        <main class="dashboard-grid">
            <div class="card">
                <h2>À postuler</h2>
                <div id="col-to-apply" class="job-list">
                    <p class="empty-msg">Aucune offre pour le moment.</p>
                </div>
            </div>

            <div class="card">
                <h2>CV Envoyé</h2>
                <div id="col-sent" class="job-list">
                    <p class="empty-msg">Aucune candidature en cours.</p>
                </div>
            </div>

            <div class="card">
                <h2>Entretiens</h2>
                <div id="col-interview" class="job-list">
                    <p class="empty-msg">Aucun entretien planifié.</p>
                </div>
            </div>
        </main>

        <!-- Section 2 : Liste complète classique (Tableau avec sélecteur multiple) -->
        <section class="classic-section">
            <div class="classic-section-header">
                <h2>Liste complète des candidatures</h2>
                <button type="button" id="printSelectedBtn" class="btn btn-success" style="display: none; padding: 6px 14px; font-size: 0.9rem;">🖨️ Imprimer (<span id="selectedCount">0</span>)</button>
            </div>
            <div class="classic-table-container">
                <table class="classic-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;"><input type="checkbox" id="selectAllCheckbox" title="Tout sélectionner"></th>
                            <th>Statut</th>
                            <th>Poste</th>
                            <th>Entreprise</th>
                            <th>Site / Source</th>
                            <th>Réf. Offre</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="classicTableBody">
                        <tr>
                            <td colspan="7" style="text-align: center; color: var(--text-muted);">Aucune candidature enregistrée.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Section 3 : Fiche détaillée / Modification de l'offre sélectionnée -->
        <section id="previewSection" class="preview-section">
            <div class="preview-header">
                <h2 id="previewSectionTitle">Détails de l'offre</h2>
                <div style="display: flex; gap: 10px;">
                    <button type="button" id="printJobBtn" class="btn btn-success" style="padding: 5px 12px; font-size: 0.85rem;">👁️ Prévisualiser l'offre (A4)</button>
                    <button type="button" id="closePreviewBtn" class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.85rem;">Fermer la vue</button>
                </div>
            </div>
            
            <!-- Mode Affichage -->
            <div id="previewDisplayMode">
                <div class="preview-grid">
                    <div class="preview-box">
                        <h4>Entreprise</h4>
                        <p id="previewCompany">-</p>
                    </div>
                    <div class="preview-box">
                        <h4>Site / Source</h4>
                        <p id="previewSource">-</p>
                    </div>
                    <div class="preview-box">
                        <h4>Réf. Offre</h4>
                        <p id="previewRef">-</p>
                    </div>
                    <div class="preview-box">
                        <h4>Responsable / Contact</h4>
                        <p id="previewContact">-</p>
                    </div>
                    <div class="preview-box">
                        <h4>Moyen de contact</h4>
                        <p id="previewEmail">-</p>
                    </div>
                    <div class="preview-box">
                        <h4>Date d'envoi / Prévue</h4>
                        <p id="previewDate">-</p>
                    </div>
                </div>

                <div class="preview-notes">
                    <h4>Texte complet de l'offre</h4>
                    <p id="previewJobText" style="white-space: pre-wrap; font-family: inherit;">-</p>
                </div>

                <div class="preview-notes">
                    <h4>Notes / Commentaires personnels</h4>
                    <p id="previewNotes" style="white-space: pre-wrap;">-</p>
                </div>

                <div class="preview-actions">
                    <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; gap: 10px;">
                        <label for="previewStatusSelect" style="margin-bottom: 0; white-space: nowrap;">Statut :</label>
                        <select id="previewStatusSelect" style="padding: 6px; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color);">
                            <option value="to-apply">À postuler (Rouge)</option>
                            <option value="sent">CV Envoyé (Vert)</option>
                            <option value="interview">Entretiens (Orange)</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="button" id="enableEditBtn" class="btn">Modifier</button>
                        <button type="button" id="deleteJobBtn" class="btn btn-danger">Supprimer</button>
                    </div>
                </div>
            </div>

            <!-- Mode Édition (Caché par défaut) -->
            <form id="editJobForm" style="display: none;">
                <div class="preview-grid">
                    <div class="form-group">
                        <label>Intitulé du poste</label>
                        <input type="text" id="editTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Entreprise</label>
                        <input type="text" id="editCompany" required>
                    </div>
                    <div class="form-group">
                        <label>Site / Source</label>
                        <input type="text" id="editSource" list="sourcesList">
                    </div>
                    <div class="form-group">
                        <label>Réf. Offre</label>
                        <input type="text" id="editRef">
                    </div>
                    <div class="form-group">
                        <label>Responsable / Contact</label>
                        <input type="text" id="editContactName">
                    </div>
                    <div class="form-group">
                        <label>Moyen de contact</label>
                        <input type="text" id="editContactEmail">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="editApplyDate">
                    </div>
                </div>
                <div class="form-group">
                    <label>Texte complet de l'offre</label>
                    <textarea id="editJobText" placeholder="Collez le texte brut de l'offre ici..."></textarea>
                </div>
                <div class="form-group">
                    <label>Notes / Commentaires personnels</label>
                    <textarea id="editNotes"></textarea>
                </div>
                <div class="preview-actions">
                    <button type="button" id="cancelEditBtn" class="btn btn-secondary">Annuler</button>
                    <button type="submit" class="btn btn-success">Enregistrer les modifications</button>
                </div>
            </form>
        </section>
    </div>

    <!-- Modale d'ajout -->
    <div id="jobModal" class="modal">
        <div class="modal-content">
            <h2>Ajouter une candidature</h2>
            <form id="jobForm">
                <div class="form-group">
                    <label for="jobTitle">Intitulé du poste</label>
                    <input type="text" id="jobTitle" required placeholder="ex: Développeur Front-End">
                </div>
                <div class="form-group">
                    <label for="company">Entreprise</label>
                    <input type="text" id="company" required placeholder="ex: Google">
                </div>
                <div class="form-group">
                    <label for="jobSourceInput">Site de recherche d'emploi</label>
                    <input type="text" id="jobSourceInput" list="sourcesList" required placeholder="ex: Pôle Emploi, Apec, LinkedIn...">
                    <datalist id="sourcesList">
                        <!-- Alimenté dynamiquement en JS -->
                    </datalist>
                </div>
                <div class="form-group">
                    <label for="jobRef">Code / Référence de l'offre</label>
                    <input type="text" id="jobRef" placeholder="ex: 123456X ou REF-99">
                </div>
                <div class="form-group">
                    <label for="contactName">Nom du responsable / Contact</label>
                    <input type="text" id="contactName" placeholder="ex: Jean Dupont (RH)">
                </div>
                <div class="form-group">
                    <label for="contactEmail">E-mail ou Téléphone du contact</label>
                    <input type="text" id="contactEmail" placeholder="ex: j.dupont@email.com">
                </div>
                <div class="form-group">
                    <label for="applyDate">Date d'envoi / Prévue</label>
                    <input type="date" id="applyDate">
                </div>
                <div class="form-group">
                    <label for="status">Statut</label>
                    <select id="status">
                        <option value="to-apply">À postuler</option>
                        <option value="sent">CV Envoyé</option>
                        <option value="interview">Entretiens</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="jobText">Texte complet de l'offre</label>
                    <textarea id="jobText" placeholder="Collez l'annonce ici pour pouvoir la relire avant vos entretiens..."></textarea>
                </div>
                <div class="form-group">
                    <label for="notes">Notes / Commentaires personnels</label>
                    <textarea id="notes" placeholder="Détails, salaires, technologies..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" id="closeModalBtn" class="btn btn-secondary">Annuler</button>
                    <button type="submit" class="btn">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>

<!-- Modale de Prévisualisation Compacte Multi-Offres (Type Feuille A4) -->
    <div id="printPreviewModal" class="modal">
        <div class="a4-page">
            <!-- Croix de fermeture en haut à droite -->
            <button type="button" id="closeModalCross" class="print-hide-actions" style="position: absolute; top: 15px; right: 15px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; width: 32px; height: 32px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Fermer">&times;</button>

            <div>
                <!-- En-tête de la page A4 -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; padding-right: 40px;">
                    <div>
                        <h2 style="color: #0f172a; font-size: 1.4rem; margin: 0 0 3px 0;">Récapitulatif des Rendez-vous</h2>
                        <span id="printDateSubtitle" style="font-size: 0.8rem; color: #64748b;">Sélection d'offres du jour</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.75rem; font-weight: bold; color: #64748b; display: block;">EMPLOYOR</span>
                        <span style="font-size: 0.7rem; color: #94a3b8;">Suivi Journalier</span>
                    </div>
                </div>
                
                <!-- Conteneur dynamique où les fiches compactes vont s'empiler -->
                <div id="printCardsContainer" style="display: flex; flex-direction: column; gap: 15px;">
                    <!-- Injecté par JavaScript -->
                </div>

                <!-- Bloc d'envoi d'e-mail intégré (masqué à l'impression) -->
                <div class="print-hide-actions" style="margin-top: 25px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px;">
                    <h4 style="color: #0f172a; font-size: 0.95rem; margin-bottom: 10px;">📧 Envoyer ce récapitulatif par e-mail</h4>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="email" id="recipientEmail" placeholder="Adresse e-mail du destinataire..." style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;">
                        <button type="button" id="sendEmailActionBtn" class="btn" style="background-color: #8b5cf6; padding: 8px 16px; font-size: 0.9rem; white-space: nowrap;">Envoyer l'e-mail</button>
                    </div>
                </div>
            </div>

            <!-- Boutons de contrôle (masqués à l'impression) -->
            <div class="print-hide-actions" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">
                <button type="button" id="closePrintModalBtn" class="btn btn-danger">Fermer</button>
                <button type="button" id="confirmPrintBtn" class="btn btn-success">Lancer l'impression</button>
            </div>
        </div>
    </div>




    <script src="./js/script.js"></script>




</body>
</html>