
import Jogador from "./Jogador.js";
import Inimigo from "./Inimigo.js";

export default class cenaFinal extends Phaser.Scene {

    constructor() {
        super({ key: 'CenaFinal' });
    }

    preload() {
        //precarregar imagem do mapa e o seu estilo titledjson
        this.load.image("partes2", "assets/images/RPG Nature Tileset_2.png");
        this.load.tilemapTiledJSON("mapa2", "assets/images/mapa_2.json");
    }

    create() {
        const map = this.make.tilemap({key: "mapa2"});
        this.map = map;
        const tileset2 = map.addTilesetImage("RPG Nature Tileset_2", "partes2", 32,32,0,0);
        
    }

    update() {

    }
}
