const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());

app.post('/api/igdb', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      req.body,
      {
        headers: {
          'Client-ID': 'yytjvifii8si3zmeshx8znlox2nuc5',
          'Authorization': 'Bearer vb8e7cupalh6uc0pafce3eikvd9pfs',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
