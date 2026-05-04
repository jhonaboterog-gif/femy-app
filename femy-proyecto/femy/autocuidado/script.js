/**
 * FEMY - Módulo Autocuidado
 * Artículos y consejos de bienestar según la fase del ciclo
 */

const articulos = [
  {
    id: 1,
    titulo: 'Alivio del dolor del período',
    categoria: 'alivio',
    emoji: '🩹',
    color: 'linear-gradient(135deg, #FFD6E0, #FF9CB0)',
    colorChip: '#FFD6E0',
    colorTextoChip: '#E8527A',
    tiempo: '5 min',
    preview: 'Técnicas probadas para aliviar los cólicos menstruales y mejorar tu bienestar durante el período.',
    fases: ['periodo'],
    contenido: `
      <h4>Calor terapéutico</h4>
      <p>Aplicar calor en el abdomen es uno de los remedios más efectivos para los cólicos. Una almohadilla eléctrica o una bolsa de agua caliente aplicada durante 15-20 minutos puede relajar la musculatura uterina y aliviar el dolor significativamente.</p>
      
      <h4>Técnicas de respiración</h4>
      <p>La respiración abdominal profunda puede reducir la tensión muscular:</p>
      <ul>
        <li>Inhala lentamente por la nariz durante 4 segundos</li>
        <li>Mantén el aire durante 2 segundos</li>
        <li>Exhala suavemente por la boca durante 6 segundos</li>
        <li>Repite 10 veces cuando sientas dolor</li>
      </ul>
      
      <h4>Masaje abdominal</h4>
      <p>Un masaje suave en círculos sobre el bajo vientre con aceite de lavanda o menta puede proporcionar alivio. El masaje mejora la circulación y reduce las contracciones musculares.</p>
      
      <h4>Posiciones de alivio</h4>
      <p>La posición fetal (acostada de lado con las rodillas dobladas hacia el pecho) puede reducir la presión abdominal. También puedes probar yoga restaurativo con posturas como "la niña" o las rodillas al pecho.</p>
      
      <h4>Hidratación y dieta</h4>
      <p>Mantenerte bien hidratada con agua tibia o infusiones puede ayudar. Evita el café, el alcohol y los alimentos muy salados que pueden empeorar la inflamación y los cólicos.</p>
    `
  },
  {
    id: 2,
    titulo: 'Remedios naturales para síntomas comunes',
    categoria: 'remedios',
    emoji: '🌿',
    color: 'linear-gradient(135deg, #D4F5E9, #A8E6CF)',
    colorChip: '#D4F5E9',
    colorTextoChip: '#1A6B40',
    tiempo: '7 min',
    preview: 'Infusiones, plantas medicinales y remedios caseros respaldados por la evidencia para el ciclo menstrual.',
    fases: ['periodo', 'premenstrual'],
    contenido: `
      <h4>Infusión de jengibre y canela</h4>
      <p>El jengibre tiene propiedades antiinflamatorias naturales. Prepara una infusión con 1 cm de jengibre fresco rallado + 1 ramita de canela + 1 taza de agua caliente. Endulza con miel. Toma 2-3 tazas al día durante el período.</p>
      
      <h4>Aceite de onagra</h4>
      <p>Rico en ácido gamma-linolénico (GLA), puede ayudar a reducir los síntomas del SPM, especialmente la sensibilidad en los senos y los cambios de humor. Consulta con tu médico antes de usarlo.</p>
      
      <h4>Té de manzanilla</h4>
      <p>La manzanilla tiene propiedades antiespasmódicas y relajantes. Puede ayudar a reducir los cólicos y mejorar la calidad del sueño durante el período.</p>
      
      <h4>Magnesio y vitamina B6</h4>
      <p>Estos nutrientes pueden reducir los síntomas del SPM. El magnesio está presente en los frutos secos, legumbres y hojas verdes. La vitamina B6 se encuentra en plátanos, pollo y patatas.</p>
      
      <h4>Omega-3</h4>
      <p>Los ácidos grasos omega-3 (salmón, sardinas, semillas de chía, nueces) tienen propiedades antiinflamatorias que pueden reducir la intensidad de los cólicos menstruales.</p>
    `
  },
  {
    id: 3,
    titulo: 'Nutrición y autocuidado cíclico',
    categoria: 'nutricion',
    emoji: '🥗',
    color: 'linear-gradient(135deg, #FFF8E7, #FFE8B0)',
    colorChip: '#FFF8E7',
    colorTextoChip: '#7A5A00',
    tiempo: '10 min',
    preview: 'Come de acuerdo a tu ciclo. Descubre cómo adaptar tu alimentación a cada fase hormonal.',
    fases: ['periodo', 'folicula', 'fertil', 'lutea'],
    contenido: `
      <h4>Fase menstrual (días 1-5)</h4>
      <p>Tu cuerpo necesita reponer hierro y combatir la inflamación:</p>
      <ul>
        <li>Alimentos ricos en hierro: espinacas, lentejas, carne roja magra</li>
        <li>Vitamina C para absorber el hierro: naranja, kiwi, pimientos</li>
        <li>Reduce sal para evitar retención de líquidos</li>
        <li>Evita café y alcohol que aumentan los cólicos</li>
      </ul>
      
      <h4>Fase folicular (días 6-13)</h4>
      <p>Apoya el aumento de estrógenos con alimentos fermentados y frescos:</p>
      <ul>
        <li>Verduras crucíferas: brócoli, coliflor, kale</li>
        <li>Probióticos: yogur natural, kéfir</li>
        <li>Proteína magra para apoyar la energía</li>
      </ul>
      
      <h4>Fase ovulatoria (días 14-16)</h4>
      <p>Mantén la energía y apoya la ovulación:</p>
      <ul>
        <li>Zinc: semillas de calabaza, garbanzos</li>
        <li>Antioxidantes: frutas del bosque, tomates</li>
        <li>Fibra: cereales integrales, verduras</li>
      </ul>
      
      <h4>Fase lútea (días 17-28)</h4>
      <p>Gestiona el SPM y apoya la progesterona:</p>
      <ul>
        <li>Magnesio: almendras, cacao puro, espinacas</li>
        <li>Carbohidratos complejos para estabilizar el ánimo</li>
        <li>Reduce cafeína y azúcar procesada</li>
      </ul>
    `
  },
  {
    id: 4,
    titulo: 'Yoga para el ciclo menstrual',
    categoria: 'ejercicio',
    emoji: '🧘',
    color: 'linear-gradient(135deg, #EDD5F8, #C97FE8)',
    colorChip: '#EDD5F8',
    colorTextoChip: '#7B2D9E',
    tiempo: '15 min',
    preview: 'Posturas de yoga adaptadas a cada fase de tu ciclo para aliviar tensiones y mejorar el bienestar.',
    fases: ['periodo', 'lutea', 'premenstrual'],
    contenido: `
      <h4>Durante el período: yoga restaurativo</h4>
      <p>Evita las inversiones y el ejercicio intenso. Estas posturas pueden ayudar:</p>
      <ul>
        <li><strong>Postura del niño (Balasana):</strong> Relaja el útero y la espalda baja. Mantén 2-3 minutos.</li>
        <li><strong>Postura de la mariposa reclinada:</strong> Abre las caderas y alivia la tensión pélvica.</li>
        <li><strong>Piernas contra la pared (Viparita Karani):</strong> Reduce la fatiga y mejora la circulación.</li>
      </ul>
      
      <h4>Fase folicular: yoga dinámico</h4>
      <p>Tu energía aumenta, puedes practicar yoga más activo:</p>
      <ul>
        <li>Saludo al sol para activar el cuerpo</li>
        <li>Posturas de equilibrio para fortalecer la concentración</li>
        <li>Flexiones hacia adelante para estimular la creatividad</li>
      </ul>
      
      <h4>Fase lútea: yoga suave</h4>
      <p>Cuando el SPM aparece, vuelve a lo restaurativo:</p>
      <ul>
        <li>Posturas de torsión suave para detoxificar</li>
        <li>Respiración alternada para equilibrar el sistema nervioso</li>
        <li>Meditación para gestionar la sensibilidad emocional</li>
      </ul>
    `
  },
  {
    id: 5,
    titulo: 'Manejo emocional durante el ciclo',
    categoria: 'emocional',
    emoji: '💆',
    color: 'linear-gradient(135deg, #E8F4FD, #BFE0F7)',
    colorChip: '#E8F4FD',
    colorTextoChip: '#1A6B9E',
    tiempo: '8 min',
    preview: 'Técnicas para comprender y gestionar los cambios emocionales a lo largo de tu ciclo hormonal.',
    fases: ['premenstrual', 'lutea'],
    contenido: `
      <h4>Comprendiendo la ciclicidad emocional</h4>
      <p>Las fluctuaciones hormonales afectan directamente el sistema nervioso y los neurotransmisores como la serotonina y la dopamina. No estás "siendo difícil" — tu biología tiene su propio ritmo.</p>
      
      <h4>Técnicas de regulación emocional</h4>
      <ul>
        <li><strong>Journaling:</strong> Escribe 10 minutos al día sobre tus emociones. La escritura ayuda a procesar sentimientos difíciles.</li>
        <li><strong>Técnica 5-4-3-2-1:</strong> Nombra 5 cosas que ves, 4 que puedes tocar, 3 que oyes, 2 que hueles, 1 que saboreas. Ancla tu atención al presente.</li>
        <li><strong>Movimiento expresivo:</strong> Bailar, caminar o hacer cualquier actividad física libera endorfinas y reduce la tensión emocional.</li>
      </ul>
      
      <h4>Autocompasión como práctica</h4>
      <p>Trata tus dificultades con la misma gentileza que tratarías a una amiga. Recuerda que todas las personas menstruantes experimentan estos cambios — no estás sola.</p>
      
      <h4>Comunicar tus necesidades</h4>
      <p>Informar a las personas cercanas sobre cómo te sientes puede reducir malentendidos. Frases como "Hoy necesito más espacio" o "Podría necesitar apoyo extra esta semana" son formas de cuidado propio.</p>
    `
  },
  {
    id: 6,
    titulo: 'Ejercicio para cada fase',
    categoria: 'ejercicio',
    emoji: '🏃',
    color: 'linear-gradient(135deg, #FFF0F3, #FFD6E0)',
    colorChip: '#FFF0F3',
    colorTextoChip: '#E8527A',
    tiempo: '6 min',
    preview: 'Adapta tu rutina de ejercicio a las fases de tu ciclo para maximizar resultados y sentirte mejor.',
    fases: ['folicula', 'fertil', 'lutea'],
    contenido: `
      <h4>Fase menstrual: descanso activo</h4>
      <p>Caminatas suaves, yoga restaurativo, natación suave. Escucha tu cuerpo — si hay dolor intenso, descansa.</p>
      
      <h4>Fase folicular: construye fuerza</h4>
      <p>Es tu mejor momento para entrenar. Los estrógenos altos mejoran la recuperación muscular:</p>
      <ul>
        <li>Levantamiento de pesas</li>
        <li>HIIT de alta intensidad</li>
        <li>Actividades nuevas y retadoras</li>
      </ul>
      
      <h4>Ovulación: máximo rendimiento</h4>
      <p>Estás en tu pico de energía y fuerza. Ideal para:</p>
      <ul>
        <li>Entrenamientos más largos e intensos</li>
        <li>Deportes de equipo o competencias</li>
        <li>Actividades de alta coordinación</li>
      </ul>
      
      <h4>Fase lútea: mantén la constancia</h4>
      <p>Reduce la intensidad gradualmente a medida que avanza la fase. El ejercicio moderado ayuda a reducir los síntomas del SPM:</p>
      <ul>
        <li>Pilates y ejercicios de core</li>
        <li>Natación</li>
        <li>Yoga y estiramientos</li>
      </ul>
    `
  }
];

