import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent } from '@coreui/angular';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ArticleService } from 'src/app/shared/service/article.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { UnitesService } from 'src/app/shared/service/unites.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { InterfaceAchatDetail } from 'src/app/shared/model/interface-achatdetail';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InventairesService } from 'src/app/shared/service/inventaires.service';
import { VentesService } from 'src/app/shared/service/ventes.service';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import {
  ButtonDirective,
  ColComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { InterfaceFichetechnique } from 'src/app/shared/model/interface-fichetechnique';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, HighchartsChartModule, RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    ChartjsComponent],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  public articlesvariations: {
    id: number,
    libelle: string,
    prixactuel: number,
    prixprecedent: number,
    ecart: number,
    article: any
  }[] = [];

  public articlesvariationsBack: {
    id: number,
    libelle: string,
    prixactuel: number,
    prixprecedent: number,
    ecart: number,
    article: any
  }[] = [];

  public pertesData : any;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;

  public exploitationsselected: number[];

  public chartVariationArticle: Highcharts.Options;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;

  public articlevariationtoggle = true;

  public periode: { debut: Date, fin: Date }[] = []
  public periodeselected: { debut: Date, fin: Date | null };
  public isperiodeencours: boolean = false;
  public isfinperiode: boolean = false;
  public today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today,
  }
  public pertes: {
    perte: number,
    periode: number
  }[] = [];
  public perteperiode: string = 'Période en cours';
  public isperteperiode: boolean = true;
  // public pertetoggle: boolean = true;

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
    stock_initiale: number,
    prix: number
  }[] = [];

  public chiffreaffaire: {
    ca: number,
    cmr: number,
    cmt: number,
    debut: string,
    fin: string
  }[] = [];

  public mouvementsstocks: {
    mouvementstock: {
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
      stock_initiale: number,
      prix: number
    }[],
  }[] = [];

  public perte: {
    articlelibelle: string,
    articleId: number,
    perte: number,
    perteprecedent: number,
    cout: number,
    totalPertePrecedent: number,
    totalPerteEnCours: number,
    ecart:number
  }[] = [];

  public perteBack: {
    articlelibelle: string,
    articleId: number,
    perte: number,
    perteprecedent: number,
    cout: number,
    totalPertePrecedent?: number,
    totalPerteEnCours?: number,
    ecart?:number
  }[] = [];

  public nombrevente: number = 0;
  public venteshebdo: any = [];

  public data: any = {};
  public options: any = {};
  public datasets: {
    label: string,
    backgroundColor: string,
    borderColor: string,
    data: number[]
  }[] = [];
  public fichetechniques  : {
    fichetechnique: InterfaceFichetechnique,
    cout: 0,
    prix: 0,
    ecart:0,
  }[] = [];
  
  public fichetechniquesBack  : {
    fichetechnique: InterfaceFichetechnique,
    cout: 0,
    prix: 0,
    ecart:0,
  }[] = [];


  public optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 100,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  public labels: string[] = [];

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';

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
    private articleService: ArticleService,
    private uniteService: UnitesService,
    private exploitationService: ExploitationService,
    private centrerevenuService: CentreRevenuService,
    private inventaireService: InventairesService,
    private venteService: VentesService,
    private dashService: DashboardService,
    private datePipe: DatePipe,
    private sortFilterSearchService:SortFilterSearchService
  ) {
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.exploitations = [];
        this.centrerevenus = _centreRevenu;
        this.centrerevenusdefault = _centreRevenu;
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

            await this.getvariation(this.exploitations);

            this.exploitations[0].selected = true;
            this.exploitationsselected = [this.exploitations[0].id || 0];
            if (this.isAdmin === true) {
              for (const item of this.exploitations) {
                this.exploitationsselected.push(item.id || 0)
              }
            }
            this.exploitation = this.exploitations[0];

            await this.getMouvementStock(this.exploitationsselected);

          }
        });
      }
    });
  }

  private formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // console.log(`${year}-${month}-${day} 00:00:00`)
    return `${year}-${month}-${day}`;
  }

  private tritable(_array: any[]) {
    const tableauAvecIndex = _array.map((item, index) => ({ ...item, index }));
    tableauAvecIndex.sort((a, b) => b.index - a.index);
    return tableauAvecIndex.map(({ index, ...rest }) => rest);
  }

  private getrealdate(dateString: any) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate());

    return (`${year}-${month}-${day}`);
  }

  public periodeperte() {
    this.isperteperiode = !this.isperteperiode;
    // if (isnowperiode == true) {
    //   this.perteperiode = 'Période en cours';
    // } else {
    //   this.perteperiode = 'Période précédente';
    // }
  }

  private async getMouvementStock(_idexploitation: number[]) {
    this.inventaireService.getPeriode(_idexploitation, true).subscribe({
      next: (value: any) => {
        this.periode = value;
        console.log(value)
        if (this.periode.length > 0) {
          this.venteService.getVenteCrDate(this.exploitationsselected, this.getrealdate(this.periode[0].debut), this.getrealdate(this.periode[0].fin), true).subscribe({
            next: (_ventes: any) => {
              const _dateFin = new Date(this.periode[0].fin);
              _dateFin.setDate(_dateFin.getDate() - 1);
              let _chiffreaffaire = 0;

              for (const item of _ventes) {
                _chiffreaffaire += +item.montantttc;
              }
              console.log(this.getrealdate(this.periode[0].debut), this.getrealdate(this.periode[0].fin))
              // this.periodeselected = this.periode[0];
              this.articleService.getMouvementStock({ debut: this.getrealdate(this.periode[0].debut), fin: this.getrealdate(_dateFin), final: this.getrealdate(this.periode[0].fin) }, this.exploitationsselected, true).subscribe({
                next: (_articles: any) => {
                  this.chiffreaffaire.push({
                    ca: _chiffreaffaire,
                    cmr: this.getcout(_articles, 1),
                    cmt: this.getcout(_articles, 2),
                    debut: this.getrealdate(this.periode[0].debut),
                    fin: this.getrealdate(this.periode[0].fin)
                  });
                  let pertevalue = 0;
                  for (const _pertes of _articles) {
                    pertevalue += +_pertes.pertes;
                  }
                  this.pertes.push({
                    perte: pertevalue,
                    periode: 0
                  });
                  for (const _pertes of _articles) {
                    this.perte.push({
                      articlelibelle: _pertes.libelle,
                      articleId: _pertes.article_id,
                      perte: _pertes.pertes,
                      perteprecedent: 0,
                      cout: _pertes.cout,
                      totalPerteEnCours:+_pertes.pertes * +_pertes.cout,
                      totalPertePrecedent:0,
                      ecart:0
                    });
                  }
                  this.perteBack = this.perte
                  this.venteService.getVenteCrDate(this.exploitationsselected, this.getrealdate(this.periode[1].debut), this.getrealdate(new Date()), true).subscribe({
                    next: (_ventes: any) => {
                      // console.log(_ventes)
                      const _dateFin = new Date();
                      _dateFin.setDate(_dateFin.getDate() - 1);
                      this.articleService.getMouvementStock({ debut: this.getrealdate(this.periode[1].debut), fin: this.getrealdate(new Date()), final: this.getrealdate(new Date()) }, this.exploitationsselected, true).subscribe({
                        next: async (_articles: any) => {
                          _chiffreaffaire = 0;
                          for (const item of _ventes) {
                            _chiffreaffaire += +item.montantttc;
                          }
                          this.chiffreaffaire.push({
                            ca: _chiffreaffaire,
                            cmr: this.getcout(_articles, 1),
                            cmt: this.getcout(_articles, 2),
                            debut: this.getrealdate(this.periode[0].debut),
                            fin: this.getrealdate(new Date())
                          })
                          let pertevalue = 0;
                          for (const _pertes of _articles) {
                            pertevalue += +_pertes.pertes;
                          }
                          this.pertes.push({
                            perte: pertevalue,
                            periode: 1
                          });
                          for (const _pertes of _articles) {
                            for (const _perte of this.perte) {
                              if (_perte.articleId === _pertes.article_id) {
                                const pertePrecedent = +_pertes.pertes;
                                const totalPertePrecedent =  pertePrecedent * +_perte.cout
                                const totalPerteEnCours = +_perte.totalPerteEnCours
                                // const ecart = ((_perte.totalPerteEnCours - +totalPertePrecedent) / _perte.totalPerteEnCours) * 100;
                                const ecartPourcentage = Math.abs(totalPertePrecedent - totalPerteEnCours) / totalPerteEnCours  * 100;

                                Object.assign(_perte, {
                                  perteprecedent: pertePrecedent,
                                  totalPertePrecedent : totalPertePrecedent,
                                  ecart : ecartPourcentage
                                })
                              }
                            }
                            // this.perte.push({
                            //   articlelibelle: _pertes.libelle,
                            //   articleId: _pertes.article_id,
                            //   perte: _pertes.pertes,
                            //   valorisation: _pertes.cout * _pertes.pertes,
                            //   periode: 1
                            // });
                          }

                          this.perteBack = this.perte
                          this.nombrevente = _ventes.filter((vente: any) => this.getrealdate(new Date(vente.date_vente)) == this.getrealdate(new Date())).length;
                          this.venteshebdo = _ventes.filter((vente: any) => this.getrealdate(new Date(vente.date_vente)) == this.getrealdate(new Date()));
                          const nbventedate = await this.countSalesByDate(_ventes);

                          for (const vente of _ventes) {
                            if (this.getrealdate(new Date(vente.date_vente)) == this.getrealdate(new Date('2024-06-06'))) {
                              for (const ft of vente.ventedetail) {
                                this.fichetechniques.push({
                                  fichetechnique: ft.fichetechnique,
                                  cout: 0,
                                  prix: ft.prixttc,
                                  ecart: ft.prixttc,
                                })
                              }
                            }
                          }
                          this.fichetechniques = this.getUniqueFt(this.fichetechniques)

                          this.fichetechniquesBack = this.fichetechniques;
                          this.labels = nbventedate.labels;
                          const resultArray = [];
                          for (const property in nbventedate.ventes) {
                            const value = nbventedate.ventes[property];
                            resultArray.push(value);
                          }
                          const _data = [];
                          for (let index = resultArray.length - 1; index >= 0; index--) {
                            const element = resultArray[index];
                            _data.push(element)
                          }
                          // console.log(_data)
                          this.datasets = [
                            {
                              label: '',
                              backgroundColor: 'transparent',
                              borderColor: 'rgba(255,255,255,.55)',
                              data: _data
                            }
                          ]
                          this.data = {
                            labels: this.labels.slice(0, 7),
                            datasets: this.datasets
                          };
                          this.options = this.optionsDefault;
                          console.log(this.pertes)
                        }
                      });
                    }
                  })
                }
              })
            }
          })
        }
      }
    });
  }

  private async countSalesByDate(ventes: any[]) {
    const uniqueDates = [...new Set(ventes.map(vente => this.getrealdate(new Date(vente.date_vente))))];
    uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const recentDates = uniqueDates.slice(0, 7);
    const recentSales = ventes.filter(vente => recentDates.includes(this.getrealdate(new Date(vente.date_vente))));
    const ventesCountByDate = recentSales.reduce((acc, vente) => {
      const venteDate = this.getrealdate(new Date(vente.date_vente));
      if (!acc[venteDate]) {
        acc[venteDate] = 0;
      }
      acc[venteDate]++;
      return acc;
    }, {});
    return { labels: recentDates, ventes: ventesCountByDate };
  }

  private getUniqueFt(_fichetechniques: {
    fichetechnique: InterfaceFichetechnique,
    cout: 0,
    prix: 0,
    ecart:0
  }[]) {
    // Objet pour garder la trace du coût le plus bas pour chaque id
    const coutMinParId: {
      [key: number]: {
        fichetechnique: InterfaceFichetechnique,
        cout: 0,
        prix: 0,
        ecart:0
      }
    } = {};

    // Parcourir chaque vente
    _fichetechniques.forEach(fichetechnique => {
      const ftId = fichetechnique.fichetechnique.id;
      const prix = fichetechnique.prix;

      // Si l'id n'est pas encore dans l'objet ou si le coût actuel est inférieur au coût enregistré
      if (ftId && (!coutMinParId[ftId] || prix < coutMinParId[ftId].prix)) {
        coutMinParId[ftId] = fichetechnique;
      }
    });

    // Retourner les valeurs de l'objet sous forme de tableau
    return Object.values(coutMinParId);
  }

  getcoutvente(id: number,) {

  }

  private getcout(_mouvements: {
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
    stock_initiale: number,
    prix: number
  }[], type: number = 0) {
    let total = 0;
    if (_mouvements) {
      for (const _mouvement of _mouvements) {
        switch (type) {
          case 0:
            total += +_mouvement.inventaires * +_mouvement.cout;
            break;
          case 1:
            total += +_mouvement.inventairesfinal * +_mouvement.cout;
            break;
          case 2:
            total += (+_mouvement.inventaires - +_mouvement.pertes - +_mouvement.ventes + +_mouvement.achats) * +_mouvement.cout;
            break;

          default:
            break;
        }
      }
    }
    return total;
  }

  private async getvariation(_exploitations: InterfaceExploitations[]) {
    let idexploitations: number[] = [];
    for (const item of _exploitations) {
      idexploitations.push(item.id || 0)
    }
    this.dashService.getVariationArticle(idexploitations).subscribe({
      next: (articles: any) => {
        // this.articlesvariations = articles;
        for (const article of articles) {
          if (article.achatDetail.length == 0) {
            this.articlesvariations.push({
              id: article.id,
              libelle: article.libelle,
              prixactuel: this.valeurLaPlusHaute(article.articlefournisseur),
              prixprecedent: 0,
              ecart: ((this.valeurLaPlusHaute(article.articlefournisseur) - 0) / this.valeurLaPlusHaute(article.articlefournisseur)) * 100,
              article: article
            })
          }
          if (article.achatDetail.length == 1) {
            this.articlesvariations.push({
              id: article.id,
              libelle: article.libelle,
              prixactuel: article.articlefournisseur[0].prixReference,
              prixprecedent: article.articlefournisseur[0].prixReferencePrecedent,
              ecart: ((article.articlefournisseur[0].prixReference - article.articlefournisseur[0].prixReferencePrecedent) / article.articlefournisseur[0].prixReferencePrecedent) * 100,
              article: article
            })
          }
          if (article.achatDetail.length > 1) {
            this.articlesvariations.push({
              id: article.id,
              libelle: article.libelle,
              prixactuel: article.achatDetail[article.achatDetail.length - 1].prixArticle,
              prixprecedent: article.achatDetail[article.achatDetail.length - 2].prixArticle,
              ecart: ((article.achatDetail[article.achatDetail.length - 1].prixArticle - article.achatDetail[article.achatDetail.length - 2].prixArticle) / article.achatDetail[article.achatDetail.length - 1].prixArticle) * 100,
              article: article
            })
          }
          // console.log(this.articlesvariations)
        }
        this.articlesvariationsBack = this.articlesvariations;
      }
    })
  }

  private valeurLaPlusHaute(tableauDePrix: InterfaceArticlefournisseurs[]) {
    if (tableauDePrix.length === 0) {
      const prix: number = 0;
      return prix;
    }
    const prix: number = Math.max(...tableauDePrix.map(item => item.prixReference));
    return prix;
  }

  ngOnInit(): void {

  }

  getchartarticlevariation(article: {
    id: number,
    libelle: string,
    prixactuel: number,
    prixprecedent: number,
    ecart: number,
    article: any
  } | null) {
    this.articlevariationtoggle = !this.articlevariationtoggle;
    console.log(article?.article)

    this.chartVariationArticle = {
      xAxis: {
        categories: []
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        }
      },
      series: [{
        type: 'line',
        data: []
      }]
    };

    if (article != null) {
      this.chartVariationArticle = {
        xAxis: {
          categories: this.getData(article).categories
        },
        yAxis: {
          title: {
            text: 'Prix (€)'
          }
        },
        title: {
          text: article.libelle.toUpperCase()
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          spline: {
            lineWidth: 4,
            states: {
              hover: {
                lineWidth: 5
              }
            },
            marker: {
              enabled: false
            },
          }
        },
        series: [{
          type: 'spline',
          name: article.libelle,
          data: this.getData(article).data
        }]
      };
    }
  }

  private getData(article: {
    id: number,
    libelle: string,
    prixactuel: number,
    prixprecedent: number,
    ecart: number,
    article: any
  } | null) {
    // this.bordercolor = event.point.color;
    let _id: number[] = [];
    const data = [];
    const categories = [];
    for (const item of article?.article.achatDetail) {
      data.push(item.prixArticle)
      const date = item.achat.dateAchat.split('-')[2].substring(0, 2) + '/' + item.achat.dateAchat.split('-')[1] + '/' + item.achat.dateAchat.split('-')[0];
      categories.push(date)
    }
    console.log(categories)
    return { data: data, categories: categories }
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  screenHour(_date: Date) {
    const date = new Date(_date);
    return date.getHours() + ':' + date.getMinutes()
    // console.log(new Date(date));
  }

  onSortArticleVariation(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.articlesvariations, colonne, type, this.articlesvariationsBack);
  }

  onSearchArticleVariation(event: any, colonne: any) {
    this.articlesvariations =  this.sortFilterSearchService.handleSearch(event, this.articlesvariations, colonne, this.articlesvariationsBack);
  }

  onSortAnalyseVentes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.fichetechniques, colonne, type, this.fichetechniquesBack);
  }

  onSearchAnalyseVentes(event: any, colonne: any) {
    this.fichetechniques =  this.sortFilterSearchService.handleSearch(event, this.fichetechniques, colonne, this.fichetechniquesBack);
  }

  onSortPertes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.perte, colonne, type, this.perteBack ) ;
  }

  onSearchPertes(event: any, colonne: any) {
     this.perte   =  (this.sortFilterSearchService.handleSearch(event, this.perte , colonne, this.perteBack )) ;
  }

}
