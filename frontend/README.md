# Frontend - Bug Tracker

Aceasta este partea de frontend a aplicatiei Bug Tracker, facuta cu React.

## Cum pornesc?

```bash
npm install
npm start
```

Se deschide automat in browser la **http://localhost:3000**

## Componente principale

| Fisier | Ce face |
|--------|---------|
| `App.jsx` | Componenta principala, gestioneaza rutele si autentificarea |
| `Login.jsx` | Formularul de logare |
| `Register.jsx` | Formularul de inregistrare |
| `Navbar.jsx` | Bara de navigare din partea de sus |
| `ProjectList.jsx` | Lista cu proiectele + formular de creare proiect |
| `BugList.jsx` | Lista bug-urilor + formular de raportare + actiuni |

## Stiluri

Toate stilurile sunt in `src/index.css`. Am folosit:
- Tema dark (fundal inchis)
- Culori violet pentru accent
- Design responsive (merge si pe telefon)

## Cum comunica cu backend-ul?

Foloseste **axios** pentru a face request-uri HTTP catre backend-ul de pe portul 8080.

Exemplu din cod:
```javascript
const response = await axios.get('https://aplicatieweb-bcj6.onrender.com/projects')
```

## Note

- Datele utilizatorului sunt salvate in `localStorage` (sesiunea persista la refresh)
- Pentru a te deloga, apasa butonul "Deconectare" din navbar
