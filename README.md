# 🐛 Bug Tracker - Aplicatie Web pentru Gestionarea Bug-urilor

## 📌 Despre Proiect

Bug Tracker este o aplicatie web pe care am facut-o pentru proiectul de la facultate. Practic, e o platforma unde echipele de dezvoltatori pot sa tina evidenta bug-urilor din proiectele lor software.

Am vrut sa fac ceva util si modern, asa ca am folosit React pentru frontend si Node.js pentru backend. Aplicatia e deployata pe Vercel si Render, deci poate fi accesata de oriunde.

## 🚀 Link-uri Demo

- **Frontend (Vercel):** https://aplicatie-web-bugs-frontend.vercel.app/
- **Backend (Render):** https://aplicatie-web-backend.onrender.com/

> **Nota:** Backend-ul pe Render poate sa dureze ~30 secunde la prima accesare daca a fost inactiv, pentru ca e pe planul gratuit.

## ✨ Ce poate sa faca aplicatia

### Autentificare
- Te poti **inregistra** cu email si parola
- Te poti **loga** cu contul creat
- Sesiunea ramane salvata (nu trebuie sa te loghezi de fiecare data)

### Gestionare Proiecte
- Poti **crea un proiect nou** - devii automat Membru Proiect (MP)
- Poti **vedea toate proiectele** din aplicatie
- Poti sa te **alaturi** la un proiect existent ca Tester

### Gestionare Bug-uri
- Poti **raporta un bug** cu descriere, severitate si prioritate
- Ca MP, poti **sa iti aloci** un bug pentru rezolvare
- Poti **marca un bug ca rezolvat** si sa adaugi link-ul la commit

### Alte functionalitati
- Statistici cu numarul de bug-uri (deschise, in lucru, rezolvate)
- Filtrare bug-uri dupa status
- Vizualizare echipa proiectului

## 🛠️ Tehnologii folosite

### Frontend
- **React.js** - pentru interfata utilizator
- **Axios** - pentru request-urile HTTP catre backend
- **CSS** - stilizare custom (tema dark, design modern)

### Backend
- **Node.js** cu **Express** - serverul API
- **Sequelize** - ORM pentru baza de date
- **SQLite** - baza de date (simplu, nu necesita configurare)
- **CORS** - pentru a permite request-uri din frontend

## 📂 Structura Proiectului

```
📦 Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor
├── 📁 frontend/           # Aplicatia React
│   ├── 📁 public/         # Fisiere statice
│   └── 📁 src/
│       ├── 📁 components/ # Componentele React
│       │   ├── App.jsx        # Componenta principala
│       │   ├── Login.jsx      # Formular login
│       │   ├── Register.jsx   # Formular inregistrare
│       │   ├── Navbar.jsx     # Bara de navigare
│       │   ├── ProjectList.jsx # Lista proiecte
│       │   └── BugList.jsx    # Lista bug-uri
│       ├── index.js       # Punct de intrare
│       └── index.css      # Stiluri CSS
│
├── 📁 backend/            # Copie backup a serverului
│   └── server.js
│
├── server.js              # Serverul principal Express
├── package.json           # Dependente backend
└── README.md              # Fisierul asta :)
```

## 🔧 Cum rulez local

### 1. Clonez repository-ul
```bash
git clone https://github.com/aevali/Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor.git
cd Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor
```

### 2. Instalez si pornesc backend-ul
```bash
npm install
node server.js
```
Backend-ul va rula pe `http://localhost:8080`

### 3. Instalez si pornesc frontend-ul (in alt terminal)
```bash
cd frontend
npm install
npm start
```
Frontend-ul va rula pe `http://localhost:3000`

### 4. Deschid aplicatia
Merg in browser la `http://localhost:3000` si gata!

## 📡 API Endpoints

### Autentificare
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| POST | `/auth/register` | Inregistreaza un user nou |
| POST | `/auth/login` | Logheaza un user |
| GET | `/users/me` | Returneaza user-ul curent |

### Proiecte
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/projects` | Lista toate proiectele |
| GET | `/projects/:id` | Detalii proiect |
| POST | `/projects` | Creeaza proiect (devii MP) |
| POST | `/projects/:id/join` | Te alaturi ca Tester |
| GET | `/my-projects` | Proiectele mele |

### Bug-uri
| Metoda | Endpoint | Descriere |
|--------|----------|-----------|
| GET | `/projects/:id/bugs` | Bug-urile unui proiect |
| POST | `/projects/:id/bugs` | Raporteaza un bug |
| PUT | `/bugs/:id/assign` | Iti aloci un bug |
| PUT | `/bugs/:id/resolve` | Rezolvi un bug |

## 👥 Roluri in aplicatie

| Rol | Cod | Ce poate face |
|-----|-----|---------------|
| **Membru Proiect** | MP | Tot: creeaza proiecte, aloca bug-uri, rezolva |
| **Tester** | TST | Raporteaza bug-uri |

## 📝 Baza de date

Am folosit SQLite pentru ca e simplu - salveaza totul intr-un fisier `database.sqlite`. 

### Modele:
- **User** - utilizatorii aplicatiei
- **Project** - proiectele software
- **ProjectMember** - legatura user-proiect (cu rol)
- **Bug** - bug-urile raportate

## 🎨 Design

Am incercat sa fac un design modern, cu:
- Tema dark (mai usor pentru ochi)
- Carduri cu umbra
- Butoane colorate in functie de actiune
- Badge-uri pentru roluri si statusuri
- Responsive (merge si pe telefon)

## ⚠️ Limitari cunoscute

- Nu am implementat JWT pentru autentificare (folosesc doar ID-ul userului)
- Parola nu e hashuitaD (intr-o aplicatie reala ar trebui)
- Pe Render, serverul "adoarme" dupa inactivitate

## 🙋 Intrebari frecvente

**Q: De ce dureaza mult prima incarcare?**
A: Backend-ul e pe Render gratuit si se opreste dupa inactivitate. Prima cerere il trezeste.

**Q: Pot sa sterg un proiect/bug?**
A: Nu am implementat inca stergerea, doar adaugare si modificare.

## 📧 Contact

Daca ai intrebari sau sugestii, ma gasesti pe GitHub: [@aevali](https://github.com/aevali)

---

**© 2026 - Proiect realizat pentru facultate** 🎓
