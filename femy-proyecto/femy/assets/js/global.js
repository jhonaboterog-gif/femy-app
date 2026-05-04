/**
 * FEMY - Utilidades Globales y Almacén de Datos
 * Gestión de estado de la aplicación usando localStorage
 */

const Femy = {

  // ALMACÉN DE DATOS (localStorage)

  guardarDato(clave, valor) {
    try {
      localStorage.setItem('femy_' + clave, JSON.stringify(valor));
    } catch (e) {
      console.error('Error guardando dato:', e);
    }
  },

  obtenerDato(clave, valorPorDefecto = null) {
    try {
      const dato = localStorage.getItem('femy_' + clave);
      return dato ? JSON.parse(dato) : valorPorDefecto;
    } catch (e) {
      return valorPorDefecto;
    }
  },

  eliminarDato(clave) {
    localStorage.removeItem('femy_' + clave);
  },

  // GESTIÓN DE USUARIO

  obtenerUsuario() {
    return this.obtenerDato('usuario', null);
  },

  guardarUsuario(datos) {
    this.guardarDato('usuario', datos);
  },

  estaAutenticado() {
    return this.obtenerDato('sesion_activa', false);
  },

  iniciarSesion(correo, contrasena) {
    // --- ESTA ES LA MODIFICACIÓN ---
    const CORREO_DEMO = 'demo@femy.com';
    const CLAVE_DEMO = 'Demo1234';

    // 1. Validamos contra las credenciales por defecto
    if (correo === CORREO_DEMO && contrasena === CLAVE_DEMO) {
      this.guardarDato('sesion_activa', true);

      // Creamos el perfil de Adriana si no existe para que el Dashboard funcione
      if (!this.obtenerUsuario()) {
        this.guardarUsuario({ nombre: 'Adriana', correo: CORREO_DEMO });
      }
      return { exito: true };
    }

    // 2. Si no es el demo, buscamos en usuarios registrados (lógica original)
    const usuario = this.obtenerUsuario();
    if (usuario && usuario.correo === correo && usuario.contrasena === contrasena) {
      this.guardarDato('sesion_activa', true);
      return { exito: true };
    }

    return { exito: false, mensaje: 'Correo electrónico o contraseña incorrectos.' };
    // --- FIN DE LA MODIFICACIÓN ---
  },

  cerrarSesion() {
    this.guardarDato('sesion_activa', false);
    window.location.href = '../bienvenida/index.html';
  },

  // GESTIÓN DEL CICLO MENSTRUAL

  obtenerCiclo() {
    return this.obtenerDato('ciclo', {
      fechaUltimoPeriodo: null,
      duracionCiclo: 28,
      duracionPeriodo: 5,
      historial: []
    });
  },

  guardarCiclo(datos) {
    this.guardarDato('ciclo', datos);
  },

  calcularFaseActual() {
    const ciclo = this.obtenerCiclo();
    if (!ciclo.fechaUltimoPeriodo) return null;

    const hoy = new Date();
    const ultimoPeriodo = new Date(ciclo.fechaUltimoPeriodo);
    const diasDesdeInicio = Math.floor((hoy - ultimoPeriodo) / (1000 * 60 * 60 * 24));
    const diaDelCiclo = ((diasDesdeInicio % ciclo.duracionCiclo) + ciclo.duracionCiclo) % ciclo.duracionCiclo + 1;

    const fases = {
      nombre: '',
      diaDelCiclo,
      diasRestantes: 0,
      proximoEvento: null,
      proximaFecha: null
    };

    if (diaDelCiclo <= ciclo.duracionPeriodo) {
      fases.nombre = 'periodo';
      fases.diasRestantes = ciclo.duracionPeriodo - diaDelCiclo;
    } else if (diaDelCiclo <= 10) {
      fases.nombre = 'folicula';
      fases.diasRestantes = 10 - diaDelCiclo;
    } else if (diaDelCiclo <= 16) {
      fases.nombre = 'fertil';
      fases.diasRestantes = 16 - diaDelCiclo;
    } else if (diaDelCiclo <= ciclo.duracionCiclo - 3) {
      fases.nombre = 'lutea';
      fases.diasRestantes = (ciclo.duracionCiclo - 3) - diaDelCiclo;
    } else {
      fases.nombre = 'premenstrual';
      fases.diasRestantes = ciclo.duracionCiclo - diaDelCiclo;
    }

    // Calcular próximos eventos
    const diaOvulacion = Math.round(ciclo.duracionCiclo / 2) - 2;
    const proximoPeriodo = new Date(ultimoPeriodo);
    proximoPeriodo.setDate(proximoPeriodo.getDate() + ciclo.duracionCiclo);

    const diaFertilInicio = new Date(ultimoPeriodo);
    diaFertilInicio.setDate(diaFertilInicio.getDate() + 10);

    const diaOvulacionFecha = new Date(ultimoPeriodo);
    diaOvulacionFecha.setDate(diaOvulacionFecha.getDate() + diaOvulacion);

    fases.proximoPeriodo = proximoPeriodo;
    fases.diaFertilInicio = diaFertilInicio;
    fases.diaOvulacion = diaOvulacionFecha;
    fases.diasParaProximoPeriodo = Math.ceil((proximoPeriodo - hoy) / (1000 * 60 * 60 * 24));

    return fases;
  },

  // GESTIÓN DE SÍNTOMAS

  obtenerSintomas() {
    return this.obtenerDato('sintomas', []);
  },

  guardarSintomas(lista) {
    this.guardarDato('sintomas', lista);
  },

  // GESTIÓN DE RECORDATORIOS

  obtenerRecordatorios() {
    return this.obtenerDato('recordatorios', {
      inicioPeriodo: true,
      finPeriodo: true,
      introducirPeriodo: false
    });
  },

  guardarRecordatorios(datos) {
    this.guardarDato('recordatorios', datos);
  },

  // UTILIDADES DE FECHA

  formatearFecha(fecha, opciones = {}) {
    const f = new Date(fecha);
    if (isNaN(f.getTime())) return '';
    const config = { day: 'numeric', month: 'short', ...opciones };
    return f.toLocaleDateString('es-CO', config);
  },

  formatearFechaLarga(fecha) {
    return this.formatearFecha(fecha, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

  obtenerNombreMes(indice) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[indice];
  },

  obtenerNombresDias() {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  },

  // VALIDACIONES

  validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  },

  validarContrasena(contrasena) {
    // Mínimo 8 caracteres, al menos una mayúscula y un número
    return contrasena.length >= 8 && /[A-Z]/.test(contrasena) && /[0-9]/.test(contrasena);
  },

  // NAVEGACIÓN CON PROTECCIÓN DE SESIÓN

  verificarSesion() {
    if (!this.estaAutenticado()) {
      window.location.href = '../bienvenida/index.html';
      return false;
    }
    return true;
  },

  resaltarNavActual(nombreModulo) {
    const elementos = document.querySelectorAll('.nav-elemento');
    elementos.forEach(el => {
      el.classList.remove('activo');
      if (el.dataset.modulo === nombreModulo) {
        el.classList.add('activo');
      }
    });
  },

  // MOSTRAR NOTIFICACIÓN TOAST

  mostrarToast(mensaje, tipo = 'exito') {
    const existente = document.querySelector('.toast-notificacion');
    if (existente) existente.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notificacion toast-${tipo}`;
    toast.innerHTML = `
      <span>${tipo === 'exito' ? '✓' : '✗'}</span>
      <span>${mensaje}</span>
    `;
    toast.style.cssText = `
      position: fixed; top: 24px; right: 24px; z-index: 9999;
      background: ${tipo === 'exito' ? '#E5FFE5' : '#FFE5E5'};
      color: ${tipo === 'exito' ? '#1A7A3A' : '#C0392B'};
      border: 1px solid ${tipo === 'exito' ? '#A8E6BF' : '#FAB8B8'};
      padding: 14px 20px; border-radius: 14px;
      font-family: var(--fuente-cuerpo, DM Sans, sans-serif);
      font-weight: 600; font-size: 0.9rem;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      animation: aparecer 0.3s ease;
      max-width: 320px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // GENERAR BARRA DE NAVEGACIÓN

  generarNavegacion(moduloActual) {
    return `
    <nav class="barra-navegacion">
      <a href="../inicio/index.html" class="nav-elemento ${moduloActual === 'inicio' ? 'activo' : ''}" data-modulo="inicio">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Hoy
      </a>
      <a href="../calendario/index.html" class="nav-elemento ${moduloActual === 'calendario' ? 'activo' : ''}" data-modulo="calendario">
        <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Calendario
      </a>
      <a href="../autocuidado/index.html" class="nav-elemento ${moduloActual === 'autocuidado' ? 'activo' : ''}" data-modulo="autocuidado">
        <svg viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        Autocuidado
      </a>
      <a href="../analisis/index.html" class="nav-elemento ${moduloActual === 'analisis' ? 'activo' : ''}" data-modulo="analisis">
        <svg viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        Análisis
      </a>
    </nav>`;
  }
};

// Exportar para módulos
if (typeof module !== 'undefined') module.exports = Femy;

// AÑADIDO PARA USUARIO DEMO
// Al final de global.js
const usuarioPorDefecto = {
  nombre: "Adriana",
  correo: "demo@femy.com",
  contrasena: "Demo1234"
};

// Si no existe un usuario guardado, creamos el de prueba
if (!Femy.obtenerUsuario()) {
  Femy.guardarUsuario(usuarioPorDefecto);
}