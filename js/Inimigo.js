
export default class Inimigo extends Phaser.Physics.Matter.Sprite {

    constructor(dados) {
        let {scene,x,y,texture,frame} = dados;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        //buscar o Body e Bodies ao Matter
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        //definir uma divisão circular de colisão e um sensor circular para usos futuros
        var jogadorColidir = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:"inimigoColidir"});
        var jogadorSensor = Bodies.circle(this.x, this.y, 24, {isSensor:true, label:"inimigoSensor"});
        //associar sensor e culisão a um so corpo e definir propriedades
        const corpoComposto = Body.create({
            parts:[jogadorColidir, jogadorSensor],
            frictionAir: 0.7,
        });
        //jogadorColidir

        this.setExistingBody(corpoComposto);//criar corpo
        this.setFixedRotation(); //não rodar o boneco ao colidir com outro

    }

    static preload(scene) {
        scene.load.atlas('inimigo', 'assets/images/inimigo.png', 'assets/images/inimigo_atlas.json');
        scene.load.animation('inimigo_anim', 'assets/images/inimigo_anim.json');
    }

    //propriedade de velocidade existe no corpo "body" de um matter sprite
    get velocity() {
        return this.body.velocity;
    } 

    update(jogador) {
        this.health = 40;
        let inimigoVelocidade = new Phaser.Math.Vector2();

        if(Math.abs(this.velocity.x)> 0.1 || Math.abs(this.velocity.y)> 0.1) { 
            this.anims.play(('andar'), true);
        } else {
            this.anims.play(('andar'), false);
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

        // if((this.y == jogador.y)&&(this.x < jogador.x)) {
        //     inimigoVelocidade.x = 1;
        //     inimigoVelocidade.y = 1;
        // }else if((this.y == jogador.y)&&(this.x > jogador.x)) {
        //     inimigoVelocidade.x = -1;
        //     inimigoVelocidade.y = 1;
        // }

        // if((this.x == jogador.x)&&(this.y > jogador.y)) {
        //     inimigoVelocidade.x = 1;
        //     inimigoVelocidade.y = 1;
        // }else if((this.x == jogador.x)&&(this.y < jogador.y)) {
        //     inimigoVelocidade.x = 1;
        //     inimigoVelocidade.y = -1;
        // }
        /*
        if(this.checkCollision(jogador , this.body)){
            this.health -= 10;
            
            if(this.health <= 0){
                this.disableBody(true, true);
            }  
        }
*/
/*
        if (this.checkSensorCollision(this.body.parts[1], jogador.body.parts[1])) {
        // The two sensors are colliding
        console.log('Collision detected!');
    }
*/
        inimigoVelocidade.normalize();
        this.setVelocity(inimigoVelocidade.x, inimigoVelocidade.y);
    
    }

    /*
    checkSensorCollision(sensor1, sensor2) {
        // Check if the two sensors are overlapping
        if (sensor1.x < sensor2.x + sensor2.width &&
            sensor1.x + sensor1.width > sensor2.x &&
            sensor1.y < sensor2.y + sensor2.height &&
            sensor1.y + sensor1.height > sensor2.y) {
          // The two sensors are colliding
          return true;
        } else {
          // The two sensors are not colliding
          return false;
        }
      }
*/
}