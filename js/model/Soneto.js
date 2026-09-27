/** Estructura fija de un soneto: dos cuartetos seguidos de dos tercetos. */
const ESTROFAS = [
  { nombre: 'Primer cuarteto', versos: 4 },
  { nombre: 'Segundo cuarteto', versos: 4 },
  { nombre: 'Primer terceto', versos: 3 },
  { nombre: 'Segundo terceto', versos: 3 },
];

const TOTAL_VERSOS = ESTROFAS.reduce((suma, estrofa) => suma + estrofa.versos, 0); // 14

export class Soneto {
  /**
   * @param {{ id: string, titulo: string, autor: string, versos: string[] }} datos
   */
  constructor({ id, titulo, autor, versos }) {
    if (versos.length !== TOTAL_VERSOS) {
      throw new Error(`«${titulo}» tiene ${versos.length} versos y un soneto debe tener ${TOTAL_VERSOS}.`);
    }

    this.id = id;
    this.titulo = titulo;
    this.autor = autor;

    // Reparte los 14 versos en las cuatro estrofas: [{ nombre, versos: [...] }, ...]
    let inicio = 0;
    this.estrofas = ESTROFAS.map(({ nombre, versos: cantidad }) => {
      const estrofa = { nombre, versos: versos.slice(inicio, inicio + cantidad) };
      inicio += cantidad;
      return estrofa;
    });
  }
}
