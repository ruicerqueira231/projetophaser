
import Jogador from "./Jogador.js";
import Inimigo from "./Inimigo.js";

export default class cenaFinal extends Phaser.Scene {

    constructor() {
        super("cenaFinal");
    }

    preload() {
        //precarregar imagem do mapa e o seu estilo titledjson
        this.load.image("partes", "assets/images/RPG Nature Tileset_2.png");
        this.load.tilemapTiledJSON("mapa", "assets/images/mapa_2.json");
    }

    create() {
        const map = this.make.tilemap({key: "mapa"});
        const tileset = map.addTilesetImage("RPG Nature Tileset", "partes", 32,32,0,0);
        const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset,0,0);
        const camada2 = map.createStaticLayer("Camada de Blocos 2", tileset,0,0);
        const camada3 = map.createStaticLayer("Camada de Blocos 3", tileset,0,0);
        const camada5 = map.createStaticLayer("Camada de Blocos 5", tileset,0,0);
    }

    update() {

    }
}
