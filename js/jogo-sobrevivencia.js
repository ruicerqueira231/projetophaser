import cenaPrincipal from "./cenaPrincipal.js";

const config = {
    width: 512,
    height: 512,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'jogo-sobrevivencia',
    scene:[cenaPrincipal],
    scale: {
        zoom: 2,

    },
    physics: {
        default: "matter",
        matter: {
            debug:true,
            gravity:{y:0},
        }
    },
};

new Phaser.Game(config);