// ---- DATOS DEL TEST PHQ-9 ----
const PHQ9 = {
  nombre: "Evaluacion A - Cuestionario de estado de animo (PHQ-9)",
  instruccion: "Durante las ultimas 2 semanas, con que frecuencia le ha molestado alguno de los siguientes problemas?",
  preguntas: [
    "Poco interes o placer en hacer las cosas",
    "Sentirse triste, desanimado o sin esperanza",
    "Tener problemas para dormir, mantenerse dormido o dormir demasiado",
    "Sentirse cansado o con poca energia",
    "Tener poco apetito o comer en exceso",
    "Sentirse mal consigo mismo, o que es un fracaso, o que ha fallado a si mismo o a su familia",
    "Tener dificultad para concentrarse en cosas como leer el periodico o ver television",
    "Moverse o hablar tan lento que otras personas lo han notado. O lo contrario: estar tan inquieto que se ha movido mucho mas de lo usual",
    "Pensamientos de que estaria mejor muerto, o de hacerse dano de alguna manera"
  ],
  opciones: [
    { etiqueta: "Nunca",          valor: 0 },
    { etiqueta: "Varios dias",    valor: 1 },
    { etiqueta: "Mas de la mitad de los dias", valor: 2 },
    { etiqueta: "Casi todos los dias",         valor: 3 }
  ],
  resultados: [
    { min: 0,  max: 4,  nivel: "Sin depresion o minima",      descripcion: "Sus respuestas indican que actualmente no presenta sintomas significativos de depresion. Esto es una buena senal. Si en algun momento se siente diferente, puede repetir esta evaluacion." },
    { min: 5,  max: 9,  nivel: "Depresion leve",              descripcion: "Sus respuestas sugieren sintomas leves de depresion. Le recomendamos hablar con alguien de confianza o un profesional de salud si estos sentimientos persisten o se intensifican." },
    { min: 10, max: 14, nivel: "Depresion moderada",          descripcion: "Sus respuestas indican sintomas moderados de depresion. Es recomendable consultar con un medico o profesional de salud mental para recibir orientacion adecuada." },
    { min: 15, max: 19, nivel: "Depresion moderadamente severa", descripcion: "Sus respuestas sugieren sintomas considerables de depresion. Le recomendamos buscar atencion profesional pronto. Un medico puede ayudarle a encontrar el tratamiento mas adecuado." },
    { min: 20, max: 27, nivel: "Depresion severa",            descripcion: "Sus respuestas indican sintomas severos de depresion. Es importante que consulte a un profesional de salud lo antes posible. No tiene que enfrentar esto solo." }
  ]
};

// ---- ESTADO DE LA APLICACION ----
let testSeleccionado = null;
let preguntaActual = 0;
let respuestas = [];

// ---- TEXTOS DE AYUDA POR PANTALLA ----
const textosAyuda = {
  bienvenida: "Esta es la pantalla de bienvenida. Aqui vera como funciona la evaluacion. Cuando este listo, presione el boton 'Comenzar mi evaluacion'.",
  seleccion:  "Seleccione el tipo de evaluacion que desea realizar tocando una de las opciones. Luego presione 'Continuar'.",
  pregunta:   "Lea la pregunta con calma. Luego elija la opcion que mejor describa como se ha sentido durante las ultimas dos semanas. Puede regresar a la pregunta anterior si desea cambiar su respuesta.",
  resultado:  "Esta pantalla muestra el resultado de su evaluacion. Recuerde que este resultado es orientativo y no reemplaza la consulta con un profesional de salud."
};

// ---- NAVEGACION ENTRE PANTALLAS ----
function irA(idPantalla) {
  document.querySelectorAll(".pantalla").forEach(p => {
    p.classList.remove("activa");
    p.classList.add("oculto");
  });
  const destino = document.getElementById(idPantalla);
  destino.classList.remove("oculto");
  destino.classList.add("activa");
  window.scrollTo(0, 0);
}

// ---- SELECCION DE TEST ----
function seleccionarTest(letra) {
  testSeleccionado = letra;
  document.querySelectorAll(".btn-opcion-test").forEach(btn => {
    btn.classList.remove("seleccionado");
    btn.setAttribute("aria-pressed", "false");
  });
  const btnSeleccionado = document.getElementById("btn-test-" + letra.toLowerCase());
  if (btnSeleccionado) {
    btnSeleccionado.classList.add("seleccionado");
    btnSeleccionado.setAttribute("aria-pressed", "true");
  }
}

function iniciarTest() {
  if (!testSeleccionado) {
    alert("Por favor, seleccione una evaluacion para continuar.");
    return;
  }
  preguntaActual = 0;
  respuestas = new Array(PHQ9.preguntas.length).fill(null);
  mostrarPregunta();
  irA("pantalla-preguntas");
}

