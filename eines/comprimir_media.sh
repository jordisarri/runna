#!/bin/sh
# Redueix el pes dels vídeos de la intro i de les músiques (cal ffmpeg).
#   sh eines/comprimir_media.sh
# Vídeos: H.264 sense àudio (el joc els fa sonar muts), faststart perquè comencin abans d'acabar de baixar.
# Músiques: AAC 96 kbps en .m4a (funciona a tots els navegadors), sense la portada incrustada.
# Els originals queden a art/ (art/video/) i art/musica/ (mp3).
cd "$(dirname "$0")/.." || exit 1
mkdir -p art/musica
for v in intro_runna_vertical intro_runna_bucle_vertical; do
    src="art/video/$v.mp4"; [ -f "$src" ] || src="assets/video/$v.mp4"
    ffmpeg -v error -y -i "$src" -an -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart "assets/video/$v.tmp.mp4" &&
        mv "assets/video/$v.tmp.mp4" "assets/video/$v.mp4"
done
for m in assets/musica/*.mp3; do
    [ -f "$m" ] || continue
    nom=$(basename "$m" .mp3)
    ffmpeg -v error -y -i "$m" -vn -c:a aac -b:a 96k -movflags +faststart "assets/musica/$nom.m4a" && mv "$m" "art/musica/$nom.mp3"
done
ls -la assets/video assets/musica
