export default class cenaMenuFinal extends Phaser.Scene {
    constructor() {
      super({ key: 'cenaMenuFinal' });
    }
  
    preload() {
      // Load menu assets
        this.load.image("partes", "assets/images/RPG Nature Tileset.png");
        this.load.tilemapTiledJSON("mapa", "assets/images/mapa.json");
        this.load.image('playButton', 'assets/images/playButton.png');
    }
  
    create() {
      // Add menu background image
    const map = this.make.tilemap({key: "mapa"});
    this.map = map;
    const tileset = map.addTilesetImage("RPG Nature Tileset", "partes", 32,32,0,0);
    const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset,0,0);
  
      // Add play button
      var playButton = this.add.sprite(20, 20, 'playButton').setInteractive();
      playButton.on('pointerdown', () => {
        this.scene.stop();
        this.scene.start('CenaMenu');
      });
    }
  }