let articulosFiltrados = [...articulos];
let articuloAbierto = null;

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
  if (!Femy.verificarSesion()) return;

  renderizarBannerFase();
  renderizarArticulos(articulos);
  document.getElementById('nav-contenedor').innerHTML = Femy.generarNavegacion('autocuidado');
});

// BANNER DE FASE ACTUAL

function renderizarBannerFase() {
  const fase = Femy.calcularFaseActual();
  const banner = document.getElementById('banner-fase');
  const badge = document.getElementById('fase-badge');

  const configs = {
    periodo: {
      titulo: '🩸 Estás en tu período',
      desc: 'Tu cuerpo necesita descanso y nutrición especial. Prioriza el autocuidado.',
      gradiente: 'linear-gradient(135deg, #FFD6E0, #FFABC0)',
      color: '#9B1239',
      emoji: '🩸'
    },
    folicula: {
      titulo: '🌱 Fase folicular',
      desc: 'Tu energía está en ascenso. Excelente momento para actividades nuevas.',
      gradiente: 'linear-gradient(135deg, #D4F5E9, #A8E6CF)',
      color: '#1A6B40',
      emoji: '🌱'
    },
    fertil: {
      titulo: '✨ Período fértil',
      desc: 'Estás en tu máximo de energía y vitalidad. ¡Aprovéchalo!',
      gradiente: 'linear-gradient(135deg, #FFF8E7, #FFD97D)',
      color: '#7A5000',
      emoji: '✨'
    },
    lutea: {
      titulo: '🌙 Fase lútea',
      desc: 'Tiempo de introversión y autocuidado. Escucha tus necesidades.',
      gradiente: 'linear-gradient(135deg, #EDD5F8, #C97FE8)',
      color: '#7B2D9E',
      emoji: '🌙'
    },
    premenstrual: {
      titulo: '💜 Fase premenstrual',
      desc: 'Tu cuerpo se prepara. La autocompasión es tu mejor herramienta.',
      gradiente: 'linear-gradient(135deg, #EDD5F8, #C97FE8)',
      color: '#7B2D9E',
      emoji: '💜'
    }
  };

  const nombreFase = fase ? fase.nombre : 'fertil';
  const config = configs[nombreFase] || configs.fertil;

  banner.style.background = config.gradiente;
  banner.setAttribute('data-emoji', config.emoji);
  banner.innerHTML = `
    <div class="banner-fase-titulo" style="color:${config.color}">${config.titulo}</div>
    <div class="banner-fase-desc" style="color:${config.color}">${config.desc}</div>
  `;

  badge.textContent = nombreFase.charAt(0).toUpperCase() + nombreFase.slice(1);
}

