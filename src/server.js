require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bugs', bugRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Serverul functioneaza' });
});

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Bd sincronizata');
  app.listen(PORT, () => {
    console.log(`Server pornit pe http://localhost:${PORT}`);
  });
});
