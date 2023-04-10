import cenaFinal from "./cenaFinal.js";
import cenaPrincipal from "./cenaPrincipal.js";
import cenaMenu from "./cenaMenu.js";

const config = {
    width: 512,
    height: 512,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'jogo-sobrevivencia',
    scene:[cenaMenu , cenaPrincipal, cenaFinal],
    scale: {
        zoom: 2,

    },
    physics: {
        default: "matter",
        matter: {
            debug:false,
            gravity:{y:0},
        }
    },
};

new Phaser.Game(config);