// RENDERIZAR ARTÍCULOS

function renderizarArticulos(lista) {
  const contenedor = document.getElementById('lista-articulos');
  contenedor.innerHTML = lista.map(art => `
    <div class="tarjeta-articulo" onclick="abrirArticulo(${art.id})">
      <div class="art-imagen" style="background:${art.color}">${art.emoji}</div>
      <div class="art-cuerpo">
        <span class="art-categoria-chip" style="background:${art.colorChip};color:${art.colorTextoChip}">
          ${art.categoria}
        </span>
        <h3 class="art-titulo">${art.titulo}</h3>
        <p class="art-preview">${art.preview}</p>
        <div class="art-pie">
          <span class="art-tiempo">⏱ ${art.tiempo} lectura</span>
          <span class="art-leer-mas">Leer más →</span>
        </div>
      </div>
    </div>
  `).join('');
}

// FILTRAR POR CATEGORÍA

function filtrarCategoria(categoria, boton) {
  document.querySelectorAll('.chip-categoria').forEach(c => c.classList.remove('activo'));
  boton.classList.add('activo');

  articulosFiltrados = categoria === 'todo'
    ? articulos
    : articulos.filter(a => a.categoria === categoria);

  renderizarArticulos(articulosFiltrados);
}

// ABRIR/CERRAR ARTÍCULO

function abrirArticulo(id) {
  const art = articulos.find(a => a.id === id);
  if (!art) return;

  document.getElementById('modal-art-cuerpo').innerHTML = `
    <div class="art-hero" style="background:${art.color}">${art.emoji}</div>
    <h1 class="art-full-titulo">${art.titulo}</h1>
    <div class="art-full-cuerpo">${art.contenido}</div>
  `;

  document.getElementById('modal-articulo').style.display = 'block';
  window.scrollTo(0, 0);
}

function cerrarArticulo() {
  document.getElementById('modal-articulo').style.display = 'none';
}
