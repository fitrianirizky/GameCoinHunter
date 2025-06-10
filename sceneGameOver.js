var sceneGameOver = new Phaser.Class({
            extends: Phaser.Scene,
            initialize: function(){
                Phaser.Scene.call(this, { key: "sceneGameOver"});
            },
            init: function(data){
                //menerima data level dan koin dari scene sebelumnya
                this.finalLevel = data.level || 1;
                this.finalCoins = data.coins || 0;
            },
            preload: function(){
                // Assets sudah di-load di sceneMenu, tidak perlu load ulang
            },
            create: function(){
                //sound efek
                //menampung sound yang nanti dibunyikan ketika ada tombol yang ditekan
                this.snd_touch = this.sound.add('snd_touch');

                //menambahkan sprite background langit biru dan gunung ke dalam game
                //dan menempatkannya ditengah-tengah tampilan game
                this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background').setScale(2);

                //menambahkan lapisan gelap semi-transparan
                var darkenLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
                    this.cameras.main.width, this.cameras.main.height, 0x000000);
                darkenLayer.setAlpha(0.7);
                darkenLayer.setDepth(1);

                //menambahkan judul "Game Over"
                var gameOverText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'GAME OVER', {
                    fontFamily: 'Verdana, Arial',
                    fontSize: '48px',
                    color: '#ff0000',
                    fontStyle: 'bold'
                });
                gameOverText.setOrigin(0.5);
                gameOverText.setDepth(2);

                //menambahkan teks statistik level
                var levelText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER - 80, 'Level Reached: ' + this.finalLevel, {
                    fontFamily: 'Verdana, Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                levelText.setOrigin(0.5);
                levelText.setDepth(2);

                //menambahkan teks statistik koin
                var coinsText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER - 40, 'Coins Collected: ' + this.finalCoins, {
                    fontFamily: 'Verdana, Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                coinsText.setOrigin(0.5);
                coinsText.setDepth(2);

                //menampung scene yang sedang aktif
                var activeScene = this;

                //membuat tombol "Play Again"
                var playAgainButton = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 50, 'btn_play');
                playAgainButton.setScale(0.8);
                playAgainButton.setDepth(2);
                playAgainButton.setInteractive();
                
                //menambahkan teks pada tombol play again
                var playAgainText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER + 50, 'PLAY AGAIN', {
                    fontFamily: 'Verdana, Arial',
                    fontSize: '20px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                });
                playAgainText.setOrigin(0.5);
                playAgainText.setDepth(3);

                //event ketika tombol play again diklik
                playAgainButton.on('pointerdown', function(){
                    //memainkan sound efek tombol
                    if(activeScene.snd_touch.play) {
                        activeScene.snd_touch.play();
                    }
                    //kembali ke scene play untuk main lagi
                    activeScene.scene.start('scenePlay');
                });

                //efek hover untuk tombol play again
                playAgainButton.on('pointerover', function(){
                    playAgainButton.setScale(0.85);
                    playAgainText.setScale(1.05);
                });

                playAgainButton.on('pointerout', function(){
                    playAgainButton.setScale(0.8);
                    playAgainText.setScale(1);
                });

                //membuat tombol "Main Menu"
                var mainMenuButton = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 120, 'btn_play');
                mainMenuButton.setScale(0.8);
                mainMenuButton.setDepth(2);
                mainMenuButton.setInteractive();
                
                //menambahkan teks pada tombol main menu
                var mainMenuText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER + 120, 'MAIN MENU', {
                    fontFamily: 'Verdana, Arial',
                    fontSize: '20px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                });
                mainMenuText.setOrigin(0.5);
                mainMenuText.setDepth(3);

                //event ketika tombol main menu diklik
                mainMenuButton.on('pointerdown', function(){
                    //memainkan sound efek tombol
                    if(activeScene.snd_touch.play) {
                        activeScene.snd_touch.play();
                    }
                    //kembali ke scene menu utama
                    activeScene.scene.start('sceneMenu');
                });

                //efek hover untuk tombol main menu
                mainMenuButton.on('pointerover', function(){
                    mainMenuButton.setScale(0.85);
                    mainMenuText.setScale(1.05);
                });

                mainMenuButton.on('pointerout', function(){
                    mainMenuButton.setScale(0.8);
                    mainMenuText.setScale(1);
                });

                //animasi masuk untuk elemen-elemen UI
                gameOverText.setAlpha(0);
                levelText.setAlpha(0);
                coinsText.setAlpha(0);
                playAgainButton.setAlpha(0);
                playAgainText.setAlpha(0);
                mainMenuButton.setAlpha(0);
                mainMenuText.setAlpha(0);

                //tween animasi untuk memunculkan elemen satu per satu
                this.tweens.add({
                    targets: gameOverText,
                    alpha: 1,
                    duration: 500,
                    delay: 200
                });

                this.tweens.add({
                    targets: [levelText, coinsText],
                    alpha: 1,
                    duration: 500,
                    delay: 700
                });

                this.tweens.add({
                    targets: [playAgainButton, playAgainText],
                    alpha: 1,
                    duration: 500,
                    delay: 1200
                });

                this.tweens.add({
                    targets: [mainMenuButton, mainMenuText],
                    alpha: 1,
                    duration: 500,
                    delay: 1500
                });
            }
        });