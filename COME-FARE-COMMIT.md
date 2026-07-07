# Come salvare le modifiche su GitHub (da VS Code)

Guida veloce per Luca. Non serve usare il terminale: si fa tutto con i pulsanti di VS Code.

---

## 🟢 La prima volta (solo una volta)

1. Installa **Git**: https://git-scm.com/downloads (scarica, avanti-avanti-fine).
2. Crea un account su **https://github.com** (se non ce l'hai).
3. Apri la cartella del sito in VS Code (`File ▸ Apri cartella…` → scegli la cartella `luca`).
4. Clicca l'icona **Source Control** nella barra a sinistra
   (il simbolo con i tre pallini collegati, oppure premi `Cmd+Shift+G`).
5. Clicca il pulsante blu **“Publish to GitHub”**.
   - VS Code ti chiede di accedere a GitHub → accetta nel browser.
   - Scegli **“Publish to GitHub private repository”** (privato = lo vedi solo tu)
     oppure **public** se vuoi che sia visibile a tutti.
6. Fatto ✅ — il sito è ora su GitHub.

---

## 🔁 Ogni volta che cambi qualcosa (la routine)

Ogni volta che modifichi il sito e vuoi salvarlo online:

1. Vai su **Source Control** (`Cmd+Shift+G`). Vedrai la lista dei file cambiati.
2. In alto scrivi un **messaggio** breve che descrive cosa hai fatto,
   per esempio: `Aggiornato testo esperienza` o `Cambiato colore titoli`.
3. Clicca **✓ Commit** (il segno di spunta in alto).
   - Se chiede “Vuoi fare lo stage di tutte le modifiche?”, rispondi **Sì / Yes**.
4. Clicca **Sync Changes** (o **Push**) per mandarle su GitHub.

Riassunto: **Scrivi messaggio → Commit → Sync**. Tutto qui 🎉

---

## 💡 Parole utili

- **Commit** = un “salvataggio” con un'etichetta (il messaggio). Resta nella cronologia.
- **Push / Sync** = mandare i commit su GitHub (nel cloud).
- **Pull** = scaricare eventuali modifiche fatte altrove (di solito non serve se lavori da solo).

## ⚠️ Consigli

- Fai un commit ogni volta che finisci una modifica sensata, con un messaggio chiaro.
- Non serve committare ad ogni singola lettera: quando una cosa è “a posto”, salvala.
- Se qualcosa si blocca, chiudi e riapri VS Code: di solito si risolve.
