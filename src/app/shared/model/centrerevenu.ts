
import { InterfaceCentreRevenu, InterfaceCentreRevenus } from './interface-centrerevenu';


export class Centrerevenu implements InterfaceCentreRevenus {
    centrerevenus: InterfaceCentreRevenu[];

    constructor(centrerevenus:InterfaceCentreRevenu[]){
        this.centrerevenus = centrerevenus;
    }

    *[Symbol.iterator](){
        for(let centrerevenu of this.centrerevenus){
            yield centrerevenu;
        }
    }
}