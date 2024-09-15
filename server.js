const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener el rendimiento del sitio web
app.get('/pagespeed', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
      params: {
        url: url,
        key: 'AIzaSyCXpgCK-7bx8RMzvXKuA4_3bI3Mrsa8FDY',  // Tu API Key aquí
      },
    });

    if (response.data && response.data.lighthouseResult && response.data.lighthouseResult.categories) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: 'Invalid response format from PageSpeed Insights API' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data from PageSpeed Insights API' });
  }
});

// Servir el archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
