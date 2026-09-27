#!/usr/bin/env bash
# Перекодирует исходники из корня проекта в site/public/video. Запуск: bash tools/encode.sh
set -e
cd "$(dirname "$0")/.."
O=site/public/video; mkdir -p $O
FIT="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
X264="-an -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart"
V="$X264 -vf $FIT"
dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
poster() { ffmpeg -v error -y -i "$1" -frames:v 1 -vf scale=1280:-2 -q:v 5 "$2"; }

# обычные клипы + реверс для прокрутки назад
ffmpeg -v error -y -i video_preloader.mp4 $V -crf 27 $O/preloader.mp4
for p in "1-2:t12" "2-3:t23"; do s=${p%%:*}; d=${p##*:}
  ffmpeg -v error -y -i "$s.mp4" $V -crf 27 $O/$d.mp4
  ffmpeg -v error -y -i "$s.mp4" $X264 -vf "reverse,$FIT" -crf 27 $O/${d}_rev.mp4
done

# лупы: хвост кроссфейдом наезжает на начало — файл зациклен без шва
loop() { L=$(dur "$1"); X=0.8
  ffmpeg -v error -y -i "$1" -filter_complex \
  "[0:v]fps=60,settb=AVTB,split[a][b];[a]trim=start=$X,setpts=PTS-STARTPTS[m];[b]trim=0:$X,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=$X:offset=$(python -c "print($L-2*$X)"),$FIT[v]" \
  -map "[v]" $X264 -crf 28 "$2"; }
loop Hero_loop.mp4 $O/hero.mp4
loop "3 section.mp4" $O/beach.mp4

# скраб: ключевой кадр каждые 4 кадра — файл целиком в памяти, перемотка назад декодирует максимум 3 кадра
ffmpeg -v error -y -i "2 section_scrub video.mp4" $X264 -vf "$FIT,fps=30" -x264-params keyint=4:min-keyint=1:scenecut=0 -bf 0 -crf 26 $O/scrub.mp4

poster $O/hero.mp4 $O/hero.jpg; poster $O/preloader.mp4 $O/preloader.jpg
ls -la $O
