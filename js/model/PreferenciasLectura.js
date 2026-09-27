const CLAVE = 'sonetos:escala-texto';
const ESCALA_MIN = -2;
const ESCALA_MAX = 4;
const BASE_REM = 1.375;
const PASO_REM = 0.125;

/** Preferencias del lector (de momento, el tamaño del texto). Se recuerdan entre visitas. */
export class PreferenciasLectura {
  #escala = 0;

  constructor() {
    try {
      const guardada = Number(localStorage.getItem(CLAVE));
      if (Number.isInteger(guardada)) {
        this.#escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, guardada));
      }
    } catch {
      // Sin acceso a localStorage: se usa el valor por defecto.
    }
  }

  get tamanoRem() {
    return BASE_REM + this.#escala * PASO_REM;
  }

  get puedeReducir() {
    return this.#escala > ESCALA_MIN;
  }

  get puedeAumentar() {
    return this.#escala < ESCALA_MAX;
  }

  cambiar(delta) {
    this.#escala = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, this.#escala + delta));
    try {
      localStorage.setItem(CLAVE, String(this.#escala));
    } catch {
      // Se ignora: la preferencia solo dura mientras la página está abierta.
    }
  }
}
