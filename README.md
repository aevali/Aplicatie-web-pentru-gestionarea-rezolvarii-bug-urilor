# 🐛 Bug Tracker - Aplicatie Web pentru Gestionarea Bug-urilor

## Despre Proiect

Salut! Aceasta este aplicatia mea de la Tehnologii Web. Am facut un sistem de bug tracking - adica o platforma unde echipele pot sa tina evidenta problemelor din proiectele lor software.

Am ales sa folosesc React pentru frontend si Node.js cu Express pentru backend. Totul e deployat online pe Vercel si Render.

## Link-uri Demo

- **Frontend:** https://aplicatie-web-bugs-frontend.vercel.app/
- **Backend API:** https://aplicatie-web-backend.onrender.com/

> **Atentie:** La prima accesare backend-ul poate dura ~30 secunde sa raspunda (e pe planul gratuit la Render si se opreste cand nu e folosit).

## Ce face aplicatia

### Conturi si autentificare
- Iti poti crea cont cu email si parola
- Te loghezi si ramai logat (sesiunea se salveaza)

### Proiecte
- Creezi un proiect nou si devii automat Membru Proiect (MP)
- Vezi toate proiectele existente
- Te poti alatura la orice proiect ca Tester

### Bug-uri
- Raportezi bug-uri cu descriere, severitate (High/Medium/Low) si prioritate
- Daca esti MP, iti poti aloca bug-uri pentru rezolvare
- Marchezi bug-urile ca rezolvate si poti adauga link la commit-ul care le rezolva

### Altele
- Statistici cu cate bug-uri sunt deschise, in lucru sau rezolvate
- Poti filtra bug-urile dupa status
- Vezi membrii fiecarui proiect si ce roluri au

## Tehnologii folosite

| Parte | Tehnologii |
|-------|-----------|
| Frontend | React.js, Axios, CSS |
| Backend | Node.js, Express, Sequelize ORM |
| Baza de date | SQLite |
| Hosting | Vercel (frontend), Render (backend) |

## Structura proiectului

```
📦 Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor
├── 📁 backend/              # Serverul Node.js
│   ├── server.js            # Codul serverului (API-uri REST)
│   └── package.json         # Dependente backend
│
├── 📁 frontend/             # Aplicatia React
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentele React
│   │   │   ├── App.jsx      # Componenta principala
│   │   │   ├── Login.jsx    # Pagina de login
│   │   │   ├── Register.jsx # Pagina de inregistrare
│   │   │   ├── Navbar.jsx   # Bara de navigare
│   │   │   ├── ProjectList.jsx
│   │   │   └── BugList.jsx
│   │   └── index.css        # Stilurile CSS
│   └── package.json         # Dependente frontend
│
├── .gitignore
└── README.md
```

## Cum rulez local

### 1. Clonez repo-ul
```bash
git clone https://github.com/aevali/Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor.git
cd Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor
```

### 2. Pornesc backend-ul
```bash
cd backend
npm install
node server.js
```
Serverul porneste pe `http://localhost:8080`

### 3. Pornesc frontend-ul (in alt terminal)
```bash
cd frontend
npm install
npm start
```
Frontend-ul porneste pe `http://localhost:3000`

### 4. Gata!
Deschid `http://localhost:3000` in browser si pot folosi aplicatia.

## API Endpoints

### Autentificare
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| POST | `/auth/register` | Creeaza cont nou |
| POST | `/auth/login` | Te logheaza |
| GET | `/users/me` | Iti da datele contului |

### Proiecte
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/projects` | Lista cu toate proiectele |
| GET | `/projects/:id` | Detalii despre un proiect |
| POST | `/projects` | Creeaza proiect (devii MP) |
| POST | `/projects/:id/join` | Te alaturi ca Tester |
| GET | `/my-projects` | Proiectele la care esti membru |

### Bug-uri
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/projects/:id/bugs` | Bug-urile unui proiect |
| POST | `/projects/:id/bugs` | Raportezi un bug |
| PUT | `/bugs/:id/assign` | Iti aloci un bug |
| PUT | `/bugs/:id/resolve` | Marchezi bug-ul ca rezolvat |

## Roluri

- **MP (Membru Proiect)** - Poate face orice: modifica proiectul, isi aloca bug-uri, le rezolva
- **TST (Tester)** - Poate doar sa raporteze bug-uri noi

## Baza de date

Am folosit SQLite pentru ca e simplu - nu trebuie sa configurez nimic, totul se salveaza intr-un fisier.

**Tabele:**
- `users` - utilizatorii
- `projects` - proiectele
- `projectMembers` - cine e in ce proiect si cu ce rol
- `bugs` - bug-urile raportate

## Design

Am incercat sa fac un design modern cu:
- Tema intunecata (dark mode)
- Carduri cu umbra
- Culori diferite pentru butoane in functie de actiune
- Badge-uri colorate pentru statusuri si roluri
- E responsive, merge si pe telefon

## Limitari

- Autentificarea e simpla (nu folosesc JWT, doar ID-ul userului)
- Parolele nu sunt criptate (intr-o aplicatie reala ar trebui sa fie)
- Nu se pot sterge proiecte sau bug-uri (doar adaugare si modificare)

---

**Proiect realizat pentru Tehnologii Web, 2025** 🎓
