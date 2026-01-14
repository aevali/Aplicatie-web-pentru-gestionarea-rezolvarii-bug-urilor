/*
 * SERVER BACKEND - Bug Tracker
 * 
 * Aici e toata logica pentru API-ul aplicatiei.
 * Folosim Express pentru server si Sequelize pentru baza de date.
 * 
 * Cum functioneaza:
 * 1. Definim modelele (User, Project, Bug, etc.)
 * 2. Facem relatiile intre ele
 * 3. Cream endpoint-urile REST
 */

const express = require('express')
const Sequelize = require('sequelize')
const cors = require('cors')

const app = express()
const corsOptions = {
    origin: [
        'https://aplicatie-web-bugs-frontend.vercel.app',  // URL-ul production de pe Vercel
        'http://localhost:5173',  // pentru development local
        'http://localhost:3000'   // pentru development local
    ],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))


/*
 * Configurarea bazei de date
 * 
 * Folosim SQLite pentru ca e simplu - salveaza totul intr-un fisier.
 * Nu trebuie sa instalam MySQL sau PostgreSQL separat.
 */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false  // nu afisam query-urile SQL in consola
})


/*
 * MODELUL USER
 * 
 * Reprezinta un utilizator al aplicatiei.
 * Fiecare user are nume, email (unic) si parola.
 */
const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


/*
 * MODELUL PROJECT
 * 
 * Reprezinta un proiect software care va fi monitorizat.
 * Are nume, link la repository-ul git si o descriere optionala.
 */
const Project = sequelize.define('project', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    repository: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.TEXT
})


/*
 * MODELUL PROJECT MEMBER
 * 
 * Face legatura intre useri si proiecte.
 * Un user poate fi in mai multe proiecte, un proiect poate avea mai multi useri.
 * 
 * Rolurile posibile:
 * - MP (Membru Proiect) = poate face tot: modifica proiectul, aloca si rezolva bug-uri
 * - TST (Tester) = poate doar sa raporteze bug-uri
 */
const ProjectMember = sequelize.define('projectMember', {
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['MP', 'TST']]
        }
    }
})


/*
 * MODELUL BUG
 * 
 * Reprezinta un bug raportat intr-un proiect.
 * 
 * Campuri importante:
 * - severity: cat de grav e bug-ul (High, Medium, Low)
 * - priority: cat de urgent trebuie rezolvat (Urgent, Normal, Low)
 * - status: in ce stadiu e (OPEN, IN_PROGRESS, RESOLVED)
 * - commitLink: link la commit-ul care a cauzat bug-ul
 * - resolvedCommitLink: link la commit-ul care l-a rezolvat
 * - assignedToId: cine lucreaza la rezolvare
 */
const Bug = sequelize.define('bug', {
    severity: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['High', 'Medium', 'Low']]
        }
    },
    priority: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['Urgent', 'Normal', 'Low']]
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    commitLink: Sequelize.STRING,
    status: {
        type: Sequelize.STRING,
        defaultValue: 'OPEN',
        validate: {
            isIn: [['OPEN', 'IN_PROGRESS', 'RESOLVED']]
        }
    },
    resolvedCommitLink: Sequelize.STRING,
    assignedToId: Sequelize.INTEGER
})


/*
 * RELATIILE INTRE MODELE
 * 
 * Aici definim cum se leaga tabelele intre ele.
 */

// User si Project sunt legate prin ProjectMember (relatie many-to-many)
User.belongsToMany(Project, { through: ProjectMember })
Project.belongsToMany(User, { through: ProjectMember })

// ProjectMember tine referinte la User si Project
ProjectMember.belongsTo(User)
ProjectMember.belongsTo(Project)
User.hasMany(ProjectMember)
Project.hasMany(ProjectMember)

// Un proiect are mai multe bug-uri
Project.hasMany(Bug)
Bug.belongsTo(Project)

