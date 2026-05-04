/**
 * FEMY - Módulo Ajustes
 * Configuración de la aplicación
 */

const sintomasOpciones = [
  { nombre: 'Acné', icono: '💢' },
  { nombre: 'Dolor abdominal (Cólicos)', icono: '🫁' },
  { nombre: 'Dolor de cabeza/migraña', icono: '🤕' },
  { nombre: 'Fatiga o cansancio inusual', icono: '😴' },
  { nombre: 'Sensibilidad en los senos', icono: '💜' },
  { nombre: 'Dolor muscular o lumbar', icono: '🦴' },
  { nombre: 'Problemas digestivos', icono: '🫄' },
  { nombre: 'SPM', icono: '😤' },
  { nombre: 'Flujo abundante', icono: '💧' },
  { nombre: 'Cambios de humor', icono: '🌊' },
  { nombre: 'Sangrado abundante', icono: '🩸' },
  { nombre: 'Insomnio', icono: '🌙' }
];

// INICIALIZACIÓN 

document.addEventListener('DOMContentLoaded', () => {
  if (!Femy.verificarSesion()) return;

  cargarPerfil();
  cargarRecordatorios();
  cargarSintomasAjustes();
});

// CARGAR PERFIL 

function cargarPerfil() {
  const usuario = Femy.obtenerUsuario();
  const ciclo = Femy.obtenerCiclo();
  const contenedor = document.getElementById('tarjeta-perfil');

  const nombre = usuario ? usuario.nombre : 'Usuario';
  const correo = usuario ? usuario.correo : '';
  const inicial = nombre.charAt(0).toUpperCase();

  contenedor.innerHTML = `
    <div class="avatar-usuario">${inicial}</div>
    <div>
      <div class="perfil-info-nombre">${nombre}</div>
      <div class="perfil-info-correo">${correo}</div>
      <div class="perfil-info-ciclo">Ciclo: ${ciclo.duracionCiclo || 28} días · Período: ${ciclo.duracionPeriodo || 5} días</div>
    </div>
  `;
}

// CARGAR RECORDATORIOS 

function cargarRecordatorios() {
  const recordatorios = Femy.obtenerRecordatorios();

  const recInicio = document.getElementById('recor-inicio');
  const recFin = document.getElementById('recor-fin');
  const recIntroducir = document.getElementById('recor-introducir');

  if (recInicio) recInicio.checked = recordatorios.inicioPeriodo;
  if (recFin) recFin.checked = recordatorios.finPeriodo;
  if (recIntroducir) recIntroducir.checked = recordatorios.introducirPeriodo;
}

function actualizarRecordatorio(clave, valor) {
  const recordatorios = Femy.obtenerRecordatorios();
  recordatorios[clave] = valor;
  Femy.guardarRecordatorios(recordatorios);
  Femy.mostrarToast(`Recordatorio ${valor ? 'activado' : 'desactivado'}`, 'exito');
}

// CARGAR SÍNTOMAS EN AJUSTES 

function cargarSintomasAjustes() {
  const sintomasActuales = Femy.obtenerSintomas();
  const contenedor = document.getElementById('lista-sintomas-ajustes');

  contenedor.innerHTML = sintomasOpciones.map((s, i) => {
    const seleccionado = sintomasActuales.includes(s.nombre);
    return `
      <div class="item-sintoma ${seleccionado ? 'seleccionado' : ''}"
           onclick="alternarSintomaAjustes(this, '${s.nombre}', '${i}')">
        <span class="icono-sintoma">${s.icono}</span>
        <span>${s.nombre}</span>
        <span class="checkbox-sintoma" id="ajuste-check-${i}">${seleccionado ? '✓' : ''}</span>
      </div>
    `;
  }).join('');
}

function alternarSintomaAjustes(elemento, nombre, idx) {
  elemento.classList.toggle('seleccionado');
  const check = document.getElementById(`ajuste-check-${idx}`);
  check.textContent = elemento.classList.contains('seleccionado') ? '✓' : '';
}

function guardarSintomasAjustes() {
  const seleccionados = [];
  document.querySelectorAll('#lista-sintomas-ajustes .item-sintoma.seleccionado').forEach(el => {
    const nombre = el.querySelector('span:nth-child(2)').textContent;
    seleccionados.push(nombre);
  });

  Femy.guardarSintomas(seleccionados);
  Femy.mostrarToast('Síntomas actualizados correctamente', 'exito');
  alternarSeccion('sintomas'); // Cerrar sección
}

// CAMBIAR CONTRASEÑA

function guardarNuevaContrasena(evento) {
  evento.preventDefault();

  const nueva = document.getElementById('nueva-contrasena').value;
  const confirmar = document.getElementById('confirmar-nueva-contrasena').value;
  const alerta = document.getElementById('alerta-contrasena');

  alerta.style.display = 'none';

  if (!Femy.validarContrasena(nueva)) {
    alerta.className = 'alerta alerta-error';
    alerta.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
    alerta.style.display = 'flex';
    return;
  }

  if (nueva !== confirmar) {
    alerta.className = 'alerta alerta-error';
    alerta.textContent = 'Las contraseñas no coinciden.';
    alerta.style.display = 'flex';
    return;
  }

  const usuario = Femy.obtenerUsuario();
  usuario.contrasena = nueva;
  Femy.guardarUsuario(usuario);

  alerta.className = 'alerta alerta-exito';
  alerta.textContent = '✓ Contraseña actualizada correctamente.';
  alerta.style.display = 'flex';

  document.getElementById('nueva-contrasena').value = '';
  document.getElementById('confirmar-nueva-contrasena').value = '';

  setTimeout(() => {
    alerta.style.display = 'none';
    alternarSeccion('contrasena');
  }, 2000);
}

// ALTERNAR SECCIONES (ACCORDION)

function alternarSeccion(nombreSeccion) {
  const contenido = document.getElementById(`contenido-${nombreSeccion}`);
  const seccion = contenido ? contenido.closest('.seccion-ajustes') : null;

  if (!contenido || !seccion) return;

  const estaAbierta = contenido.classList.contains('abierto');

  // Cerrar todas las secciones
  document.querySelectorAll('.contenido-seccion.abierto').forEach(c => {
    c.classList.remove('abierto');
    c.closest('.seccion-ajustes').classList.remove('abierta');
  });

  // Abrir la seleccionada si estaba cerrada
  if (!estaAbierta) {
    contenido.classList.add('abierto');
    seccion.classList.add('abierta');
  }
}

// CERRAR SESIÓN

function confirmarCerrarSesion() {
  if (confirm('¿Estás segura de que deseas cerrar sesión?')) {
    Femy.cerrarSesion();
  }
}
