import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, TooltipModule } from '@coreui/angular';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { InterfaceBonCommande } from 'src/app/shared/model/interface-bonCommande';

import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { ArticleService } from 'src/app/shared/service/article.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { InventairesService } from 'src/app/shared/service/inventaires.service';

@Component({
  selector: 'app-stock-minimum',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertModule, TooltipModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './stock-minimum.component.html',
  styleUrl: './stock-minimum.component.scss'
})
export class StockMinimumComponent implements OnInit {

  public centrerevenus: InterfaceCentreRevenu[];
  public exploitationsdefault: InterfaceExploitations[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public centrerevenusselected: number[];
  public exploitationsselected: number[];
  public articles: InterfaceArticle[];
  public boncommande: InterfaceBonCommande;

  position = 'top-end';
  visible = false;
  active = 1;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  public modifToggle = true;

  public periode: { debut: Date, fin: Date }[] = []
  public periodeselected: { debut: Date, fin: Date };
  public toggle: boolean = true;
  public togglestock: boolean = true;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idexploitations: number = 0;
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today,
  }
  public sorticon = 'fa-sort';
  public unitefilter: any[] = [];
  public headerchoice = '';

  public articlefournisseurs: InterfaceArticlefournisseurs[];
  public fournisseurs: {
    fournisseur: InterfaceFournisseur,
    articlefournisseurs: InterfaceArticlefournisseurs[];
  }[] = [];

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

  toggleToast(_message: string) {
    this.message = _message;
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private articleService: ArticleService,
    private inventaireService: InventairesService,
    public fournisseurService: FournisseurService,
    private datePipe: DatePipe
  ) {
    this.headerchoice = '';
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetExploitation();
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.headerchoice = '';
        this.centrerevenus = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];

