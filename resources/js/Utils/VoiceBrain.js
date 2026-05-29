// resources/js/Utils/VoiceBrain.js
const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Elimina marcas de acentos
        .trim();
};

// 1. Diccionarios de Sinónimos e Intenciones
const intents = {
    affirmative: ['si', 'claro', 'dale', 'ok', 'bueno', 'avanza', 'correcto', 'bien', 'esta bien', 'procede', 'continuar'],
    negativeOrChange: ['cambia', 'cambio', 'cambiar', 'cambiemos', 'cambialo', 'otro', 'retrocede', 'volver', 'incorrecto', 'me equiveque', 'no'],
    helpOrList: ['cuáles hay', 'qué opciones', 'dime las opciones', 'no me acuerdo', 'ayuda', 'listar', 'qué categorías', 'qué documentos', 'opciones'],
    anotherQuestion: ['otra pregunta', 'otra cosa', 'aquí mismo', 'en este documento', 'sobre este', 'seguir preguntando', 'tengo otra duda', 'otra consulta'],
    changeCategory: ['cambiar categoria', 'otro documento', 'otro entregable', 'cambiar de archivo', 'revisar otro', 'otra categoria', 'cambiar entregable', 'cambia entregable', 'otro archivo'],
    changeGroup: ['cambiar de grupo', 'otro grupo', 'cambiar equipo', 'evaluar a otro', 'cambiar de equipo', 'cambia grupo']
};

export const VoiceBrain = {
    // Normalizador expuesto por si se necesita fuera
    normalize: (text) => normalizeText(text),

    // Evaluadores de Intenciones (retornan true si hay coincidencia semántica)
    isAffirmative: (text) => intents.affirmative.some(k => normalizeText(text).includes(k)),
    isNegativeOrChange: (text) => intents.negativeOrChange.some(k => normalizeText(text).includes(k)),
    isHelp: (text) => intents.helpOrList.some(k => normalizeText(text).includes(k)),
    isChangeCategory: (text) => intents.changeCategory.some(k => normalizeText(text).includes(k)),
    isChangeGroup: (text) => intents.changeGroup.some(k => normalizeText(text).includes(k)),
    
    // Algoritmo de Coincidencia Parcial de Categorías (Permite decir "charter" para "Project Charter")
    findPartialCategory: (text, categories) => {
        const cleanText = normalizeText(text);
        
        for (let cat of categories) {
            const cleanCat = normalizeText(cat.name);
            
            // Coincidencia directa completa o inversa
            if (cleanText.includes(cleanCat) || cleanCat.includes(cleanText)) {
                return cat;
            }
            
            // Coincidencia por palabras individuales (ignora conectores cortos menores a 3 letras)
            const words = cleanCat.split(/\s+/);
            const hasMatch = words.some(w => w.length > 3 && cleanText.includes(w));
            if (hasMatch) return cat;
        }
        return null;
    },

    generateCategoryHelpText: (categories) => {
        if (!categories || categories.length === 0) return "No tengo categorías registradas en este momento.";
        const names = categories.map(c => c.name).join(", ");
        return `Los entregables disponibles son: ${names}. ¿Cuál de ellos deseas abrir?`;
    }
};