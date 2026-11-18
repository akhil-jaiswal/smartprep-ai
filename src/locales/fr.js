(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});
  const Locales = SmartPrep.Locales || (SmartPrep.Locales = {});

  const fr = {
    meta: { code: 'fr', name: 'French', nativeName: 'Français' },
    brand: { name: 'SmartPrep AI', tagline: 'Atelier d’Entretien' },
    nav: {
      practice: 'Salle de Pratique',
      bank: 'Banque de Questions',
      history: 'Historique',
      notes: 'Notes de Préparation',
      activeTrack: 'Parcours Actif',
      targetRole: 'Poste Ciblé',
      roleTitle: 'Intitulé du Poste',
      experienceLevel: 'Niveau d’Expérience',
      saveProgress: 'Enregistrer localement',
      saveProgressHint: 'Stocké dans ce navigateur uniquement.'
    },
    practice: {
      savePrompt: 'Enregistrer',
      savedPrompt: 'Enregistrée',
      newPrompt: 'Autre question',
      showHint: 'Afficher l’indice du recruteur',
      hideHint: 'Masquer l’indice du recruteur',
      yourResponse: 'Votre Réponse',
      outlineBtn: 'Plan',
      starBtn: 'STAR',
      clearBtn: 'Effacer',
      placeholder: 'Structurez votre réponse comme en entretien réel :\n1. Ce que vous clarifiez ou mesurez en premier\n2. Votre approche et les principaux compromis\n3. Comment vous testez et vérifiez le résultat',
      draftSaved: 'Brouillon enregistré',
      saving: 'Enregistrement...',
      shortcutHint: 'Appuyez sur Ctrl + Entrée pour évaluer',
      evaluateBtn: 'Évaluer la Réponse',
      evaluatingBtn: 'Évaluation...',
      rubricTitle: 'Évaluation par Grille',
      conceptChecklist: 'Points Clés',
      workedWell: 'Points forts',
      improvements: 'Axes d’amélioration',
      refAnswerTab: 'Réponse de Référence',
      compareTab: 'Comparer Côte à Côte',
      copyExample: 'Copier l’exemple',
      exportMd: 'Exporter .md',
      reviseBtn: 'Améliorer la réponse',
      nextPromptBtn: 'Question suivante',
      levelExpectations: 'Attentes du Niveau',
      recommendedLength: 'Longueur recommandée',
      scoringRubric: 'Barème d’Évaluation',
      trackProgress: 'Progression du Poste',
      promptsPracticed: 'Questions pratiquées',
      trackAverage: 'Score moyen',
      savedBookmarks: 'Questions enregistrées',
      browseBank: 'Ouvrir la Banque',
      timerStart: 'Démarrer',
      timerPause: 'Pause',
      timerResume: 'Reprendre'
    },
    bank: {
      heading: 'Banque de Questions',
      subtitle: 'Parcourez toutes les questions, filtrez par rôle ou niveau et lancez une session.',
      searchPlaceholder: 'Rechercher questions, catégories ou concepts (ex. caching, SQL, SLO)...',
      allRoles: 'Tous les postes',
      allLevels: 'Tous les niveaux',
      savedOnly: 'Enregistrées uniquement',
      practiceBtn: 'Pratiquer',
      emptyTitle: 'Aucune question trouvée',
      emptyDesc: 'Essayez de modifier votre recherche ou de réinitialiser les filtres.',
      resetFilters: 'Réinitialiser'
    },
    history: {
      heading: 'Historique des Tentatives',
      subtitle: 'Consultez vos réponses passées, comparez vos scores par poste et exportez vos données.',
      exportJson: 'Exporter JSON',
      clearHistory: 'Effacer l’historique',
      totalAttempts: 'Total Tentatives',
      averageScore: 'Score Moyen',
      highestScore: 'Meilleur Score',
      uniquePrompts: 'Questions Couvertes',
      avgByRole: 'Moyenne par Poste',
      recordedAttempts: 'Tentatives Enregistrées',
      emptyTitle: 'Aucune tentative enregistrée',
      emptyDesc: 'Évaluez une réponse dans la Salle de Pratique pour suivre vos progrès ici.',
      goPractice: 'Aller à la Salle de Pratique'
    },
    notes: {
      heading: 'Notes et Méthodes',
      subtitle: 'Gardez vos expériences clés, indicateurs et notes par poste dans ce navigateur.',
      exportNotes: 'Exporter Notes (.md)',
      notebookSection: 'Section du Carnet',
      clearNote: 'Effacer la note',
      placeholder: 'Notez vos chiffres clés de projets, incidents résolus, arbitrages techniques ou questions à poser au recruteur...'
    },
    shortcuts: {
      title: 'Raccourcis Clavier',
      evaluate: 'Évaluer la réponse actuelle',
      next: 'Charger la question suivante',
      hint: 'Afficher / masquer l’indice',
      timer: 'Démarrer / mettre en pause le chrono',
      openDialog: 'Ouvrir les raccourcis clavier',
      closeDialog: 'Fermer la fenêtre ou le menu'
    }
  };

  Locales.fr = fr;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fr;
  }
})(typeof window !== 'undefined' ? window : globalThis);
