/**
 * EFECTES DE SO SINTETITZATS (Web Audio, sense arxius)
 * Cada so es fabrica amb oscil·ladors i soroll filtrat. Sfx.<nom>() és segur de cridar sempre:
 * si el navegador encara no deixa sonar (cal un gest) o no hi ha Web Audio, no fa res.
 */
const Sfx = {
    ctx: null,
    mestre: null,
    soroll: null,
    ultim: {},

    init() {
        if (this.mestre) return true;
        const c = (typeof game !== 'undefined' && game.sound && game.sound.context) || null;
        if (!c) return false;
        this.ctx = c;
        const comp = c.createDynamicsCompressor();
        const g = c.createGain();
        g.gain.value = 0.7;
        g.connect(comp);
        comp.connect(c.destination);
        this.mestre = g;
        const b = c.createBuffer(1, c.sampleRate, c.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        this.soroll = b;
        return true;
    },

    // Evita apilar el mateix so massa seguit i no sona mentre el navegador té l'àudio bloquejat
    ok(nom, minMs = 30) {
        if (!this.init()) return false;
        if (this.ctx.state !== 'running') return false;
        const t = performance.now();
        if (t - (this.ultim[nom] || 0) < minMs) return false;
        this.ultim[nom] = t;
        return true;
    },

    // To amb envolupant; la freqüència llisca de f1 a f2
    to(f1, f2, dur, tipus = 'sine', vol = 0.3, retard = 0) {
        const c = this.ctx, t = c.currentTime + retard;
        const o = c.createOscillator(), g = c.createGain();
        o.type = tipus;
        o.frequency.setValueAtTime(f1, t);
        o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.mestre);
        o.start(t); o.stop(t + dur + 0.02);
    },

    // Soroll filtrat; el filtre llisca de f1 a f2
    xiu(dur, vol, filtre, f1, f2, q = 1, retard = 0) {
        const c = this.ctx, t = c.currentTime + retard;
        const s = c.createBufferSource();
        s.buffer = this.soroll;
        s.playbackRate.value = 0.8 + Math.random() * 0.4;
        const f = c.createBiquadFilter(), g = c.createGain();
        f.type = filtre; f.Q.value = q;
        f.frequency.setValueAtTime(f1, t);
        f.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + Math.min(0.02, dur / 3));
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        s.connect(f); f.connect(g); g.connect(this.mestre);
        s.start(t, Math.random() * 0.5, dur + 0.05);
    },

    // ---------- Combat ----------
    atac(runna) {
        if (!this.ok('atac', 60)) return;
        this.xiu(0.16, 0.34, 'bandpass', 500, 2600, 1.2);
        this.to(260, 120, 0.1, 'triangle', 0.1);
        if (runna) { this.to(1100, 1900, 0.18, 'sine', 0.1); this.to(1650, 2600, 0.14, 'sine', 0.06, 0.03); }
    },
    cop(forta) {
        if (!this.ok('cop', 25)) return;
        this.to(forta ? 200 : 160, 55, forta ? 0.18 : 0.13, 'sine', 0.5);
        this.xiu(0.07, 0.4, 'highpass', 1800, 900);
        this.to(900, 260, 0.06, 'square', 0.12);
    },
    derrota() {
        if (!this.ok('derrota', 80)) return;
        this.to(620, 130, 0.38, 'triangle', 0.26);
        this.to(310, 70, 0.3, 'sine', 0.3, 0.04);
        this.xiu(0.35, 0.22, 'lowpass', 1800, 200);
        [1568, 1976, 2349].forEach((f, i) => this.to(f, f * 1.3, 0.12, 'sine', 0.07, 0.05 + i * 0.05));
    },
    ferit() {
        if (!this.ok('ferit', 120)) return;
        this.to(330, 80, 0.28, 'sawtooth', 0.26);
        this.to(120, 50, 0.22, 'sine', 0.5);
        this.xiu(0.12, 0.35, 'lowpass', 1400, 200);
    },
    corPerdut() {
        if (!this.ok('corPerdut', 150)) return;
        this.xiu(0.08, 0.3, 'highpass', 3000, 2000, 1, 0.04);       // el vidre es trenca
        [2093, 2637, 3136, 3520, 2794].forEach((f, i) => this.to(f, f * 0.8, 0.14, 'sine', 0.09, 0.05 + i * 0.035));
        this.to(220, 150, 0.35, 'triangle', 0.14, 0.12);
    },
    escut() {
        if (!this.ok('escut', 120)) return;
        this.to(880, 1320, 0.16, 'triangle', 0.18);
        this.to(1760, 2640, 0.2, 'sine', 0.08, 0.04);
    },
    carrega() {                  // l'enemic apunta (avís abans de carregar)
        if (!this.ok('carrega', 200)) return;
        this.to(180, 640, 0.4, 'sawtooth', 0.1);
        this.xiu(0.4, 0.08, 'bandpass', 300, 1500, 2);
    },
    puf() {
        if (!this.ok('puf', 60)) return;
        this.xiu(0.4, 0.16, 'lowpass', 1400, 150, 0.7);
    },
    salt() {
        if (!this.ok('salt', 150)) return;
        this.to(160, 420, 0.14, 'sine', 0.22);
    },
    be() {                       // el Pastor crida el ramat
        if (!this.ok('be', 400)) return;
        this.to(420, 300, 0.5, 'sawtooth', 0.1);
        this.to(430, 330, 0.5, 'square', 0.04);
    },
    talla() {                    // esbarzer tallat
        if (!this.ok('talla', 80)) return;
        this.xiu(0.14, 0.3, 'highpass', 2500, 1200);
        this.to(500, 180, 0.12, 'sawtooth', 0.12);
    },
    basto() {                    // el bàcul de l'Ocellaire que gira: un vuit-vuit d'aire
        if (!this.ok('basto', 140)) return;
        this.xiu(0.13, 0.16, 'bandpass', 380, 900, 3);
    },
    xiscle() {                   // els ocells de foc es llancen
        if (!this.ok('xiscle', 300)) return;
        this.to(1400, 2600, 0.18, 'sawtooth', 0.06);
        this.to(1900, 3200, 0.22, 'square', 0.03, 0.08);
        this.xiu(0.25, 0.1, 'highpass', 3000, 1800);
    },
    flama() {                    // un ocell de foc que s'apaga
        if (!this.ok('flama', 60)) return;
        this.xiu(0.22, 0.14, 'lowpass', 2400, 300, 0.8);
    },
    ratpenat() {                 // xisclet agut
        if (!this.ok('ratpenat', 250)) return;
        this.to(3200, 4200, 0.07, 'square', 0.03); this.to(3600, 4600, 0.06, 'square', 0.025, 0.09);
    },
    ferralla() {                 // ferros que piquen a terra
        if (!this.ok('ferralla', 120)) return;
        this.to(1800, 1500, 0.12, 'square', 0.05); this.to(2600, 2300, 0.09, 'triangle', 0.06, 0.03);
        this.xiu(0.1, 0.18, 'highpass', 4000, 2500);
    },
    tambor(fort) {               // tambor de guerra del combat final
        if (!this.ok('tambor', 90)) return;
        this.to(fort ? 95 : 80, 38, fort ? 0.45 : 0.32, 'sine', fort ? 0.55 : 0.4);
        this.xiu(0.12, fort ? 0.2 : 0.12, 'lowpass', 600, 120);
    },
    rugit() {                    // l'Ocellaire crida: veu greu i un xiscle d'ocell a sobre
        if (!this.ok('rugit', 600)) return;
        this.to(140, 60, 1.1, 'sawtooth', 0.22); this.to(146, 55, 1.1, 'square', 0.08);
        this.xiu(1.0, 0.25, 'bandpass', 900, 200, 1.5);
        this.to(2200, 3400, 0.5, 'sawtooth', 0.04, 0.2);
    },
    riure() {                    // els nens riuen: tres pujades alegres
        if (!this.ok('riure', 500)) return;
        [0, 0.16, 0.32, 0.5].forEach((t, i) => this.to(620 + i * 60, 820 + i * 60, 0.11, 'triangle', 0.12, t));
    },
    orgue(notes, durada = 0.6) { // acord d'orgue: notes en Hz, totes alhora
        if (!this.ok('orgue', 200)) return;
        notes.forEach(f => { this.to(f, f, durada, 'sawtooth', 0.04); this.to(f * 2, f * 2, durada, 'sine', 0.05); });
    },
    cura() {
        if (!this.ok('cura', 150)) return;
        [523, 659, 784, 1047].forEach((f, i) => this.to(f, f, 0.22, 'sine', 0.14, i * 0.07));
    },

    // ---------- Món i interfície ----------
    pas(fort) {
        if (!this.ok('pas', 120)) return;
        this.xiu(0.05, fort ? 0.12 : 0.07, 'lowpass', 700 + Math.random() * 400, 200);
    },
    porta() {
        if (!this.ok('porta', 300)) return;
        this.to(95, 60, 0.18, 'sine', 0.35);
        this.xiu(0.3, 0.14, 'lowpass', 900, 150);
    },
    objecte() {
        if (!this.ok('objecte', 200)) return;
        [659, 880, 1319].forEach((f, i) => this.to(f, f, 0.25, 'triangle', 0.16, i * 0.09));
    },
    fanfara() {                  // l'Ineu alça una arma nova: arpegi de Mi major que s'obre en un acord llarg, amb campaneta
        if (!this.ok('fanfara', 1500)) return;
        [330, 415, 494, 659].forEach((f, i) => this.to(f, f, 0.3, 'triangle', 0.16, i * 0.11));
        [330, 415, 494, 659, 988].forEach(f => { this.to(f, f, 1.6, 'triangle', 0.09, 0.48); this.to(f * 2, f * 2, 1.2, 'sine', 0.04, 0.48); });
        this.to(1319, 1319, 1.4, 'sine', 0.08, 0.5);
    },
    secret() {                   // descobriment: una porta amagada s'obre, un mecanisme encaixa
        if (!this.ok('secret', 1500)) return;
        this.to(70, 45, 0.9, 'sine', 0.3);                          // retruny de pedra
        this.xiu(0.9, 0.12, 'lowpass', 600, 90, 0.8);
        [440, 523, 659, 831, 988, 1319].forEach((f, i) => this.to(f, f, 0.28, 'triangle', 0.13, 0.25 + i * 0.1));
        [1760, 2217].forEach((f, i) => this.to(f, f * 1.01, 0.6, 'sine', 0.06, 0.85 + i * 0.08));   // espurneig final
    },
    lletra() {                   // veu del diàleg: un petit tic per cada dues lletres
        if (!this.ok('lletra', 45)) return;
        this.to(300 + Math.random() * 90, 260, 0.035, 'square', 0.025);
    },
    pagina() {
        if (!this.ok('pagina', 100)) return;
        this.to(520, 720, 0.07, 'triangle', 0.08);
    },
    menu() {
        if (!this.ok('menu', 40)) return;
        this.to(700, 900, 0.05, 'triangle', 0.08);
    },
    tria() {
        if (!this.ok('tria', 80)) return;
        this.to(520, 520, 0.08, 'triangle', 0.1);
        this.to(780, 780, 0.14, 'triangle', 0.1, 0.07);
    }
};
