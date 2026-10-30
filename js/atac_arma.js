/**
 * MIDA I AGAFADA DE L'ARMA (igual per a les tres: el moviment de ATAC_ARMA és comú)
 * ARMA_LLARG: llargada de l'arma a pantalla, en píxels de joc, de la punta al pom.
 * agafa: on la té a la mà, com a fracció de la llargada comptant des de la punta (0 = punta, 1 = pom).
 * Es retoquen amb eines/ajust_arma.html (botó "Desa al joc").
 */
const ARMA_LLARG = 115;
const ARMES_ATAC = {
    basto: { clau: 'arma_basto', agafa: 0.82 },
    tiller: { clau: 'arma_tiller', agafa: 0.82 },
    espasa: { clau: 'arma_espasa', agafa: 0.86 }
};

/**
 * POSICIÓ DE L'ARMA DURANT L'ATAC DE L'INEU
 * Les fulles d'atac (assets/ineu/atac_<vista>.webp) mostren l'Ineu sense arma. El joc hi afegeix l'arma
 * (bastó, branca del Til·ler o espasa) com una capa que segueix la mà fotograma a fotograma amb aquesta taula.
 *
 * Una entrada per cada fotograma de ATAC_INEU.fotogrames (els 16 de la fulla, 0-15), en aquest ordre (els 6-11 són interpolats entre el 5 i el 12; es poden retocar amb eines/ajust_arma.html):
 *   { x, y, a, d }  x, y: la mà, en píxels de la cel·la de 256 (els peus de l'Ineu són a x = 128, y = 240)
 *                   a: angle de l'arma en graus (0 = punta cap amunt, positiu = cap a la dreta, en el sentit de les agulles)
 *                   d: true = l'arma es veu per davant del cos; false = per darrere
 *   null            la mà és buida: no es veu l'arma
 * Es retoca amb eines/ajust_arma.html (fa clic al fotograma per moure la mà, roda per girar l'arma) i es desa aquí amb el botó "Desa al joc".
 */
/**
 * ARC DEL COP (l'estela en mitja lluna que surt en atacar): color i radi (px de joc) de cada arma.
 * Es dibuixa a js/combat.js (tallBasto) i es pot veure a eines/ajust_arma.html per saber cap on es mou l'arma.
 */
const ARC_ATAC = {
    basto: { color: '#f5ecd0', R: 108 },
    tiller: { color: '#d8f0b0', R: 118 },
    espasa: { color: '#ffe08a', R: 118 }
};

