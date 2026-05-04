/**
 * FEMY - Módulo Registro
 * Formulario de creación de cuenta en múltiples pasos
 */

// Datos temporales durante el registro
const datosRegistro = {
  correo: '',
  contrasena: '',
  nombre: '',
  fechaNacimiento: '',
  duracionCiclo: 28,
  duracionPeriodo: 5,
  ultimaRegla: '',
  sintomasFisicos: [],
  molestias: []
};

// Catálogo de síntomas
const sintomasFisicos = [
  { nombre: 'Acné', icono: '💢' },
  { nombre: 'Dolor abdominal (Cólicos)', icono: '🫁' },
  { nombre: 'Dolor de cabeza/migraña', icono: '🤕' },
  { nombre: 'Fatiga o cansancio inusual', icono: '😴' },
  { nombre: 'Sensibilidad o hinchazón en los senos', icono: '💜' },
  { nombre: 'Dolor muscular o lumbar', icono: '🦴' },
  { nombre: 'Problemas digestivos', icono: '🫄' },
  { nombre: 'Insomnio', icono: '🌙' }
];

const molestias = [
  { nombre: 'SPM (Síndrome Premenstrual)', icono: '😤' },
  { nombre: 'Flujo abundante', icono: '💧' },
  { nombre: 'Dolor intenso', icono: '🔥' },
  { nombre: 'Sangrado abundante', icono: '🩸' },
  { nombre: 'Cambios de humor', icono: '🌊' },
  { nombre: 'No me molesta nada', icono: '😊' }
];

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
  // Establecer fecha máxima para última regla (hoy)
  const hoy = new Date().toISOString().split('T')[0];
  const campoUltimaRegla = document.getElementById('ultima-regla');
  if (campoUltimaRegla) {
    campoUltimaRegla.max = hoy;
    // Establecer fecha por defecto hace 10 días
    const hace10dias = new Date();
    hace10dias.setDate(hace10dias.getDate() - 10);
    campoUltimaRegla.value = hace10dias.toISOString().split('T')[0];
  }

  // Fecha de nacimiento máxima (hace 10 años)
  const campoBirth = document.getElementById('fecha-nacimiento');
  if (campoBirth) {
    const maxBirth = new Date();
    maxBirth.setFullYear(maxBirth.getFullYear() - 10);
    campoBirth.max = maxBirth.toISOString().split('T')[0];
  }

  // Generar listas de síntomas
  generarListaSintomas('lista-sintomas-fisicos', sintomasFisicos, 'fisico');
  generarListaSintomas('lista-molestias', molestias, 'molestia');

  // Validación en tiempo real de contraseña
  const campoContrasena = document.getElementById('contrasena-registro');
  if (campoContrasena) {
    campoContrasena.addEventListener('input', validarContrasenaEnTiempoReal);
  }
});

// GENERAR LISTA DE SÍNTOMAS DINÁMICA

function generarListaSintomas(contenedorId, lista, tipo) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = lista.map((item, idx) => `
    <div class="item-sintoma" 
         id="sintoma-${tipo}-${idx}"
         onclick="alternarSintoma('${tipo}', ${idx}, '${item.nombre}')">
      <span class="icono-sintoma">${item.icono}</span>
      <span class="nombre-sintoma">${item.nombre}</span>
      <span class="checkbox-sintoma" id="check-${tipo}-${idx}"></span>
    </div>
  `).join('');
}

function alternarSintoma(tipo, idx, nombre) {
  const elemento = document.getElementById(`sintoma-${tipo}-${idx}`);
  const check = document.getElementById(`check-${tipo}-${idx}`);

  const lista = tipo === 'fisico' ? datosRegistro.sintomasFisicos : datosRegistro.molestias;

  if (elemento.classList.contains('seleccionado')) {
    elemento.classList.remove('seleccionado');
    check.textContent = '';
    const i = lista.indexOf(nombre);
    if (i > -1) lista.splice(i, 1);
  } else {
    elemento.classList.add('seleccionado');
    check.textContent = '✓';
    lista.push(nombre);
  }
}

// VALIDACIÓN EN TIEMPO REAL DE CONTRASEÑA

function validarContrasenaEnTiempoReal() {
  const valor = document.getElementById('contrasena-registro').value;

  const reqLongitud = document.getElementById('req-longitud');
  const reqMayuscula = document.getElementById('req-mayuscula');
  const reqNumero = document.getElementById('req-numero');

  if (reqLongitud) {
    reqLongitud.classList.toggle('cumplido', valor.length >= 8);
  }
  if (reqMayuscula) {
    reqMayuscula.classList.toggle('cumplido', /[A-Z]/.test(valor));
  }
  if (reqNumero) {
    reqNumero.classList.toggle('cumplido', /[0-9]/.test(valor));
  }
}

// AVEGACIÓN ENTRE PASOS

