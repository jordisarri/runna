/**
 * Zona retirada del joc (l'original és a art/arxiu/esglesia_nova.js). Es manté aquest fitxer buit només perquè
 * els navegadors que encara tenen una versió antiga del joc a la memòria cau (que la demanen) no es trenquin
 * mentre s'actualitzen. Cap versió nova del joc no el carrega.
 */
class ZonaEsglesiaNova extends ZonaBase {
    constructor() { super('ZonaEsglesiaNova', { nom: 'Santuari', amplada: 800, alcada: 800, colorFons: '#140e0a', pacifica: true, entrades: { porta: { x: 400, y: 700, dir: 'amunt' } } }); }
    construir() { this.canviarZona('ZonaEsglesia', 'placa'); }
}
