const axios = require('axios');

module.exports = async (req, res) => {
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

    // Verifica el formato de la respuesta
    console.log('Response Data:', response.data);  // Log de la respuesta completa

    if (response.data && response.data.lighthouseResult && response.data.lighthouseResult.categories) {
      const performanceScore = response.data.lighthouseResult.categories.performance.score * 100;
      res.json({
        performanceScore: performanceScore,
        data: response.data
      });
    } else {
      res.status(500).json({ error: 'Invalid response format from PageSpeed Insights API' });
    }
  } catch (error) {
    console.error('Error fetching data from PageSpeed Insights API:', error.message);
    res.status(500).json({ error: `Error fetching data from PageSpeed Insights API: ${error.message}` });
  }
};

