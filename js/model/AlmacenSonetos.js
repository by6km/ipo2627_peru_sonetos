import { Soneto } from './Soneto.js';

/*Almacén de sonetos: los carga desde el JSON*/
export class AlmacenSonetos {
  #sonetos = [];

  async cargar(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${url} (${respuesta.status})`);
    }
    const datos = await respuesta.json();
    this.#sonetos = datos.map((d) => new Soneto(d));
  }

  listar() {
    return [...this.#sonetos];
  }

  obtener(id) {
    return this.#sonetos.find((soneto) => soneto.id === id) ?? null;
  }

  /**Soneto anterior y siguiente (null si no existen)*/
  vecinos(id) {
    const posicion = this.#sonetos.findIndex((soneto) => soneto.id === id);
    return {
      anterior: this.#sonetos[posicion - 1] ?? null,
      siguiente: this.#sonetos[posicion + 1] ?? null,
    };
  }
}
