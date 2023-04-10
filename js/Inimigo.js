
export default class Inimigo extends Phaser.Physics.Matter.Sprite {

    constructor(dados) {
        let {scene,x,y,texture,frame,scale,vida,tipo} = dados;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);
        this.vida = vida; //vida do inimigo
        this.inimigoDamaged = this.scene.sound.add('inimigoDamaged');
        this.tipo = tipo;
        
        //buscar o Body e Bodies ao Matter
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        //definir uma divisão circular de colisão e um sensor circular para usos futuros
        var jogadorColidir = Bodies.circle(this.x, this.y, 8, {isSensor:false, label:"inimigoColidir"});
        var jogadorSensor = Bodies.circle(this.x, this.y, 40, {isSensor:true, label:"inimigoSensor"});
        //associar sensor e culisão a um so corpo e definir propriedades
        const corpoComposto = Body.create({
            parts:[jogadorColidir, jogadorSensor],
            frictionAir: 0.7,
        });
        this.setScale(scale);// tamanho do inimigo
        this.setExistingBody(corpoComposto);//criar corpo
        this.setFixedRotation(); //não rodar o boneco ao colidir com outro
        
    }

    static preload(scene, tipo) {
        if(tipo == "inimigo") {
            scene.load.atlas('inimigo', 'assets/images/inimigo.png', 'assets/images/inimigo_atlas.json');
            scene.load.animation('inimigo_anim', 'assets/images/inimigo_anim.json');
        } else if(tipo == "inimigogoglem") {
            scene.load.atlas('inimigogoglem', 'assets/images/inimigogoglem.png', 'assets/images/inimigogoglem_atlas.json');
            scene.load.animation('inimigogoglem_anim', 'assets/images/inimigogoglem_anim.json');
        }
        
        scene.load.audio('inimigoDamaged', 'assets/audios/inimigoDamaged.mp3');
    }

    //propriedade de velocidade existe no corpo "body" de um matter sprite
    get velocity() {
        return this.body.velocity;
    } 

    danoSofrido() {
        this.setTint(0x0000ff);
        setTimeout(() => {
          this.clearTint();
        }, 100);
      }

      inimigoDamage(){
        this.inimigoDamaged.play();
    }
    
    
    
    update(jogador) {

        if(this.vida <= 800) {

        }else if (this.vida <= 600){

        }else if (this.vida <= 400){

        }else if (this.vida <= 200){

        }

        if (this.vida <= 0) {
            this.scene.nextScene();
        }

        let inimigoVelocidade = new Phaser.Math.Vector2();

        if(Math.abs(this.velocity.x)> 0.1 || Math.abs(this.velocity.y)> 0.1) { 
            this.anims.play(('andar'), true);
        } else if (this.tipo == "inimigo") {
            this.anims.play(('andar'), false);
        } else if (this.tipo == "inimigogoglem") {
            this.anims.play(('parado'), true);
        }

        if(this.x < jogador.x) {
            inimigoVelocidade.x = 1;
        } else {
            inimigoVelocidade.x = -1;
        }

        if(this.y < jogador.y) {
            inimigoVelocidade.y = 1;
        } else {
            inimigoVelocidade.y = -1;
        }

        inimigoVelocidade.normalize();
        this.setVelocity(inimigoVelocidade.x, inimigoVelocidade.y);

    }

}