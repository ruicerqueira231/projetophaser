import CenaFinal from "./CenaFinal.js";
import CenaPrincipal from "./CenaPrincipal.js";
import CenaMenu from "./CenaMenu.js";
import CenaMenuFinal from "./CenaMenuFinal.js";

const config = {
    width: 512,
    height: 512,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'jogo-sobrevivencia',
    scene:[CenaMenu, CenaPrincipal, CenaFinal, CenaMenuFinal],
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
