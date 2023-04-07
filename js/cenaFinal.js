
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

    create() {}

    update() {}
}
