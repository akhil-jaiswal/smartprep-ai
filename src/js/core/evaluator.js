(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function getConstants() {
    if (SmartPrep.Constants) return SmartPrep.Constants;
    if (typeof module !== 'undefined' && module.exports) {
      return require('../config/constants');
    }
    return {
      EXPERIENCE_LEVELS: {
        'Entry level': { targetWords: [65, 130], expectation: 'Focus on clear fundamentals, logical order, and verification.' },
        'Mid level': { targetWords: [95, 180], expectation: 'Show ownership: trade-offs, edge cases, and validation.' },
        'Senior level': { targetWords: [120, 230], expectation: 'Show system-level judgement: constraints, risk, and ownership.' }
      },
      SPEAKING_WPM: 130
    };
  }

  function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    const tokens = text.match(/[a-zA-Z0-9+#./'-]+/g);
    return tokens ? tokens.length : 0;
  }

  function estimateSpeakingSeconds(wordCount, wpm) {
    const rate = wpm || getConstants().SPEAKING_WPM || 130;
    if (!wordCount) return 0;
    return Math.max(5, Math.round((wordCount / rate) * 60));
  }

  function matchesAny(text, patterns) {
    return patterns.some((pattern) => pattern.test(text));
  }

  function evaluateConcepts(lowerText, concepts) {
    const matched = [];
    const missed = [];

    (concepts || []).forEach((concept) => {
      const terms = concept.terms || [concept.label];
      const hit = terms.some((term) => lowerText.includes(String(term).toLowerCase()));
      if (hit) {
        matched.push(concept.label);
      } else {
        missed.push(concept.label);
      }
    });

    return { matched, missed };
  }

  function getScoreBand(score) {
    if (score >= 9) {
      return {
        label: 'Strong interview-ready answer',
        tone: 'excellent',
        description: 'Clear structure, solid technical coverage, and practical judgement. Ready for follow-up probing.'
      };
    }
    if (score >= 7.5) {
      return {
        label: 'Solid foundation',
        tone: 'good',
        description: 'Covers the core reasoning well. Tightening one or two missing concepts or trade-offs would make it stand out.'
      };
    }
    if (score >= 5.5) {
      return {
        label: 'Developing answer',
        tone: 'fair',
        description: 'Good instincts, but key details or validation steps are still implicit rather than stated clearly.'
      };
    }
    if (score >= 3.5) {
      return {
        label: 'Early draft',
        tone: 'needs-work',
        description: 'Touches the topic briefly. Expand your step-by-step reasoning and walk through concrete checks.'
      };
    }
    return {
      label: 'Needs more depth',
      tone: 'low',
      description: 'Too brief to evaluate thoroughly. Outline your first step, core decision criteria, and how you verify success.'
    };
  }

  function evaluateAnswer(answer, question, level) {
    const constants = getConstants();
    const levelName = level || 'Mid level';
    const levelConfig = constants.EXPERIENCE_LEVELS[levelName] || constants.EXPERIENCE_LEVELS['Mid level'];
    const cleanText = String(answer || '').trim();
    const lower = cleanText.toLowerCase();
    const wordCount = countWords(cleanText);
    const speakingSeconds = estimateSpeakingSeconds(wordCount, constants.SPEAKING_WPM);

    const { matched: matchedConcepts, missed: missedConcepts } = evaluateConcepts(lower, question.concepts || []);
    const totalConcepts = Math.max((question.concepts || []).length, 1);

    const signals = {
      opening: matchesAny(lower, [
        /\b(first|initially|to start|start by|begin by|before jumping|my first step|context)\b/
      ]),
      sequence: matchesAny(lower, [
        /\b(then|next|after that|once|following|second|subsequently|from there)\b/
      ]),
      closing: matchesAny(lower, [
        /\b(finally|lastly|to conclude|after release|post-release|follow-up|prevent|long-term)\b/
      ]),
      example: matchesAny(lower, [
        /\b(for example|for instance|such as|in my last|in a previous|on a recent|project|scenario|case)\b/
      ]),
      testing: matchesAny(lower, [
        /\b(test|validate|verify|measure|monitor|track|metric|benchmark|load test|soak|alert|check)\b/
      ]),
      tradeoff: matchesAny(lower, [
        /\b(trade.?off|however|whereas|instead|rather than|depends|risk|cost|drawback|downside|avoid|alternative)\b/
      ]),
      outcome: matchesAny(lower, [
        /\b(result|outcome|improv|reduc|increas|impact|stabilis|stabiliz|confirm|recover|success)\w*\b/
      ])
    };

    // Transparent 100-point rubric: Technical (40), Structure (25), Practical (25), Depth/Communication (10)
    const technicalRaw = 40 * (matchedConcepts.length / totalConcepts);

    const structureCount = Number(signals.opening) + Number(signals.sequence) + Number(signals.closing);
    const hasParagraphs = cleanText.split(/\n\s*\n/).filter(Boolean).length >= 2;
    const structureRaw = Math.min(25, (structureCount / 3) * 22 + (hasParagraphs ? 3 : 0));

    const practicalCount =
      Number(signals.example) +
      Number(signals.testing) +
      Number(signals.tradeoff) +
      Number(signals.outcome);
    const practicalRaw = 25 * (practicalCount / 4);

    const [minTarget, maxTarget] = levelConfig.targetWords || [90, 180];
    let communicationRaw = 10 * Math.min(wordCount / minTarget, 1);
    if (wordCount > maxTarget * 1.9) {
      // Gentle nudge against rambling walls of text
      communicationRaw = Math.max(6, communicationRaw - 1.5);
    }

    const breakdown = {
      technical: Math.round(technicalRaw),
      structure: Math.round(structureRaw),
      practical: Math.round(practicalRaw),
      communication: Math.round(communicationRaw)
    };

    let rawScore = (breakdown.technical + breakdown.structure + breakdown.practical + breakdown.communication) / 10;

    if (levelName === 'Senior level' && !signals.tradeoff) rawScore -= 0.4;
    if (levelName === 'Senior level' && !signals.testing) rawScore -= 0.3;
    if (wordCount < 25) rawScore = Math.min(rawScore, 3.5);

    const score = Math.max(1, Math.min(10, Math.round(rawScore * 2) / 2));
    const band = getScoreBand(score);

    const strengths = [];
    if (matchedConcepts.length >= 2) {
      strengths.push(`Covered ${matchedConcepts.length} of ${totalConcepts} core concepts: ${matchedConcepts.slice(0, 3).join(', ')}.`);
    } else if (matchedConcepts.length === 1) {
      strengths.push(`Addressed a key concept (${matchedConcepts[0]}).`);
    }

    if (signals.opening && signals.sequence) {
      strengths.push('Structured logically from initial diagnosis through next steps.');
    } else if (signals.opening || signals.sequence) {
      strengths.push('Included helpful signposting to guide the listener through your steps.');
    }

    if (signals.testing) {
      strengths.push('Explained how you would measure, test, or validate the solution.');
    }
    if (signals.tradeoff) {
      strengths.push('Acknowledged trade-offs, risks, or alternatives instead of pitching one silver bullet.');
    }
    if (signals.example) {
      strengths.push('Grounded the response with concrete examples or specific mechanisms.');
    }
    if (signals.outcome) {
      strengths.push('Connected actions to observable results or operational impact.');
    }
    if (!strengths.length) {
      strengths.push('Started framing a response to the prompt—build from here by naming key diagnostic steps.');
    }

    const gaps = [];
    if (missedConcepts.length) {
      gaps.push(`Unmentioned rubric areas to review: ${missedConcepts.slice(0, 4).join(', ')}.`);
    }
    if (!signals.opening || !signals.sequence) {
      gaps.push('Make your sequence explicit (what you check first, what follows next, and how you close the loop).');
    }
    if (!signals.testing) {
      gaps.push('Specify how you would verify, test, or monitor whether your fix actually worked.');
    }
    if (levelName !== 'Entry level' && !signals.tradeoff) {
      gaps.push(`For ${levelName.toLowerCase()}, explicitly call out at least one trade-off, risk, or rejected option.`);
    }
    if (!signals.example) {
      gaps.push('Include a specific example, tool mechanism, or realistic scenario to make the answer less abstract.');
    }
    if (wordCount < Math.round(minTarget * 0.7)) {
      gaps.push(`Response is short (${wordCount} words). Aim for roughly ${minTarget}–${maxTarget} words (~1–1.5 min spoken).`);
    }
    if (!gaps.length) {
      gaps.push('No major rubric gaps flagged. Practice delivering this aloud concisely and preparing for follow-up questions.');
    }

    return {
      score,
      label: band.label,
      tone: band.tone,
      description: band.description,
      summary: `Evaluated against ${levelName.toLowerCase()} expectations. ${levelConfig.expectation}`,
      breakdown,
      matchedConcepts,
      missedConcepts,
      signals,
      strengths: strengths.slice(0, 4),
      gaps: gaps.slice(0, 4),
      wordCount,
      speakingSeconds,
      modelAnswer: question.answer,
      evaluatedAt: new Date().toISOString()
    };
  }

  const Evaluator = {
    countWords,
    estimateSpeakingSeconds,
    evaluateAnswer
  };

  SmartPrep.Evaluator = Evaluator;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Evaluator;
  }
})(typeof window !== 'undefined' ? window : globalThis);
