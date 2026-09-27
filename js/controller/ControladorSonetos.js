const URL_DATOS = 'data/sonetos.json';

/**
 * Controlador: escucha lo que hace el usuario, consulta/actualiza el modelo y ordena a la vista qué pintar.
 * La selección de soneto se apoya en el hash de la URL (#a-una-nariz): funciona el botón "Atrás",
 * se puede enlazar un soneto concreto y el índice es un conjunto de enlaces normales.
 */
export class ControladorSonetos {
  #almacen;
  #preferencias;
  #vista;

  constructor(almacen, preferencias, vista) {
    this.#almacen = almacen;
    this.#preferencias = preferencias;
    this.#vista = vista;
  }

  async iniciar() {
    try {
      await this.#almacen.cargar(URL_DATOS);
    } catch (error) {
      console.error(error);
      this.#vista.mostrarError(
        'No se han podido cargar los sonetos. Abre la página desde un servidor local (por ejemplo, Live Server) e inténtalo de nuevo.',
      );
      return;
    }

    this.#vista.mostrarIndice(this.#almacen.listar());

    this.#vista.enlazarTamano({
      reducir: () => this.#cambiarTamano(-1),
      aumentar: () => this.#cambiarTamano(1),
    });
    this.#vista.fijarTamano(this.#preferencias.tamanoRem, this.#preferencias);

    window.addEventListener('hashchange', () => this.#mostrarSegunHash({ enfocar: true }));
    this.#mostrarSegunHash({ enfocar: false });
  }

  #cambiarTamano(delta) {
    this.#preferencias.cambiar(delta);
    this.#vista.fijarTamano(this.#preferencias.tamanoRem, this.#preferencias);
  }

  #mostrarSegunHash({ enfocar }) {
    // Si el hash no corresponde a ningún soneto, se muestra el primero.
    const soneto = this.#almacen.obtener(this.#idDelHash()) ?? this.#almacen.listar()[0];
    this.#vista.marcarActivo(soneto.id);
    this.#vista.mostrarSoneto(soneto, this.#almacen.vecinos(soneto.id), { enfocar });
  }

  #idDelHash() {
    try {
      return decodeURIComponent(location.hash.slice(1));
    } catch {
      return '';
    }
  }
}
