import { Component, Input } from '@angular/core';

import { HeaderComponent } from '@coreui/angular';
import { InterfaceOperateur } from '../../shared/model/interface-operateur';
import { LoginService } from '../../shared/service/login.service';
import { ArticleService } from 'src/app/shared/service/article.service';
import { InventairesService } from 'src/app/shared/service/inventaires.service';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { CommonModule } from '@angular/common';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  public articles: InterfaceArticle[];

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  public idexploitation = +(sessionStorage.getItem('exploitation') || 0);
  public isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public periode: { debut: Date, fin: Date }[] = []
  public periodeselected: { debut: Date, fin: Date };
  public toggle: boolean = true;
  public exploitation: InterfaceExploitations;

  public idexploitations: number = 0;
  public idoperateur = +(sessionStorage.getItem('id') || 0);
  public idcentrerevenu: number = 0;

  public isrefresh: boolean = false;
  public nombrearticle = 0;

  public mouvemenstock: {
    article_id: number,
    libelle: string,
    unite: string,
    inventaires: number,
    inventairesfinal: number,
    cout: number,
    pertes: number,
    achats: number,
    ventes: number,
    stock_theorique: number,
    stock_reel: number,
    stock_initiale: number
  }[];

  constructor(
    private loginService: LoginService,
    private articleService: ArticleService,
    private exploitationService: ExploitationService,
    private inventaireService: InventairesService) {

    super();
    this.exploitationService.getExploitationById(this.idexploitation).subscribe({
      next: (_exploitation) => {
        // console.log(_exploitation)
        this.exploitation = _exploitation;
        this.getstockminimum();
        this.refreshdata(150000);
      }
    })
  }

  getstockminimum(): void {
    this.isrefresh = true;
    this.exploitationService.getExploitation().subscribe({
      next: async (_exploitations) => {
        // console.log("RAFRAICHISSEMENT")
        const exploitationid: number[] = [];
        if (this.isAdmin == true) {
          for (const _exploitation of _exploitations) {
            exploitationid.push(_exploitation.id);
          }
        } else {
          exploitationid.push(this.idexploitation);
        }
        console.log(exploitationid)
        this.inventaireService.getPeriode(exploitationid, true).subscribe({
          next: (value: any) => {
            for (const _date of value) {
              if (_date.fin == null) {
                _date.fin = new Date();
              }
            }
            this.periode = value;
            if (this.periode.length > 0) {
              const _index = this.periode.length - 1;
              this.periodeselected = this.periode[_index];
              if (this.periodeselected.fin == null) {
                this.periodeselected.fin = new Date();
              }
              const _dateFin = new Date(this.periodeselected.fin);
              if (this.periodeselected.fin == null) {
                _dateFin.setDate(_dateFin.getDate() - 1);
              }
              this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.periodeselected.debut)), fin: this.formatDate(new Date(_dateFin)), final: this.formatDate(new Date(this.periodeselected.fin)) }, exploitationid, true).subscribe({
                next: (_articles: any) => {
                  this.mouvemenstock = _articles;
                  this.articleService.getArticlesByExploitation(this.idexploitation || 0).subscribe({
                    next: (_values) => {
                      this.articles = _values;
                      for (const _article of this.articles) {
                        let _value = 0
                        for (const _mouvement of this.mouvemenstock) {
                          if (_mouvement.article_id === _article.id) {
                            _value += +_mouvement.inventaires + +_mouvement.achats - +_mouvement.ventes - +_mouvement.pertes;
                            _article.stock = _value;
                            _article.stockminimum = _article.articleexploitation[0].stockminimum;
                          }
                        }
                      }
                      this.nombrearticle = this.nombrestockminimum(this.articles);
                      this.isrefresh = false;
                    }
                  })
                }
              })
            } else {
              this.isrefresh = false;
            }
          }
        })
      }
    })
  }
  
  private formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // console.log(`${year}-${month}-${day} 00:00:00`)
    return `${year}-${month}-${day}`;
  }

  public operateurData: InterfaceOperateur = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    compteConnecte: false,
    actif: true,
    login_count: 0,
    code: '',
    fournisseurId: null,
    telephone: '',
    civilite: ''
  };

  public onLogout() {
    const id = sessionStorage.getItem('id') || 0;
    this.loginService.logout({ id: +id });
  }

  nombrestockminimum(_articles: InterfaceArticle[]) {
    let nb = 0;
    if (_articles && _articles.length > 0) {
      for (const _article of _articles) {
        if ((_article.stockminimum || 0) >= (_article.stock || 0)) {
          nb++;
        }
      }
    }
    return nb;
  }

  refreshdata(interval: number = 300000 ) {
    this.isrefresh = true;
    setInterval(() => {
      this.getstockminimum();
    }, interval)
  }

}
