/**
 * FEMY - Módulo Calendario
 * Renderizado y lógica del calendario menstrual
 */

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let diaSeleccionado = null;

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
  if (!Femy.verificarSesion()) return;
  renderizarCalendario();
  document.getElementById('nav-contenedor').innerHTML = Femy.generarNavegacion('calendario');

  // Precargar valores del editor
  const ciclo = Femy.obtenerCiclo();
  if (ciclo) {
    document.getElementById('editar-ciclo').value = ciclo.duracionCiclo || 28;
    document.getElementById('editar-periodo').value = ciclo.duracionPeriodo || 5;
    document.getElementById('editar-fecha-inicio').value = ciclo.fechaUltimoPeriodo || '';
  }
});

// RENDERIZAR CALENDARIO

function renderizarCalendario() {
  actualizarTituloMes();
  const dias = calcularDiasDelMes(anioActual, mesActual);
  const grilla = document.getElementById('grilla-dias');

  grilla.innerHTML = dias.map(dia => {
    if (!dia) return `<div class="celda-dia vacia"></div>`;

    const fecha = new Date(anioActual, mesActual, dia);
    const clases = obtenerClasesDia(fecha);
    const esDiaSeleccionado = diaSeleccionado &&
      diaSeleccionado.getDate() === dia &&
      diaSeleccionado.getMonth() === mesActual &&
      diaSeleccionado.getFullYear() === anioActual;

    if (esDiaSeleccionado) clases.push('seleccionado');

    const tieneIndicador = clases.some(c => ['dia-periodo', 'dia-fertil', 'dia-ovulacion'].includes(c));

    return `
      <div class="celda-dia ${clases.join(' ')}" 
           onclick="seleccionarDia(${dia})"
           title="${Femy.formatearFechaLarga(fecha)}">
        ${dia}
        ${tieneIndicador ? '<span class="indicador-dia"></span>' : ''}
      </div>
    `;
  }).join('');
}

// CALCULAR DÍAS DEL MES

function calcularDiasDelMes(anio, mes) {
  const primerDia = new Date(anio, mes, 1).getDay(); // 0=Dom
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  const dias = [];
  // Espacios vacíos al inicio
  for (let i = 0; i < primerDia; i++) dias.push(null);
  // Días del mes
  for (let d = 1; d <= totalDias; d++) dias.push(d);

  return dias;
}

// OBTENER CLASES SEGÚN FASE DEL CICLO

function obtenerClasesDia(fecha) {
  const ciclo = Femy.obtenerCiclo();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  const clases = [];

  if (fecha.getTime() === hoy.getTime()) {
    clases.push('hoy');
  }

  if (!ciclo.fechaUltimoPeriodo) return clases;

  const ultimoPeriodo = new Date(ciclo.fechaUltimoPeriodo);
  ultimoPeriodo.setHours(0, 0, 0, 0);

  const diasDesdePeriodo = Math.round((fecha - ultimoPeriodo) / (1000 * 60 * 60 * 24));
  const durCiclo = ciclo.duracionCiclo || 28;
  const durPeriodo = ciclo.duracionPeriodo || 5;

  // Calcular en qué ciclo está este día
  // Podemos tener historial de múltiples ciclos
  const rangos = calcularRangosCiclo(ciclo);

  for (const rango of rangos) {
    const d = Math.round((fecha - rango.inicio) / (1000 * 60 * 60 * 24));

    if (d < 0 || d >= durCiclo + 3) continue; // fuera del rango

    if (d >= 0 && d < durPeriodo) {
      clases.push('dia-periodo');
    } else if (d >= durPeriodo + 5 && d <= Math.round(durCiclo / 2) - 2) {
      clases.push('dia-fertil');
    } else if (d === Math.round(durCiclo / 2) - 2) {
      clases.push('dia-ovulacion');
    } else if (d >= durCiclo - 5 && d < durCiclo) {
      clases.push('dia-premenstrual');
    }
  }

  return clases;
}

// CALCULAR RANGOS DE CICLOS

function calcularRangosCiclo(ciclo) {
  const rangos = [];
  const hoy = new Date();
  const durCiclo = ciclo.duracionCiclo || 28;

  if (!ciclo.fechaUltimoPeriodo) return rangos;

  // Ciclo actual y los 3 anteriores
  const fechaBase = new Date(ciclo.fechaUltimoPeriodo);

  for (let i = -3; i <= 2; i++) {
    const inicio = new Date(fechaBase);
    inicio.setDate(inicio.getDate() + (i * durCiclo));
    inicio.setHours(0, 0, 0, 0);
    rangos.push({ inicio });
  }

  return rangos;
}

