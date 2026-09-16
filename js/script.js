document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const jobModal = document.getElementById('jobModal');
    const jobForm = document.getElementById('jobForm');
    const jobSourceInput = document.getElementById('jobSourceInput');
    const sourcesList = document.getElementById('sourcesList');

    const previewSection = document.getElementById('previewSection');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const printJobBtn = document.getElementById('printJobBtn');
    const deleteJobBtn = document.getElementById('deleteJobBtn');
    const previewSectionTitle = document.getElementById('previewSectionTitle');

    const previewDisplayMode = document.getElementById('previewDisplayMode');
    const editJobForm = document.getElementById('editJobForm');
    const enableEditBtn = document.getElementById('enableEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const previewCompany = document.getElementById('previewCompany');
    const previewSource = document.getElementById('previewSource');
    const previewRef = document.getElementById('previewRef');
    const previewContact = document.getElementById('previewContact');
    const previewEmail = document.getElementById('previewEmail');
    const previewDate = document.getElementById('previewDate');
    const previewJobText = document.getElementById('previewJobText');
    const previewNotes = document.getElementById('previewNotes');
    const previewStatusSelect = document.getElementById('previewStatusSelect');

    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const printSelectedBtn = document.getElementById('printSelectedBtn');
    const selectedCountSpan = document.getElementById('selectedCount');
    const printPreviewModal = document.getElementById('printPreviewModal');
    const closePrintModalBtn = document.getElementById('closePrintModalBtn');
    const closeModalCross = document.getElementById('closeModalCross');
    const confirmPrintBtn = document.getElementById('confirmPrintBtn');
    const sendEmailActionBtn = document.getElementById('sendEmailActionBtn');
    const printCardsContainer = document.getElementById('printCardsContainer');
    const printDateSubtitle = document.getElementById('printDateSubtitle');

    const btnReport = document.getElementById('btn-report');

    let currentJobId = null;
    let selectedJobIds = [];
    let jobs = JSON.parse(localStorage.getItem('employor_jobs')) || [];
    let jobSources = JSON.parse(localStorage.getItem('employor_sources')) || ['Pôle Emploi', 'Apec', 'LinkedIn', 'Indeed', 'HelloWork'];

    renderJobs();
    updateSourcesDatalist();

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            updateSourcesDatalist();
            jobModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            jobModal.classList.remove('active');
        });
    }

    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', () => {
            previewSection.classList.remove('active');
            currentJobId = null;
        });
    }

    if (btnReport) {
        btnReport.addEventListener('click', () => {
            if (jobs.length === 0) {
                alert("Aucune candidature enregistrée pour générer le rapport.");
                return;
            }

            printCardsContainer.innerHTML = '';
            const todayStr = new Date().toLocaleDateString('fr-FR');
            printDateSubtitle.textContent = `Rapport d'étape Conseiller — Édition du ${todayStr}`;

            const total = jobs.length;
            const aPostuler = jobs.filter(c => c.status === 'to-apply').length;
            const cvEnvoye = jobs.filter(c => c.status === 'sent').length;
            const entretiens = jobs.filter(c => c.status === 'interview').length;

            const reportDiv = document.createElement('div');
            reportDiv.style.cssText = 'background: #ffffff; border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #1e293b; page-break-inside: avoid;';

            let htmlContent = `
                <p style="margin-top: 0;">Bonjour,</p>
                <p>Voici un point d'étape concernant mes démarches de recherche d'emploi récentes (généré via Employor) :</p>
                
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 1rem;">📊 Statistiques globales :</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Total des offres suivies : <strong>${total}</strong></li>
                        <li>À postuler : <strong>${aPostuler}</strong></li>
                        <li>CV / Candidatures envoyés : <strong>${cvEnvoye}</strong></li>
                        <li>Entretiens planifiés / passés : <strong>${entretiens}</strong></li>
                    </ul>
                </div>

                <div style="margin: 15px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 1rem;">📋 Détail des dernières démarches :</h4>
                    <ol style="margin: 0; padding-left: 20px;">
            `;

            [...jobs].reverse().slice(0, 10).forEach((c) => {
                htmlContent += `<li style="margin-bottom: 6px;">Poste : <strong>${escapeHtml(c.title)}</strong> chez <strong>${escapeHtml(c.company)}</strong> [Statut : ${getStatusLabel(c.status)}] (Source : ${escapeHtml(c.source || 'N/C')})</li>`;
            });

            htmlContent += `
                    </ol>
                </div>

                <p style="margin-bottom: 25px;">Je reste à votre disposition pour toute information complémentaire ou pour faire un point.</p>
                <p style="margin-bottom: 0;">Cordialement,<br><strong>Christophe Millot</strong></p>
            `;

            reportDiv.innerHTML = htmlContent;
            printCardsContainer.appendChild(reportDiv);

            printPreviewModal.classList.add('active');
        });
    }

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.job-checkbox');
            selectedJobIds = [];
            checkboxes.forEach(cb => {
                cb.checked = e.target.checked;
                if (e.target.checked) {
                    selectedJobIds.push(Number(cb.dataset.id));
                }
            });
            updateSelectedUI();
        });
    }

    if (printJobBtn) {
        printJobBtn.addEventListener('click', () => {
            const job = jobs.find(j => j.id === currentJobId);
            if (!job) return;

            printCardsContainer.innerHTML = '';
            const todayStr = new Date().toLocaleDateString('fr-FR');
            printDateSubtitle.textContent = `Édition du ${todayStr} — 1 offre sélectionnée`;

            renderPrintCard(job);
            printPreviewModal.classList.add('active');
        });
    }

    if (printSelectedBtn) {
        printSelectedBtn.addEventListener('click', () => {
            if (selectedJobIds.length === 0) return;

            printCardsContainer.innerHTML = '';
            const todayStr = new Date().toLocaleDateString('fr-FR');
            printDateSubtitle.textContent = `Édition du ${todayStr} — ${selectedJobIds.length} offre(s) sélectionnée(s)`;

            let selectedJobs = selectedJobIds.map(id => jobs.find(j => j.id === id)).filter(Boolean);

            selectedJobs.sort((a, b) => {
                if (!a.applyDate) return 1;
                if (!b.applyDate) return -1;
                return new Date(a.applyDate) - new Date(b.applyDate);
            });

            selectedJobs.forEach(job => {
                renderPrintCard(job);
            });

            printPreviewModal.classList.add('active');
        });
    }

    function renderPrintCard(job) {
        const cardDiv = document.createElement('div');
        cardDiv.style.cssText = 'background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 15px; border-radius: 6px; page-break-inside: avoid;';
        cardDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
                <h3 style="color: #0f172a; font-size: 1.1rem; margin: 0;">${escapeHtml(job.title)}</h3>
                <span style="font-size: 0.75rem; font-weight: 600; color: #3b82f6; text-transform: uppercase;">${getStatusLabel(job.status)}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.85rem; margin-bottom: 8px;">
                <div><strong>Entreprise :</strong> ${escapeHtml(job.company)}</div>
                <div><strong>Source :</strong> ${escapeHtml(job.source || '-')}</div>
                <div><strong>Réf :</strong> ${escapeHtml(job.reference || '-')}</div>
                <div><strong>Contact :</strong> ${escapeHtml(job.contactName || 'Non renseigné')}</div>
                <div><strong>Tél/Mail :</strong> ${escapeHtml(job.contactEmail || 'Non renseigné')}</div>
                <div><strong>Date :</strong> ${escapeHtml(job.applyDate || 'Non définie')}</div>
            </div>
            ${job.jobText ? `<div style="font-size: 0.82rem; background: #ffffff; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 6px; white-space: pre-wrap;"><strong>Texte de l'offre :</strong>\n${escapeHtml(job.jobText)}</div>` : ''}
            ${job.notes ? `<div style="font-size: 0.82rem; background: #ffffff; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; white-space: pre-wrap;"><strong>Notes personnelles :</strong> ${escapeHtml(job.notes)}</div>` : ''}
        `;
        printCardsContainer.appendChild(cardDiv);
    }

    if (sendEmailActionBtn) {
        sendEmailActionBtn.addEventListener('click', async () => {
            const recipientInput = document.getElementById('recipientEmail');
            const recipient = recipientInput ? recipientInput.value.trim() : '';

            if (!recipient) {
                alert('Veuillez renseigner une adresse e-mail de destinataire.');
                if (recipientInput) recipientInput.focus();
                return;
            }

            let targetJobs = [];
            if (selectedJobIds.length > 0) {
                targetJobs = selectedJobIds.map(id => jobs.find(j => j.id === id)).filter(Boolean);
            } else if (currentJobId) {
                const singleJob = jobs.find(j => j.id === currentJobId);
                if (singleJob) targetJobs.push(singleJob);
            } else {
                targetJobs = [...jobs];
            }

            if (targetJobs.length === 0) {
                alert('Aucune offre à envoyer.');
                return;
            }

            targetJobs.sort((a, b) => {
                if (!a.applyDate) return 1;
                if (!b.applyDate) return -1;
                return new Date(a.applyDate) - new Date(b.applyDate);
            });

            let emailBody = `
                <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                    <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Récapitulatif des Candidatures</h2>
                    <p style="font-size: 0.9rem; color: #64748b;">Généré via Employor le ${new Date().toLocaleDateString('fr-FR')}</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
            `;

            targetJobs.forEach((job, index) => {
                emailBody += `
                    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                        <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 10px; font-size: 1.1rem;">#${index + 1} : ${escapeHtml(job.title)}</h3>
                        <table style="width: 100%; font-size: 0.9rem; border-collapse: collapse; margin-bottom: 10px;">
                            <tr>
                                <td style="padding: 4px 0; width: 35%;"><strong>Entreprise :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.company)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Statut :</strong></td>
                                <td style="padding: 4px 0; color: #2563eb; font-weight: bold;">${getStatusLabel(job.status)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Source :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.source || 'Non renseignée')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Référence :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.reference || 'Aucune')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Contact :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.contactName || 'Non renseigné')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Tél/Mail contact :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.contactEmail || 'Non renseigné')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;"><strong>Date :</strong></td>
                                <td style="padding: 4px 0;">${escapeHtml(job.applyDate || 'Non définie')}</td>
                            </tr>
                        </table>
                `;

                if (job.jobText) {
                    emailBody += `
                        <div style="margin-top: 10px; background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.85rem; white-space: pre-wrap;">
                            <strong style="display: block; margin-bottom: 5px; color: #475569;">Texte de l'offre :</strong>
                            ${escapeHtml(job.jobText)}
                        </div>
                    `;
                }

                if (job.notes) {
                    emailBody += `
                        <div style="margin-top: 8px; background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.85rem; white-space: pre-wrap;">
                            <strong style="display: block; margin-bottom: 5px; color: #475569;">Notes personnelles :</strong>
                            ${escapeHtml(job.notes)}
                        </div>
                    `;
                }

                emailBody += `</div>`;
            });

            emailBody += `</div>`;

            sendEmailActionBtn.disabled = true;
            sendEmailActionBtn.textContent = 'Envoi en cours...';

            const formData = new FormData();
            formData.append('recipient', recipient);
            formData.append('message', emailBody);

            try {
                const response = await fetch('send-email.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert('✅ ' + result.message);
                    if (recipientInput) recipientInput.value = '';
                    printPreviewModal.classList.remove('active');
                } else {
                    alert('❌ Erreur : ' + result.message);
                }
            } catch (error) {
                console.error('Erreur :', error);
                alert("❌ Erreur de communication avec le serveur.");
            } finally {
                sendEmailActionBtn.disabled = false;
                sendEmailActionBtn.textContent = "Envoyer l'e-mail";
            }
        });
    }

    if (closePrintModalBtn) {
        closePrintModalBtn.addEventListener('click', () => {
            printPreviewModal.classList.remove('active');
        });
    }

    if (closeModalCross) {
        closeModalCross.addEventListener('click', () => {
            printPreviewModal.classList.remove('active');
        });
    }

    if (confirmPrintBtn) {
        confirmPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === jobModal) jobModal.classList.remove('active');
        if (e.target === printPreviewModal) printPreviewModal.classList.remove('active');
    });

    function updateSourcesDatalist() {
        if (!sourcesList) return;
        sourcesList.innerHTML = '';
        jobSources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            sourcesList.appendChild(option);
        });
    }

    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const typedSource = jobSourceInput.value.trim();

            if (typedSource && !jobSources.includes(typedSource)) {
                jobSources.push(typedSource);
                localStorage.setItem('employor_sources', JSON.stringify(jobSources));
                updateSourcesDatalist();
            }

            const newJob = {
                id: Date.now(),
                title: document.getElementById('jobTitle').value,
                company: document.getElementById('company').value,
                source: typedSource || 'Autre',
                reference: document.getElementById('jobRef').value,
                contactName: document.getElementById('contactName').value,
                contactEmail: document.getElementById('contactEmail').value,
                applyDate: document.getElementById('applyDate').value,
                status: document.getElementById('status').value,
                jobText: document.getElementById('jobText').value,
                notes: document.getElementById('notes').value
            };

            jobs.push(newJob);
            localStorage.setItem('employor_jobs', JSON.stringify(jobs));
            renderJobs();
            jobForm.reset();
            jobModal.classList.remove('active');
        });
    }

    if (enableEditBtn) {
        enableEditBtn.addEventListener('click', () => {
            const job = jobs.find(j => j.id === currentJobId);
            if (!job) return;

            document.getElementById('editTitle').value = job.title || '';
            document.getElementById('editCompany').value = job.company || '';
            document.getElementById('editSource').value = job.source || '';
            document.getElementById('editRef').value = job.reference || '';
            document.getElementById('editContactName').value = job.contactName || '';
            document.getElementById('editContactEmail').value = job.contactEmail || '';
            document.getElementById('editApplyDate').value = job.applyDate || '';
            document.getElementById('editJobText').value = job.jobText || '';
            document.getElementById('editNotes').value = job.notes || '';

            previewDisplayMode.style.display = 'none';
            editJobForm.style.display = 'block';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editJobForm.style.display = 'none';
            previewDisplayMode.style.display = 'block';
        });
    }

    if (editJobForm) {
        editJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const typedSource = document.getElementById('editSource').value.trim();

            if (typedSource && !jobSources.includes(typedSource)) {
                jobSources.push(typedSource);
                localStorage.setItem('employor_sources', JSON.stringify(jobSources));
                updateSourcesDatalist();
            }

            jobs = jobs.map(j => {
                if (j.id === currentJobId) {
                    return {
                        ...j,
                        title: document.getElementById('editTitle').value,
                        company: document.getElementById('editCompany').value,
                        source: typedSource || 'Autre',
                        reference: document.getElementById('editRef').value,
                        contactName: document.getElementById('editContactName').value,
                        contactEmail: document.getElementById('editContactEmail').value,
                        applyDate: document.getElementById('editApplyDate').value,
                        jobText: document.getElementById('editJobText').value,
                        notes: document.getElementById('editNotes').value
                    };
                }
                return j;
            });

            localStorage.setItem('employor_jobs', JSON.stringify(jobs));
            editJobForm.style.display = 'none';
            previewDisplayMode.style.display = 'block';
            renderJobs();

            const updatedJob = jobs.find(j => j.id === currentJobId);
            if (updatedJob) showJobPreview(updatedJob);
        });
    }

    if (deleteJobBtn) {
        deleteJobBtn.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
                jobs = jobs.filter(job => job.id !== currentJobId);
                localStorage.setItem('employor_jobs', JSON.stringify(jobs));
                renderJobs();
                previewSection.classList.remove('active');
                currentJobId = null;
            }
        });
    }

    if (previewStatusSelect) {
        previewStatusSelect.addEventListener('change', (e) => {
            if (!currentJobId) return;
            const newStatus = e.target.value;
            jobs = jobs.map(j => {
                if (j.id === currentJobId) j.status = newStatus;
                return j;
            });
            localStorage.setItem('employor_jobs', JSON.stringify(jobs));
            renderJobs();
        });
    }

    function renderJobs() {
        const colToApply = document.getElementById('col-to-apply');
        const colSent = document.getElementById('col-sent');
        const colInterview = document.getElementById('col-interview');
        const classicTableBody = document.getElementById('classicTableBody');

        if (!colToApply || !colSent || !colInterview || !classicTableBody) return;

        colToApply.innerHTML = '';
        colSent.innerHTML = '';
        colInterview.innerHTML = '';
        classicTableBody.innerHTML = '';

        let counts = { 'to-apply': 0, 'sent': 0, 'interview': 0 };

        if (jobs.length === 0) {
            classicTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Aucune candidature enregistrée.</td></tr>`;
        }

        [...jobs].reverse().forEach(job => {
            counts[job.status]++;
            let dotClass = getStatusDotClass(job.status);
            let dateText = job.applyDate ? `📅 ${job.applyDate}` : 'Non définie';
            let refText = job.reference ? `Réf: ${job.reference}` : '';

            const jobElement = document.createElement('div');
            jobElement.className = 'job-item';
            jobElement.innerHTML = `
                <div class="job-header-row">
                    <span class="status-dot ${dotClass}"></span>
                    <h3>${escapeHtml(job.title)}</h3>
                </div>
                <p>${escapeHtml(job.company)} (${escapeHtml(job.source || 'Autre')})</p>
                ${refText ? `<div class="job-date">${escapeHtml(refText)}</div>` : ''}
            `;
            jobElement.addEventListener('click', () => showJobPreview(job));

            if (job.status === 'to-apply') colToApply.appendChild(jobElement);
            if (job.status === 'sent') colSent.appendChild(jobElement);
            if (job.status === 'interview') colInterview.appendChild(jobElement);

            const tr = document.createElement('tr');
            tr.className = 'classic-row';

            const isChecked = selectedJobIds.includes(job.id) ? 'checked' : '';

            tr.innerHTML = `
                <td style="width: 40px; text-align: center;"><input type="checkbox" class="job-checkbox" data-id="${job.id}" ${isChecked}></td>
                <td><span class="status-dot ${dotClass}" style="display: inline-block; margin-right: 8px;"></span>${getStatusLabel(job.status)}</td>
                <td><strong>${escapeHtml(job.title)}</strong></td>
                <td>${escapeHtml(job.company)}</td>
                <td>${escapeHtml(job.source || '-')}</td>
                <td>${escapeHtml(job.reference || '-')}</td>
                <td>${escapeHtml(dateText)}</td>
            `;

            const checkbox = tr.querySelector('.job-checkbox');
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    if (!selectedJobIds.includes(job.id)) selectedJobIds.push(job.id);
                } else {
                    selectedJobIds = selectedJobIds.filter(id => id !== job.id);
                }
                updateSelectedUI();
            });

            tr.addEventListener('click', () => showJobPreview(job));
            classicTableBody.appendChild(tr);
        });

        if (counts['to-apply'] === 0) colToApply.innerHTML = '<p class="empty-msg">Aucune offre pour le moment.</p>';
        if (counts['sent'] === 0) colSent.innerHTML = '<p class="empty-msg">Aucune candidature en cours.</p>';
        if (counts['interview'] === 0) colInterview.innerHTML = '<p class="empty-msg">Aucun entretien planifié.</p>';

        updateSelectedUI();

        if (currentJobId) {
            const activeJob = jobs.find(j => j.id === currentJobId);
            if (activeJob) showJobPreview(activeJob);
            else previewSection.classList.remove('active');
        }
    }

    function updateSelectedUI() {
        if (selectedJobIds.length > 0) {
            printSelectedBtn.style.display = 'inline-block';
            selectedCountSpan.textContent = selectedJobIds.length;
        } else {
            printSelectedBtn.style.display = 'none';
        }
    }

    function showJobPreview(job) {
        currentJobId = job.id;
        previewSectionTitle.textContent = job.title;
        previewCompany.textContent = job.company || '-';
        previewSource.textContent = job.source || '-';
        previewRef.textContent = job.reference || 'Aucune référence';
        previewContact.textContent = job.contactName || 'Non renseigné';
        previewEmail.textContent = job.contactEmail || 'Non renseigné';
        previewDate.textContent = job.applyDate || 'Non renseignée';
        previewJobText.textContent = job.jobText || 'Aucun texte d\'offre collé.';
        previewNotes.textContent = job.notes || 'Aucune note enregistrée.';
        previewStatusSelect.value = job.status;

        editJobForm.style.display = 'none';
        previewDisplayMode.style.display = 'block';

        previewSection.classList.add('active');
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    function getStatusDotClass(status) {
        switch (status) {
            case 'to-apply': return 'status-red';
            case 'interview': return 'status-orange';
            case 'sent': return 'status-green';
            default: return 'status-red';
        }
    }

    function getStatusLabel(status) {
        switch (status) {
            case 'to-apply': return 'À postuler';
            case 'sent': return 'CV Envoyé';
            case 'interview': return 'Entretiens';
            default: return status;
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.toString().replace(/[&<>"']/g, m => map[m]);
    }
});