const ATAC_ARMA = {
    down: [{ x: 49.98, y: 123.12, a: 0, d: true }, { x: 67.05, y: 47.54, a: 60, d: false }, { x: 73.14, y: 37.79, a: 60, d: false }, { x: 57.3, y: 138.97, a: 330, d: true }, { x: 97.52, y: 202.36, a: 125, d: true }, { x: 95.09, y: 196.27, a: 125, d: true }, { x: 90.04, y: 190.35, a: 122.14, d: true }, { x: 84.99, y: 184.43, a: 119.29, d: true }, { x: 79.94, y: 178.51, a: 116.43, d: true }, { x: 74.88, y: 172.58, a: 113.57, d: true }, { x: 69.83, y: 166.66, a: 110.71, d: true }, { x: 64.78, y: 160.74, a: 107.86, d: true }, { x: 59.73, y: 154.82, a: 105, d: true }, { x: 58.51, y: 157.26, a: 100, d: true }, { x: 58.51, y: 153.6, a: 85, d: true }, { x: 64.61, y: 154.82, a: 75, d: true }],
    up: [{ x: 184.32, y: 65.34, a: 260, d: false }, { x: 193.58, y: 64.37, a: 310, d: false }, { x: 194.07, y: 68.27, a: 5, d: false }, { x: 195.54, y: 65.34, a: 35, d: false }, { x: 225.28, y: 81.43, a: 70, d: false }, { x: 214.06, y: 99.96, a: 45, d: false }, { x: 203.82, y: 97.04, a: 16.430000000000007, d: false }, { x: 177.01, y: 48.27, a: 352.86, d: false }, { x: 52.66, y: 127.76, a: 309.28999999999996, d: false }, { x: 66.8, y: 138.48, a: 305.71000000000004, d: false }, { x: 55.59, y: 128.73, a: 287.14, d: false }, { x: 56.08, y: 135.56, a: 258.56999999999994, d: false }, { x: 100.45, y: 105.81, a: 240, d: false }, { x: 106.79, y: 65.83, a: 235, d: false }, { x: 153.11, y: 51.2, a: 240, d: false }, { x: 162.13, y: 74.36, a: 260, d: true }],
    left: [{ x: 118.25, y: 93.87, a: 0, d: false }, { x: 159.7, y: 14.63, a: 60, d: false }, { x: 168.23, y: 10.97, a: 90, d: false }, { x: 56.08, y: 47.54, a: 55, d: false }, { x: 84.11, y: 131.66, a: 305, d: false }, { x: 85.33, y: 128, a: 280, d: false }, { x: 87.07, y: 130.26, a: 284.29, d: false }, { x: 88.81, y: 132.53, a: 288.57, d: false }, { x: 90.55, y: 134.79, a: 292.86, d: false }, { x: 92.3, y: 137.06, a: 297.14, d: false }, { x: 94.04, y: 139.32, a: 301.43, d: false }, { x: 95.78, y: 141.59, a: 305.71, d: false }, { x: 97.52, y: 143.85, a: 310, d: false }, { x: 97.52, y: 146.29, a: 330, d: false }, { x: 95.09, y: 145.07, a: 345, d: false }, { x: 95.09, y: 146.29, a: 355, d: false }],
    right: [{ x: 164.57, y: 129.22, a: 10, d: false }, { x: 126.78, y: 53.64, a: 320, d: false }, { x: 108.5, y: 40.23, a: 345, d: false }, { x: 210.9, y: 121.9, a: 55, d: false }, { x: 197.49, y: 149.94, a: 80, d: false }, { x: 199.92, y: 151.16, a: 85, d: false }, { x: 192.43, y: 152.73, a: 82.86, d: false }, { x: 184.94, y: 154.29, a: 80.71, d: false }, { x: 177.45, y: 155.86, a: 78.57, d: false }, { x: 169.97, y: 157.43, a: 76.43, d: false }, { x: 162.48, y: 159, a: 74.29, d: false }, { x: 154.99, y: 160.56, a: 72.14, d: false }, { x: 147.5, y: 162.13, a: 70, d: false }, { x: 147.5, y: 163.35, a: 55, d: false }, { x: 148.72, y: 160.91, a: 35, d: false }, { x: 147.5, y: 164.57, a: 10, d: false }],
    southwest: [{ x: 74.36, y: 85.33, a: 335, d: false }, { x: 99.96, y: 17.07, a: 45, d: false }, { x: 119.47, y: 7.31, a: 80, d: false }, { x: 39.01, y: 91.43, a: 325, d: false }, { x: 69.49, y: 168.23, a: 245, d: false }, { x: 69.49, y: 163.35, a: 245, d: false }, { x: 71.93, y: 157.26, a: 252.14, d: false }, { x: 74.36, y: 151.16, a: 259.29, d: false }, { x: 76.8, y: 145.07, a: 266.43, d: false }, { x: 79.24, y: 138.97, a: 273.57, d: true }, { x: 81.68, y: 132.88, a: 280.71, d: true }, { x: 84.11, y: 126.78, a: 287.86, d: true }, { x: 86.55, y: 120.69, a: 295, d: true }, { x: 84.11, y: 120.69, a: 335, d: true }, { x: 82.9, y: 118.25, a: 355, d: true }, { x: 80.46, y: 119.47, a: 0, d: true }],
    southeast: [{ x: 88.99, y: 141.41, a: 10, d: true }, { x: 70.7, y: 52.42, a: 335, d: true }, { x: 74, y: 37, a: 320, d: true }, { x: 156, y: 131, a: 55, d: true }, { x: 167, y: 179, a: 115, d: true }, { x: 168.23, y: 175.54, a: 110, d: false }, { x: 157.08, y: 173.62, a: 107.14, d: false }, { x: 145.94, y: 171.71, a: 104.29, d: false }, { x: 134.79, y: 169.79, a: 101.43, d: false }, { x: 123.65, y: 167.88, a: 98.57, d: true }, { x: 112.5, y: 165.96, a: 95.71, d: true }, { x: 101.36, y: 164.05, a: 92.86, d: true }, { x: 90.21, y: 162.13, a: 90, d: true }, { x: 82.9, y: 164.57, a: 70, d: true }, { x: 90.21, y: 165.79, a: 60, d: true }, { x: 87.77, y: 167.01, a: 50, d: true }],
    northwest: [{ x: 140.19, y: 56.08, a: 30, d: false }, { x: 174.32, y: 18.29, a: 40, d: false }, { x: 173.1, y: 18.29, a: 55, d: false }, { x: 70.7, y: 71.92, a: 15, d: false }, { x: 81.92, y: 95.09, a: 320, d: false }, { x: 88.26, y: 96.06, a: 275, d: false }, { x: 97.52, y: 93.14, a: 266.43000000000006, d: false }, { x: 95.09, y: 89.23, a: 267.86, d: false }, { x: 98.5, y: 90.7, a: 269.29, d: false }, { x: 98.99, y: 94.6, a: 270.71, d: false }, { x: 109.23, y: 89.72, a: 282.14, d: false }, { x: 114.59, y: 81.92, a: 288.56999999999994, d: false }, { x: 114.1, y: 80.46, a: 275, d: false }, { x: 124.34, y: 92.16, a: 295, d: false }, { x: 140.19, y: 95.09, a: 330, d: false }, { x: 134.1, y: 95.09, a: 0, d: false }],
    northeast: [{ x: 188.95, y: 143.85, a: 5, d: false }, { x: 158.48, y: 70.7, a: 355, d: true }, { x: 138.97, y: 58.51, a: 340, d: true }, { x: 213.33, y: 114.59, a: 30, d: false }, { x: 196.27, y: 141.41, a: 75, d: false }, { x: 201.14, y: 141.41, a: 60, d: false }, { x: 198.35, y: 144.2, a: 57.86, d: false }, { x: 195.57, y: 146.98, a: 55.71, d: false }, { x: 192.78, y: 149.77, a: 53.57, d: false }, { x: 190, y: 152.55, a: 51.43, d: false }, { x: 187.21, y: 155.34, a: 49.29, d: false }, { x: 184.43, y: 158.12, a: 47.14, d: false }, { x: 181.64, y: 160.91, a: 45, d: false }, { x: 176.76, y: 158.48, a: 30, d: false }, { x: 180.42, y: 160.91, a: 20, d: false }, { x: 176.76, y: 160.91, a: 5, d: false }]
};

/**
 * AJUSTOS FINS PER ARMA I FOTOGRAMA (sobre la taula comuna ATAC_ARMA)
 * Per a cada arma ('basto', 'tiller', 'espasa') i vista, una entrada per fotograma (com a ATAC_ARMA):
 *   { dx, dy, a, e, d }  desplaçament de la mà (px de la cel·la de 256), gir afegit (graus), factor de mida de l'arma
 *                   i, si hi és, d: true/false per posar-la davant/darrere de l'Ineu en lloc d'usar el de ATAC_ARMA
 *   null              sense ajust: l'arma fa el que diu ATAC_ARMA
 * Es fa amb eines/ajust_arma.html (mode "Només aquesta arma") i es desa amb el botó "Desa al joc".
 */
const ATAC_AJUST = {
    basto: {},
    tiller: {},
    espasa: {}
};
