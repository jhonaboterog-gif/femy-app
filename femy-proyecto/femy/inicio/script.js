/**
 * FEMY - Módulo Inicio / Dashboard
 * Lógica del panel principal de la aplicación
 */

const consejosPorFase = {
  periodo: [
    { emoji: '🌸', titulo: 'Cuídate hoy', texto: 'Es normal sentirte un poco cansada. Prioriza el descanso y mantente hidratada. El agua caliente con jengibre puede ayudar con los cólicos.' },
    { emoji: '🛁', titulo: 'Autocuidado', texto: 'Un baño tibio o una bolsa de agua caliente puede aliviar el dolor abdominal. ¡Mímarte es parte del proceso!' }
  ],
  folicula: [
    { emoji: '🌱', titulo: 'Fase de energía', texto: 'Tu energía está aumentando. Es un buen momento para comenzar nuevos proyectos y ser más activa físicamente.' },
    { emoji: '💪', titulo: 'Actívate', texto: 'Los estrógenos están aumentando, lo que puede mejorar tu estado de ánimo y nivel de energía. ¡Aprovéchalo!' }
  ],
  fertil: [
    { emoji: '✨', titulo: 'Período fértil', texto: 'Estás en tu ventana fértil. Tu cuerpo está en su punto de mayor vitalidad. Excelente momento para actividades sociales y creativas.' },
    { emoji: '🌟', titulo: 'Tu momento de brillar', texto: 'Los niveles hormonales están en su punto más alto. Puede que notes más energía, confianza y claridad mental.' }
  ],
  lutea: [
    { emoji: '🧘', titulo: 'Fase de calma', texto: 'Es normal querer un poco más de tranquilidad. Los ejercicios de respiración y el yoga pueden ser muy beneficiosos.' },
    { emoji: '🍫', titulo: 'Antojos normales', texto: 'Los antojos de carbohidratos y chocolate son comunes en esta fase. Escucha tu cuerpo pero mantén una alimentación balanceada.' }
  ],
  premenstrual: [
    { emoji: '💜', titulo: 'Pronto llegará tu período', texto: 'Tu cuerpo se está preparando. Es normal sentir cierta sensibilidad emocional. Practica la autocompasión.' },
    { emoji: '🌙', titulo: 'Descansa más', texto: 'Reducir el consumo de sal y cafeína puede ayudar a disminuir la retención de líquidos y la inflamación.' }
  ]
};

const sintomasDisponibles = [
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

let accionModalActual = 'inicio';

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
  if (!Femy.verificarSesion()) return;

  const usuario = Femy.obtenerUsuario();

  // Saludo personalizado
  actualizarSaludo(usuario);

  // Fecha de hoy
  document.getElementById('fecha-hoy').textContent = Femy.formatearFechaLarga(new Date());

  // Renderizar dashboard
  renderizarTarjetaCiclo();
  renderizarBotonesPeriodo();
  renderizarFases();
  renderizarSintomas();
  renderizarConsejo();

  // Verificar recordatorios
  verificarRecordatorios();

  // Navegación
  document.getElementById('nav-contenedor').innerHTML = Femy.generarNavegacion('inicio');
});

// SALUDO DINÁMICO

function actualizarSaludo(usuario) {
  const hora = new Date().getHours();
  let saludo = 'Hola';
  if (hora < 12) saludo = '¡Buenos días';
  else if (hora < 18) saludo = '¡Buenas tardes';
  else saludo = '¡Buenas noches';

  const nombre = usuario ? usuario.nombre : '';
  document.getElementById('texto-saludo').textContent = `${saludo}, ${nombre}! 👋`;
}

// TARJETA PRINCIPAL DEL CICLO

