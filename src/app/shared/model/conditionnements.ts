import { IntefaceConditionnements, IntefaceConditionnement } from "./inteface-conditionnements";

export class Conditionnement implements IntefaceConditionnements {
    conditionnements: IntefaceConditionnement[];

    constructor(conditionnements: IntefaceConditionnement[]){
        this.conditionnements = conditionnements;
    }

    *[Symbol.iterator]() {
        for (let conditionnement of this.conditionnements) {
            yield conditionnement;
        }
    }
}