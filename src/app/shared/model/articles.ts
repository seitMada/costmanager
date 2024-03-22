import { InterfaceArticle, InterfaceArticles } from "./interface-articles";

export class Article implements InterfaceArticles{
    articles: InterfaceArticle[];

    constructor(articles: InterfaceArticle[]){
        this.articles = articles;
    }

    *[Symbol.iterator]() {
        for (let article of this.articles) {
            yield article;
        }
    }
}