// ---- LOGICA DE PREGUNTAS ----
function mostrarPregunta() {
  const total = PHQ9.preguntas.length;
  const indice = preguntaActual;

  // Progreso
  document.getElementById("progreso-texto").textContent =
    "Pregunta " + (indice + 1) + " de " + total;
  const barra = document.getElementById("barra-progreso");
  const porcentaje = ((indice) / total) * 100;
  barra.style.width = porcentaje + "%";
  document.getElementById("barra-contenedor").setAttribute("aria-valuenow", indice + 1);

  // Pregunta
  document.getElementById("texto-pregunta").textContent = PHQ9.preguntas[indice];

  // Opciones de respuesta
  const contenedor = document.getElementById("opciones-respuesta");
  contenedor.innerHTML = "";
  PHQ9.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.className = "btn-respuesta" + (respuestas[indice] === opcion.valor ? " seleccionado" : "");
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", respuestas[indice] === opcion.valor ? "true" : "false");
    btn.setAttribute("data-valor", opcion.valor);

    const circulo = document.createElement("span");
    circulo.className = "radio-circulo";
    circulo.setAttribute("aria-hidden", "true");

    const etiqueta = document.createElement("span");
    etiqueta.textContent = opcion.etiqueta;

    btn.appendChild(circulo);
    btn.appendChild(etiqueta);
    btn.addEventListener("click", () => seleccionarRespuesta(opcion.valor));
    contenedor.appendChild(btn);
  });

  // Botones de navegacion
  const btnAnterior = document.getElementById("btn-anterior");
  btnAnterior.style.visibility = indice === 0 ? "hidden" : "visible";

  const btnSiguiente = document.getElementById("btn-siguiente");
  const esUltima = indice === total - 1;
  btnSiguiente.textContent = esUltima ? "Ver mi resultado" : "Siguiente";
}

function seleccionarRespuesta(valor) {
  respuestas[preguntaActual] = valor;
  // Actualizar estilos
  document.querySelectorAll(".btn-respuesta").forEach(btn => {
    const esSeleccionado = parseInt(btn.getAttribute("data-valor")) === valor;
    btn.classList.toggle("seleccionado", esSeleccionado);
    btn.setAttribute("aria-checked", esSeleccionado ? "true" : "false");
  });
}

function preguntaSiguiente() {
  if (respuestas[preguntaActual] === null) {
    alert("Por favor, seleccione una respuesta antes de continuar.");
    return;
  }
  if (preguntaActual < PHQ9.preguntas.length - 1) {
    preguntaActual++;
    mostrarPregunta();
    window.scrollTo(0, 0);
  } else {
    mostrarResultado();
  }
}

function preguntaAnterior() {
  if (preguntaActual > 0) {
    preguntaActual--;
    mostrarPregunta();
    window.scrollTo(0, 0);
  }
}

// ---- RESULTADO ----
function mostrarResultado() {
  const puntuacion = respuestas.reduce((suma, r) => suma + (r !== null ? r : 0), 0);
  const maxPuntuacion = PHQ9.preguntas.length * 3; // 27

  // Encontrar nivel
  const nivel = PHQ9.resultados.find(r => puntuacion >= r.min && puntuacion <= r.max);

  // Indicadores de nivel (4 puntos: sin, leve, moderada, severa)
  const niveles = PHQ9.resultados;
  const indiceLevelActual = niveles.indexOf(nivel);
  const contenedorPuntos = document.getElementById("nivel-puntos");
  contenedorPuntos.innerHTML = "";
  niveles.forEach((n, i) => {
    const punto = document.createElement("span");
    punto.className = "punto" + (i <= indiceLevelActual ? " activo" : "");
    punto.setAttribute("aria-hidden", "true");
    contenedorPuntos.appendChild(punto);
  });

  document.getElementById("resultado-nivel").textContent = nivel.nivel;
  document.getElementById("resultado-puntuacion").textContent =
    "Puntuacion: " + puntuacion + " de " + maxPuntuacion;
  document.getElementById("resultado-descripcion").textContent = nivel.descripcion;

  irA("pantalla-resultado");
}

// ---- REINICIO ----
function reiniciar() {
  testSeleccionado = null;
  preguntaActual = 0;
  respuestas = [];
  // Limpiar seleccion de test
  document.querySelectorAll(".btn-opcion-test").forEach(btn => {
    btn.classList.remove("seleccionado");
    btn.setAttribute("aria-pressed", "false");
  });
  irA("pantalla-bienvenida");
}

// ---- AYUDA ----
function abrirAyuda(pantalla) {
  const texto = textosAyuda[pantalla] || "No hay ayuda disponible para esta pantalla.";
  document.getElementById("ayuda-texto").textContent = texto;
  const overlay = document.getElementById("ayuda-overlay");
  overlay.classList.remove("oculto");
  overlay.classList.add("activa");
  overlay.querySelector(".btn-primario").focus();
}

function cerrarAyuda() {
  const overlay = document.getElementById("ayuda-overlay");
  overlay.classList.add("oculto");
  overlay.classList.remove("activa");
}

// Cerrar ayuda con tecla Escape
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    cerrarAyuda();
  }
});