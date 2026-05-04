/**
 * FEMY - Módulo Análisis
 * Estadísticas, gráficos SVG y reportes del ciclo
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!Femy.verificarSesion()) return;

  renderizarEstadisticas();
  renderizarGraficoCiclos();
  renderizarHistorial();
  renderizarGraficoSintomas();
  document.getElementById('nav-contenedor').innerHTML = Femy.generarNavegacion('analisis');
});

// ESTADÍSTICAS RÁPIDAS

function renderizarEstadisticas() {
  const ciclo = Femy.obtenerCiclo();
  const historial = ciclo.historial || [];
  const durCiclo = ciclo.duracionCiclo || 28;
  const durPeriodo = ciclo.duracionPeriodo || 5;

  // Calcular promedio de ciclos del historial
  let promedioCiclo = durCiclo;
  let promedioPeriodo = durPeriodo;

  if (historial.length >= 2) {
    const diferencias = [];
    for (let i = 1; i < historial.length; i++) {
      const d1 = new Date(historial[i - 1].inicio);
      const d2 = new Date(historial[i].inicio);
      diferencias.push(Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24))));
    }
    if (diferencias.length > 0) {
      promedioCiclo = Math.round(diferencias.reduce((a, b) => a + b, 0) / diferencias.length);
    }
  }

  const stats = [
    {
      numero: historial.length || 2,
      unidad: 'ciclos',
      etiqueta: 'Ciclos registrados',
      color: 'var(--lila-fuerte)',
      fondo: 'var(--lila-claro)'
    },
    {
      numero: promedioCiclo,
      unidad: 'días',
      etiqueta: 'Promedio de ciclo',
      color: 'var(--rosa-fuerte)',
      fondo: '#FFD6E0'
    },
    {
      numero: durPeriodo,
      unidad: 'días',
      etiqueta: 'Promedio de período',
      color: '#1A6B40',
      fondo: '#D4F5E9'
    },
    {
      numero: Femy.obtenerSintomas().length,
      unidad: 'síntomas',
      etiqueta: 'Síntomas registrados',
      color: '#B8860B',
      fondo: '#FFF8E7'
    }
  ];

  document.getElementById('grilla-estadisticas').innerHTML = stats.map(s => `
    <div class="tarjeta-estadistica" style="border-top: 4px solid ${s.color};">
      <div class="stat-numero" style="color:${s.color}">${s.numero}</div>
      <div class="stat-unidad" style="color:${s.color}">${s.unidad}</div>
      <div class="stat-etiqueta">${s.etiqueta}</div>
    </div>
  `).join('');
}

// GRÁFICO SVG DE CICLOS

function renderizarGraficoCiclos() {
  const ciclo = Femy.obtenerCiclo();
  const historial = ciclo.historial || [];
  const durCiclo = ciclo.duracionCiclo || 28;

  // Generar datos de ciclos (simulados si hay pocos)
  const datos = generarDatosCiclos(historial, durCiclo);

  const ancho = 600;
  const alto = 200;
  const paddingX = 50;
  const paddingY = 30;
  const anchoGraf = ancho - paddingX * 2;
  const altoGraf = alto - paddingY * 2;

  const maxVal = Math.max(...datos.map(d => d.duracion)) + 5;
  const minVal = Math.min(...datos.map(d => d.duracion)) - 5;
  const rangoY = maxVal - minVal;

  const escalaX = anchoGraf / (datos.length - 1 || 1);
  const escalaY = altoGraf / rangoY;

  // Puntos del gráfico
  const puntos = datos.map((d, i) => ({
    x: paddingX + i * escalaX,
    y: paddingY + altoGraf - (d.duracion - minVal) * escalaY
  }));

  // Línea del área (relleno)
  const puntosArea = [
    `${paddingX},${paddingY + altoGraf}`,
    ...puntos.map(p => `${p.x},${p.y}`),
    `${paddingX + anchoGraf},${paddingY + altoGraf}`
  ].join(' ');

  // Línea del path
  const pathLinea = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Línea de promedio
  const promedio = Math.round(datos.reduce((s, d) => s + d.duracion, 0) / datos.length);
  const yPromedio = paddingY + altoGraf - (promedio - minVal) * escalaY;

  const svg = `
    <svg viewBox="0 0 ${ancho} ${alto}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#C97FE8;stop-opacity:0.25"/>
          <stop offset="100%" style="stop-color:#C97FE8;stop-opacity:0.02"/>
        </linearGradient>
      </defs>

      <!-- Líneas de referencia horizontales -->
      ${[0, 0.25, 0.5, 0.75, 1].map(f => {
    const y = paddingY + f * altoGraf;
    const val = Math.round(maxVal - f * rangoY);
    return `
          <line x1="${paddingX}" y1="${y}" x2="${paddingX + anchoGraf}" y2="${y}" 
                stroke="#F0E0F8" stroke-width="1" stroke-dasharray="4,4"/>
          <text x="${paddingX - 8}" y="${y + 4}" text-anchor="end" class="eje-texto">${val}</text>
        `;
  }).join('')}

      <!-- Área bajo la curva -->
      <polygon points="${puntosArea}" fill="url(#gradArea)"/>

      <!-- Línea de promedio -->
      <line x1="${paddingX}" y1="${yPromedio}" x2="${paddingX + anchoGraf}" y2="${yPromedio}"
            stroke="#FFD97D" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="${paddingX + anchoGraf + 4}" y="${yPromedio + 4}" class="eje-texto" fill="#B8860B">
        prom. ${promedio}d
      </text>

      <!-- Línea de la curva -->
      <path d="${pathLinea}" fill="none" stroke="#C97FE8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

      <!-- Puntos y etiquetas -->
      ${puntos.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="#9B4DC4" stroke="white" stroke-width="2"/>
        <text x="${p.x}" y="${paddingY + altoGraf + 18}" text-anchor="middle" class="eje-texto">
          ${datos[i].etiqueta}
        </text>
        <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" 
              style="font-family:DM Sans,sans-serif;font-size:10px;font-weight:700;fill:#7B2D9E;">
          ${datos[i].duracion}d
        </text>
      `).join('')}
    </svg>
  `;

  document.getElementById('grafico-ciclos').innerHTML = svg;
}

function generarDatosCiclos(historial, durBase) {
  if (historial.length >= 3) {
    return historial.slice(-6).map((h, i) => ({
      duracion: h.duracion || durBase + Math.floor(Math.random() * 4 - 2),
      etiqueta: `C${i + 1}`
    }));
  }

  // Simular datos históricos realistas
  const base = durBase;
  return [
    { duracion: base - 1, etiqueta: 'Ago' },
    { duracion: base + 2, etiqueta: 'Sep' },
    { duracion: base - 2, etiqueta: 'Oct' },
    { duracion: base, etiqueta: 'Nov' },
    { duracion: base + 1, etiqueta: 'Dic' },
    { duracion: base - 1, etiqueta: 'Ene' }
  ];
}

// HISTORIAL DE CICLOS

function renderizarHistorial() {
  const ciclo = Femy.obtenerCiclo();
  const historial = ciclo.historial || [];
  const contenedor = document.getElementById('lista-historial');
  const contador = document.getElementById('contador-ciclos');

  const totalCiclos = historial.length || 2;
  contador.textContent = `${totalCiclos} ciclos`;

  const colores = ['#E8527A', '#C97FE8', '#52C07A', '#FFD97D', '#5B8DEF'];

  // Generar historial simulado si hay pocos datos
  const items = historial.length >= 2 ? historial : [
    { inicio: calcularFechaAtras(56), fin: calcularFechaAtras(51) },
    { inicio: calcularFechaAtras(28), fin: calcularFechaAtras(23) }
  ];

  contenedor.innerHTML = items.slice().reverse().map((h, i) => {
    const fechaInicio = Femy.formatearFecha(h.inicio, { day: 'numeric', month: 'short' });
    const fechaFin = h.fin ? Femy.formatenerFecha(h.fin, { day: 'numeric', month: 'short' }) : 'En curso';
    const dias = h.fin
      ? Math.round((new Date(h.fin) - new Date(h.inicio)) / (1000 * 60 * 60 * 24))
      : (ciclo.duracionPeriodo || 5);
    const color = colores[i % colores.length];

    return `
      <div class="item-historial">
        <div class="historial-indicador" style="background:${color}"></div>
        <div class="historial-info">
          <div class="historial-fechas">${fechaInicio} — ${fechaFin}</div>
          <div class="historial-duracion">${dias} días de período</div>
        </div>
        <div class="historial-barra" 
             style="background:${color}30;width:${dias * 8}px;min-width:30px;max-width:80px;border-left:3px solid ${color};">
        </div>
      </div>
    `;
  }).join('');
}

function calcularFechaAtras(dias) {
  const f = new Date();
  f.setDate(f.getDate() - dias);
  return f.toISOString().split('T')[0];
}

// Parche para el typo en renderizarHistorial
Femy.formatenerFecha = Femy.formatearFecha.bind(Femy);

// GRÁFICO DE SÍNTOMAS (BARRAS HORIZONTALES)

function renderizarGraficoSintomas() {
  const sintomas = Femy.obtenerSintomas();
  const contenedor = document.getElementById('grafico-sintomas');

  // Datos de frecuencia simulados (en app real, se registraría por día)
  const frecuencias = {};
  sintomas.forEach(s => { frecuencias[s] = Math.floor(Math.random() * 8) + 3; });

  // Añadir algunos predeterminados si hay pocos
  if (Object.keys(frecuencias).length < 3) {
    frecuencias['Cólicos'] = 8;
    frecuencias['Fatiga'] = 6;
    frecuencias['Cambios de humor'] = 5;
  }

  const entradas = Object.entries(frecuencias).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entradas.map(e => e[1]));

  if (entradas.length === 0) {
    contenedor.innerHTML = '<p style="color:var(--gris-texto);font-style:italic;font-size:0.88rem;">No hay síntomas registrados aún.</p>';
    return;
  }

  contenedor.innerHTML = entradas.map(([nombre, valor]) => `
    <div class="barra-sintoma">
      <div class="barra-sintoma-nombre">${nombre}</div>
      <div class="barra-sintoma-track">
        <div class="barra-sintoma-fill" style="width:0%" data-ancho="${(valor / max * 100).toFixed(0)}%"></div>
      </div>
      <div class="barra-sintoma-valor">${valor}x</div>
    </div>
  `).join('');

  // Animar barras
  setTimeout(() => {
    document.querySelectorAll('.barra-sintoma-fill').forEach(b => {
      b.style.width = b.dataset.ancho;
    });
  }, 300);
}

// EXPORTAR DATOS

function exportarDatos() {
  const ciclo = Femy.obtenerCiclo();
  const usuario = Femy.obtenerUsuario();
  const sintomas = Femy.obtenerSintomas();
  const fase = Femy.calcularFaseActual();

  const texto = `
REPORTE FEMY - ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}
=====================================
Usuario: ${usuario ? usuario.nombre : 'N/A'}
Correo: ${usuario ? usuario.correo : 'N/A'}

DATOS DEL CICLO:
- Duración promedio: ${ciclo.duracionCiclo || 28} días
- Duración del período: ${ciclo.duracionPeriodo || 5} días
- Último período: ${ciclo.fechaUltimoPeriodo || 'No registrado'}
- Fase actual: ${fase ? fase.nombre : 'N/A'}
- Días para próximo período: ${fase ? fase.diasParaProximoPeriodo : 'N/A'}

SÍNTOMAS REGISTRADOS:
${sintomas.length > 0 ? sintomas.map(s => `- ${s}`).join('\n') : '- Ninguno registrado'}

HISTORIAL DE CICLOS:
${(ciclo.historial || []).map((h, i) => `Ciclo ${i + 1}: ${h.inicio} — ${h.fin || 'En curso'}`).join('\n') || '- Sin historial'}

---
Generado por Femy App
  `.trim();

  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `femy-reporte-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  Femy.mostrarToast('Reporte exportado correctamente', 'exito');
}
