
import Jogador from "./Jogador.js";
import Inimigo from "./Inimigo.js";

var resetLife;
var playerVidas;
var inimigoVidas;
var lifeKey;
var gameOver = false;

export default class CenaFinal extends Phaser.Scene {

    constructor() {
        super({ key: 'CenaFinal' });
    }

    init(data) {
       this.vidaJogador = data.vida;
    }
  
    preload() {
        //precarregar musica
        this.load.audio('gameBackground' , ['assets/audios/gameBackground.ogg']);
        this.load.audio('gameOver', ['assets/audios/gameOver.mp3']);

        //precarregar imagens do jogador
        Jogador.preload(this);

        //precarregar inimigo
        Inimigo.preload(this, "inimigo");

        //precarregar imagem do mapa e o seu estilo titledjson
        this.load.image("partes2", "assets/images/RPG Nature Tileset_2.png");
        this.load.tilemapTiledJSON("mapa2", "assets/images/mapa_2.json");

    }

    create() {
        // musica
        this.soundEffect = this.sound.add('gameBackground');
        this.soundEffect.play();

        //camadas do mapa/jogadores e respetivas propriedades 
        const map = this.make.tilemap({key: "mapa2"});
        this.map = map;
        const tileset2 = map.addTilesetImage("RPG Nature Tileset_2", "partes2", 32,32,0,0);
        const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset2,0,0);
        const camada2 = map.createStaticLayer("Camada de Blocos 2", tileset2,0,0);
        const camada4 = map.createStaticLayer("Camada de Blocos 4", tileset2,0,0);
        //new Jogador({scene:this, x:100, y:100, texture:'menina', frame: 'townsfolk_f_walk_1'});
        this.player = new Jogador({scene:this, x:100, y:100, texture:'menina', frame: 'townsfolk_f_walk_1', vida: this.vidaJogador});
        this.inimigo = new Inimigo({scene:this, x:300, y:300, texture:'inimigo', frame: 'crabmoving1', scale: 3, vida: 2000, tipo: "inimigogoglem"});
        const camada3 = map.createStaticLayer("Camada de Blocos 3", tileset2,0,0);

        //colisões dos tiletmapslayers
        camada1.setCollisionByProperty({colisoes:true}); //colisões das aguas por voltar
        camada3.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        camada4.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        //aplicar as colisoes definidas
        this.matter.world.convertTilemapLayer(camada1); 
        this.matter.world.convertTilemapLayer(camada3);
        this.matter.world.convertTilemapLayer(camada4);

        //camera
        let camera = this.cameras.main;
        camera.zoom = 2; //zoom aplicado
        camera.startFollow(this.player); //seguir o jogador
        camera.setLerp(0.1,0.1); //delay na camera
        camera.setBounds(0,0,this.game.config.width, this.game.config.height);

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
        playerVidas = this.add.text(16, 16, 'Vidas: ' + this.player.vida, { fontSize: '20px', fill: '#fff' });
        inimigoVidas = this.add.text(350, 16, 'Inimigo: ' + this.inimigo.vida, { fontSize: '20px', fill: '#fff' });

        //código para tirar vidas ao haver colisão entre os inimigos

        let collisionStartTime = 0;
        let collisionDuration = 0;
        const decrementInterval = 500; //intervalo para tirar dano jogador
        const decrementInterval2 = 100; //intervalo para tirar dano inimigo
        
        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
          if ((bodyA.label == "jogadorColidir" && bodyB.label == "inimigoSensor") || 
              (bodyB.label == "inimigoSensor" && bodyA.label == "jogadorColidir")) {
            collisionStartTime = this.time.now;
            collisionDuration = 0;
          }
        });
        
        this.matter.world.on("collisionactive", (event, bodyA, bodyB) => {
          if ((bodyA.label == "jogadorColidir" && bodyB.label == "inimigoSensor") || 
              (bodyB.label == "inimigoSensor" && bodyA.label == "jogadorColidir")) {
            const currentTime = this.time.now;
            const deltaTime = currentTime - collisionStartTime;
            collisionStartTime = currentTime;
            collisionDuration += deltaTime;
            if (collisionDuration >= decrementInterval) {
              this.player.vida -= 1;
              this.player.danoSofrido();
              this.player.playerDamage();
              collisionDuration = 0;
            } else if (collisionDuration >= decrementInterval2 && this.input.activePointer.leftButtonDown() && 
                      this.input.activePointer.getDuration() > 300 && this.input.activePointer.getDuration() < 500)  {
              this.inimigo.vida -= 10;
              this.inimigo.danoSofrido();
              this.inimigo.inimigoDamage();
              console.log(this.inimigo.vida);
              collisionDuration = 0;
            }
          }
        });
}
    

    //função que inicia a cena Final
    nextScene(){
        this.soundEffect.stop();
        this.player.pauseSteps();
        this.scene.stop();
        this.scene.start("cenaMenuFinal");
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
            this.player.vida = 1000;
        }
        if(resetLife.isDown){
            this.player.vida = 10;
        }

        if(this.player.vida === 0){
            gameOver=true;
        }
        
        playerVidas.setText("Vidas: "+ this.player.vida);
        inimigoVidas.setText("Inimigo: "+ this.inimigo.vida);
        
    }
}