// SELECCIONAR DÍA

function seleccionarDia(dia) {
  diaSeleccionado = new Date(anioActual, mesActual, dia);
  renderizarCalendario();
  mostrarDetalleDia(diaSeleccionado);
}

function mostrarDetalleDia(fecha) {
  const detalle = document.getElementById('detalle-dia');
  const ciclo = Femy.obtenerCiclo();

  const clases = obtenerClasesDia(new Date(fecha));

  let estado = 'Sin datos de fase';
  let color = 'var(--gris-texto)';

  if (clases.includes('dia-periodo')) { estado = '🩸 Período'; color = 'var(--rosa-fuerte)'; }
  else if (clases.includes('dia-ovulacion')) { estado = '✨ Ovulación'; color = '#B8860B'; }
  else if (clases.includes('dia-fertil')) { estado = '🌱 Período fértil'; color = '#1A6B40'; }
  else if (clases.includes('dia-premenstrual')) { estado = '💜 Fase premenstrual'; color = 'var(--lila-fuerte)'; }

  const diasDesdeInicio = ciclo.fechaUltimoPeriodo ?
    Math.round((fecha - new Date(ciclo.fechaUltimoPeriodo)) / (1000 * 60 * 60 * 24)) % (ciclo.duracionCiclo || 28) + 1 : '--';

  detalle.innerHTML = `
    <div class="detalle-encabezado">
      <div>
        <div class="detalle-fecha-titulo">${Femy.formatearFechaLarga(fecha)}</div>
        <div class="detalle-dia-numero">Día del ciclo: ${diasDesdeInicio > 0 ? diasDesdeInicio : '--'}</div>
      </div>
      <div class="detalle-acciones">
        <button class="btn-detalle-accion" onclick="mostrarEditorPeriodo()">✏️ Editar período</button>
      </div>
    </div>
    <div style="margin-top:12px;">
      <span style="font-size:1rem;font-weight:600;color:${color};">${estado}</span>
    </div>
  `;

  detalle.style.display = 'block';
  detalle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// EDITOR DE PERIODO

function mostrarEditorPeriodo() {
  document.getElementById('panel-editar-periodo').style.display = 'block';
  document.getElementById('panel-editar-periodo').scrollIntoView({ behavior: 'smooth' });
}

function guardarEdicionPeriodo(evento) {
  evento.preventDefault();

  const nuevoCiclo = parseInt(document.getElementById('editar-ciclo').value);
  const nuevoPeriodo = parseInt(document.getElementById('editar-periodo').value);
  const nuevaFecha = document.getElementById('editar-fecha-inicio').value;

  if (!nuevoCiclo || !nuevoPeriodo || !nuevaFecha) {
    Femy.mostrarToast('Completa todos los campos', 'error');
    return;
  }

  const ciclo = Femy.obtenerCiclo();
  ciclo.duracionCiclo = nuevoCiclo;
  ciclo.duracionPeriodo = nuevoPeriodo;
  ciclo.fechaUltimoPeriodo = nuevaFecha;
  Femy.guardarCiclo(ciclo);

  document.getElementById('panel-editar-periodo').style.display = 'none';
  renderizarCalendario();
  Femy.mostrarToast('Período actualizado correctamente', 'exito');
}

// NAVEGACIÓN POR MES

function cambiarMes(delta) {
  mesActual += delta;
  if (mesActual > 11) { mesActual = 0; anioActual++; }
  if (mesActual < 0) { mesActual = 11; anioActual--; }
  diaSeleccionado = null;
  document.getElementById('detalle-dia').style.display = 'none';
  renderizarCalendario();
}

function irAHoy() {
  const hoy = new Date();
  mesActual = hoy.getMonth();
  anioActual = hoy.getFullYear();
  diaSeleccionado = null;
  document.getElementById('detalle-dia').style.display = 'none';
  renderizarCalendario();
  Femy.mostrarToast('Volviste al mes actual', 'exito');
}

function actualizarTituloMes() {
  document.getElementById('titulo-mes').textContent =
    `${Femy.obtenerNombreMes(mesActual)} ${anioActual}`;
}
