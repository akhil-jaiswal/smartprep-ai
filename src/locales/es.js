(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});
  const Locales = SmartPrep.Locales || (SmartPrep.Locales = {});

  const es = {
    meta: { code: 'es', name: 'Spanish', nativeName: 'Español' },
    brand: { name: 'SmartPrep AI', tagline: 'Espacio de Entrevistas' },
    nav: {
      practice: 'Sala de Práctica',
      bank: 'Banco de Preguntas',
      history: 'Historial',
      notes: 'Notas de Estudio',
      activeTrack: 'Ruta Activa',
      targetRole: 'Rol Objetivo',
      roleTitle: 'Nombre del Rol',
      experienceLevel: 'Nivel de Experiencia',
      saveProgress: 'Guardar progreso local',
      saveProgressHint: 'Solo en este navegador. Sin envíos externos.'
    },
    practice: {
      savePrompt: 'Guardar',
      savedPrompt: 'Guardada',
      newPrompt: 'Otra pregunta',
      showHint: 'Mostrar pista del entrevistador',
      hideHint: 'Ocultar pista del entrevistador',
      yourResponse: 'Tu Respuesta',
      outlineBtn: 'Esquema',
      starBtn: 'STAR',
      clearBtn: 'Limpiar',
      placeholder: 'Explica tu respuesta con claridad como en una entrevista real:\n1. Qué aclararías o medirías primero\n2. Tu enfoque principal y sus trade-offs\n3. Cómo probarías y verificarías el resultado',
      draftSaved: 'Borrador guardado',
      saving: 'Guardando...',
      shortcutHint: 'Pulsa Ctrl + Enter para evaluar',
      evaluateBtn: 'Evaluar Respuesta',
      evaluatingBtn: 'Evaluando...',
      rubricTitle: 'Evaluación por Rúbrica',
      conceptChecklist: 'Lista de Conceptos',
      workedWell: 'Lo que funcionó bien',
      improvements: 'Áreas de mejora',
      refAnswerTab: 'Respuesta de Referencia',
      compareTab: 'Comparar Lado a Lado',
      copyExample: 'Copiar ejemplo',
      exportMd: 'Exportar .md',
      reviseBtn: 'Editar respuesta',
      nextPromptBtn: 'Siguiente pregunta',
      levelExpectations: 'Expectativas del Nivel',
      recommendedLength: 'Extensión recomendada',
      scoringRubric: 'Rúbrica de Puntuación',
      trackProgress: 'Progreso del Rol',
      promptsPracticed: 'Preguntas practicadas',
      trackAverage: 'Promedio del rol',
      savedBookmarks: 'Preguntas guardadas',
      browseBank: 'Explorar Banco',
      timerStart: 'Iniciar',
      timerPause: 'Pausar',
      timerResume: 'Reanudar'
    },
    bank: {
      heading: 'Banco de Preguntas',
      subtitle: 'Explora todas las preguntas curadas, filtra por rol o nivel y practica al instante.',
      searchPlaceholder: 'Buscar preguntas, categorías o conceptos (ej. caching, SQL, SLO)...',
      allRoles: 'Todos los roles',
      allLevels: 'Todos los niveles',
      savedOnly: 'Solo guardadas',
      practiceBtn: 'Practicar',
      emptyTitle: 'No hay preguntas con esos filtros',
      emptyDesc: 'Prueba limpiando la búsqueda o seleccionando todos los roles.',
      resetFilters: 'Restablecer filtros'
    },
    history: {
      heading: 'Historial de Intentos',
      subtitle: 'Revisa tus respuestas anteriores, compara puntajes por rol y exporta tu progreso.',
      exportJson: 'Exportar JSON',
      clearHistory: 'Borrar historial',
      totalAttempts: 'Total de Intentos',
      averageScore: 'Puntaje Promedio',
      highestScore: 'Mejor Puntaje',
      uniquePrompts: 'Preguntas Cubiertas',
      avgByRole: 'Promedio por Rol',
      recordedAttempts: 'Intentos Registrados',
      emptyTitle: 'Aún no hay intentos registrados',
      emptyDesc: 'Evalúa una respuesta en la Sala de Práctica para ver tu evolución aquí.',
      goPractice: 'Ir a la Sala de Práctica'
    },
    notes: {
      heading: 'Notas y Marcos de Trabajo',
      subtitle: 'Guarda historias reales de proyectos, métricas y notas por rol en este navegador.',
      exportNotes: 'Exportar Notas (.md)',
      notebookSection: 'Sección del Cuaderno',
      clearNote: 'Limpiar nota',
      placeholder: 'Escribe métricas reales de tus proyectos, incidentes resueltos, decisiones de arquitectura o preguntas para el entrevistador...'
    },
    shortcuts: {
      title: 'Atajos de Teclado',
      evaluate: 'Evaluar respuesta actual',
      next: 'Cargar siguiente pregunta',
      hint: 'Mostrar u ocultar pista',
      timer: 'Iniciar / pausar temporizador',
      openDialog: 'Abrir atajos de teclado',
      closeDialog: 'Cerrar ventana o menú'
    }
  };

  Locales.es = es;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = es;
  }
})(typeof window !== 'undefined' ? window : globalThis);
