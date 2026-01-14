# 🐛 Bug Tracker - Aplicatie Web pentru Gestionarea Bug-urilor

Salut! Aceasta este o aplicatie web care te ajuta sa tii evidenta bug-urilor dintr-un proiect software. E facuta pentru proiectul de la WebTech.

## Ce face aplicatia?

- Te poti **inregistra** si **loga** cu adresa de email
- Poti **crea proiecte** si devii automat membru al echipei (MP)
- Altii se pot **alatura** proiectului tau ca Testeri (TST)
- Oricine din echipa poate **raporta bug-uri** 
- Membrii echipei (MP) pot **aloca** si **rezolva** bug-urile

## Tehnologii folosite

- **Backend**: Node.js + Express.js
- **Baza de date**: SQLite (prin Sequelize ORM)
- **Frontend**: React.js

## Cum pornesc aplicatia?

### 1. Porneste backend-ul

Deschide un terminal in folderul principal si ruleaza:

```bash
npm install
node server.js
```

Serverul va rula pe **https://aplicatieweb-bcj6.onrender.com**

### 2. Porneste frontend-ul

Deschide alt terminal in folderul `frontend` si ruleaza:

```bash
cd frontend
npm install
npm start
```

Aplicatia se va deschide automat in browser la **http://localhost:3000**

## Structura proiectului

```
BugCatcher/
├── server.js          <- Serverul backend (API-ul)
├── database.sqlite    <- Baza de date (se creeaza automat)
├── package.json
│
└── frontend/          <- Aplicatia React
    └── src/
        └── components/
            ├── App.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Navbar.jsx
            ├── ProjectList.jsx
            └── BugList.jsx
```

## Roluri in aplicatie

| Rol | Ce poate face |
|-----|---------------|
| **MP** (Membru Proiect) | Creeaza proiecte, raporteaza bug-uri, aloca si rezolva bug-uri |
| **TST** (Tester) | Raporteaza bug-uri |

## Endpoint-uri API (pentru backend)

Daca vrei sa testezi API-ul direct:

- `POST /auth/register` - inregistrare user nou
- `POST /auth/login` - logare
- `GET /projects` - lista proiecte
- `POST /projects` - creare proiect
- `POST /projects/:id/join` - alaturare ca tester
- `GET /projects/:id/bugs` - bug-urile unui proiect
- `POST /projects/:id/bugs` - raportare bug
- `PUT /bugs/:id/assign` - alocare bug
- `PUT /bugs/:id/resolve` - rezolvare bug

## Probleme frecvente

**Nu merge sa pornesc serverul?**
- Asigura-te ca ai Node.js instalat (`node --version`)
- Ruleaza `npm install` inainte de `node server.js`

**Nu se incarca datele in frontend?**
- Verifica ca backend-ul ruleaza pe portul 8080
- Verifica consola browser-ului pentru erori

**Vreau sa resetez baza de date?**
- Sterge fisierul `database.sqlite` si reporneste serverul

---

Facut pentru proiectul de WebTech 2026 🚀
