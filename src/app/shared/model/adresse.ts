import { InterfaceAdresse, InterfaceAdresses } from './interface-adresse';

export class Adresse implements InterfaceAdresses{
    adresses: InterfaceAdresse[];

    constructor(adresses:InterfaceAdresse[]){
        this.adresses = adresses;
    }

    *[Symbol.iterator](){
        for(let adresse of this.adresses){
            yield adresse;
        }
    }
}