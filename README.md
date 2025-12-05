<<<<<<< HEAD
descriere:
  Acesta este serviciul RESTful pentru proiectul de Bug Tracking.
  Sistemul permite inregistrarea utilizatorilor, gestionarea proiectelor,
  adaugarea membrilor (MP/TST) si managementul bug-urilor.
  Tehnologiile utilizate sunt:
    - Node.js cu Express
    - Sequelize ORM
    - SQLite ca baza de date

functionalitati:
  - inregistrare utilizatori (register)
  - autentificare utilizatori (login)
  - creare proiect
  - adaugare membri in proiect
  - raportare bug
  - alocare bug catre membru
  - rezolvare bug

instalare_si_rulare:
  pasi:
  - Clonare repository:
    - "git clone https://github.com/aevali/Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor.git"
      - "cd Aplicatie-web-pentru-gestionarea-rezolvarii-bug-urilor"
    - Instalare dependente:
      - "npm install"
    - Creare fisier .env (pe baza .env.example):
      - PORT=3000
      - NODE_ENV=development
    - Creare folder pentru baza de date:
      - "data/"
    - Pornire aplicatie:
      - "npm run dev"

mesaj_la_rulare_corecta: >
  Baza de date sincronizata
  Server pornit pe http://localhost:3000

testare_API:
  instrumente:
    - Thunder Client
  endpointuri:
    health_check:
      metoda: GET
      url: "http://localhost:3000/"
      raspuns: "{ \"message\": \"Server functional\" }"

    register:
      metoda: POST
      url: "http://localhost:3000/api/auth/register"
      body:
        name: "Ana"
        email: "ana@example.com"
        password: "1234"

    creare_proiect:
      metoda: POST
      url: "http://localhost:3000/api/projects"
      body:
        name: "Demo Project"
        repositoryUrl: "https://github.com/user/demo"
        description: "Primul meu proiect de test"
        ownerId: 1
=======
Aplicatia web de tip Single Page Application (SPA) care permite gestionarea simplificata a bug-urilor dintr-un proiect software. Aplicatia include autentificare, administrarea proiectelor si raportarea/rezolvarea bug-urilor.

Este formata din:

-Front-end realizat in React.js
-Back-end RESTful realizat in Node.js (Express)
-Baza de date relationala

Functionalitati

-Creare cont si autentificare pe baza email
-Roluri: MP (developer) si TST (tester)
-MP poate crea proiecte si poate gestiona bug-urile proiectului
-TST poate raporta bug-uri cu severitate, prioritate, descriere si link la commit
-MP poate aloca bug-uri si actualiza statusul lor
>>>>>>> 9f8aad901389fce3526bcd2f571b1026d256782b
