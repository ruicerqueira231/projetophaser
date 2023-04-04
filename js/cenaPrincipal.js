import Jogador from "./Jogador.js";

var resetLife;
var textoVidas;
var lifeKey;
var vidas = 3;

export default class cenaPrincipal extends Phaser.Scene {

    constructor() {
        super("cenaPrincipal");
    }

    preload() {
        //precarregar musica
        this.load.audio('gameBackground' , ['assets/audios/gameBackground.ogg']);

        //precarregar imagens do jogador
        Jogador.preload(this);

        //precarregar imagem do mapa e o seu estilo titledjson
        this.load.image("partes", "assets/images/RPG Nature Tileset.png");
        this.load.tilemapTiledJSON("mapa", "assets/images/mapa.json");

        //desenvolvimento
        this.load.image("comida" , "assets/images/Pac de Comida.png");

    }

    create() {
        // musica
        this.sound.add('gameBackground').play();

        //camadas do mapa/jogadores e respetivas propriedades 
        const map = this.make.tilemap({key: "mapa"});
        const tileset = map.addTilesetImage("RPG Nature Tileset", "partes", 32,32,0,0);
        const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset,0,0);
        const camada2 = map.createStaticLayer("Camada de Blocos 2", tileset,0,0);
        const camada4 = map.createStaticLayer("Camada de Blocos 4", tileset,0,0);
        this.player = new Jogador({scene:this, x:100, y:100, texture:'menina', frame: 'townsfolk_f_walk_1'});
        const camada3 = map.createStaticLayer("Camada de Blocos 3", tileset,0,0);

        //colisões dos tiletmapslayers
        camada1.setCollisionByProperty({colisoes:true}); //colisões das aguas por voltar
        camada3.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        //aplicar as colisoes definidas
        this.matter.world.convertTilemapLayer(camada1); 
        this.matter.world.convertTilemapLayer(camada3);
        
        //teclas utilizadas pelo jogador
        this.player.inputKeys = this.input.keyboard.addKeys({
            cima: Phaser.Input.Keyboard.KeyCodes.W,
            baixo: Phaser.Input.Keyboard.KeyCodes.S,
            esquerda: Phaser.Input.Keyboard.KeyCodes.A,
            direita: Phaser.Input.Keyboard.KeyCodes.D,
            velocidade: Phaser.Input.Keyboard.KeyCodes.M,
        })

        //cheats
        lifeKey = this.input.keyboard.addKey('Q');
        resetLife = this.input.keyboard.addKey('T');
        textoVidas = this.add.text(16, 16, 'Vidas: ' + vidas, { fontSize: '20px', fill: '#fff' });
        
    }

    update() {
        this.player.update(); //updates do jogador

        //update cheats
        if(lifeKey.isDown){
            vidas = 1000;
            textoVidas.setText("Vidas: "+vidas);
        }
        if(resetLife.isDown){
            vidas = 3;
            textoVidas.setText("Vidas: "+ vidas);
        }
        
    }
}