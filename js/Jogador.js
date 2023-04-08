
export default class Jogador extends Phaser.Physics.Matter.Sprite {

    constructor(dados) {
        let {scene,x,y,texture,frame} = dados;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);
        this.spriteEspada = new Phaser.GameObjects.Sprite(this.scene , 0,0,'espada', 82);
        this.audioSteps = this.scene.sound.add('audioSteps');
        this.audioSword = this.scene.sound.add('swordSound');
        //diminui o tamanho da espada
        this.spriteEspada.setScale(0.7);
        this.spriteEspada.setOrigin(0.25,0.75);
        //Para ficar visivel na scene do jogo
        this.scene.add.existing(this.spriteEspada);
        this.spriteEspada.visible = true;
        //buscar o Body e Bodies ao Matter
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        //definir uma divisão circular de colisão e um sensor circular para usos futuros
        var jogadorColidir = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:"jogadorColidir"});
        var jogadorSensor = Bodies.circle(this.x, this.y, 24, {isSensor:true, label:"jogadorSensor"});
        //associar sensor e culisão a um so corpo e definir propriedades
        const corpoComposto = Body.create({
            parts:[jogadorColidir, jogadorSensor],
            frictionAir: 0.35,
        });

        
        this.setExistingBody(corpoComposto);//criar corpo
        this.setFixedRotation(); //não rodar o boneco ao colidir com outro

        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
    }

    static preload(scene) {
        scene.load.atlas('menina', 'assets/images/menina.png', 'assets/images/menina_atlas.json');
        scene.load.animation('menina_anim', 'assets/images/menina_anim.json');
        scene.load.spritesheet('espada' , 'assets/images/utensilios.png', {frameWidth:32,frameHeight:32});
        scene.load.audio('audioSteps', 'assets/audios/audioSteps.ogg');
        scene.load.audio('swordSound', 'assets/audios/swordSound.ogg');
    }

    //propriedade de velocidade existe no corpo "body" de um matter sprite
    get velocity() {
        return this.body.velocity;
    }  

    update() {
        
        const velocidadeDoJogador = 1.5;
    
        let jogadorVelocidade = new Phaser.Math.Vector2(); //usar os vetores do phaser para controlar o movimento do jogador
        
        //movimentos do jogador
        if(this.inputKeys.esquerda.isDown) {
            jogadorVelocidade.x = -1;
        } else if(this.inputKeys.direita.isDown) {
            jogadorVelocidade.x = 1;
        }
        if(this.inputKeys.cima.isDown) {
            jogadorVelocidade.y = -1;
        } else if(this.inputKeys.baixo.isDown) {
            jogadorVelocidade.y = 1;
        }
        jogadorVelocidade.normalize(); //para não aumentar a velocidade quando motivo na diogonal
        
        //cheat para aumentar 3x a velocidade do jogador ao apertar "M"
        if(this.inputKeys.velocidade.isDown) {
            this.audioSteps.setRate(2.0);
            jogadorVelocidade.scale(velocidadeDoJogador*3);
        } else {
            this.audioSteps.setRate(1.0);
            jogadorVelocidade.scale(velocidadeDoJogador);
        }
        this.setVelocity(jogadorVelocidade.x, jogadorVelocidade.y);
        //dependendo das teclas pressionadas a animação altera-se
        if(Math.abs(this.velocity.x)> 0.1 || Math.abs(this.velocity.y)> 0.1) { 
            this.anims.play(('menina_andar'), true);
            if (!this.audioSteps.isPlaying) {
                this.audioSteps.play();
            }
        } else {
            this.anims.play('menina_parado', true);
            this.audioSteps.stop();
        }
        //fixar a posição da espada com o jogador
        this.spriteEspada.setPosition(this.x,this.y);
        //erro ao chamar este metodo rotateEspada() - Espada deixa de aparecer na scene
        this.rotateEspada();
    }
     rotateEspada(){
        let clique = this.scene.input.activePointer;
        if(clique.isDown){
            this.rotacaoEspada += 6;
            if (!this.audioSword.isPlaying) {
                this.audioSword.play();
            }
        } else {
            this.rotacaoEspada = 0;
        }
         if(this.rotacaoEspada > 60){
             this.rotacaoEspada = 0;
         }
        this.spriteEspada.setAngle(this.rotacaoEspada);

        if(this.flipX){
            this.spriteEspada.setAngle(-this.rotacaoEspada - 90);
        }else{
            this.spriteEspada.setAngle(this.rotacaoEspada);
        }
    }

}