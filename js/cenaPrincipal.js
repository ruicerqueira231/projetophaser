import Jogador from "./Jogador.js";
import Inimigo from "./Inimigo.js";
import cenaFinal from "./cenaFinal.js";

var resetLife;
var textoVidas;
var lifeKey;
var vidas = 10;
var gameOver = false;

export default class cenaPrincipal extends Phaser.Scene {

    constructor() {
        super({ key: 'CenaPrincipal' });
    }

    preload() {
        //precarregar musica
        this.load.audio('gameBackground' , ['assets/audios/gameBackground.ogg']);

        //precarregar imagens do jogador
        Jogador.preload(this);

        //precarregar inimigo
        Inimigo.preload(this);

        //precarregar imagem do mapa e o seu estilo titledjson
        this.load.image("partes", "assets/images/RPG Nature Tileset.png");
        this.load.tilemapTiledJSON("mapa", "assets/images/mapa.json");

        //desenvolvimento
        this.load.image("burrito" , "assets/images/burrito.png");
        this.load.image("botao" , "assets/images/button.png");

    }

    create() {
        // musica
        this.sound.add('gameBackground').play();

        //camadas do mapa/jogadores e respetivas propriedades 
        const map = this.make.tilemap({key: "mapa"});
        this.map = map;
        const tileset = map.addTilesetImage("RPG Nature Tileset", "partes", 32,32,0,0);
        const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset,0,0);
        map.createStaticLayer("Camada de Blocos 2", tileset,0,0);
        map.createStaticLayer("Camada de Blocos 3", tileset,0,0);
        const camada5 = map.createStaticLayer("Camada de Blocos 5", tileset,0,0);
        this.player = new Jogador({scene:this, x:100, y:100, texture:'menina', frame: 'townsfolk_f_walk_1'});
        this.inimigo = new Inimigo({scene:this, x:300, y:300, texture:'inimigo', frame: 'crabmoving1'});
          
        const camada4 = map.createStaticLayer("Camada de Blocos 4", tileset,0,0);

        //teste - botão para trocar de cena
        let button = this.add.sprite(200,200,"botao");
        button.setInteractive();
        button.on('pointerdown', this.nextScene.bind(this));

        //colisões dos tiletmapslayers
        camada1.setCollisionByProperty({colisoes:true}); //colisões das aguas por voltar
        camada4.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        camada5.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        //aplicar as colisoes definidas
        this.matter.world.convertTilemapLayer(camada1); 
        this.matter.world.convertTilemapLayer(camada4);
        this.matter.world.convertTilemapLayer(camada5);

        
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

        //texto vidas
        textoVidas = this.add.text(16, 16, 'Vidas: ' + vidas, { fontSize: '20px', fill: '#fff' });


        //código para tirar vidas ao haver colisão entre os inimigos

        let collisionStartTime = 0;
        let collisionDuration = 0;
        const decrementInterval = 1000; //intervalo para tirar dano

        //declarar variavel para clique no rato
        var clique = this.input.activePointer;

        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
        if ((bodyA.label == "jogadorColidir" && bodyB.label == "inimigoColidir") || 
            (bodyB.label == "inimigoColidir" && bodyA.label == "jogadorColidir")) {
            collisionStartTime = this.time.now;
            collisionDuration = 0;
        }
        });

        this.matter.world.on("collisionactive", (event, bodyA, bodyB) => {
        if ((bodyA.label == "jogadorColidir" && bodyB.label == "inimigoColidir") || 
            (bodyB.label == "inimigoColidir" && bodyA.label == "jogadorColidir")) {
            const currentTime = this.time.now;
            const deltaTime = currentTime - collisionStartTime;
            collisionStartTime = currentTime;
            collisionDuration += deltaTime;
            if (collisionDuration >= decrementInterval) {
                collisionDuration = 0;
                vidas--;
            }
            if(clique.isDown){
                this.matter.world.remove(this.inimigo);
                this.inimigo.visible=false;
            }
        }
        });

        
}
    

    //função que inicia a cena Final
    nextScene(){
           this.scene.start("cenaFinal");
    }

    update() {
        this.player.update(); //updates do jogador
        this.inimigo.update(this.player);

        if(gameOver){
            this.matter.pause(); // pause the game physics
            this.add.text(180, 256, 'Game Over!!', { fontSize: '20px', fill: '#fff' });
            return;
        }

        //update cheats
        if(lifeKey.isDown){
            vidas = 1000;
        }
        if(resetLife.isDown){
            vidas = 10;
        }

        if(vidas === 0){
            gameOver=true;
        }
        
        textoVidas.setText("Vidas: "+ vidas);
        
    }
}