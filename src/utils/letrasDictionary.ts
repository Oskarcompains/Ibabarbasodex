/**
 * Spanish words dictionary and Letters game logic for Cifras y Letras
 */

// Weighted letter pool in Spanish (Spanish Countdown / Cifras y Letras frequency)
export const SPANISH_VOWELS = [
  'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
  'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
  'I', 'I', 'I', 'I', 'I', 'I',
  'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
  'U', 'U', 'U', 'U', 'U',
];

export const SPANISH_CONSONANTS = [
  'B', 'B',
  'C', 'C', 'C', 'C',
  'D', 'D', 'D', 'D', 'D',
  'F', 'F',
  'G', 'G',
  'H', 'H',
  'J', 'J',
  'L', 'L', 'L', 'L',
  'M', 'M', 'M',
  'N', 'N', 'N', 'N', 'N',
  'P', 'P', 'P',
  'Q',
  'R', 'R', 'R', 'R', 'R',
  'S', 'S', 'S', 'S', 'S', 'S',
  'T', 'T', 'T', 'T',
  'V', 'V',
  'X',
  'Y',
  'Z',
];

// Rich Curated Spanish Dictionary with standard words and football/regional terms
export const SPANISH_DICTIONARY = new Set([
  // 3 letters
  'SOL', 'MAR', 'PAN', 'GOL', 'RED', 'VOZ', 'LUZ', 'PAZ', 'REY', 'SUR', 'MAS', 'DOS', 'TIO', 'TIA', 'RIO', 'DIA', 'PIE', 'SAL', 'CAL', 'GAS', 'SER', 'DAR', 'VER', 'OIR', 'CAN', 'BAR', 'MES', 'PAR', 'ERA', 'LEY', 'ALA', 'ORO', 'OCA', 'UVA', 'AJO', 'AVE', 'ECO', 'EJE', 'OLA', 'OSO', 'OJO', 'RAS', 'VAN', 'VIA', 'UNO', 'UNA', 'USA', 'USA', 'VAL', 'VIL', 'ZOO',

  // 4 letters
  'SOTO', 'CASA', 'MESA', 'VIDA', 'HORA', 'ALMA', 'AGUA', 'ROSA', 'PALO', 'PASO', 'BOLA', 'TAPA', 'TOMA', 'MANO', 'CARA', 'LUNA', 'LAGO', 'RICO', 'RICA', 'ROCA', 'LOBO', 'GATO', 'RATO', 'FOTO', 'COLA', 'PELO', 'SOPA', 'TAZA', 'VASO', 'VINO', 'PISO', 'CAMO', 'CAMA', 'POZO', 'RAYO', 'RELO', 'ISLA', 'ROBO', 'TREN', 'BARN', 'BICI', 'BOCA', 'CODO', 'DEDO', 'DUDA', 'FASE', 'GIRO', 'HOJA', 'HUMO', 'LANA', 'LEMA', 'MAPA', 'MURO', 'NADA', 'NUBE', 'ONDA', 'PALA', 'PENA', 'RAMA', 'SACO', 'SEDA', 'SELO', 'TEMA', 'TIRO', 'TUBP', 'VELA', 'VOTO', 'ZONA', 'ALTO', 'BAJO', 'DURO', 'FINO', 'GRIS', 'LOCO', 'MALO', 'NETO', 'POCO', 'RARO', 'ROJO', 'SECO', 'SOLO', 'VANO', 'VIVO', 'ABRE', 'ANDA', 'BAJA', 'BEBE', 'CAGA', 'CAYE', 'CEDE', 'CORR', 'DAME', 'DICE', 'DURA', 'GANA', 'HACE', 'JUEG', 'LAVA', 'MIRA', 'NACE', 'PAGA', 'PARA', 'PASA', 'PIDE', 'PONE', 'SABE', 'SACA', 'SALE', 'TOCA', 'TRAE', 'VALE', 'VIVE', 'VOTA', 'ROTA', 'FRIO', 'AUTO', 'LIMA', 'FARO', 'PIEL',

  // 5 letters
  'BALON', 'CAMPO', 'BARBA', 'BRAVO', 'CORRE', 'JUEGA', 'PASES', 'TIROS', 'GOLAZ', 'GANAR', 'PERRO', 'GATOS', 'CASAS', 'MESAS', 'ARBOL', 'BARCO', 'CALLE', 'CARRO', 'CHICO', 'CIELO', 'CLASE', 'COLOR', 'CORTE', 'DISCO', 'DOLOR', 'DRAMA', 'FUEGO', 'FIEST', 'GRUPO', 'HIELO', 'HOTEL', 'LIBRO', 'LINEA', 'MADRE', 'MONTE', 'MUNDO', 'NOCHE', 'ORDEN', 'PADRE', 'PAPEL', 'PARTE', 'PISTA', 'PLAYA', 'PLAZA', 'PODER', 'PUNTO', 'RADIO', 'REGLA', 'RESTO', 'RITMO', 'SALUD', 'SERIE', 'SITIO', 'SUELO', 'TARDE', 'TEXTO', 'TORRE', 'TRAJE', 'UNION', 'VALOR', 'VIAJE', 'VISTA', 'BUENO', 'CLARO', 'CORTO', 'DULCE', 'FACIL', 'FELIZ', 'FUERTE', 'GRAN', 'GUAPO', 'IGUAL', 'JOVEN', 'LARGO', 'LIMPIO', 'LLENO', 'MAYOR', 'MEJOR', 'MENOR', 'NUEVO', 'POBRE', 'PRIMO', 'RAPID', 'RECTO', 'RUBIO', 'SANTO', 'SUAVE', 'UNICO', 'VERDE', 'VIEJO', 'ABRIR', 'ANDAR', 'BAJAR', 'BEBER', 'CAER', 'CALLA', 'CANTA', 'COMER', 'CREER', 'DARLE', 'DECIR', 'DEJAR', 'DURAR', 'ENTRA', 'ESTAR', 'HABER', 'HACER', 'JUGAR', 'LAVAR', 'LEER', 'LLEGA', 'LLEVA', 'LLORA', 'MIRAR', 'MORIR', 'NACER', 'NOTAR', 'PAGAR', 'PARAR', 'PASAR', 'PEDIR', 'PEGAR', 'PODER', 'PONER', 'QUEDA', 'SABER', 'SACAR', 'SALIR', 'SENTI', 'SUBIR', 'TENER', 'TOCAR', 'TOMAR', 'TRAER', 'VALER', 'VENIR', 'VOLAR', 'VOTAR', 'MARCA', 'POSTE', 'BANDA', 'CHUTE', 'FUERA', 'TABLA', 'BANCA', 'RIVAL', 'FALTA', 'BOMBA', 'PUNTA',

  // 6 letters
  'FUTBOL', 'SOTICO', 'ESCUAD', 'CENTRO', 'CORNER', 'CHILEN', 'EQUIPO', 'JUGADA', 'PELOTA', 'PORTER', 'REBOTE', 'REMATE', 'SILBAT', 'TARJET', 'AMARIL', 'CROMOS', 'SOBRES', 'ESCUDO', 'AFICIA', 'GRANDA', 'ACCION', 'ACUERD', 'ANIMAL', 'ATAQUE', 'CAMINO', 'CAMBIO', 'CIUDAD', 'CUERPO', 'EFECTO', 'ESTUDI', 'FIGURA', 'FUERZA', 'IMAGEN', 'INTERE', 'MANERA', 'MINUTO', 'MOMENT', 'MOTIVO', 'MUSICA', 'NUMERO', 'OBJETO', 'ORIGEN', 'PAGINA', 'PASION', 'PIEDRA', 'PUEBLO', 'REGION', 'SEMANA', 'TIEMPO', 'TIERRA', 'VERDAD', 'VIENTO', 'BLANCO', 'CALIDO', 'DIRECT', 'ENTERO', 'FRESCO', 'GRANDE', 'HUMANO', 'LIBRES', 'LIMPIO', 'MAXIMO', 'MINIMO', 'NORMAL', 'OSCURO', 'PESADO', 'PROPIO', 'RAPIDO', 'SEGURO', 'SIMPLE', 'SOCIAL', 'SOLIDO', 'TRISTE', 'VALIEN', 'CANTAR', 'CORRER', 'CORTAR', 'CRECER', 'CUIDAR', 'DEBER', 'DESEAR', 'DORMIR', 'ENVIAR', 'EVITAR', 'FIRMAR', 'GANADO', 'GRITAR', 'GUSTAR', 'LLAMAR', 'LOGRAR', 'MANDAR', 'MONTAR', 'MOSTRAR', 'OCUPAR', 'OFRECE', 'PENSAR', 'PERDER', 'PINTAR', 'PROBAR', 'QUEDAR', 'QUERER', 'SALVAR', 'SALTAR', 'SEGUIR', 'SENTIR', 'SERVIR', 'SUFRIR', 'TARDAR', 'TRATAR', 'VENCER', 'VIAJAR', 'VOLVER', 'PIVOTE', 'DEFENS', 'LATERAL',

  // 7 letters
  'ESTADIO', 'PARTIDO', 'PENALTI', 'ARBITRO', 'CAMPEON', 'DELANTE', 'PORTERO', 'DEFENSA', 'EXTREMO', 'CARRIL', 'MINUTOS', 'TABLERO', 'MEDALLA', 'JUGADOR', 'CANTERA', 'GRADERI', 'AFICION', 'BANDERA', 'CABEZAZ', 'CAPITAN', 'CENTRAL', 'CHILENA', 'EMPATAR', 'GANADOR', 'GOLEADA', 'MARCADOR', 'RESERVA', 'TARJETA', 'TRIUNFO', 'VICTORI', 'ALIANZA', 'ALEGRIA', 'CAMINOS', 'DESTINO', 'DOMINIO', 'EMPRESA', 'ENERGIA', 'ESPACIO', 'ESPEJO', 'ESTRELLA', 'FORTUNA', 'HISTORIA', 'IMPACTO', 'JUSTICIA', 'LIBERTAD', 'MEMORIA', 'MENSAJE', 'MISTERIO', 'NOVEDAD', 'PALABRA', 'PELIGRO', 'PLANETA', 'REALIDAD', 'RESPETO', 'SECRETO', 'SILENCIO', 'TALENTO', 'TRABAJO', 'VALIENT', 'VENTAJA', 'VOLUNTAD', 'ABIERTO', 'ANTIGUO', 'CERCANO', 'DIVERSO', 'EXTRAÑO', 'GENERAL', 'INTENSO', 'MAGNIFICO', 'NATURAL', 'PERFECT', 'POPULAR', 'POTENTE', 'SEVERO', 'ACEPTAR', 'APRENDER', 'AVANZAR', 'CAMBIAR', 'CONOCER', 'CUMPLIR', 'DECIDIR', 'DEFINIR', 'DESCUBR', 'DIBUJAR', 'DIRIGIR', 'DOMINAR', 'EMPEZAR', 'ENCONTR', 'ENTRENA', 'ESCUCHA', 'ESPERAR', 'ESTUDIA', 'GENERAR', 'IMAGINA', 'INVENTA', 'MEJORAR', 'ORDENAR', 'ORGANIZ', 'PROTEGE', 'RECORDAR', 'RESOLVER', 'SUPERAR', 'VALORAR', 'ALINEAR', 'REGATEO',

  // 8 letters
  'IBARBASO', 'CAMPEONA', 'DEPORTE', 'JUGADORES', 'ENTRENO', 'ENTRENAD', 'VICTORIA', 'PLANTILLA', 'AMISTOSO', 'BANQUILLO', 'DELANTER', 'DESCUENT', 'ENCUENTR', 'EXPULSIO', 'FINTADOR', 'GOLEADOR', 'LIGUILLA', 'MARCADOR', 'PASAPORTE', 'PENALTIS', 'PORTERIA', 'POSICION', 'REGATEAR', 'SUSTITUT', 'TALENTOS', 'ACTIVIDAD', 'AMBIENTE', 'AVENTURA', 'CARACTER', 'CONCEPTO', 'CORAZON', 'CREACION', 'CULTURA', 'DESTREZA', 'DISCIPLINA', 'ELECCION', 'EQUILIBRIO', 'ESFUERZO', 'ESTRATEG', 'FANTASIA', 'FORTALEZA', 'GRANDEZA', 'HORIZONTE', 'ILUSION', 'INVENTIVA', 'LEALTAD', 'NOBLEZA', 'OBJETIVO', 'PACIENCIA', 'POTENCIA', 'PROGRESO', 'PROYECTO', 'SABIDURIA', 'SIMPATIA', 'SOLUCION', 'SUPERIOR', 'VALENTIA', 'VARIEDAD', 'APRENDER', 'CALCULAR', 'COMPETIR', 'CONSEGUI', 'CONSTRUIR', 'DEFENDER', 'DESAFIAR', 'DESCUBRE', 'DISPARAR', 'EJECUTAR', 'ENTRENAR', 'EXPLORAR', 'ILUMINAR', 'MANTENER', 'OBSERVAR', 'PRACTICA', 'PREPARAR', 'REALIZAR', 'RECORRER', 'REFORZAR', 'RESISTIR', 'SOPORTAR', 'TRIUNFAR', 'UTILIZAR', 'VERIFICA',

  // 9 letters
  'IBARBASOS', 'DELANTERO', 'DELANTERA', 'DEFENSORES', 'CENTROCAM', 'CANTERANO', 'CHILENAZO', 'COLECTIVO', 'ESTRATEGIA', 'EXPULSION', 'FINALISTA', 'GOLEADORA', 'JUGADORES', 'MEDIOPOZO', 'PENALITOS', 'PRORROGAS', 'PUNTUABLE', 'REMONTADA', 'SUPLENTES', 'TIEMPOSUR', 'TRIUNFADO', 'VALENTIAS', 'VICTORIAS', 'CAMPEONATO', 'ACTITUDES', 'AMISTADES', 'CAPACIDAD', 'CELEBRAR', 'COMPARTIR', 'CONQUISTA', 'CREATIVO', 'DEDICACIO', 'DISFRUTAR', 'EMOCIONES', 'ENTUSIAS', 'ESPERANZA', 'ESTABILID', 'EXCELENTE', 'FANTASIAS', 'FORTALEZAS', 'HERMANDAD', 'HOMENAJE', 'IDENTIDAD', 'INSPIRAR', 'INTEGRAL', 'LECCIONES', 'LIBERTADES', 'MARAVILLA', 'NOVEDADES', 'OPTIMISMO', 'PANORAMA', 'PERSISTIR', 'POTENCIAL', 'PRECISION', 'PRINCIPAL', 'PROGRESAR', 'PROTAGONI', 'REENCUENT', 'REFLEXION', 'RENDIMIEN', 'SABIDURIA', 'SOLIDARIO', 'SUPERACION', 'TRAYECTOR', 'UNIFICADO', 'VALIOSAS',

  // 10 letters
  'CAMPEONATO', 'DELANTEROS', 'DEFENSORES', 'ENTRENADOR', 'GOLEADORES', 'CHILENAZOS', 'ESTRATEGIAS', 'HABILIDADES', 'JUGADORES', 'VICTORIOSO', 'ESPECTACUL', 'INTRATABLE', 'REVOLUCION', 'CELEBRACION', 'COMPROMISO', 'DETERMINAC', 'DISCIPLINA', 'ENTUSIASMO', 'EXCELENCIA', 'EXPERIENCIA', 'FASCINANTE', 'INSPIRACION', 'MOTIVACION', 'OPORTUNIDA', 'PERFECCION', 'RESISTENCIA', 'SATISFACCI', 'SOLIDARIDAD', 'SUPERIORID', 'TRIUNFADOR'
]);

