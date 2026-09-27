/**
 * Vista: es la única parte que toca el DOM y el CSSOM.
 *  - DOM:   clona <template>, rellena textos y sustituye contenido.
 *  - CSSOM: fija custom properties (--tamano-lectura, --orden) y deja que el CSS haga el resto.
 * No conoce el modelo más allá de los datos que recibe, ni decide qué hacer ante un evento.
 */
export class VistaSonetos {
  #indice = document.getElementById('indice');
  #contenedor = document.getElementById('soneto');
  #lectura = document.getElementById('lectura');
  #reducir = document.getElementById('reducir');
  #aumentar = document.getElementById('aumentar');
  #pasoAnterior = document.getElementById('paso-anterior');
  #pasoSiguiente = document.getElementById('paso-siguiente');

  #plantillaIndice = document.getElementById('plantilla-indice');
  #plantillaSoneto = document.getElementById('plantilla-soneto');
  #plantillaEstrofa = document.getElementById('plantilla-estrofa');

  // --- Índice -------------------------------------------------------------

  mostrarIndice(sonetos) {
    const elementos = sonetos.map((soneto) => {
      const nodo = this.#plantillaIndice.content.cloneNode(true);
      const enlace = nodo.querySelector('[data-campo="enlace"]');
      enlace.href = this.#hash(soneto.id);
      enlace.dataset.id = soneto.id;
      nodo.querySelector('[data-campo="titulo"]').textContent = soneto.titulo;
      nodo.querySelector('[data-campo="autor"]').textContent = soneto.autor;
      return nodo;
    });
    this.#indice.replaceChildren(...elementos);
  }

  marcarActivo(id) {
    for (const enlace of this.#indice.querySelectorAll('a')) {
      if (enlace.dataset.id === id) {
        enlace.setAttribute('aria-current', 'page');
      } else {
        enlace.removeAttribute('aria-current');
      }
    }
  }

  // --- Soneto -------------------------------------------------------------

  mostrarSoneto(soneto, { anterior, siguiente }, { enfocar = false } = {}) {
    const nodo = this.#plantillaSoneto.content.cloneNode(true);
    nodo.querySelector('[data-campo="titulo"]').textContent = soneto.titulo;
    nodo.querySelector('[data-campo="autor"]').textContent = soneto.autor;

    const cuerpo = nodo.querySelector('[data-campo="cuerpo"]');
    soneto.estrofas.forEach((estrofa, posicion) => {
      cuerpo.append(this.#crearEstrofa(estrofa, posicion));
    });

    this.#contenedor.replaceChildren(nodo);
    this.#configurarPaso(this.#pasoAnterior, anterior);
    this.#configurarPaso(this.#pasoSiguiente, siguiente);
    document.title = `${soneto.titulo}, de ${soneto.autor} | Sonetos`;

    if (enfocar) {
      // Lleva la vista y el foco (lectores de pantalla, teclado) al soneto recién elegido.
      this.#lectura.scrollIntoView({ block: 'start' });
      this.#lectura.focus({ preventScroll: true });
    }
  }

  mostrarError(mensaje) {
    const aviso = document.createElement('p');
    aviso.setAttribute('role', 'alert');
    aviso.textContent = mensaje;
    this.#contenedor.replaceChildren(aviso);
  }

  // --- Tamaño del texto (coordinación con el CSSOM) -----------------------

  fijarTamano(rem, { puedeReducir, puedeAumentar }) {
    this.#lectura.style.setProperty('--tamano-lectura', `${rem}rem`);
    this.#reducir.disabled = !puedeReducir;
    this.#aumentar.disabled = !puedeAumentar;
  }

  enlazarTamano({ reducir, aumentar }) {
    this.#reducir.addEventListener('click', reducir);
    this.#aumentar.addEventListener('click', aumentar);
  }

  // --- Auxiliares ---------------------------------------------------------

  #crearEstrofa(estrofa, posicion) {
    const nodo = this.#plantillaEstrofa.content.cloneNode(true);
    nodo.querySelector('[data-campo="nombre"]').textContent = estrofa.nombre;

    const versos = nodo.querySelector('[data-campo="versos"]');
    versos.append(
      ...estrofa.versos.map((texto) => {
        const verso = document.createElement('span');
        verso.className = 'verso';
        verso.textContent = texto;
        return verso;
      }),
    );

    // El CSS usa --orden para escalonar la aparición de las estrofas.
    nodo.querySelector('[data-campo="estrofa"]').style.setProperty('--orden', posicion);
    return nodo;
  }

  #configurarPaso(enlace, soneto) {
    enlace.hidden = soneto === null;
    if (soneto === null) return;
    enlace.href = this.#hash(soneto.id);
    enlace.querySelector('[data-campo="titulo"]').textContent = soneto.titulo;
  }

  #hash(id) {
    return `#${encodeURIComponent(id)}`;
  }
}