        this.exploitationService.getExploitation().subscribe({
          next: async (_exploitation) => {
            this.exploitations = _exploitation;
            if (this.isAdmin === true) {
              this.exploitations = this.exploitations.filter(e => e.id !== this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId !== this.idexploitation);
            } else {
              this.exploitations = this.exploitations.filter(e => e.id == this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId == this.idexploitation);
            }
            this.exploitationsdefault = this.exploitations;
            this.exploitations[0].selected = true;
            this.exploitationsselected = [this.exploitations[0].id || 0];
            this.headerchoice = this.exploitations[0].libelle;
            this.exploitation = this.exploitations[0];
            await this.selectExploitations(this.exploitation);
            this.inventaireService.getPeriode(this.exploitationsselected, true).subscribe({
              next: (value: any) => {
                this.periode = value;
                for (const _date of this.periode) {
                  if (_date.fin == null) {
                    _date.fin = new Date();
                  }
                }
                console.log(this.periode)
                if (this.periode.length > 0) {
                  const _index = this.periode.length - 1;
                  const _periode = this.periode[_index]
                  this.periodeselected = this.periode[_index];
                  if (this.periodeselected.fin == null) {
                    this.periodeselected.fin = new Date();
                  }
                  const _dateFin = new Date(this.periodeselected.fin);
                  _dateFin.setDate(_dateFin.getDate() - 1);
                  console.log(this.exploitations[0])
                  this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.periodeselected.debut)), fin: this.formatDate(new Date(_dateFin)), final: this.formatDate(new Date(this.periodeselected.fin)) }, this.exploitationsselected, true).subscribe({
                    next: (_articles: any) => {
                      this.mouvemenstock = _articles;
                      this.unitefilter = [];
                      this.dates.debut = new Date(_periode.debut);
                      this.dates.fin = new Date(_periode.fin ? _periode.fin : new Date());
                      this.articleService.getArticlesByExploitation(this.exploitations[0].id || 0).subscribe({
                        next: (_values) => {
                          this.articles = _values;
                          console.log(this.articles)
                          for (const _article of this.articles) {
                            let _value = 0
                            for (const _mouvement of this.mouvemenstock) {
                              if (_mouvement.article_id === _article.id) {
                                _value += _mouvement.inventaires + _mouvement.achats - _mouvement.ventes - _mouvement.pertes;
                                _article.stock = _value;
                                _article.stockminimum = _article.articleexploitation[0].stockminimum;
                              }
                            }
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  }

  ngOnInit(): void {
    // setInterval(this.refreshdata, 300000);
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  private formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // console.log(`${year}-${month}-${day} 00:00:00`)
    return `${year}-${month}-${day}`;
  }

  async selectExploitations(_exploitation: InterfaceExploitations) {
    this.exploitation = _exploitation;
    this.idexploitations = _exploitation.id ? _exploitation.id : 0;
  }

  private resetExploitation() {
    this.exploitation = {
      code_couleur: '',
      libelle: '',
      nbDecimal: 0,
      commentaire: '',
      siteWeb: '',
      codenaf: '',
      siret: '',
      logo: '',
      actif: false,
      adressesId: 0,
      selected: false,
      adresses: new Adress(),
      centreRevenu: [],
    }
  }

  submit() {
    const data: { stockminimum: number, articleexploitationid: number }[] = [];
    for (const _article of this.articles) {
      const _item = { stockminimum: _article.stockminimum || 0, articleexploitationid: _article.articleexploitation[0].id || 0 }
      data.push(_item);
    }
    this.articleService.updateStockminimum(data).subscribe({
      next: () => {
        this.toggleToast('Stock minimum mis à jour');
        this.modifToggle = true;
      }
    })
  }

  cancel() {
    this.refreshdata();
    this.modifToggleModal()
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  refreshdata() {
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.headerchoice = '';
        this.centrerevenus = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];

        this.exploitationService.getExploitation().subscribe({
          next: async (_exploitation) => {
            this.exploitations = _exploitation;
            if (this.isAdmin === true) {
              this.exploitations = this.exploitations.filter(e => e.id !== this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId !== this.idexploitation);
            } else {
              this.exploitations = this.exploitations.filter(e => e.id == this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId == this.idexploitation);
            }
            this.exploitationsdefault = this.exploitations;
            this.exploitations[0].selected = true;
            this.exploitationsselected = [this.exploitations[0].id || 0];
            this.headerchoice = this.exploitations[0].libelle;
            this.exploitation = this.exploitations[0];
            await this.selectExploitations(this.exploitation);
            this.inventaireService.getPeriode(this.exploitationsselected, true).subscribe({
              next: (value: any) => {
                this.periode = value;
                for (const _date of this.periode) {
                  if (_date.fin == null) {
                    _date.fin = new Date();
                  }
                }
                console.log(this.periode)
                if (this.periode.length > 0) {
                  const _index = this.periode.length - 1;
                  const _periode = this.periode[_index]
                  this.periodeselected = this.periode[_index];
                  if (this.periodeselected.fin == null) {
                    this.periodeselected.fin = new Date();
                  }
                  const _dateFin = new Date(this.periodeselected.fin);
                  _dateFin.setDate(_dateFin.getDate() - 1);
                  console.log(this.exploitations[0])
                  this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.periodeselected.debut)), fin: this.formatDate(new Date(_dateFin)), final: this.formatDate(new Date(this.periodeselected.fin)) }, this.exploitationsselected, true).subscribe({
                    next: (_articles: any) => {
                      this.mouvemenstock = _articles;
                      this.unitefilter = [];
                      this.dates.debut = new Date(_periode.debut);
                      this.dates.fin = new Date(_periode.fin ? _periode.fin : new Date());
                      this.articleService.getArticlesByExploitation(this.exploitations[0].id || 0).subscribe({
                        next: (_values) => {
                          this.articles = _values;
                          for (const _article of this.articles) {
                            let _value = 0
                            for (const _mouvement of this.mouvemenstock) {
                              if (_mouvement.article_id === _article.id) {
                                _value += _mouvement.inventaires + _mouvement.achats - _mouvement.ventes - _mouvement.pertes;
                                _article.stock = _value;
                                _article.stockminimum = _article.articleexploitation[0].stockminimum;
                              }
                            }
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
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

  commanderstock(_nbarticle: number = 0, _articles: InterfaceArticle[]) {
    this.articlefournisseurs = [];
    this.fournisseurs = [];
    if (_nbarticle > 0 && _articles.length > 0) {
      this.fournisseurService.getAllFournisseurByExploitation(this.idexploitation).subscribe({
        next: (_fournisseurs) => {
          const article = _articles.filter(_article => (_article.stock || 0) <= (_article.stockminimum || 0));
          article.forEach(_article => {
            let cout = 0;
            let conditionnements: any = null;
            _article.articlefournisseur.forEach(articlefournisseurs => {
              articlefournisseurs.conditionnement.forEach(conditionnement => {
                const coutactuel = conditionnement.prixAchat / conditionnement.coefficientAchatCommande / conditionnement.coefficientInventaireAchat / conditionnement.coefficientInventaire;
                if (_article.id === articlefournisseurs.articleId && coutactuel > cout) {
                  cout = coutactuel;
                  conditionnements = conditionnement;
                }
              })
            });
            _article.cout = cout;
            _article.conditionnement = conditionnements;
            // console.log(_article)
            this.togglestock = false;
            if (this.fournisseur(_article.articlefournisseur, _article.conditionnement?.articlefournisseurId || 0) != undefined) {
              const _articlefournisseur: InterfaceArticlefournisseurs = {
                articleId: _article.id || 0,
                fournisseurId: this.fournisseur(_article.articlefournisseur, _article.conditionnement?.articlefournisseurId || 0).fournisseurId,
                marque: '',
                prixReference: _article.conditionnement?.prixAchat || 0,
                prixReferencePrecedent: 0,
                commentaire: '',
                article: _article,
                fournisseur: this.fournisseur(_article.articlefournisseur, _article.conditionnement?.articlefournisseurId || 0),
                conditionnement: []
              }
              this.articlefournisseurs.push(_articlefournisseur);
            } else {
              const _articlefournisseur: InterfaceArticlefournisseurs = {
                articleId: _article.id || 0,
                fournisseurId: undefined,
                marque: '',
                prixReference: _article.conditionnement?.prixAchat || 0,
                prixReferencePrecedent: 0,
                commentaire: '',
                article: _article,
                fournisseur: undefined,
                conditionnement: []
              }
              this.articlefournisseurs.push(_articlefournisseur);
            }
          });
          for (const _fournisseur of _fournisseurs) {
            this.fournisseurs.push({
              fournisseur: _fournisseur,
              articlefournisseurs: this.articlefournisseurs.filter(_art => _art.fournisseurId == _fournisseur.id)
            });
          }
          this.fournisseurs.push({
            fournisseur: {
              raison_social: 'SANS FOURNISSEUR',
              actif: false,
              codeFournisseur: '',
              siret: '',
              codeNaf: '',
              tvaIntracom: '',
              web: '',
              codeComptable: '',
              modereglementId: 0,
              commentaires: '',
              adresseId: null,
              adresse: new Adress(),
              operateur: []
            },
            articlefournisseurs: this.articlefournisseurs.filter(_art => _art.fournisseurId == undefined)
          });
          console.log(this.fournisseurs)

        }
      })
    }
  }

  fournisseur(_articlefournisseurs: InterfaceArticlefournisseurs[], _idarticlefournisseur: number = 0) {
    let articlefournisseur: any;
    if (_articlefournisseurs.length > 0) {
      for (const _articlefournisseur of _articlefournisseurs) {
        if (_articlefournisseur.id == _idarticlefournisseur) {
          articlefournisseur = _articlefournisseur;
        }
      }
    }
    return articlefournisseur;
  }

  commander(fournisseurs: { fournisseur: InterfaceFournisseur, articlefournisseurs: InterfaceArticlefournisseurs[]; }) {
    console.log(fournisseurs)
  }
}