/**
 * Generate 9 random letters for the game (e.g. 4 vowels and 5 consonants)
 */
export function generateRandomLetters(vowelCount: number = 4, consonantCount: number = 5): string[] {
  const letters: string[] = [];

  for (let i = 0; i < vowelCount; i++) {
    const randomIndex = Math.floor(Math.random() * SPANISH_VOWELS.length);
    letters.push(SPANISH_VOWELS[randomIndex]);
  }

  for (let i = 0; i < consonantCount; i++) {
    const randomIndex = Math.floor(Math.random() * SPANISH_CONSONANTS.length);
    letters.push(SPANISH_CONSONANTS[randomIndex]);
  }

  // Shuffle letters
  return letters.sort(() => 0.5 - Math.random());
}

/**
 * Check if a word can be formed from the pool of available letters
 */
export function canFormWord(word: string, availableLetters: string[]): boolean {
  const normalizedWord = word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const pool = [...availableLetters.map(l => l.toUpperCase())];

  for (const char of normalizedWord) {
    const idx = pool.indexOf(char);
    if (idx === -1) {
      return false;
    }
    pool.splice(idx, 1);
  }
  return true;
}

/**
 * Validates a word submitted by player
 */
export function validateWord(
  word: string,
  availableLetters: string[]
): { valid: boolean; points: number; message: string } {
  const clean = word.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (clean.length < 3) {
    return { valid: false, points: 0, message: 'La palabra debe tener al menos 3 letras.' };
  }

  if (!canFormWord(clean, availableLetters)) {
    return { valid: false, points: 0, message: 'No puedes usar letras que no estén en el tablero.' };
  }

  if (!SPANISH_DICTIONARY.has(clean)) {
    // Check if it matches any word in dictionary
    return {
      valid: false,
      points: 0,
      message: `"${clean}" no está en el diccionario oficial del juego.`,
    };
  }

  // Points based on length: length + bonus for long words
  let points = clean.length * 10;
  if (clean.length >= 8) points += 30;
  else if (clean.length >= 6) points += 15;

  return {
    valid: true,
    points,
    message: `¡Palabra válida de ${clean.length} letras! (+${points} Puntos)`,
  };
}

/**
 * Anagram solver: find all valid words from the dictionary that can be made with availableLetters
 */
export function solveBestWords(availableLetters: string[]): { word: string; length: number; points: number }[] {
  const results: { word: string; length: number; points: number }[] = [];

  for (const dictWord of SPANISH_DICTIONARY) {
    if (canFormWord(dictWord, availableLetters)) {
      let points = dictWord.length * 10;
      if (dictWord.length >= 8) points += 30;
      else if (dictWord.length >= 6) points += 15;

      results.push({
        word: dictWord,
        length: dictWord.length,
        points,
      });
    }
  }

  // Sort by length desc, then alphabetically
  return results.sort((a, b) => b.length - a.length || a.word.localeCompare(b.word)).slice(0, 12);
}
