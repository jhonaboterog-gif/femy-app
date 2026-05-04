// INICIALIZACIÓN Y DATOS POR DEFECTO
document.addEventListener('DOMContentLoaded', () => {
  // 1. Si ya está logueada, mandarla directo al inicio
  if (Femy.estaAutenticado()) {
    window.location.href = '../inicio/index.html';
    return;
  }

  // 2. Crear los datos de Adriana si la app está vacía
  // Esto asegura que el "cerebro" global tenga información que validar
  if (!Femy.obtenerUsuario()) {
    const datosAdriana = {
      nombre: 'Adriana',
      correo: 'demo@femy.com',
      contrasena: 'Demo1234', // Debe coincidir con CORREO_DEMO en global.js
      fechaNacimiento: '1996-10-13'
    };

    Femy.guardarUsuario(datosAdriana);

    // Configuración inicial del ciclo para que no aparezca en blanco
    Femy.guardarCiclo({
      fechaUltimoPeriodo: calcularFechaDemo(10), // Iniciará en día 10 del ciclo
      duracionCiclo: 28,
      duracionPeriodo: 5,
      historial: []
    });

    console.log("Datos demo de Adriana cargados correctamente.");
  }
});

// Función auxiliar para mover la fecha del periodo atrás en el tiempo
function calcularFechaDemo(diasAtras) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha.toISOString().split('T')[0];
}

function calcularFechaHistorial(diasAtras) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha.toISOString().split('T')[0];
}

// CAMBIO DE PANTALLAS

function mostrarPantalla(idPantalla) {
  const actual = document.querySelector('.pantalla.activa');
  const destino = document.getElementById(idPantalla);

  if (!destino || actual === destino) return;

  actual.classList.remove('activa');
  actual.style.display = 'none';

  destino.style.display = 'flex';
  destino.classList.add('activa');

  // Scroll al inicio
  destino.scrollTop = 0;

  // Limpiar alertas al cambiar pantalla
  const alertas = destino.querySelectorAll('.alerta');
  alertas.forEach(a => a.style.display = 'none');
}

// PROCESAR INICIO DE SESIÓN

function procesarSesion(evento) {
  evento.preventDefault();

  const correo = document.getElementById('correo-sesion').value.trim();
  const contrasena = document.getElementById('contrasena-sesion').value;
  const alerta = document.getElementById('alerta-sesion');

  // Limpiar estado previo
  alerta.style.display = 'none';

  // Validar formato de correo
  if (!Femy.validarCorreo(correo)) {
    mostrarAlerta(alerta, 'Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  // Intentar iniciar sesión
  const resultado = Femy.iniciarSesion(correo, contrasena);

  if (resultado.exito) {
    // Animación de éxito
    const boton = document.querySelector('#pantalla-inicio-sesion .boton-primario');
    boton.textContent = '✓ Bienvenida de nuevo';
    boton.style.background = 'var(--exito)';

    setTimeout(() => {
      window.location.href = '../inicio/index.html';
    }, 800);
  } else {
    mostrarAlerta(alerta, resultado.mensaje, 'error');

    // Marcar campos en error
    document.getElementById('correo-sesion').classList.add('error');
    document.getElementById('contrasena-sesion').classList.add('error');

    // Quitar error al escribir
    ['correo-sesion', 'contrasena-sesion'].forEach(id => {
      document.getElementById(id).addEventListener('input', function () {
        this.classList.remove('error');
        alerta.style.display = 'none';
      }, { once: true });
    });
  }
}

// PROCESAR RECUPERACIÓN DE CONTRASEÑA

function procesarRecuperacion(evento) {
  evento.preventDefault();

  const correo = document.getElementById('correo-recuperar').value.trim();
  const alerta = document.getElementById('alerta-recuperar');

  if (!Femy.validarCorreo(correo)) {
    mostrarAlerta(alerta, 'Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  // Simular envío de correo
  const usuario = Femy.obtenerUsuario();

  if (usuario && usuario.correo === correo) {
    mostrarAlerta(alerta, '✓ Hemos enviado un enlace de recuperación a tu correo.', 'exito');
    setTimeout(() => mostrarPantalla('pantalla-inicio-sesion'), 2500);
  } else {
    // Por seguridad, mostramos el mismo mensaje aunque no exista
    mostrarAlerta(alerta, '✓ Si el correo existe, recibirás un enlace de recuperación.', 'exito');
  }
}

// TOGGLE VISIBILIDAD CONTRASEÑA

function alternarContrasena(idCampo, boton) {
  const campo = document.getElementById(idCampo);
  const esContrasena = campo.type === 'password';
  campo.type = esContrasena ? 'text' : 'password';

  boton.innerHTML = esContrasena
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

// MOSTRAR ALERTA EN FORMULARIO

function mostrarAlerta(elemento, mensaje, tipo = 'error') {
  elemento.className = `alerta alerta-${tipo}`;
  elemento.textContent = mensaje;
  elemento.style.display = 'flex';

  // Auto-ocultar mensajes de éxito
  if (tipo === 'exito') {
    setTimeout(() => { elemento.style.display = 'none'; }, 4000);
  }
}
