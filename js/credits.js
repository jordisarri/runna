/**
 * CRÈDITS: després de l'epíleg. Text que puja sobre fons negre amb ocells daurats; en acabar (o tocant), torna al Santuari.
 */
const CREDITS = [
    ['RUNNA', 64, '#ffe08a'],
    ["L'espasa del Miracle", 30, '#e0c8ff'],
    ['', 30],
    ['El Santuari torna a cantar.', 26, '#fff8e7'],
    ['', 40],
    ['PERSONATGES', 28, '#ffe08a'],
    ["L'Ineu, novici", 24], ['El Pare Jordà', 24], ['El Germà Aldreu', 24], ["L'Ocellaire, l'Home de la Gàbia", 24],
    ["L'Huri, el Fram i el Sardi", 24], ['La Pianista', 24], ['El Pare Nadiel i el Pare Alcoví', 24], ['El Germà Francí', 24],
    ['Les sacerdotesses Dolora, Pilària i Carmèlia', 24], ['Les Venerables Sàvies', 24], ['El Senyor Pomers, en Julius, en Jusef i el Galf', 24], ['La Meus i el senyor Molner', 24], ['La Carry i el Pallofa', 24], ["L'Isílder, la Joaneta i la Rosansa", 24],
    ['L\'Iscu', 24], ["L\'Eve i la Càren, de la Taverna", 24], ['En Georgi de la Caseta', 24], ['La Nena de les Trenes', 24], ['Els pastors de la Cirosa', 24], ['El Follet del Carro Verd', 24], ['El Gran Til·ler', 24], ["L'ombra del monjo", 24],
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
        this.sortint = false;                 // (l'escena es reaprofita: si es tornen a veure els crèdits, s'ha de poder sortir)
        this.cameras.main.setBackgroundColor('#06040a');
        Joc.iniciarMusica(this, 0, 'musica_credits');
        this.cameras.main.fadeIn(1200, 0, 0, 0);
        // Ocells daurats en posició de vol que creuen la pantalla aletejant
        this.preparaOcellVol();
        for (let k = 0; k < 7; k++) {
            const o = this.add.sprite(-60, 120 + k * 150, 'ocell_vol', k % 4).setAlpha(0.38);
            o.setScale(58 / 90);
            o.play({ key: 'ocell_vol_vola', startFrame: k % 4 });
            this.tweens.add({ targets: o, x: AMPLE + 60, y: o.y - 60, duration: 9000 + k * 1300, delay: k * 900, repeat: -1 });
        }
        const c = this.add.container(AMPLE / 2, ALT + 40);
        let y = 0;
        // Abans del «FI», el que ha completat el jugador
        const linies = CREDITS.slice(), pos = linies.findIndex(l => l[0] === 'GRÀCIES PER JUGAR');
        if (pos >= 0) { const cmp = PROGRES.completat(Estat); linies.splice(pos + 1, 0, ['', 16], ['Has completat el ' + cmp.percent + '% del joc', 26, cmp.percent === 100 ? '#ffe08a' : '#fff8e7']); }
        linies.forEach(([t, mida, color]) => {
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

    preparaOcellVol() {
        const FW = 120, FH = 90;
        if (!this.textures.exists('ocell_vol')) {
            const tex = this.textures.createCanvas('ocell_vol', FW * 4, FH), ctx = tex.getContext();
            const ala = (ox, ang, escala, alfa, color) => {
                ctx.save();
                ctx.translate(ox + 62, 46); ctx.rotate(ang); ctx.globalAlpha = alfa;
                const L = 38 * escala;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.moveTo(-8, 2);
                ctx.quadraticCurveTo(-20 * escala, -L * 0.48, -8 * escala, -L);
                [[-3, -L + 6], [2, -L - 2], [7, -L + 7], [12, -L], [16, -L * 0.6]].forEach(([x, y]) => ctx.lineTo(x * escala, y));
                ctx.quadraticCurveTo(16 * escala, -L * 0.25, 9, 2);
                ctx.closePath(); ctx.fill();
                ctx.restore();
            };
            [-0.25, -1.15, -2.15, -1.15].forEach((ang, i) => {
                const ox = i * FW;
                // Ala llunyana
                ala(ox, ang * 0.8 + 0.45, 0.78, 0.65, '#d8b45a');
                // Cua oberta en ventall (posició de vol, sense potes)
                ctx.fillStyle = '#e8c870';
                ctx.beginPath(); ctx.moveTo(ox + 42, 47); ctx.lineTo(ox + 14, 38); ctx.lineTo(ox + 18, 48); ctx.lineTo(ox + 12, 57); ctx.lineTo(ox + 42, 53); ctx.closePath(); ctx.fill();
                // Cos aerodinàmic allargat i cap estirat endavant
                ctx.fillStyle = '#ffe08a';
                ctx.beginPath(); ctx.ellipse(ox + 60, 49, 22, 11, -0.1, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ox + 82, 43, 9.5, 0, Math.PI * 2); ctx.fill();
                // Bec apuntant endavant
                ctx.fillStyle = '#fff2b8';
                ctx.beginPath(); ctx.moveTo(ox + 90, 40); ctx.lineTo(ox + 104, 43); ctx.lineTo(ox + 90, 47); ctx.closePath(); ctx.fill();
                // Ala propera
                ala(ox, ang, 1, 1, '#fff0b0');
            });
            tex.refresh();
            for (let i = 0; i < 4; i++) tex.add(i, 0, i * FW, 0, FW, FH);
        }
        if (!this.anims.exists('ocell_vol_vola')) {
            this.anims.create({ key: 'ocell_vol_vola', frames: [0, 1, 2, 3].map(f => ({ key: 'ocell_vol', frame: f })), frameRate: 10, repeat: -1 });
        }
    }

    potSortir() {
        const t = this.add.text(AMPLE / 2, ALT - 90, 'Toca per tornar al principi', estilText(22, '#9a8ab0', { fontStyle: 'italic' })).setOrigin(0.5);
        this.tweens.add({ targets: t, alpha: 0.3, yoyo: true, repeat: -1, duration: 800 });
    }

    sortir() {
        if (this.sortint) return;
        this.sortint = true;
        this.cameras.main.fadeOut(900, 0, 0, 0);
        // Final del joc: no es continua a l'església. Es tornen a començar les coses des del principi (portada, intro i pròleg), amb una partida nova i sense res desat.
        this.cameras.main.once('camerafadeoutcomplete', () => {
            Estat.esborrar();
            Estat.nova();
            Joc.aturarTot(this);
            const m = this.game.scene;
            if (m.isActive('UI')) m.stop('UI');
            m.start('Titol', { mode: 'intro' });
        });
    }
}
