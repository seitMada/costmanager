import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from "../../../shared/service/article.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private articleService: ArticleService
  ) { }

  public toggle = true;

  toggleModal() {
    this.toggle = !this.toggle;
  }

  public article: any;
  public articles: any;

  ngOnInit(): void {
    this.articleService.getAllArticle().subscribe({
      next: (article) => {
        this.articles = article;
        console.log(this.articles);
      },
      error: (error) => {
        alert('ERREUR')
      }
    })
  }

  showArticle(art: any) {
    this.article = art;
    console.log(this.article)
    this.toggleModal();
  }

}
