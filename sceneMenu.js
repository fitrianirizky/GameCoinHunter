// ============================================================================
// SCENE GAME OVER
// ============================================================================
var sceneGameOver = new Phaser.Class({
    extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {
            key: "sceneGameOver"
        });
    },
    preload: function() {
        // Mengatur base URL untuk aset
        this.load.setBaseURL('assets/');
        // Memuat aset yang dibutuhkan oleh sceneGameOver
        this.load.image("background", "images/BG.png");
        this.load.image("btn_play", "images/ButtonPlay.png");
        this.load.image("gameover", "images/GameOver.png");
        this.load.audio("snd_touch", "audio/touch.mp3");
    },
    create: function() {
        // Inisialisasi variabel posisi relatif terhadap ukuran kamera
        var X_POSITION = {
            'LEFT': 0,
            'CENTER': this.cameras.main.width / 2,
            'RIGHT': this.cameras.main.width,
        };
        var Y_POSITION = {
            'TOP': 0,
            'CENTER': this.cameras.main.height / 2,
            'BOTTOM': this.cameras.main.height,
        };

        // Menambahkan sprite background ke dalam game dan menempatkannya di tengah
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background').setScale(2);

        // Menambahkan lapisan gelap yang menutupi seluruh layar
        var darkenLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
            this.cameras.main.width, this.cameras.main.height, 0x000000);
        darkenLayer.setDepth(10);
        darkenLayer.alpha = 0.75; // Sudah gelap saat scene dimulai

        // Menambahkan gambar "Game Over"
        let gameOverImage = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 160, 'gameover');
        gameOverImage.setDepth(20); // Menempatkan di atas lapisan gelap

        // Menambahkan tombol play ulang
        let restartButton = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 110, 'btn_play');
        restartButton.setDepth(20); // Menempatkan di atas lapisan gelap
        restartButton.setInteractive(); // Mengaktifkan interaktivitas

        // Menambahkan teks "RESTART" pada tombol
        var restartText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER + 110, 'RESTART', {
            fontFamily: 'Verdana, Arial',
            fontSize: '32px',
            color: '#ffffff'
        });
        restartText.setOrigin(0.5);
        restartText.setDepth(21);

        // Memuat sound efek sentuhan
        this.snd_touch = this.sound.add('snd_touch');

        // Event listener untuk tombol restart
        restartButton.on('pointerdown', () => {
            restartButton.setTint(0x5a5a5a); // Mengubah warna tombol saat ditekan
            restartText.setTint(0x5a5a5a); // Mengubah warna teks saat ditekan
        });
        restartButton.on('pointerout', () => {
            restartButton.clearTint(); // Mengembalikan warna tombol ke normal
            restartText.clearTint(); // Mengembalikan warna teks ke normal
        });
        restartButton.on('pointerup', () => {
            restartButton.clearTint(); // Mengembalikan warna tombol ke normal
            restartText.clearTint(); // Mengembalikan warna teks ke normal
            this.snd_touch.play(); // Memainkan sound efek sentuhan
            this.scene.start('scenePlay'); // Memulai ulang scenePlay
        });
    }
});