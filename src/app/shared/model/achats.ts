import { InterfaceAchat,InterfaceAchats } from "./interface-achats";


export class Achat implements InterfaceAchats{
    achats : InterfaceAchat[];

    constructor(achats:InterfaceAchat[]){
        this.achats = achats;
    }

    *[Symbol.iterator](){
        for (let achat of this.achats) {
          yield achat;
        }
    }
}