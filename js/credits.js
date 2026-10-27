/**
 * CRÈDITS: després de l'epíleg. Text que puja sobre fons negre amb ocells daurats; en acabar (o tocant), torna al Santuari.
 */
const CREDITS = [
    ['RUNNA', 64, '#ffe08a'],
    ["La llegenda de l'Ocellaire", 30, '#e0c8ff'],
    ['', 30],
    ['El Santuari torna a cantar.', 26, '#fff8e7'],
    ['', 40],
    ['PERSONATGES', 28, '#ffe08a'],
    ["L'Ineu, novici", 24], ['El Pare Jordi', 24], ['El Germà Andreu', 24], ["L'Ocellaire, l'Home de la Gàbia", 24],
    ["L'Huri, el Flami i el Sardi", 24], ['La Pianista', 24], ['El Pare Daniel i el Pare Alcuí', 24], ['El Germà Francesc', 24],
    ['Les sacerdotesses Pains, Phili i Charm', 24], ['Les Venerables Sàvies', 24], ['El Frederic, en Josep i el Garf', 24], ["L'Isidre, la Jaumeta i la Sansa", 24],
    ['El Siscu i la Carmen', 24], ["L'Eva de la Taverna", 24], ['En Jordi de la Caseta', 24], ["L'ombra del monjo", 24],
    ['', 40],
    ['GRÀCIES PER JUGAR', 30, '#ffe08a'],
    ['', 20],
    ['La foscor tem la llum...', 26, '#e0c8ff'],
    ['però més encara el riure!', 30, '#fff8e7'],
    ['', 80],
    ['FI', 56, '#ffe08a']
];

class EscenaCredits extends Phaser.Scene {
    constructor() { super('Credits'); }

    create() {
        this.cameras.main.setBackgroundColor('#06040a');
        Joc.iniciarMusica(this, 0, 'musica_credits');
        this.cameras.main.fadeIn(1200, 0, 0, 0);
        // Ocells daurats que volen de costat a costat
        for (let k = 0; k < 7; k++) {
            const o = this.add.image(-60, 120 + k * 150, 'ocell').setTintFill(0xffe08a).setAlpha(0.3);
            o.setScale(50 / o.height);
            this.tweens.add({ targets: o, x: AMPLE + 60, y: o.y - 60, duration: 9000 + k * 1300, delay: k * 900, repeat: -1 });
        }
        const c = this.add.container(AMPLE / 2, ALT + 40);
        let y = 0;
        CREDITS.forEach(([t, mida, color]) => {
            if (t) c.add(this.add.text(0, y, t, estilText(mida, color || '#d8ccb8', { align: 'center', fontStyle: mida > 28 ? 'bold' : 'normal' })).setOrigin(0.5, 0));
            y += mida * 1.6;
        });
        const final = ALT / 2 - y + 40;            // el «FI» es queda al mig
        this.tweens.add({ targets: c, y: final, duration: 38000, ease: 'Linear', onComplete: () => this.potSortir() });
        this.time.delayedCall(4000, () => {             // (no es salta sense voler en arribar)
            this.input.once('pointerdown', () => this.sortir());
            this.input.keyboard.once('keydown', () => this.sortir());
        });
    }

    potSortir() {
        const t = this.add.text(AMPLE / 2, ALT - 90, 'Toca per continuar', estilText(22, '#9a8ab0', { fontStyle: 'italic' })).setOrigin(0.5);
        this.tweens.add({ targets: t, alpha: 0.3, yoyo: true, repeat: -1, duration: 800 });
    }

    sortir() {
        if (this.sortint) return;
        this.sortint = true;
        this.cameras.main.fadeOut(900, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => Joc.continuar(this));
    }
}
