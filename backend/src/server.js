const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/search', require('./routes/search.js'))
app.use('/api/votes', require('./routes/votes.js'));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
