
export default class Jogador extends Phaser.Physics.Matter.Sprite {

    constructor(dados) {
        let {scene,x,y,texture,frame} = dados;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);


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
    }

    static preload(scene) {
        scene.load.atlas('menina', 'assets/images/menina.png', 'assets/images/menina_atlas.json');
        scene.load.animation('menina_anim', 'assets/images/menina_anim.json');
    }

    //propriedade de velocidade existe no corpo "body" de um matter sprite
    get velocity() {
        return this.body.velocity;
    }  

    update() {
        
        const velocidadeDoJogador = 1.5;
        let jogadorVelocidade = new Phaser.Math.Vector2(); //usar os vetores do phaser para controlar o movimento do jogador
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
        
        if(this.inputKeys.velocidade.isDown) {
            jogadorVelocidade.scale(velocidadeDoJogador*3);
        } else {
            jogadorVelocidade.scale(velocidadeDoJogador);
        }
        this.setVelocity(jogadorVelocidade.x, jogadorVelocidade.y);
        //dependendo das teclas pressionadas a animação altera-se
        if(Math.abs(this.velocity.x)> 0.1 || Math.abs(this.velocity.y)> 0.1) { 
            this.anims.play(('menina_andar'), true);
        } else {
            this.anims.play('menina_parado', true);
        }


    }
}