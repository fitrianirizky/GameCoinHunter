var scenePlay = new Phaser.Class({
    extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, { key: "scenePlay"});
    },
    init: function(){},
    preload: function(){
        this.load.setBaseURL('assets/');
        this.load.image("background", "images/BG.png");
        this.load.image("btn_play", "images/ButtonPlay.png");
        this.load.image("gameover", "images/GameOver.png");
        this.load.image("coin", "images/Koin.png");
        this.load.image("enemy1", "images/Musuh01.png");
        this.load.image("enemy2", "images/Musuh02.png");
        this.load.image("enemy3", "images/Musuh03.png");
        this.load.image("coin_panel", "images/PanelCoin.png");
        this.load.image("ground", "images/Tile50.png");
        this.load.audio("snd_coin", "audio/koin.mp3");
        this.load.audio("snd_lose", "audio/kalah.mp3");
        this.load.audio("snd_jump", "audio/lompat.mp3");
        this.load.audio("snd_leveling", "audio/ganti_level.mp3");
        this.load.audio("snd_walk", "audio/jalan.mp3");
        this.load.audio("snd_touch", "audio/touch.mp3");
        this.load.audio("music_play", "audio/music_play.mp3");
        this.load.spritesheet("char", "images/CharaSpriteAnim.png", {frameWidth: 44.8, frameHeight: 93});
    },
    create: function(){
        //variabel yang digunakan sebagai penentu level yang sedang aktif 
        //sekaligus mengisikan dengan nilai "1"
        var currentLevel = 1;

        //variabel untuk menentukan apabila game sudah dimulai atau belum
        this.gameStarted = false;

        //sound efek
        //menampung sound yang nanti dibunyikan ketika karakter menabrak koin
        this.snd_coin = this.sound.add('snd_coin');
        //menampung sound yang nanti dibunyikan ketika karkater melompat
        this.snd_jump = this.sound.add('snd_jump');
        //menampung sound yang nanti dibunyikan ketika terjadi pergantian level
        this.snd_leveling = this.sound.add('snd_leveling');
        //menampung sound yang nanti dibunyikan ketika karakter menbrak musuh
        this.snd_lose = this.sound.add('snd_lose');
        //menampung sound yang nanti dibunyikan ketika ada tombol yang ditekan
        this.snd_touch = this.sound.add('snd_touch');

        //sound karakter berjalan
        //menampung sound yang nati dibunyikan ketika karakter bergerak
        this.snd_walk = this.sound.add("snd_walk");
        //membuat sound supaya bisa dimainkan secara terus menerus
        this.snd_walk.loop = true;
        //mengatur volume dari sound menjadi 0
        this.snd_walk.setVolume(0);
        //memainkan sound berjalan untuk pertama kali
        this.snd_walk.play();

        //musik
        //menampung musik yang nanti dibunyikan ketika tombol play ditekan
        this.music_play = this.sound.add('music_play');
        //membuat musik supaya bisa dimainkan secara terus menerus
        this.music_play.loop = true;

        //membuat variabel untuk menampung koin
        var countCoin = 0;

        //melakukan inisialisasi pada variabel pembantu
        X_POSITION={
            'LEFT': 0,
            'CENTER': game.canvas.width/2,
            'RIGHT': game.canvas.width/2,
        };
        Y_POSITION={
            'TOP': 0,
            'CENTER': game.canvas.height/2,
            'BOTTOM': game.canvas.height,
        };
        relativeSize={
            'w': ((game.canvas.width - layoutSize.w)/2),
            'h': ((game.canvas.height - layoutSize.h)/2)
        };
        //menampung scene yang sedang aktif
        //ke dalam variabel 'activeScene'
        var activeScene = this;

        //menambahkan sprite background langit biru dan gunung ke dalam game
        //dan menempatkannya ditengah-tengah tampilan game
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');

        //membuat tampilan koin
        //menambhakan tampilan panel koin
        var coinPanel = this.add.image(X_POSITION.CENTER, 30, 'coin_panel');
        coinPanel.setDepth(10);
        //menambahkan tampilan teks coin
        var coinText = this.add.text(X_POSITION.CENTER, 30, '0', {
            fontFamily: 'Verdana, Arial',
            fontSize: '37px',
            color: '#adadad'
        });
        coinText.setOrigin(0.5);
        coinText.setDepth(10);

        var newLevelTransition = function(){
            //memainkan sound efek ketika level berubah
            activeScene.snd_leveling.play();
        
            //menghentikan animasi karakter dan mengatur kecepatan horizontal menjadi 0
            activeScene.player.anims.stop();
            activeScene.player.setVelocityX(0);
            activeScene.player.anims.play('front'); // Memastikan karakter menghadap depan
        
            //animasi untuk memunculkan background gelap-transparan dengan menggunakan tween
            activeScene.tweens.add({
                targets: darkenLayer,
                duration: 250, // Durasi layar menjadi gelap
                alpha: 0.75, // Membuat layar menjadi lebih gelap (sesuaikan nilai alpha sesuai keinginan)
                onComplete: function(){
                    //menambahkan tampilan teks keterangan setelah layar gelap
                    var levelTransitionText = activeScene.add.text(X_POSITION.CENTER, Y_POSITION.CENTER, 'Level '+currentLevel, {
                        fontFamily: 'Verdana, Arial',
                        fontSize: '40px',
                        color: '#ffffff'
                    });
                    levelTransitionText.setOrigin(0.5);
                    levelTransitionText.setDepth(10);
                    levelTransitionText.alpha = 0; // Teks awalnya tidak terlihat
        
                    //animasi untuk memunculkan teks keterangan
                    activeScene.tweens.add({
                        targets: levelTransitionText,
                        duration: 750, // Durasi teks muncul
                        alpha: 1,
                        yoyo: false, // Tidak perlu memudar kembali
                        onComplete: function(){
                            //animasi untuk menyembunyikan background gelap-transparan setelah teks muncul
                            activeScene.tweens.add({
                                delay: 500, // Jeda sebentar sebelum layar kembali terang
                                targets: darkenLayer,
                                duration: 250, // Durasi layar kembali terang
                                alpha: 0,
                                onComplete: function(){
                                    //menghapus dan menghilangkan teks transisi level
                                    levelTransitionText.destroy();
                                    //mengubah nilai variabel 'gamestarted' menjadi 'true' kembali
                                    activeScene.gameStarted = true;
                                    //melanjutkan jeda sistem physics yang terjadi
                                    activeScene.physics.resume();
                                }
                            });
                        }
                    });
                }
            });
        };

        //fungsi untuk mendeteksi ketika terjadi tubrukan antara koin dengan karakter
        var colletCoin = function(player, coin){
            //menambahkan nilai sebanyak 10koin baru ke dalam variabel 'countCoin'
            countCoin += 1;

            //menampilkan jumlah koin pada teks dengan nama 'coinText'
            coinText.setText(countCoin);

            //mengehntikan dan menonaktifkan body (physics) yang terdapat pada objek star.
            //parameter 1, 'true' untuk menonaktifkan body (physics) yang terdapat pada objek
            //parameter 2, 'true' untuk menyembunyikan objek 
            coin.disableBody(true, true);

            //memainkan sound efek koin ketika terjadi tubrukan antara karakter dengan koin
            activeScene.snd_coin.play();

            //mengatur posisi dari emmiter supaya erpindah ke
            //titik posisi dari koin yang menabrak karakter
            activeScene.emmiterCoin.setPosition(coin.x, coin.y);
            //mulai untuk menyebarkan partikel
            activeScene.emmiterCoin.explode();

            if(coins.countActive(true) === 0){
                //menambahkan nilai level sebanyak 1
                currentLevel++;

                //prepareWorld(); >>pindah ke dalam onComplate
                //mengatur volume sound efek berjalan menjadi 0
                activeScene.snd_walk.setVolume(0);
                //mengubah nilai variabel 'gamestarted' menjadi 'false'
                activeScene.gameStarted = false;
                //menjeda semua pergerakan yang terjadi karena physics
                activeScene.physics.pause();
                //menjalankan animasi untuk membuat tampilan dari karakter menjadi ke depan
                activeScene.player.anims.play('turn');
                //animasi untuk memunculkan background gelap-transparan dengan menggunakan tween
                activeScene.tweens.add({
                    delay: 150,
                    targets: darkenLayer,
                    duration: 250,
                    alpha: 0,
                    onComplete: function(){
                        //memanggil fungsi untuk membuat tampilan area bermain dengan level baru
                        //setelah layar hitam terlihat
                        prepareWorld();
                        //memanggil fungsi untuk menjalankan animasi transisi ketika level berganti
                        newLevelTransition();
                    }
                });
            }
        }

        //membuat tampilan sebelum game dimulai
        //menambahkan lapisan gelap dengan menggunakan objek rectangle
        //(sebuah persegi dengan posisi, ukuran dan warna tertentu)
        var darkenLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
            game.canvas.width, game.canvas.height, 0x000000);
        darkenLayer.setDepth(10);
        //mengatur tingkatan transparansi dari lapisan gelap menjadi 0.25 dari 1
        darkenLayer.alpha = 0.25;
        //menambahkan tampilan tombol play
        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'btn_play');
        buttonPlay.setDepth(10);

        buttonPlay.setInteractive();
        //mendeteksi ketika pointer mouse berada di atas area
        //tombol play dan klik kirir pada mouse ditekan
        buttonPlay.on('pointerdown', function(pointer){
            //mengubah tampilan tombol play menjadi gelap
            this.setTint(0x5a5a5a);
        });
        //mendeteksi ketika pointer mouse berada di atas tombol play dan
        //klik kiri pada mouse ditekan sambil menggeser ke luar area tombol
        buttonPlay.on('pointerout', function(pointer){
            //mengubah tampilan tombol play menjadi terang kembali
            this.clearTint();
        });
        //mendeteksi ketika pointer mouse berada di atas tombol play dan
        //klik kiri oada mouse ditekan, kemudian dilepaskan
        buttonPlay.on('pointerup', function(pointer){
            //mengubah tampilan tombol play menjadi terang kembali
            this.clearTint();

            //animasi untuk menghilangkan tampilan tombol play
            //dengan mengubah ukurannya menjadi 0 selama 250 ms
            activeScene.tweens.add({
                targets: this,
                ease: 'Back.In',
                duration: 250,
                scaleX: 0,
                scaleY: 0,
            });
            //animasi untuk menghilangkan tampilan tombol play
            //dengan mengubah ukurannya menjadi 0 selama 250 ms
            //dengan jeda sebelum animasi 150 ms
            activeScene.tweens.add({
                delay: 150,
                targets: darkenLayer,
                duration: 250,
                alpha: 0,
                onComplete: function(){
                    //mengubah nilai variabel menjadi 'true',
                    //sehingga status game terdeteksi sudah dimulai
                    activeScene.gameStarted = true;
                    //melanjutkan jeda sistem physics yang terjadi
                    //semua pergerakan yang terjadi karena physics
                    activeScene.physics.resume();
                }
            });

            //memainkan sound efek
            activeScene.snd_touch.play();
            //memainkan musik
            activeScene.music_play.play();
        });

        //membuat variabel untuk menampung sprite yang nantinya akan diambil datanya 
        let groundTemp = this.add.image(0, 0, 'ground').setVisible(false);
        //membuat variabel untuk menampung ukuran dari tiap gambar pijakan untuk
        //nantinya digunakan untuk membantu menentukan posisi-posisi dari tiap
        //pijakan yang akan ditambahkan ke dalam game
        let groundSize = { 'width': groundTemp.width, 'height': groundTemp.height };

        //membuat group physics yang nantinya akan digunakan untuk 
        //menampung pijakan-pijakan yang tidak akan isa bergerak
        var platforms = this.physics.add.staticGroup();

        var prepareWorld = function(){
            //memastikan untuk membersihkan group yang digunakan untuk menampung pijakan-pijakan
            //yang mungkin sudah penah dibuat
            platforms.clear(true, true);
            
            //membuat 9 buah pijakan yng tersusun rapi, letaknya berada di tepi bawah
            //dan menampungnya ke dalam variabel group penampung dengan nama 'platforms'
            platforms.create(X_POSITION.CENTER - groundSize.width * 4, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 4, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');

            //melakukan pengecekan jika level yang sedang aktif adalah level "1"
            if(currentLevel == 1){
                //membuat pijakan-pijakan tambahan yang posisinya tersebar di layar
                platforms.create(groundTemp.width/2 + relativeSize.w, 384, 'ground');
                platforms.create(400 + relativeSize.w, 424, 'ground');
                platforms.create(1024 - groundTemp.width/2 + relativeSize.w, 480, 'ground');
                platforms.create(600 + relativeSize.w, 584, 'ground');
            }
            //melakukan pengecekan jika level yang sedang aktif adalah level "2"
            else if(currentLevel == 2){
                //membuat pijakan-pijakan tambahan untuk level "2" yang posisinya tersebar di layar
                platforms.create(80 + relativeSize.w, 284, 'ground');
                platforms.create(230 + relativeSize.w, 184, 'ground');
                platforms.create(390 + relativeSize.w, 284, 'ground');
                platforms.create(990 + relativeSize.w, 360, 'ground');
                platforms.create(620 + relativeSize.w, 430, 'ground');
                platforms.create(900 + relativeSize.w, 570, 'ground');
            }
            //melakukan pengecekan jika level sedang katif adalah selain level "1" dan level "2"
            else{
                //membuat pijakan tambahan untuk level 3
                platforms.create(80 + relativeSize.w, 230, 'ground');
                platforms.create(230 + relativeSize.w, 230, 'ground');
                platforms.create(1040 + relativeSize.w, 280, 'ground');
                platforms.create(600 + relativeSize.w, 340, 'ground');
                platforms.create(400 + relativeSize.w, 420, 'ground');
                platforms.create(930 + relativeSize.w, 430, 'ground');
                platforms.create(820 + relativeSize.w, 570, 'ground');
                platforms.create(512 + relativeSize.w, 590, 'ground');
                platforms.create(0 + relativeSize.w, 570, 'ground');

                //melakukan pengecekan jika level yang sedang aktif adalah level lebih dari 3
                //maka musuh akan muncul di layar
                if(currentLevel > 3){
                    //menentukan posisi horizontal (titik x) dari musuh yang akan muncul secara acak 
                    //dari titik 100 sampai di lebar layar dikurangi 100. 
                    var x = Phaser. Math. Between (100, game.canvas.width - 100); 
                    //membuat musuh baru yang akan muncul karena level lebih dari 2 
                    var enemy = enemies.create(x, -100, 'enemy' + Phaser.Math.Between (1, 3)); 
                    enemy.setBounce (1); 
                    enemy.setCollideWorldBounds (true); 
                    //memberikan nilai percepatan untuk membuat musuh langsung bergerak 
                    //secara acak ketika muncul 
                    enemy.setVelocity (Phaser.Math.Between(-200, 200), 20); 
                    //membuat supaya efek gravitasi tidak berlaku pada sprite musuh, 
                    //sehingga bisa bergerak bebas seperti balon 
                    enemy.allowGravity = false; 
                } 
            }

            //menampilkan koin baru sekaligus membuat koin bisa memantul 
            //berdasarkan elastisitas yang ditentukan secara acak 
            coins.children.iterate (function (child){ 
                //membuat setiap koin yang dibuat akan memantul dengan 
                //toleransi yang diacak mulai dari 0.2 -0.3 
                child.setBounceY (Phaser. Math. FloatBetween (0.2, 0.3)); 
                //mengaktifkan hukum fisika pada koin supaya 
                //dapat terkena efek gravitasi dan kemudian turun 
                child.enableBody (true, child.x, 100, true, true); 
            }); 
        }

        //membuat group physics yang nantinya akan digunakan untuk 
        //menampung musuh-musuh yang bergerak bebas di layar 
        var enemies = this.physics.add.group(); 
        //membuat setiap musuh yang ada di grup 'enemmies' 
        //bisa bertabrakan dengan setiap pijakan yang ada 
        //di grup 'platform' berdasarkan hukum fisika 
        this.physics.add.collider (enemies, platforms);

        //membuat group physics penampung sprite koin yang muncul
        //di dalam game dengan menambahkan konfigurasi
        //untuk menentukan jumlah dari koin dan menentukan
        //posisi awal kemunculan koin
        var coins = this.physics.add.group({
            //menentukan nama asset gambar yang akan ditambahkan sebagai sprite koin
            key: 'coin',
            //menentukan jumlah pengulangan pembuatan koin (scr default dibuat 1)
            repeat: 9,
            //membuat setiapkoin yang dibuat akan memantul degan besaran toleransi acak
            setXY: { x: 60 + relativeSize.w, y: -100, stepX: 100 }
        });

        //mempersiapkan area bermain untuk pertama kali dengan memanggil fungsi 'prepareWorld'
        prepareWorld();

        //membuat koin baru sekaligus membuat koin bisa memantul
        //berdasarkan elastisitas yang ditentukan secara acak
        coins.children.iterate(function (child){
            //membuat setiap koin yang dibuat akan memantul dengan 
            //toleransi yang diacak mulai dari 0.2 s/d 0.3
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
            child.setGravityY(800); //agar koin jatuh ke bawah
        });

        //menambahkan deteksi tubrukan antara koin dengan pijakan berdasarkan hukum fisika
        this.physics.add.collider(coins, platforms);

        //menambahkan sprite karakter dengan physics ke dalam game
        this.player = this.physics.add.sprite(100,500, 'char');

        //menambahkan deteksi tubrukan antara karakter berdasarkan hukum
        //fisika dengan group pijakan (yang memiliki semua piajakan)
        this.physics.add.collider(this.player, platforms);

        //menambahkan deteksi tubrukan antara karakter berdasarkan hukum
        //fisika dengan group pijakan (yang mewakili semua pijakan)
        this.physics.add.collider(this.player, platforms);

        //membuat objek partikel berdasarkan asset gambar yang sudah ada
        //kemudian menampungnya ke dalam variabel 'partikelCoin'
        let partikelCoin = this.add.particles('coin');

        //membuat emmiter atau penyebaran partikel menampungnya ke dalam variabel dengan nama emmiterCoin
        this.emmiterCoin = partikelCoin.createEmitter({
            //mengatur kecepatan persebaran dari partikel secara acak
            speed: { min: 150, max: 250 },
            //mengatur gaya gravitasi berdasarkan titik x dan y
            gravity: { x: 0, y: 200 },
            //mengatur ukuran dari pertikel yang terlihat dengan nilai ketika muncul: '1'
            //dan ketika akan menghilang, nilai ukuran partikel: '0'
            scale: { start: 1, end: 0 },
            //mengatur lama tampilan dari tiap partikel yang disebar
            lifespan: {min: 200, max: 300},
            //mengatur banyaknya jumlah partikel yang disebarkan setiap kali partikel disebar
            quantity: { min: 5, max: 15 },
        });
        //mengatur partikel untuk pertama kali ketika game dijalankan
        this.emmiterCoin.setPosition(-100, -100);
        //menyebarkan partikel untuk pertama kali ketika game dijalankan
        this.emmiterCoin.explode();

        //melakukan pengecekan jika karakter utama melewati objek koin, maka funsi dengan 
        //nama 'colletCoin' akan terpanggil
        this.physics.add.overlap(this.player, coins, colletCoin, null, this);

        //mengatur daya tarik dari bagian bawah untuk karakter
        //mejnjadi '800' agar leih cepat jatuh
        this.player.setGravity(0, 800);
        //membuat karakter memantul dengan 
        //toleransi pantulan sebesar '0.2'
        this.player.setBounce(0.2);

        //menambahkan deteksi input tombol arah pada keyboard
        this.cursors = this.input.keyboard.createCursorKeys();

        //mengaktifkan proteksi agar karakter tidak bisa bergerak ke luar dari area layar
        this.player.setCollideWorldBounds(true);
        
        //menambahkan animasi berlari dengan menghadap ke arah kiri ke dalam game, dengan nama 'left'
        this.anims.create({
            //memberikan nama animasi dengan 'left'
            key: 'left',
            //menentukan frame tampilan dari asset spritesheet bernama 'chara',
            //dan dengan urutan bingkai gambar pertama sampai ke empat
            frames: this.anims.generateFrameNumbers('char', { start: 0, end: 3}),
            //menentukan kecepatan perpindahan tampilan dari bingkai 1 ke selanjutnya
            frameRate: 12,
            //menentukan animasi diulang terus-menerus (-1 untuk terus-menerus)
            repeat: -1
        });
        //menambahkan animasi berlari dengan menghadap ke arah kanan ke dalam game, dengan nama 'right'
        this.anims.create({
            //memberikan nama animasi dengan 'right'
            key: 'right',
            //menentukan frame tampilan dari asset spritesheet bernama 'chara',
            //dan dengan urutan bingkai gambar ke-enam sampai ke-sembilan
            frames: this.anims.generateFrameNumbers('char', { start: 5, end: 8}),
            //menentukan kecepatan perpindahan tampilan dari bingkai 1 ke selanjutnya
            frameRate: 12,
            //menentukan animasi diulang terus-menerus (-1 untuk terus-menerus)
            repeat: -1
        });
        //menambahkan animasi berlari dengan menghadap ke arah depan ke dalam game, dengan nama 'front'
        this.anims.create({
            //memberikan nama animasi dengan 'front'
            key: 'front',
            //menentukan frame tampilan dari asset spritesheet bernama 'chara',
            //dan dengan urutan bingkai gambar 5 saja
            frames: [{ key: 'char', frame: 4}],
            //menentukan kecepatan perpindahan tampilan dari bingkai 1 ke selanjutnya
            frameRate: 20
        });

        //fungsi untutk mendeteksi ketika terjadi tubrukan antara musuh dengan karakter utama
        var hitEnemy = function(player, enemy){
        //menyimpan referensi ke instance scenePlay
        var self = this;
           
        //menjeda semua pergerakan yang terjadi karena physics
        this.physics.pause();
        //membuat karakter berubah warna menjadi merah
        this.player.setTint(0xff0000);
        this.player.anims.play('front');
        this.snd_lose.play();
        this.music_play.stop();
        this.snd_walk.setVolume(0);
        this.player.setVelocityX(0); 
        this.player.setVelocityY(0); 
        this.player.anims.stop(); 
        this.snd_walk.stop();
           
        //animasi untuk memunculkan background gelap-transparan dengan menggunakan tween
        activeScene.tweens.add({
            targets: darkenLayer,
            duration: 250, // Durasi layar menjadi gelap
            alpha: 0.75, // Membuat layar menjadi lebih gelap
            onComplete: function(){
                // Tambahkan gambar "Game Over"
                let gameOverImage = self.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 160, 'gameover');
                gameOverImage.setDepth(20);
           
                // Tambahkan tombol play ulang
                let restartButton = self.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 110, 'btn_play');
                restartButton.setDepth(20);
                restartButton.setInteractive();
           
            restartButton.on('pointerdown', () => {
                restartButton.setTint(0x5a5a5a); // Menggunakan restartButton
            });
            restartButton.on('pointerout', () => {
                restartButton.clearTint(); // Menggunakan restartButton
            });
            restartButton.on('pointerup', () => {
                restartButton.clearTint(); // Menggunakan restartButton
           
                restartButton.destroy();
                gameOverImage.destroy();
           
                self.scene.restart(); // restart dengan level saat ini
            });
            // Matikan kontrol input agar player tidak bisa bergerak
            self.gameStarted = false;
                    }
            });
        }
        //melakukan pengecekan jika karakter utama melewati objek musuh,
        //maka fungsi dengan nama 'hitEnemy' akan terpanggil
        this.physics.add.collider(this.player, enemies, hitEnemy, null, this);

        //menjeda semua pergerakan yang terjadi karena hukum fisika
        this.physics.pause();
    },
    update: function(){
        //melakukan pengecekan apabila kondisi game sudah dimulai atau belum sama sekali
        if(!this.gameStarted){
            //jika game belum dimulai, maka kode program dibawah ini tidak akan dijalankan
            return;
        }

        //mendeteksi apabila tombol arah atas pada keyboard 
        //ditekan dan dikondisikan untuk karakter sedang menyentuh pijakan
        if(this.cursors.up.isDown && this.player.body.touching.down){
            //memberikan nilai percepatan dengan nilai '-620' ke karakter utama
            //untuk menggerakkannya ke arah atas dengan bantuan hukum fisika (lompat)
            this.player.setVelocityY(-650);
            this.snd_jump.play(); //memainkan sound efek lompat
        }
        //mendeteksi apabila tombol arah kanan pada keyboard ditekan
        if(this.cursors.right.isDown){
            //memberikan nilai percepatan dengan nilai '200' ke karakter utama
            //untuk menggerakkan karakter ke arah kanan dengan bantuan hukum fisika
            this.player.setVelocityX(200);

            //menganimasikan karakter berlari ke arah kanan
            this.player.anims.play('right', true);
            this.snd_walk.setVolume(1); 
        }
        else if(this.cursors.left.isDown){
            //memberikan nilai percepatan dengan nilai '-200' ke karakter utama
            //untuk menggerakkan karakter ke arah kiri dengan bantuan hukum fisika
            this.player.setVelocityX(-200);

            //menganimasikan karakter berlari ke arah kiri
            this.player.anims.play('left', true);
            this.snd_walk.setVolume(1); 
        }
        //mendeteksi apabila tidak ada tombol arah pada keyboard yang ditekan
        else{
            //memberikan nilai percepatan dengan nilai '0' ke karakter untuk
            //membuat karakter tidak bergerak dengan bantuan hukum fisika
            this.player.setVelocityX(0);

            //menganimasikan karakter untuk menghadap ke depan
            this.player.anims.play('front', true);
            this.snd_walk.setVolume(0); 
        }
    }
});