function siguientePaso(evento, numeroPaso) {
  if (evento) evento.preventDefault();

  // Validar según el paso
  if (numeroPaso === 1) {
    if (!validarPaso1()) return;
  } else if (numeroPaso === 2) {
    if (!validarPaso2()) return;
  }

  // Guardar datos del paso actual
  guardarDatosPaso(numeroPaso);

  // Activar siguiente paso
  activarPaso(numeroPaso + 1);
}

function pasoAnterior(numeroPasoActual) {
  activarPaso(numeroPasoActual - 1);
}

function activarPaso(numero) {
  // Ocultar todos los pasos
  document.querySelectorAll('.paso-registro').forEach(p => p.classList.remove('activo'));

  // Mostrar el paso objetivo
  const pasoDestino = document.getElementById(`paso-${numero}`);
  if (pasoDestino) {
    pasoDestino.classList.add('activo');
    window.scrollTo(0, 0);
  }

  // Actualizar indicadores
  actualizarIndicadores(numero);
}

function actualizarIndicadores(pasoActivo) {
  for (let i = 1; i <= 4; i++) {
    const indicador = document.getElementById(`indicador-${i}`);
    const linea = document.querySelectorAll('.linea-paso')[i - 1];

    if (indicador) {
      indicador.classList.remove('activo', 'completado');
      if (i < pasoActivo) {
        indicador.classList.add('completado');
        indicador.textContent = '✓';
      } else if (i === pasoActivo) {
        indicador.classList.add('activo');
        indicador.textContent = i;
      } else {
        indicador.textContent = i;
      }
    }

    if (linea) {
      linea.classList.toggle('activa', i < pasoActivo);
    }
  }
}

// GUARDAR DATOS DE CADA PASO

function guardarDatosPaso(paso) {
  if (paso === 1) {
    datosRegistro.correo = document.getElementById('correo-registro').value.trim();
    datosRegistro.contrasena = document.getElementById('contrasena-registro').value;
  } else if (paso === 2) {
    datosRegistro.nombre = document.getElementById('nombre-registro').value.trim();
    datosRegistro.fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    datosRegistro.duracionCiclo = parseInt(document.getElementById('duracion-ciclo').value);
    datosRegistro.duracionPeriodo = parseInt(document.getElementById('duracion-periodo').value);
    datosRegistro.ultimaRegla = document.getElementById('ultima-regla').value;
  }
}

// VALIDACIONES POR PASO

function validarPaso1() {
  const correo = document.getElementById('correo-registro').value.trim();
  const contrasena = document.getElementById('contrasena-registro').value;
  const confirmar = document.getElementById('confirmar-contrasena').value;
  const alerta = document.getElementById('alerta-registro');

  if (!Femy.validarCorreo(correo)) {
    mostrarAlertaRegistro(alerta, 'Por favor ingresa un correo electrónico válido.');
    return false;
  }

  if (!Femy.validarContrasena(contrasena)) {
    mostrarAlertaRegistro(alerta, 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
    return false;
  }

  if (contrasena !== confirmar) {
    mostrarAlertaRegistro(alerta, 'Las contraseñas no coinciden. Por favor verifica.');
    return false;
  }

  alerta.style.display = 'none';
  return true;
}

function validarPaso2() {
  const nombre = document.getElementById('nombre-registro').value.trim();
  const ultimaRegla = document.getElementById('ultima-regla').value;

  if (!nombre) {
    alert('Por favor ingresa tu nombre.');
    return false;
  }

  if (!ultimaRegla) {
    alert('Por favor ingresa la fecha de tu última regla.');
    return false;
  }

  return true;
}

// FINALIZAR REGISTRO

function finalizarRegistro() {
  // Combinar todos los síntomas
  const todosSintomas = [...datosRegistro.sintomasFisicos, ...datosRegistro.molestias];

  // Guardar usuario
  Femy.guardarUsuario({
    nombre: datosRegistro.nombre,
    correo: datosRegistro.correo,
    contrasena: datosRegistro.contrasena,
    fechaNacimiento: datosRegistro.fechaNacimiento
  });

  // Guardar ciclo
  Femy.guardarCiclo({
    fechaUltimoPeriodo: datosRegistro.ultimaRegla,
    duracionCiclo: datosRegistro.duracionCiclo,
    duracionPeriodo: datosRegistro.duracionPeriodo,
    historial: []
  });

  // Guardar síntomas
  Femy.guardarSintomas(todosSintomas);

  // Activar sesión
  Femy.guardarDato('sesion_activa', true);

  // Mostrar mensaje de éxito y redirigir
  Femy.mostrarToast('¡Cuenta creada exitosamente! 🎉', 'exito');

  setTimeout(() => {
    window.location.href = '../inicio/index.html';
  }, 1200);
}

// UTILIDADES

function mostrarAlertaRegistro(elemento, mensaje) {
  elemento.className = 'alerta alerta-error';
  elemento.textContent = mensaje;
  elemento.style.display = 'flex';
  elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function alternarContrasena(idCampo, boton) {
  const campo = document.getElementById(idCampo);
  const esContrasena = campo.type === 'password';
  campo.type = esContrasena ? 'text' : 'password';
  boton.innerHTML = esContrasena
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}
