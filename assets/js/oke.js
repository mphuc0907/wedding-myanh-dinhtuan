document.addEventListener('DOMContentLoaded', function () {
    const html = document.documentElement;

    /* ========== CỬA MỞ ========== */
    const overlay = document.getElementById('door-overlay');


    function openDoor() {
        if (!overlay || overlay.classList.contains('door-open')) return;

        overlay.classList.add('door-open');

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }

    // tự mở cửa sau 500ms và bỏ khựng scroll ngay
    setTimeout(openDoor, 500);

    // Auto-click music button sau 500ms
    const openMusic = document.getElementById('music-toggle');
    if (openMusic) {
        setTimeout(() => {
            openMusic.click();
        }, 500);
    }

    /* ========== NHẠC NỀN ========== */
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;
    let hasStarted = false; // đã từng cố play sau tương tác chưa

    if (music) {
        music.loop = true;
    }

    function updateMusicIcon() {
        if (!musicToggle) return;
        musicToggle.classList.toggle('is-playing', isPlaying);
    }

    // chỉ gọi khi có tương tác người dùng
    function tryStartMusic() {
        if (!music || hasStarted) return;

        hasStarted = true;
        music.muted = false; // có thể để true nếu muốn vào là không nghe gì

        const p = music.play();
        if (p && p.then) {
            p.then(() => {
                isPlaying = true;
                updateMusicIcon();

                // khi đã phát được thì bỏ listener để khỏi gọi lại
                removeInteractionListeners();
            }).catch(err => {
                console.warn('Không phát được nhạc:', err);
            });
        }
    }

    function addInteractionListeners() {
        document.addEventListener('click', tryStartMusic, { once: false });
        document.addEventListener('touchstart', tryStartMusic, { once: false });
        document.addEventListener('scroll', tryStartMusic, { once: false });
        document.addEventListener('keydown', tryStartMusic, { once: false });
    }

    function removeInteractionListeners() {
        document.removeEventListener('click', tryStartMusic);
        document.removeEventListener('touchstart', tryStartMusic);
        document.removeEventListener('scroll', tryStartMusic);
        document.removeEventListener('keydown', tryStartMusic);
    }

    // bật lắng nghe tương tác sau khi trang load 1 tí (cho cửa mở xong)
    setTimeout(addInteractionListeners, 1000);



    /* ========== NÚT BẬT/TẮT NHẠC ========== */
    if (music && musicToggle) {
        musicToggle.addEventListener('click', () => {
            // nếu chưa từng play, click nút cũng được tính là tương tác đầu
            if (!hasStarted) {
                tryStartMusic();
                return;
            }

            if (!isPlaying) {
                music.play();
                isPlaying = true;
            } else {
                music.pause();
                isPlaying = false;
            }
            updateMusicIcon();
        });
    }



    /* ========== TRÁI TIM RƠI ========== */
    const heartContainer = document.getElementById('heart-container');

    function createHeart() {
        if (!heartContainer) return;

        const heart = document.createElement('span');
        heart.className = 'heart';

        const size = 14 + Math.random() * 10;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        heart.style.left = Math.random() * 100 + 'vw';

        const duration = 5 + Math.random() * 3;
        heart.style.animationDuration = duration + 's';

        heartContainer.appendChild(heart);

        setTimeout(() => heart.remove(), (duration * 1000) + 500);
    }

    // cho tim rơi nhẹ nhàng sau khi cửa mở
    setTimeout(() => {
        setInterval(createHeart, 1500);
    }, 1500);
});