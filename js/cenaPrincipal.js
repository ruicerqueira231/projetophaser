import Jogador from "./Jogador.js";
import Inimigo from "./Inimigo.js";

var resetLife;
var playerVidas;
var inimigoVidas;
var lifeKey;
var gameOver = false;

export default class CenaPrincipal extends Phaser.Scene {

    constructor() {
        super({ key: 'CenaPrincipal' });
    }

    preload() {
        //precarregar musica
        this.load.audio('gameBackground' , ['assets/audios/gameBackground.ogg']);
        this.load.audio('gameOver', ['assets/audios/gameOver.mp3']);

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
        this.soundEffect = this.sound.add('gameBackground');
        this.soundEffect.play();
        //camadas do mapa/jogadores e respetivas propriedades 
        const map = this.make.tilemap({key: "mapa"});
        this.map = map;
        const tileset = map.addTilesetImage("RPG Nature Tileset", "partes", 32,32,0,0);
        const camada1 = map.createStaticLayer("Camada de Blocos 1", tileset,0,0);
        map.createStaticLayer("Camada de Blocos 2", tileset,0,0);
        map.createStaticLayer("Camada de Blocos 3", tileset,0,0);
        const camada5 = map.createStaticLayer("Camada de Blocos 5", tileset,0,0);
        this.player = new Jogador({scene:this, x:100, y:100, texture:'menina', frame: 'townsfolk_f_walk_1'});
        this.inimigo = new Inimigo({scene:this, x:300, y:300, texture:'inimigo', frame: 'crabmoving1', scale: 3, vida: 5});
          
        const camada4 = map.createStaticLayer("Camada de Blocos 4", tileset,0,0);

        //colisões dos tiletmapslayers
        camada1.setCollisionByProperty({colisoes:true}); //colisões das aguas por voltar
        camada4.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        camada5.setCollisionByProperty({colisoes:true}); //colisões de obstaculos no mapa
        //aplicar as colisoes definidas
        this.matter.world.convertTilemapLayer(camada1); 
        this.matter.world.convertTilemapLayer(camada4);
        this.matter.world.convertTilemapLayer(camada5);


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
      this.scene.start("CenaFinal");
    }

    update() {
      

        this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
        this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;

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