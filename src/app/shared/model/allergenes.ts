import { InterfaceAllergeneArticle, InterfaceAllergenes } from "./interface-allergenes";

export class Allergene implements InterfaceAllergeneArticle {
  id?:      number | undefined;
  articleId:  number;
  allergeneId: number;

  allergene: InterfaceAllergenes;

  constructor(allergeneArticleInterface: InterfaceAllergeneArticle) {
    this.articleId = allergeneArticleInterface.articleId;
    this.allergeneId = allergeneArticleInterface.allergeneId;
    this.allergene = allergeneArticleInterface.allergene;
  }
}