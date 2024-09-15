document.getElementById('check-button').addEventListener('click', async function() {
    const url = document.getElementById('url-input').value;
    document.getElementById('loading-bar').style.width = '100%';
    try {
        const response = await fetch(`/pagespeed?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        document.getElementById('loading-bar').style.width = '0%';

        if (data && data.loadingExperience && data.originLoadingExperience) {
            console.log(data); // Imprime la respuesta completa para depuración

            const { loadingExperience, originLoadingExperience } = data;

            const mobileMetrics = `
                <div class="result-card">
                    <h3>Rendimiento en Móvil</h3>
                    <div class="metric">
                        <span class="metric-name">Cambio de Diseño Acumulativo</span>
                        ${formatMetric(loadingExperience.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile, { good: 0, medium: 10 })}
                    </div>
                    <div class="metric">
                        <span class="metric-name">Primer Pintado con Contenido</span>
                        ${formatMetric(loadingExperience.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile, { good: 1800, medium: 3000 })}
                    </div>
                    <div class="metric">
                        <span class="metric-name">Mayor Pintado con Contenido</span>
                        ${formatMetric(loadingExperience.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile, { good: 2500, medium: 4000 })}
                    </div>
                </div>
            `;

            const desktopMetrics = `
                <div class="result-card">
                    <h3>Rendimiento en Escritorio</h3>
                    <div class="metric">
                        <span class="metric-name">Cambio de Diseño Acumulativo</span>
                        ${formatMetric(originLoadingExperience.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile, { good: 0, medium: 10 })}
                    </div>
                    <div class="metric">
                        <span class="metric-name">Primer Pintado con Contenido</span>
                        ${formatMetric(originLoadingExperience.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile, { good: 1800, medium: 3000 })}
                    </div>
                    <div class="metric">
                        <span class="metric-name">Mayor Pintado con Contenido</span>
                        ${formatMetric(originLoadingExperience.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile, { good: 2500, medium: 4000 })}
                    </div>
                </div>
            `;

            const metricsCircles = `
                <div class="metric-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="${getColor(data.performanceScore)}" stroke-width="10" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#fff" stroke-width="10" stroke-dasharray="${(data.performanceScore || 0)} 100" stroke-dashoffset="25" fill="none"/>
                    </svg>
                    <span>${data.performanceScore || 'N/A'}</span>
                    <div class="metric-label">Rendimiento</div>
                </div>
                <div class="metric-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="${getColor(data.accessibilityScore)}" stroke-width="10" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#fff" stroke-width="10" stroke-dasharray="${(data.accessibilityScore || 0)} 100" stroke-dashoffset="25" fill="none"/>
                    </svg>
                    <span>${data.accessibilityScore || 'N/A'}</span>
                    <div class="metric-label">Accesibilidad</div>
                </div>
                <div class="metric-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="${getColor(data.bestPracticesScore)}" stroke-width="10" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#fff" stroke-width="10" stroke-dasharray="${(data.bestPracticesScore || 0)} 100" stroke-dashoffset="25" fill="none"/>
                    </svg>
                    <span>${data.bestPracticesScore || 'N/A'}</span>
                    <div class="metric-label">Prácticas Recomendadas</div>
                </div>
                <div class="metric-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="${getColor(data.seoScore)}" stroke-width="10" fill="none"/>
                        <circle cx="50" cy="50" r="45" stroke="#fff" stroke-width="10" stroke-dasharray="${(data.seoScore || 0)} 100" stroke-dashoffset="25" fill="none"/>
                    </svg>
                    <span>${data.seoScore || 'N/A'}</span>
                    <div class="metric-label">SEO</div>
                </div>
            `;

            document.getElementById('results').innerHTML = metricsCircles;

            document.getElementById('mobile-button').addEventListener('click', function() {
                document.getElementById('results').innerHTML = mobileMetrics;
                document.getElementById('mobile-icon').classList.add('active');
                document.getElementById('desktop-icon').classList.remove('active');
            });

            document.getElementById('desktop-button').addEventListener('click', function() {
                document.getElementById('results').innerHTML = desktopMetrics;
                document.getElementById('desktop-icon').classList.add('active');
                document.getElementById('mobile-icon').classList.remove('active');
            });

        } else {
            document.getElementById('results').innerHTML = `
                <div class="result-card">
                    <h3>Ocurrió un error al obtener los datos.</h3>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading-bar').style.width = '0%';
        document.getElementById('results').innerHTML = `
            <div class="result-card">
                <h3>Ocurrió un error al obtener los datos.</h3>
            </div>
        `;
    }
});

function formatMetric(value, thresholds) {
    let category;
    if (value <= thresholds.good) {
        category = 'good';
    } else if (value <= thresholds.medium) {
        category = 'medium';
    } else {
        category = 'poor';
    }
    return `
        <div class="metric-bar ${category}">
            <span>${value} ms</span>
        </div>
    `;
}

function getColor(score) {
    if (score >= 85) return '#4caf50'; // Verde para bueno
    if (score >= 50) return '#ff9800'; // Naranja para regular
    return '#f44336'; // Rojo para malo
}