function renderizarTarjetaCiclo() {
  const fase = Femy.calcularFaseActual();
  const ciclo = Femy.obtenerCiclo();
  const contenedor = document.getElementById('tarjeta-ciclo');

  if (!fase || !ciclo.fechaUltimoPeriodo) {
    contenedor.innerHTML = `
      <div style="text-align:center;color:rgba(255,255,255,0.9);">
        <p style="font-size:1.1rem;margin-bottom:12px;">📅 Registra tu primer período</p>
        <p style="font-size:0.88rem;opacity:0.8;">Toca "Inicio del período" para comenzar el seguimiento</p>
      </div>
    `;
    return;
  }

  const porcentajeCiclo = Math.round((fase.diaDelCiclo / ciclo.duracionCiclo) * 100);
  const proximaFechaStr = Femy.formatearFecha(fase.proximoPeriodo, { day: 'numeric', month: 'short' });

  const nombresEstado = {
    periodo: 'Período activo',
    folicula: 'Fase folicular',
    fertil: 'Período fértil',
    lutea: 'Fase lútea',
    premenstrual: 'Fase premenstrual'
  };

  contenedor.innerHTML = `
    <div class="ciclo-info-superior">
      <div class="etiqueta-estado">${nombresEstado[fase.nombre] || 'Ciclo activo'}</div>
      <div class="dias-restantes">
        ${fase.diasParaProximoPeriodo} <span>días para tu próximo período</span>
      </div>
      <div class="rango-fechas">Próximo período: ${proximaFechaStr}</div>
    </div>
    <div class="barra-progreso-ciclo">
      <div class="etiqueta-progreso">
        <span>Día ${fase.diaDelCiclo} de ${ciclo.duracionCiclo}</span>
        <span>${porcentajeCiclo}%</span>
      </div>
      <div class="barra-track">
        <div class="barra-fill" style="width: 0%" id="barra-ciclo"></div>
      </div>
    </div>
  `;

  // Animar la barra
  setTimeout(() => {
    const barra = document.getElementById('barra-ciclo');
    if (barra) barra.style.width = porcentajeCiclo + '%';
  }, 300);
}

// BOTONES DE PERIODO

function renderizarBotonesPeriodo() {
  document.getElementById('botones-periodo').innerHTML = `
    <button class="btn-periodo btn-inicio-periodo" onclick="abrirModalPeriodo('inicio')">
      🩸 Inicio del período
    </button>
    <button class="btn-periodo btn-fin-periodo" onclick="abrirModalPeriodo('fin')">
      ✓ Fin del período
    </button>
  `;
}

// FASES DEL CICLO

function renderizarFases() {
  const fase = Femy.calcularFaseActual();
  const ciclo = Femy.obtenerCiclo();
  if (!fase) return;

  const fases = [
    {
      nombre: 'Período fértil',
      fecha: fase.diaFertilInicio ? Femy.formatearFecha(fase.diaFertilInicio) : '--',
      color: '#A8E6CF',
      colorPunto: '#1A6B40',
      activa: fase.nombre === 'fertil'
    },
    {
      nombre: 'Ovulación',
      fecha: fase.diaOvulacion ? Femy.formatearFecha(fase.diaOvulacion) : '--',
      color: '#FFD97D',
      colorPunto: '#B8860B',
      activa: false
    },
    {
      nombre: 'Próx. período',
      fecha: fase.proximoPeriodo ? Femy.formatearFecha(fase.proximoPeriodo) : '--',
      color: '#FFD6E0',
      colorPunto: '#E8527A',
      activa: false
    }
  ];

  document.getElementById('lista-fases').innerHTML = fases.map(f => `
    <div class="item-fase" style="background: ${f.color}20;">
      <div class="item-fase-info">
        <div class="punto-fase" style="background: ${f.colorPunto};"></div>
        <div>
          <div class="fase-nombre" style="color: ${f.colorPunto};">${f.nombre}</div>
          ${f.activa ? '<div class="fase-descripcion">Actualmente</div>' : ''}
        </div>
      </div>
      <div class="fase-fecha" style="color: ${f.colorPunto};">${f.fecha}</div>
    </div>
  `).join('');
}

// SÍNTOMAS

function renderizarSintomas() {
  const sintomasGuardados = Femy.obtenerSintomas();
  const contenedor = document.getElementById('sintomas-hoy');

  if (sintomasGuardados.length === 0) {
    contenedor.innerHTML = '<span class="chips-vacio">No hay síntomas registrados</span>';
    return;
  }

  const iconosSintomas = {};
  sintomasDisponibles.forEach(s => { iconosSintomas[s.nombre] = s.icono; });

  contenedor.innerHTML = sintomasGuardados.map(s => `
    <div class="chip-sintoma">
      <span>${iconosSintomas[s] || '💊'}</span>
      ${s}
    </div>
  `).join('');
}

// CONSEJO DEL DÍA

