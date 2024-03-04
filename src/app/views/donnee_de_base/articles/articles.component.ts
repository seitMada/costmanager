import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from "../../../shared/article.service";

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent  implements OnInit{
    constructor(
      public router: Router,
      public route: ActivatedRoute,
      private articleService : ArticleService
    ){}

    public idArticle = 0;
    public articles: any;

    ngOnInit(): void{
      this.articleService.getAllArticle().subscribe({
        next: (article) =>{
          this.articles = article;
          console.log(this.articles);
        },
        error: (error) => {
          alert('ERREUR')
        }
      })
    }
    
}
