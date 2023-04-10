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

  const sobrevivexText = this.add.text(256, 160, 'You won the game', { fontSize: '20px', fill: '#fff' });
  sobrevivexText.setOrigin(0.5, 1);
  }
}