// Un user poate raporta mai multe bug-uri
User.hasMany(Bug, { as: 'reportedBugs', foreignKey: 'reporterId' })
Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' })

// Un user poate avea bug-uri alocate pentru rezolvare
User.hasMany(Bug, { as: 'assignedBugs', foreignKey: 'assignedToId' })
Bug.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' })


/*
 * MIDDLEWARE PENTRU AUTENTIFICARE
 * 
 * Verificam daca request-ul vine de la un user autentificat.
 * Frontend-ul trimite ID-ul userului in header-ul 'X-User-Id'.
 * 
 * Nota: Intr-o aplicatie reala am folosi JWT tokens, dar pentru
 * simplitate folosim doar ID-ul.
 */
const authMiddleware = async (req, res, next) => {
    const userId = req.headers['x-user-id']
    if (!userId) {
        return res.status(401).json({ message: 'Trebuie sa fii autentificat' })
    }
    const user = await User.findByPk(userId)
    if (!user) {
        return res.status(401).json({ message: 'User invalid' })
    }
    req.user = user  // punem user-ul pe request pentru a-l folosi in endpoint
    next()
}

/*
 * Functie helper: verifica daca user-ul e MP intr-un proiect
 */
const checkMPRole = async (userId, projectId) => {
    const member = await ProjectMember.findOne({
        where: { userId, projectId, role: 'MP' }
    })
    return !!member
}

/*
 * Functie helper: verifica daca user-ul e membru (orice rol) intr-un proiect
 */
const checkMembership = async (userId, projectId) => {
    const member = await ProjectMember.findOne({
        where: { userId, projectId }
    })
    return member
}


/*
 * ENDPOINT: RESETARE BAZA DE DATE
 * 
 * GET /create-db
 * 
 * Foloseste asta daca vrei sa stergi totul si sa incepi de la zero.
 * Atentie: sterge TOATE datele!
 */
app.get('/create-db', async (req, res) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'Baza de date a fost recreata!' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Eroare la creare', error: err.message })
    }
})


/*
 * ENDPOINT-URI PENTRU AUTENTIFICARE
 */

/*
 * POST /auth/register
 * 
 * Creaza un cont nou. Trimite: { name, email, password }
 */
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        // verificam daca avem toate datele
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Completeaza toate campurile' })
        }

        // verificam daca email-ul nu e deja folosit
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'Exista deja un cont cu acest email' })
        }

        // cream user-ul
        const user = await User.create({ name, email, password })
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * POST /auth/login
 * 
 * Logheaza un user. Trimite: { email, password }
 * Returneaza datele user-ului daca e corect.
 */
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Email sau parola gresita' })
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * GET /users/me
 * 
 * Returneaza datele user-ului curent (cel logat).
 * Necesita autentificare.
 */
app.get('/users/me', authMiddleware, async (req, res) => {
    res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})


/*
 * ENDPOINT-URI PENTRU PROIECTE
 */

/*
 * GET /projects
 * 
 * Returneaza lista cu toate proiectele.
 * Oricine poate vedea proiectele (nu trebuie sa fii logat).
 */
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [{
                model: ProjectMember,
                include: [User]
            }]
        })
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * GET /projects/:projectId
 * 
 * Returneaza detaliile unui singur proiect.
 */
app.get('/projects/:projectId', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.projectId, {
            include: [{
                model: ProjectMember,
                include: [User]
            }]
        })
        if (!project) {
            return res.status(404).json({ message: 'Proiectul nu exista' })
        }
        res.status(200).json(project)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * POST /projects
 * 
 * Creaza un proiect nou.
 * User-ul care creaza proiectul devine automat MP (Membru Proiect).
 * 
 * Trimite: { name, repository, description }
 */
