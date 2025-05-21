const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');

const app = express();
app.use(bodyParser.json());

app.use('/api', authRoutes); 

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
