import { AlmacenSonetos } from './model/AlmacenSonetos.js';
import { PreferenciasLectura } from './model/PreferenciasLectura.js';
import { VistaSonetos } from './view/VistaSonetos.js';
import { ControladorSonetos } from './controller/ControladorSonetos.js';

new ControladorSonetos(new AlmacenSonetos(), new PreferenciasLectura(), new VistaSonetos()).iniciar();