function renderizarConsejo() {
  const fase = Femy.calcularFaseActual();
  const nombreFase = fase ? fase.nombre : 'fertil';
  const consejos = consejosPorFase[nombreFase] || consejosPorFase.fertil;
  const consejo = consejos[Math.floor(Math.random() * consejos.length)];

  document.getElementById('tarjeta-consejo').innerHTML = `
    <div class="consejo-emoji">${consejo.emoji}</div>
    <div class="consejo-titulo">${consejo.titulo}</div>
    <div class="consejo-texto">${consejo.texto}</div>
  `;
}

// MODAL DE PERIODO

function abrirModalPeriodo(accion) {
  accionModalActual = accion;
  const modal = document.getElementById('modal-periodo');
  const titulo = document.getElementById('modal-titulo');

  titulo.textContent = accion === 'inicio' ? 'Registrar inicio del período' : 'Registrar fin del período';

  const fechaInput = document.getElementById('fecha-modal-periodo');
  fechaInput.value = new Date().toISOString().split('T')[0];
  fechaInput.max = new Date().toISOString().split('T')[0];

  modal.style.display = 'flex';
}

function cerrarModal(idModal) {
  document.getElementById(idModal).style.display = 'none';
}

function guardarRegistroPeriodo() {
  const fecha = document.getElementById('fecha-modal-periodo').value;
  if (!fecha) {
    Femy.mostrarToast('Selecciona una fecha', 'error');
    return;
  }

  const ciclo = Femy.obtenerCiclo();

  if (accionModalActual === 'inicio') {
    // Guardar en historial y actualizar fecha de inicio
    if (!ciclo.historial) ciclo.historial = [];
    ciclo.historial.push({ inicio: fecha, fin: null });
    ciclo.fechaUltimoPeriodo = fecha;
    Femy.guardarCiclo(ciclo);
    Femy.mostrarToast('¡Inicio del período registrado! 🩸', 'exito');
  } else {
    // Actualizar fin del último período
    if (ciclo.historial && ciclo.historial.length > 0) {
      ciclo.historial[ciclo.historial.length - 1].fin = fecha;
      Femy.guardarCiclo(ciclo);
    }
    Femy.mostrarToast('¡Fin del período registrado! ✓', 'exito');
  }

  cerrarModal('modal-periodo');
  renderizarTarjetaCiclo();
  renderizarFases();
}

// MODAL DE SÍNTOMAS

function mostrarModalSintomas() {
  const sintomasActuales = Femy.obtenerSintomas();
  const contenedor = document.getElementById('lista-sintomas-modal');

  contenedor.innerHTML = sintomasDisponibles.map((s, i) => {
    const seleccionado = sintomasActuales.includes(s.nombre);
    return `
      <div class="item-sintoma ${seleccionado ? 'seleccionado' : ''}" 
           onclick="alternarSintomaModal(this, '${s.nombre}', '${i}')">
        <span class="icono-sintoma">${s.icono}</span>
        <span>${s.nombre}</span>
        <span class="checkbox-sintoma" id="modal-check-${i}">${seleccionado ? '✓' : ''}</span>
      </div>
    `;
  }).join('');

  document.getElementById('modal-sintomas').style.display = 'flex';
}

function alternarSintomaModal(elemento, nombre, idx) {
  elemento.classList.toggle('seleccionado');
  const check = document.getElementById(`modal-check-${idx}`);
  check.textContent = elemento.classList.contains('seleccionado') ? '✓' : '';
}

function guardarSintomasModal() {
  const seleccionados = [];
  document.querySelectorAll('#lista-sintomas-modal .item-sintoma.seleccionado').forEach(el => {
    const nombre = el.querySelector('span:nth-child(2)').textContent;
    seleccionados.push(nombre);
  });

  Femy.guardarSintomas(seleccionados);
  cerrarModal('modal-sintomas');
  renderizarSintomas();
  Femy.mostrarToast('Síntomas actualizados', 'exito');
}

// VERIFICAR RECORDATORIOS

function verificarRecordatorios() {
  const recordatorios = Femy.obtenerRecordatorios();
  const fase = Femy.calcularFaseActual();
  const badge = document.getElementById('badge-notif');

  if (!fase) return;

  let hayNotificacion = false;

  if (recordatorios.inicioPeriodo && fase.diasParaProximoPeriodo <= 2 && fase.diasParaProximoPeriodo > 0) {
    hayNotificacion = true;
  }

  if (hayNotificacion) {
    badge.classList.add('visible');
  }
}
