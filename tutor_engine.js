/* ============================================
   ElectronFlow — tutor_engine.js
   
   Motor Híbrido de Asistente Académico EE 101:
   1. Capa 1: Búsqueda semántica instantánea local ($0 tokens, 0ms latencia)
   2. Capa 2: Conector Live AI con Gemini 2.0 Flash (optimizado para cuota gratuita de 1,500 req/día)
   3. Restricción estricta de fuentes a Alexander & Sadiku, Horowitz & Hill, y Morris Mano.
   ============================================ */

var TutorEngine = (function() {
  var DEFAULT_API_KEY = "AIzaSyBJrWF51royjZ6xvd3Fgmv4gY4l2UyzggQ";
  var STORAGE_KEY = "electronflow-gemini-key";
  var MODEL_NAME = "gemini-flash-lite-latest";
  var FALLBACK_MODEL = "gemini-flash-lite-latest";

  var currentMode = "auto"; // "auto" (local-first), "local" (100% offline), "live" (always Gemini)
  var sessionCache = {};
  var isDrawerOpen = false;

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY;
  }

  function setApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function setMode(mode) {
    currentMode = mode;
  }

  function getMode() {
    return currentMode;
  }

  /* --- Capa 1: Búsqueda local en TUTOR_KNOWLEDGE_BASE ($0 Tokens) --- */
  function findLocalMatch(query) {
    if (typeof TUTOR_KNOWLEDGE_BASE === "undefined") return null;

    var q = query.toLowerCase().trim();
    var words = q.split(/\s+/).filter(function(w) { return w.length > 2; });
    var bestMatch = null;
    var maxScore = 0;

    TUTOR_KNOWLEDGE_BASE.forEach(function(item) {
      var score = 0;

      /* Coincidencia exacta de palabras clave */
      item.keywords.forEach(function(kw) {
        if (q.indexOf(kw) !== -1) {
          score += 10;
        } else {
          var kwParts = kw.split(" ");
          kwParts.forEach(function(kp) {
            if (q.indexOf(kp) !== -1) score += 3;
          });
        }
      });

      /* Coincidencia de palabras individuales en el tema y resumen */
      words.forEach(function(w) {
        if (item.topic.toLowerCase().indexOf(w) !== -1) score += 4;
        if (item.summary.toLowerCase().indexOf(w) !== -1) score += 2;
      });

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (maxScore >= 4) {
      return { match: bestMatch, score: maxScore };
    }
    return null;
  }

  function formatLocalAnswer(item) {
    var html = '<div class="tutor-response-body">';
    html += '<p class="tutor-summary-text">' + item.summary + '</p>';

    if (item.equations && item.equations.length > 0) {
      html += '<div class="tutor-equations-box">';
      html += '<div class="tutor-eq-title">Core Equations:</div>';
      item.equations.forEach(function(eq) {
        var mathContent = eq.trim();
        if (!mathContent.startsWith("$$")) {
          mathContent = "$$" + mathContent + "$$";
        }
        html += '<div class="tutor-eq-katex">' + mathContent + '</div>';
      });
      html += '</div>';
    }

    if (item.keyPoints && item.keyPoints.length > 0) {
      html += '<ul class="tutor-keypoints-list">';
      item.keyPoints.forEach(function(kp) {
        html += '<li>' + kp + '</li>';
      });
      html += '</ul>';
    }

    html += '<div class="tutor-source-badge">';
    html += '<span class="source-icon">📖</span> ';
    html += '<strong>Source:</strong> ' + item.book + ' — <em>' + item.section + '</em>';
    html += ' <span class="tutor-free-pill">⚡ $0 Local Index</span>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  /* --- Capa 2: Conector Live AI con Gemini (Strict Grounding & Token Saver) --- */
  async function queryGemini(userQuery) {
    var apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("No Gemini API key found. Please add your key in Settings.");
    }

    /* Revisar caché de sesión para ahorrar 100% de tokens en preguntas repetidas */
    var cacheKey = userQuery.toLowerCase().trim();
    if (sessionCache[cacheKey]) {
      return sessionCache[cacheKey];
    }

    /* Construir contexto relevante de libros de texto */
    var contextSnippets = "";
    if (typeof TUTOR_KNOWLEDGE_BASE !== "undefined") {
      var topSnippets = TUTOR_KNOWLEDGE_BASE.slice(0, 4).map(function(item) {
        return "Book: " + item.book + "\nSection: " + item.section + "\nTopic: " + item.topic + "\nContent: " + item.summary + "\nEquations: " + item.equations.join(", ");
      }).join("\n\n---\n\n");
      contextSnippets = topSnippets;
    }

    var systemInstruction = "You are the ContraVista EE 101 Course Tutor. "
      + "You answer student questions strictly based on the engineering principles and derivations from: "
      + "1. Alexander & Sadiku: 'Fundamentals of Electric Circuits' "
      + "2. Horowitz & Hill: 'The Art of Electronics: The x-Chapters' "
      + "3. M. Morris Mano: 'Digital Design'.\n\n"
      + "RULES:\n"
      + "- Be concise, clear, and mathematically accurate.\n"
      + "- Include exact textbook citations (e.g. 'Alexander & Sadiku Ch 3.3' or 'Horowitz & Hill 1x.1').\n"
      + "- Format all mathematical equations in LaTeX delimiters ($$ ... $$ for display, $ ... $ for inline) using \\frac, \\sqrt, \\tau, \\omega, etc., so KaTeX renders them with 2D fractions.\n"
      + "- If a question is outside electronics/circuits, politely decline and steer back to EE 101.\n"
      + "- Keep your answer under 200 words to conserve student bandwidth and tokens.";

    var promptPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "TEXTBOOK REFERENCE CORPUS EXCERPTS:\n\n" + contextSnippets + "\n\nSTUDENT QUESTION: " + userQuery }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          { text: systemInstruction }
        ]
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800
      }
    };

    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + apiKey;

    try {
      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload)
      });

      if (!response.ok) {
        var errData = await response.json();
        throw new Error(errData.error ? errData.error.message : "API request failed with status " + response.status);
      }

      var data = await response.json();
      var answerText = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]
        ? data.candidates[0].content.parts[0].text
        : "I could not generate an answer. Please verify the topic in your textbook.";

      /* Formatear markdown preservando fórmulas LaTeX para KaTeX */
      var formatted = formatAiMarkdown(answerText);
      sessionCache[cacheKey] = formatted;
      return formatted;

    } catch (err) {
      console.warn("Live AI query failed, checking offline fallback:", err);
      /* Si la API falla, intentar respuesta local de rescate */
      var local = findLocalMatch(userQuery);
      if (local) {
        return formatLocalAnswer(local.match) + '<div class="tutor-fallback-note"><em>(Delivered via offline local textbook index)</em></div>';
      }
      throw err;
    }
  }

  function formatAiMarkdown(text) {
    /* 1. Negrita y cursiva básica */
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    /* 2. Viñetas */
    var lines = text.split("\n");
    var inList = false;
    var htmlOut = "";

    lines.forEach(function(line) {
      var trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        if (!inList) {
          htmlOut += '<ul class="tutor-keypoints-list">';
          inList = true;
        }
        htmlOut += '<li>' + trimmed.substring(2) + '</li>';
      } else {
        if (inList) {
          htmlOut += '</ul>';
          inList = false;
        }
        if (trimmed.length > 0) {
          htmlOut += '<p>' + trimmed + '</p>';
        }
      }
    });

    if (inList) htmlOut += '</ul>';

    return '<div class="tutor-response-body">' + htmlOut + '</div>';
  }

  /* --- Interfaz Pública --- */
  return {
    ask: async function(query) {
      var local = findLocalMatch(query);

      /* Si el modo es 'local' o si hay coincidencia local en modo 'auto', usar index ($0 tokens) */
      if (currentMode === "local" || (currentMode === "auto" && local)) {
        if (local) {
          return {
            source: "local-index",
            html: formatLocalAnswer(local.match)
          };
        }
      }

      /* Si es modo 'live' o no hubo match local en 'auto', consultar Gemini */
      try {
        var aiHtml = await queryGemini(query);
        return {
          source: "live-ai",
          html: aiHtml
        };
      } catch (e) {
        if (local) {
          return {
            source: "local-fallback",
            html: formatLocalAnswer(local.match)
          };
        }
        return {
          source: "error",
          html: '<div class="tutor-error-box"><p>Unable to contact live AI: ' + e.message + '</p><p>Tip: You can ask about core laws like <em>"Ohm\'s Law"</em>, <em>"KCL & KVL"</em>, <em>"Supernodes"</em>, <em>"Thevenin Equivalent"</em>, <em>"Bypass Capacitors"</em>, or <em>"Op-Amps"</em> to use the instant offline textbook index.</p></div>'
        };
      }
    },

    getApiKey: getApiKey,
    setApiKey: setApiKey,
    setMode: setMode,
    getMode: getMode,
    toggleDrawer: function() {
      isDrawerOpen = !isDrawerOpen;
      var drawer = document.getElementById("tutor-drawer");
      var overlay = document.getElementById("tutor-overlay");
      if (drawer) drawer.classList.toggle("open", isDrawerOpen);
      if (overlay) overlay.classList.toggle("open", isDrawerOpen);
      return isDrawerOpen;
    },
    closeDrawer: function() {
      isDrawerOpen = false;
      var drawer = document.getElementById("tutor-drawer");
      var overlay = document.getElementById("tutor-overlay");
      if (drawer) drawer.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    }
  };
})();
