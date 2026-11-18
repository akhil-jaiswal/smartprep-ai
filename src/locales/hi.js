(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});
  const Locales = SmartPrep.Locales || (SmartPrep.Locales = {});

  const hi = {
    meta: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    brand: { name: 'SmartPrep AI', tagline: 'इंटरव्यू प्रैक्टिस वर्कबेंच' },
    nav: {
      practice: 'प्रैक्टिस रूम',
      bank: 'क्वेश्चन बैंक',
      history: 'प्रैक्टिस हिस्ट्री',
      notes: 'तैयारी नोट्स',
      activeTrack: 'एक्टिव ट्रैक',
      targetRole: 'टारगेट रोल',
      roleTitle: 'रोल का नाम',
      experienceLevel: 'अनुभव स्तर',
      saveProgress: 'प्रोग्रेस लोकली सेव करें',
      saveProgressHint: 'केवल इस ब्राउज़र में सेव होता है। कोई अपलोड नहीं।'
    },
    practice: {
      savePrompt: 'सेव करें',
      savedPrompt: 'सेव किया गया',
      newPrompt: 'नया प्रश्न',
      showHint: 'इंटरव्यूअर हिंट देखें',
      hideHint: 'इंटरव्यूअर हिंट छिपाएं',
      yourResponse: 'आपका उत्तर',
      outlineBtn: 'आउटलाइन',
      starBtn: 'STAR',
      clearBtn: 'साफ़ करें',
      placeholder: 'इंटरव्यू की तरह अपना उत्तर स्पष्ट रूप से लिखें:\n1. पहले आप क्या स्पष्ट या मापेंगे\n2. आपका समाधान और मुख्य ट्रेड-ऑफ\n3. आप परिणाम को कैसे टेस्ट और मॉनिटर करेंगे',
      draftSaved: 'ड्राफ्ट लोकली सेव हुआ',
      saving: 'सेव हो रहा है...',
      shortcutHint: 'मूल्यांकन के लिए Ctrl + Enter दबाएं',
      evaluateBtn: 'उत्तर का मूल्यांकन करें',
      evaluatingBtn: 'जाँच हो रही है...',
      rubricTitle: 'रूब्रिक मूल्यांकन',
      conceptChecklist: 'कॉन्सेप्ट चेकलिस्ट',
      workedWell: 'क्या अच्छा रहा',
      improvements: 'सुधार के सुझाव',
      refAnswerTab: 'आदर्श उत्तर',
      compareTab: 'तुलना करें',
      copyExample: 'उदाहरण कॉपी करें',
      exportMd: '.md एक्सपोर्ट करें',
      reviseBtn: 'उत्तर सुधारें',
      nextPromptBtn: 'अगला प्रश्न',
      levelExpectations: 'स्तर के अनुसार अपेक्षाएँ',
      recommendedLength: 'सुझाई गई लंबाई',
      scoringRubric: 'स्कोरिंग रूब्रिक',
      trackProgress: 'ट्रैक प्रगति',
      promptsPracticed: 'अभ्यास किए गए प्रश्न',
      trackAverage: 'औसत स्कोर',
      savedBookmarks: 'सेव किए गए प्रश्न',
      browseBank: 'क्वेश्चन बैंक देखें',
      timerStart: 'शुरू करें',
      timerPause: 'रोकें',
      timerResume: 'जारी रखें'
    },
    bank: {
      heading: 'क्वेश्चन बैंक',
      subtitle: 'सभी रोल के इंटरव्यू प्रश्न खोजें, फ़िल्टर करें और सीधे प्रैक्टिस शुरू करें।',
      searchPlaceholder: 'प्रश्न, श्रेणी या कॉन्सेप्ट खोजें (जैसे: caching, SQL, SLO)...',
      allRoles: 'सभी रोल',
      allLevels: 'सभी स्तर',
      savedOnly: 'केवल सेव किए गए',
      practiceBtn: 'प्रैक्टिस करें',
      emptyTitle: 'कोई प्रश्न नहीं मिला',
      emptyDesc: 'खोज शब्द हटाएं या सभी रोल चुनें।',
      resetFilters: 'फ़िल्टर रीसेट करें'
    },
    history: {
      heading: 'प्रैक्टिस हिस्ट्री',
      subtitle: 'अपने पिछले उत्तर देखें, रोल के अनुसार स्कोर तुलना करें और प्रोग्रेस एक्सपोर्ट करें।',
      exportJson: 'JSON एक्सपोर्ट करें',
      clearHistory: 'हिस्ट्री साफ़ करें',
      totalAttempts: 'कुल प्रयास',
      averageScore: 'औसत स्कोर',
      highestScore: 'सर्वश्रेष्ठ स्कोर',
      uniquePrompts: 'कवर किए गए प्रश्न',
      avgByRole: 'रोल के अनुसार औसत स्कोर',
      recordedAttempts: 'रिकॉर्ड किए गए प्रयास',
      emptyTitle: 'अभी कोई प्रयास रिकॉर्ड नहीं है',
      emptyDesc: 'प्रैक्टिस रूम में उत्तर का मूल्यांकन करें और अपनी प्रगति यहाँ ट्रैक करें।',
      goPractice: 'प्रैक्टिस रूम में जाएं'
    },
    notes: {
      heading: 'तैयारी नोट्स और फ्रेमवर्क',
      subtitle: 'अपने प्रोजेक्ट की कहानियाँ, मेट्रिक्स और रोल-वाइज़ नोट्स इस ब्राउज़र में सुरक्षित रखें।',
      exportNotes: 'नोट्स एक्सपोर्ट करें (.md)',
      notebookSection: 'नोटबुक सेक्शन',
      clearNote: 'नोट साफ़ करें',
      placeholder: 'अपने वास्तविक प्रोजेक्ट मेट्रिक्स, प्रोडक्शन बग फिक्स, आर्किटेक्चर निर्णय या इंटरव्यूअर से पूछने वाले प्रश्न यहाँ लिखें...'
    },
    shortcuts: {
      title: 'कीबोर्ड शॉर्टकट्स',
      evaluate: 'वर्तमान उत्तर का मूल्यांकन करें',
      next: 'अगला प्रश्न लोड करें',
      hint: 'इंटरव्यूअर हिंट दिखाएं / छिपाएं',
      timer: 'टाइमर शुरू / रोकें',
      openDialog: 'शॉर्टकट्स विंडो खोलें',
      closeDialog: 'विंडो या मेनू बंद करें'
    }
  };

  Locales.hi = hi;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = hi;
  }
})(typeof window !== 'undefined' ? window : globalThis);
