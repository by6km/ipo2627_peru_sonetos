# Sonetos: justificación del diseño

Lector de sonetos con arquitectura MVC. Este documento explica las decisiones de diseño cromático, tipográfico y espacial, y cómo se corresponden con el código.

## 1. Diseño cromático: estrategia complementaria

**Idea.** El azul de tinta (matiz ≈ 225°) y el oro viejo (≈ 40°) son casi opuestos en la rueda de color. Evocan tinta y dorado sobre papel, en sintonía con la poesía del Siglo de Oro.

**Reparto.** El azul aporta el 90 % de la superficie: fondos, texto y líneas, en distintas luminosidades. El oro aparece solo donde hay que guiar la atención:

- el soneto seleccionado en el índice (borde izquierdo),
- el filete que agrupa cada estrofa,
- el anillo de foco del teclado,
- el borde de un botón al pasar el ratón.

Como el oro es escaso, cada aparición significa algo.

**Dos temas.** `color-scheme: light dark` y `light-dark()` en `tokens.css` dan tema claro y oscuro según la preferencia del sistema, sin JavaScript. El oro cambia de tono entre temas (`#86590a` en claro, `#e0b04a` en oscuro) para mantener el contraste.

**Accesibilidad.** Texto y acento superan 4,5:1 (nivel AA) sobre su fondo en ambos temas. El estado activo no depende solo del color: además lleva un borde y un fondo distintos.

## 2. Diseño tipográfico: dos fuentes contrastadas

| Rol | Fuente | Por qué |
|---|---|---|
| Versos y títulos | Cormorant Garamond (serifa), peso 500/600 | Serifa humanista de alto contraste; es la voz del poema. Se usa desde el peso 500 porque los pesos finos pierden legibilidad en pantalla. |
| Interfaz (autor en el índice, nombre de estrofa, botones) | Figtree (sans) | Sans sobria y neutra, que no compite con los versos. |

**Contraste.** Serifa contra sans: el ojo distingue al instante "esto es el poema" de "esto es la aplicación".

**Jerarquía.** Se apoya en tamaño y peso, sin mayúsculas ni adornos. El título del soneto mide 2,1 veces el verso, el autor va en cursiva y color suave, y los nombres de estrofa son pequeños y discretos.

**Escala y medida.** Los tamaños de interfaz siguen una escala modular de razón 1,25 (`--paso--1` … `--paso-4`). La interlínea de la serifa es de 1,55. Cada verso ocupa una línea, y si no cabe, la continuación queda sangrada (sangría francesa, tradicional en poesía).

**Tamaño ajustable.** Los botones A−/A+ cambian la variable `--tamano-lectura`. Todo lo interno al soneto está en `em`, así que se reescala en bloque.

**Carga.** Las fuentes vienen de Google Fonts con `display=swap` y pila de reserva (Georgia, system-ui), de modo que sin conexión el texto sigue siendo legible.

## 3. Diseño espacial

**Unidades.** Todo está en `rem`/`em` (más `ch` y `dvh` donde procede), no en `px`, para respetar el tamaño de letra del usuario. Hay una escala de espaciado (`--espacio-1` … `--espacio-7`) en `tokens.css`.

**Contenedores.** Rejilla CSS de dos columnas (índice | lectura) a partir de 56 rem. En pantallas estrechas se apila. La columna de lectura tiene una anchura máxima de 44 rem, centrada. En pantallas anchas la cabecera con el índice queda fija (`sticky`) mientras se lee.

**Principios Gestalt aplicados:**

- **Proximidad.** Los versos de una estrofa están juntos (solo interlínea) y las estrofas se separan con un hueco mayor. El ojo percibe 4 + 4 + 3 + 3 sin necesidad de leer.
- **Región común / continuidad.** Un filete dorado vertical acompaña a cada estrofa. Es más largo en los cuartetos y más corto en los tercetos, lo que hace visible la forma del soneto.
- **Similitud.** Todos los elementos del índice tienen la misma estructura y estilo, por lo que se leen como un conjunto de opciones equivalentes.
- **Figura y fondo.** La columna de lectura queda aislada, con mucho aire alrededor, y destaca sobre el resto.

**Nombre de estrofa.** En pantallas anchas va en el margen izquierdo, a la izquierda del filete, para no interrumpir la lectura del poema. En móvil pasa encima de la estrofa.

## 4. Arquitectura y buenas prácticas

- **MVC.** El modelo (`js/model/`) carga y consulta datos sin tocar el DOM. La vista (`js/view/`) es lo único que manipula DOM y CSSOM. El controlador (`js/controller/`) escucha eventos y coordina.
- **Vinculación moderna.** JS con `<script type="module">`; CSS con `@import` en capas (`@layer reset, tokens, base, layout, componentes`), de modo que la cascada la ordenan las capas y no la especificidad.
- **HTML semántico.** `header`, `nav`, `main`, `article` y `section` con su encabezado por estrofa. El HTML repetible (elemento del índice, soneto, estrofa) vive en `<template>` y no en cadenas de JS.
- **Selección en CSS.** Clases con nombres tipo BEM, anidamiento nativo, `:focus-visible`, y estados con atributos (`[aria-current="page"]`). JS se engancha por `id` y `data-campo`, nunca por las clases de estilo, así que se puede restilizar sin romper el código.
- **JS ↔ DOM/CSSOM.** La vista clona plantillas y rellena con `textContent`. Con el CSSOM, `style.setProperty` fija `--tamano-lectura` y `--orden`; el CSS hace el resto.
- **Interacción.** Los sonetos se eligen con enlaces de hash (`#a-una-nariz`): funcionan "Atrás" y los enlaces directos. Al elegir uno, el foco pasa al soneto. Hay enlace de salto, anterior/siguiente, tamaño de texto recordado en `localStorage`, y `prefers-reduced-motion` respetado (la única animación es la aparición escalonada de las estrofas).