app.post('/projects', authMiddleware, async (req, res) => {
    try {
        const { name, repository, description } = req.body

        if (!name || !repository) {
            return res.status(400).json({ message: 'Numele si repo-ul sunt obligatorii' })
        }

        // cream proiectul
        const project = await Project.create({ name, repository, description })

        // adaugam creatorul ca MP
        await ProjectMember.create({
            userId: req.user.id,
            projectId: project.id,
            role: 'MP'
        })

        res.status(201).json(project)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * PUT /projects/:projectId
 * 
 * Modifica un proiect existent.
 * Doar membrii MP pot face asta.
 */
app.put('/projects/:projectId', authMiddleware, async (req, res) => {
    try {
        const isMP = await checkMPRole(req.user.id, req.params.projectId)
        if (!isMP) {
            return res.status(403).json({ message: 'Doar membrii MP pot modifica proiectul' })
        }

        const project = await Project.findByPk(req.params.projectId)
        if (!project) {
            return res.status(404).json({ message: 'Proiectul nu exista' })
        }

        await project.update(req.body)
        res.status(200).json(project)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * POST /projects/:projectId/join
 * 
 * Te alatura unui proiect ca Tester (TST).
 * Nu poti face asta daca esti deja membru.
 */
app.post('/projects/:projectId/join', authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.projectId

        // verificam daca proiectul exista
        const project = await Project.findByPk(projectId)
        if (!project) {
            return res.status(404).json({ message: 'Proiectul nu exista' })
        }

        // verificam daca user-ul nu e deja membru
        const existingMember = await checkMembership(req.user.id, projectId)
        if (existingMember) {
            return res.status(400).json({ message: 'Esti deja in acest proiect' })
        }

        // il adaugam ca Tester
        const member = await ProjectMember.create({
            userId: req.user.id,
            projectId: projectId,
            role: 'TST'
        })

        res.status(201).json({ message: 'Te-ai alaturat ca Tester!', member })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * GET /projects/:projectId/members
 * 
 * Returneaza toti membrii unui proiect.
 */
app.get('/projects/:projectId/members', async (req, res) => {
    try {
        const members = await ProjectMember.findAll({
            where: { projectId: req.params.projectId },
            include: [User]
        })
        res.status(200).json(members)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * GET /my-projects
 * 
 * Returneaza proiectele in care user-ul curent e membru.
 * Include si rolul pe care il are in fiecare proiect.
 */
app.get('/my-projects', authMiddleware, async (req, res) => {
    try {
        const memberships = await ProjectMember.findAll({
            where: { userId: req.user.id },
            include: [Project]
        })

        const projects = memberships.map(m => ({
            ...m.project.toJSON(),
            myRole: m.role
        }))

        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


/*
 * ENDPOINT-URI PENTRU BUG-URI
 */

/*
 * GET /projects/:projectId/bugs
 * 
 * Returneaza toate bug-urile unui proiect.
 * Include si cine le-a raportat si cine le rezolva.
 */
app.get('/projects/:projectId/bugs', async (req, res) => {
    try {
        const bugs = await Bug.findAll({
            where: { projectId: req.params.projectId },
            include: [
                { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]  // cele mai noi primele
        })
        res.status(200).json(bugs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * POST /projects/:projectId/bugs
 * 
 * Raporteaza un bug nou.
 * Orice membru al proiectului (MP sau TST) poate face asta.
 * 
 * Trimite: { description, severity, priority, commitLink }
 */
app.post('/projects/:projectId/bugs', authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.projectId

        // verificam daca user-ul e membru al proiectului
        const membership = await checkMembership(req.user.id, projectId)
        if (!membership) {
            return res.status(403).json({ message: 'Trebuie sa fii membru ca sa raportezi bug-uri' })
        }

        const { description, severity, priority, commitLink } = req.body

        if (!description) {
            return res.status(400).json({ message: 'Descrierea e obligatorie' })
        }

        const bug = await Bug.create({
            description,
            severity: severity || 'Medium',
            priority: priority || 'Normal',
            commitLink,
            projectId,
            reporterId: req.user.id,
            status: 'OPEN'
        })

        res.status(201).json(bug)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * PUT /bugs/:bugId/assign
 * 
 * Iti aloci un bug pentru rezolvare.
 * Doar membrii MP pot face asta.
 * Un bug poate fi alocat doar unei singure persoane la un moment dat.
 */
app.put('/bugs/:bugId/assign', authMiddleware, async (req, res) => {
    try {
        const bug = await Bug.findByPk(req.params.bugId)
        if (!bug) {
            return res.status(404).json({ message: 'Bug-ul nu exista' })
        }

        // verificam daca user-ul e MP in proiect
        const isMP = await checkMPRole(req.user.id, bug.projectId)
        if (!isMP) {
            return res.status(403).json({ message: 'Doar membrii MP pot aloca bug-uri' })
        }

        // verificam daca bug-ul nu e deja alocat altcuiva
        if (bug.assignedToId && bug.assignedToId !== req.user.id) {
            return res.status(400).json({ message: 'Bug-ul e deja alocat altcuiva' })
        }

        await bug.update({
            assignedToId: req.user.id,
            status: 'IN_PROGRESS'
        })

        res.status(200).json(bug)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * PUT /bugs/:bugId/unassign
 * 
 * Renunti la un bug pe care ti l-ai alocat.
 */
app.put('/bugs/:bugId/unassign', authMiddleware, async (req, res) => {
    try {
        const bug = await Bug.findByPk(req.params.bugId)
        if (!bug) {
            return res.status(404).json({ message: 'Bug-ul nu exista' })
        }

        // doar cel care are bug-ul alocat poate renunta
        if (bug.assignedToId !== req.user.id) {
            return res.status(403).json({ message: 'Nu poti renunta la un bug care nu e al tau' })
        }

        await bug.update({
            assignedToId: null,
            status: 'OPEN'
        })

        res.status(200).json(bug)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * PUT /bugs/:bugId/resolve
 * 
 * Marcheaza un bug ca rezolvat.
 * Doar persoana care are bug-ul alocat poate face asta.
 * 
 * Trimite: { resolvedCommitLink } - link la commit-ul care rezolva bug-ul
 */
app.put('/bugs/:bugId/resolve', authMiddleware, async (req, res) => {
    try {
        const bug = await Bug.findByPk(req.params.bugId)
        if (!bug) {
            return res.status(404).json({ message: 'Bug-ul nu exista' })
        }

        // doar cel care lucreaza la bug poate sa-l rezolve
        if (bug.assignedToId !== req.user.id) {
            return res.status(403).json({ message: 'Doar cel care are bug-ul alocat poate sa-l rezolve' })
        }

        const { resolvedCommitLink } = req.body

        await bug.update({
            status: 'RESOLVED',
            resolvedCommitLink: resolvedCommitLink || null
        })

        res.status(200).json(bug)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/*
 * PUT /bugs/:bugId
 * 
 * Modifica un bug (orice camp).
 * Doar membrii MP pot face asta.
 */
app.put('/bugs/:bugId', authMiddleware, async (req, res) => {
    try {
        const bug = await Bug.findByPk(req.params.bugId)
        if (!bug) {
            return res.status(404).json({ message: 'Bug-ul nu exista' })
        }

        const isMP = await checkMPRole(req.user.id, bug.projectId)
        if (!isMP) {
            return res.status(403).json({ message: 'Doar membrii MP pot modifica bug-uri' })
        }

        await bug.update(req.body)
        res.status(200).json(bug)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


/*
 * PORNIREA SERVERULUI
 * 
 * Serverul asculta pe portul 8080.
 * La pornire, sincronizeaza modelele cu baza de date (creeaza tabelele daca nu exista).
 */
const PORT = process.env.PORT || 8080
app.listen(PORT, '0.0.0.0', async () => {
    await sequelize.sync()  // sincronizeaza modelele cu DB-ul
    console.log(`Server pornit pe http://localhost:${PORT}`)
})