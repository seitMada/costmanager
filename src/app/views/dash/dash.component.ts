import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/operators';

import { ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, TooltipDirective } from '@coreui/angular';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { Observable } from 'rxjs';
import { PpoService } from 'src/app/shared/service/ppo.service';
import { FichetechniqueService } from 'src/app/shared/service/fichetechnique.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, ToasterComponent, ToastComponent, ToastHeaderComponent,
    ToastBodyComponent, HighchartsChartModule, RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    ChartjsComponent,
    NgbModule,
    NgbTooltipModule,
    TooltipDirective

  ],
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

  public articleFt: {
    id: number,
    libelleFt: string,
    articleId: number
  }[] = [];

  public pertesData: any;
  public valorisationarticlesFT: {
    id: number,
    libelle: string,
    quantite: number,
    valorisation: number,
    unite: string,
    fichetechnique: {
      id: number,
      libelleFt: string,
      articleId: number
    }
  }[] = [];

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;

  public exploitationsselected: number[];
  public centrerevenusselected: number[];
  public article: InterfaceArticle;

  public chartVariationArticle: Highcharts.Options;
  public chartOptionsHistogramme: Highcharts.Options;
  public chartPerteArticle: Highcharts.Options;
  public chartOptionsMontantPerteArticle: Highcharts.Options;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public operateurId = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : 0;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public montantPerteEnCours: number = 0;
  public montantPertePrecedent: number = 0;

  public articlevariationtoggle = true;
  public pertechartetoggle = false;

  public bordercolor = '#FFFFFF';

  public ppodetailsarticlebyfamille: { libelle: '', id: 0, unite: '', familleColor: '', totalCost: '', totalQuantity: '' }[];

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
    periode: number,
  }[] = [];
  public perteperiode: string = 'Période en cours';
  public isperteperiode: boolean = true;
  public isarticleFt: boolean = true;

  public isstock: boolean = true;


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

  public valorisationStock: {
    articleId: number,
    articleLibelle: string,
    stockInventaire: number,
    stockTheorique: number,
    dateInventaire: Date,
    valorisationInventaire: number,
    valorisationTechnique: number,
    unite: string,
    stockmin: number
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
    ecart: number
  }[] = [];

  public perteBack: {
    articlelibelle: string,
    articleId: number,
    perte: number,
    perteprecedent: number,
    cout: number,
    totalPertePrecedent?: number,
    totalPerteEnCours?: number,
    ecart?: number
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
  public fichetechniques: {
    fichetechnique: InterfaceFichetechnique,
    cout: number,
    prix: number,
    ecart: number,
  }[] = [];

  public fichetechniquesBack: {
    fichetechnique: InterfaceFichetechnique,
    cout: number,
    prix: number,
    ecart: number,
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
    private fichetechniqueService: FichetechniqueService,
    private venteService: VentesService,
    private dashService: DashboardService,
    private ppoService: PpoService,
    private datePipe: DatePipe,
    private sortFilterSearchService: SortFilterSearchService
  ) {
    this.centrerevenuService.getCrExploitation(this.idexploitation, this.isAdmin).subscribe({
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
            this.initialiseChart();
            this.getMontantPerteEnCours();
            this.getMontantPertePrecedent();

            this.getValorisationArticleFt();
            this.getValorisationStock();

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


  ngOnInit(): void {
  }

  private formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private tritable(_array: any[]) {
    const tableauAvecIndex = _array.map((item, index) => ({ ...item, index }));
    tableauAvecIndex.sort((a, b) => b.index - a.index);
    return tableauAvecIndex.map(({ index, ...rest }) => rest);
  }

  private getrealdate(dateString: any) {
    if (dateString != null) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
      const day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate());

      return (`${year}-${month}-${day}`);
    } else {
      const date = new Date(this.today);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
      const day = (date.getDate()) < 10 ? '0' + (date.getDate()) : (date.getDate());
      return (`${year}-${month}-${day}`);
    }
  }

  public periodeperte() {
    this.isperteperiode = !this.isperteperiode;





  }

  private transformDate = (inputDate: Date): string => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  private async getMouvementStock(_idexploitation: number[]) {

    this.inventaireService.getPeriode(_idexploitation, true).subscribe({
      next: (value: any) => {
        this.periode = value;
        if (this.periode.length > 0) {
          if (!this.periode[0].fin) {
            this.periode[0].fin = new Date();
          }
          this.venteService.getVenteCrDate(this.exploitationsselected, this.transformDate(this.periode[0].debut), this.transformDate(this.periode[0].fin), true).subscribe({
            next: (_ventes: any) => {
              if (this.periode[0].fin === null) {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                this.periode[0].fin = tomorrow;
              }
              const _dateFin = new Date(this.periode[0].fin);


              _dateFin.setDate(_dateFin.getDate() - 1);
              let _chiffreaffaire = 0;

              for (const item of _ventes) {
                _chiffreaffaire += +item.montantttc;
              }


              this.articleService.getMouvementStock({ debut: this.transformDate(this.periode[0].debut), fin: this.transformDate(_dateFin), final: this.transformDate(this.periode[0].fin) }, this.exploitationsselected, true).subscribe({
                next: (_articles: any) => {

                  this.chiffreaffaire.push({
                    ca: _chiffreaffaire,
                    cmr: this.getcout(_articles, 1),
                    cmt: this.getcout(_articles, 2),
                    debut: this.getrealdate(this.periode[0].debut) !== undefined ? this.getrealdate(this.periode[0].debut) : this.getrealdate(new Date()),
                    fin: this.getrealdate(this.periode[0].fin) !== undefined ? this.getrealdate(this.periode[0].fin) : this.getrealdate(new Date())
                  });

                  console.log(this.chiffreaffaire)

                  let pertevalue = 0;
                  for (const _pertes of _articles) {
                    pertevalue += +_pertes.pertes;
                  }
                  this.pertes.push({
                    perte: pertevalue,
                    periode: 0
                  });

                  for (const _perte of _articles) {
                    this.perte.push({
                      articlelibelle: _perte.libelle,
                      articleId: _perte.article_id,
                      perte: _perte.pertes,
                      perteprecedent: 0,
                      cout: _perte.cout,
                      totalPerteEnCours: +_perte.pertes * +_perte.cout,
                      totalPertePrecedent: 0,
                      ecart: 0
                    });
                  }
                  this.perteBack = this.perte;
                  if (!this.periode[1]) {
                    this.periode.push({ debut: new Date(), fin: new Date() })
                  }
                  this.venteService.getVenteCrDate(this.exploitationsselected, this.transformDate(this.periode[1].debut), this.transformDate(new Date()), true).subscribe({
                    next: (_ventes: any) => {

                      const _dateFin = new Date();
                      _dateFin.setDate(_dateFin.getDate() - 1);
                      if (new Date(_dateFin) > new Date(this.periode[1].debut)) {
                        _dateFin.setDate(_dateFin.getDate());
                      }
                      this.articleService.getMouvementStock({ debut: this.transformDate(this.periode[1].debut), fin: this.transformDate(_dateFin), final: this.transformDate(new Date()) }, this.exploitationsselected, true).subscribe({
                        next: async (_articles: any) => {
                          _chiffreaffaire = 0;
                          for (const item of _ventes) {
                            _chiffreaffaire += +item.montantttc;
                          }
                          this.chiffreaffaire.push({
                            ca: _chiffreaffaire,
                            cmr: this.getcout(_articles, 1),
                            cmt: this.getcout(_articles, 2),
                            debut: this.getrealdate(this.periode[1].debut) !== undefined ? this.getrealdate(this.periode[1].debut) : this.getrealdate(new Date()),
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
                                const totalPertePrecedent = pertePrecedent * +_perte.cout
                                const totalPerteEnCours = +_perte.totalPerteEnCours

                                const ecartPourcentage = Math.abs(totalPertePrecedent - totalPerteEnCours) / totalPerteEnCours * 100;

                                Object.assign(_perte, {
                                  perteprecedent: pertePrecedent,
                                  totalPertePrecedent: totalPertePrecedent,
                                  ecart: ecartPourcentage
                                })
                              }
                            }
                          }
                          this.perteBack = this.perte
                          this.nombrevente = _ventes.filter((vente: any) => this.getrealdate(new Date(vente.date_vente)) == this.getrealdate(new Date())).length;
                          this.venteshebdo = _ventes.filter((vente: any) => this.getrealdate(new Date(vente.date_vente)) == this.getrealdate(new Date()));
                          const nbventedate = await this.countSalesByDate(_ventes);

                          this.venteService.getVenteCrDate(this.exploitationsselected, this.transformDate(this.periode[0].debut), this.transformDate(new Date()), true).subscribe({
                            next: (_ventesanalyse: any) => {
                              this.fichetechniqueService.getFichetechniqueByExploitation(this.idexploitation).subscribe({
                                next: (_fichetechniquesExploitations) => {
                                  for (const vente of _ventesanalyse) {
                                    for (const ft of vente.ventedetail) {
                                      for (const fte of _fichetechniquesExploitations) {
                                        if (fte.id == ft.fichetechniqueId) {
                                          // if (ft.fichetechniqueId == 191 && fte.id == 191) {
                                          // console.log(ft)
                                          let _cout: number = 0;
                                          for (const _composition of fte.composition) {
                                            if (_composition.article?.articlefournisseur.length > 0) {
                                              for (const _articlefournisseur of _composition.article.articlefournisseur) {
                                                _cout += _articlefournisseur.prixReference * _composition.quantite;
                                              }
                                            }
                                          }
                                          this.fichetechniques.push({
                                            fichetechnique: ft.fichetechnique,
                                            cout: _cout,
                                            prix: ft.prixttc,
                                            ecart: ft.prixttc - _cout
                                          })
                                        }
                                      }
                                    }
                                  }
                                  this.fichetechniques = this.getUniqueFt(this.fichetechniques);
                                  this.fichetechniquesBack = this.fichetechniques;
                                },
                              });
                            }
                          })


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

                        }
                      });
                    }
                  })
                }
              })
            }
          })
        } else {
          this.chiffreaffaire.push({
            ca: 0,
            cmr: 0,
            cmt: 0,
            debut: this.getrealdate(new Date()),
            fin: this.getrealdate(new Date())
          })
          this.chiffreaffaire.push({
            ca: 0,
            cmr: 0,
            cmt: 0,
            debut: this.getrealdate(new Date()),
            fin: this.getrealdate(new Date())
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
    cout: number,
    prix: number,
    ecart: number
  }[]) {

    const coutMinParId: {
      [key: number]: {
        fichetechnique: InterfaceFichetechnique,
        cout: number,
        prix: number,
        ecart: number
      }
    } = {};


    _fichetechniques.forEach(fichetechnique => {
      const ftId = fichetechnique.fichetechnique.id;
      const prix = fichetechnique.prix;


      if (ftId && (!coutMinParId[ftId] || prix < coutMinParId[ftId].prix)) {
        coutMinParId[ftId] = fichetechnique;
      }
    });


    return Object.values(coutMinParId);
  }

  getcoutvente(id: number,) {

  }

  private getDataPerte(articleid: number): Observable<{ data: number[], categories: string[] }> {
    return this.dashService.getPpoByArticle(articleid, this.operateurId).pipe(
      map(_articles => {
        const data: number[] = [];
        const categories: string[] = [];
        for (const item of _articles) {
          for (const line of item.ppodetailarticle) {
            data.push(line.cout);
          }

          const date = (item.date_ppo.split('-')[2].substring(0, 2)) + '/' + item.date_ppo.split('-')[1] + '/' + item.date_ppo.split('-')[0];
          categories.push(date);
        }
        return { data, categories };
      })
    );
  }

  getchartstockarticle(results: {
    articleId: number,
    articleLibelle: string,
    stockInventaire: number,
    stockTheorique: number,
    dateInventaire: Date,
    valorisationInventaire: number,
    valorisationTechnique: number,
    unite: string,
    stockmin: number
  } | null) {
    this.isstock = !this.isstock;

    this.chartOptionsHistogramme = {
      xAxis: {
        categories: []
      },
      plotOptions: {
        series: {
          allowPointSelect: true
        }
      },
      series: [{
        type: 'column',
        data: []
      }]
    };

    if (results != null) {
      this.getDataStock(results.articleId).subscribe({
        next: (result) => {
          this.chartOptionsHistogramme = {
            xAxis: {
              categories: result.categories
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            title: {
              text: results.articleLibelle.toUpperCase() + ' (' + results.unite + ')'
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
                }
              }
            },
            series: [{
              type: 'column',
              name: results.articleLibelle,
              data: result.data
            }]
          };
        },
      });
    }
  }

  getDataStock(articleId: number) {
    return this.dashService.getstockArticle(articleId, this.operateurId).pipe(
      map(_articleinventaire => {
        const data = [];
        const categories = [];
        const unite = [];
        if (_articleinventaire.length > 0) {
          for (const _article of _articleinventaire) {
            data.push(_article.quantite);
            if (_article.inventaire && _article.inventaire.date_inventaire) {
              const dateParts = _article.inventaire.date_inventaire.split('-');
              if (dateParts.length === 3) {
                const date = `${dateParts[2].substring(0, 2)}/${dateParts[1]}/${dateParts[0]}`;
                categories.push(date);
              }
            }
            unite.push(_article.unite.abreviation);
          }
        }
        return { data: data, categories: categories, unite: unite };
      })
    );
  }

  getchartarticleperte(results: {
    articlelibelle: string,
    articleId: number,
    perte: number,
    perteprecedent: number,
    cout: number
  } | null) {
    this.isperteperiode = !this.isperteperiode;

    this.chartPerteArticle = {
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

    if (results != null) {
      this.getDataPerte(results.articleId).subscribe({
        next: (result) => {
          this.chartPerteArticle = {
            xAxis: {
              categories: result.categories
            },
            yAxis: {
              title: {
                text: 'Prix (€)'
              }
            },
            title: {
              text: results.articlelibelle.toUpperCase()
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
                }
              }
            },
            series: [{
              type: 'spline',
              name: results.articlelibelle,
              data: result.data
            }]
          };
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
    }
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
              ecart: article.articlefournisseur[0].prixReferencePrecedent !== 0 ? ((article.articlefournisseur[0].prixReference - article.articlefournisseur[0].prixReferencePrecedent) / article.articlefournisseur[0].prixReferencePrecedent) * 100
                : 100,
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

  initialiseChart() {
    this.chartOptionsMontantPerteArticle = {
      time: {
        Date: new Date(),
      },
      accessibility: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.options.y:.2f} €</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.options.y:.2f} €',
            distance: -50,
            softConnector: true,
            connectorWidth: this.perte.length
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
        }
      },
      title: {
        text: "Montant du perte en cours",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: [],
        },
      ],
    };
  }
  async showchartperte() {
    this.inventaireService.getPeriode(this.exploitationsselected, true).subscribe({
      next: async (value: any) => {
        this.periode = value;
        let dayNow = new Date();
        if (this.periode[0].fin != null) {
          dayNow = this.periode[0].fin;
        }

        this.dates = {
          debut: new Date(this.getrealdate(this.periode[0].debut)),
          fin: new Date(this.getrealdate(dayNow))
        };
        const data = {
          exploitation: this.exploitationsselected.length > 0,
          id: this.exploitationsselected,
          date: this.dates
        }
        this.ppoService.getPpoDetailData(data).subscribe({
          next: async (_response: any) => {
            let _categories: any[] = [];
            const _dataquantityarticle: { y: number; name: any; color: any; id: any; exploitation: boolean; }[] | { y: number; name: string; color: string; }[] = [];
            const _datacostarticle = [];
            for (const _ppodetails of _response.article) {
              _categories.push(_ppodetails.familleLibelle);
              const dataqtyarticle = {
                y: +_ppodetails.totalQuantity,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              const datacostarticle = {
                y: +_ppodetails.totalCost,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              _dataquantityarticle.push(dataqtyarticle);
              _datacostarticle.push(datacostarticle);
            }
            this.pertechartetoggle = !this.pertechartetoggle;
            this.syntheseMontantPerteArticle(_categories, _datacostarticle).then();
          }
        });
      }
    })
  }

  private async syntheseMontantPerteArticle(_categories: string[], _data: { y: number, name: string, color: string }[]) {
    Object.assign(this.chartOptionsMontantPerteArticle, {
      series: [
        {
          type: 'pie',
          data: _data
        },
      ],
    });
  }

  public formatDateRange(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const debutFormatted = this.dates.debut.toLocaleDateString('fr-FR', options);
    const finFormatted = this.dates.fin.toLocaleDateString('fr-FR', options);

    return this.dates.debut.getTime() === this.dates.fin.getTime()
      ? `depuis l'inventaire du ${debutFormatted}`
      : `entre l'inventaire du ${debutFormatted} au ${finFormatted}`;
  }

  public formatDateRangeVente(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const debutFormatted = this.dates.debut.toLocaleDateString('fr-FR', options);
    const finFormatted = this.dates.fin.toLocaleDateString('fr-FR', options);

    return this.dates.debut.getTime() === this.dates.fin.getTime()
      ? `depuis le ${debutFormatted}`
      : `entre ${debutFormatted} et ${finFormatted}`;
  }

  showFicheTechniques(article: any) {
    this.isarticleFt = !this.isarticleFt;
    this.articleFt = article.fichetechnique;
  }
  getTooltipText(article: any): string {
    if (article && article.fichetechnique) {
      return article.fichetechnique.map((ft: any) => ft.libelleFt).join('\n');
    }


    return 'No fichetechnique available';
  }

  hideFicheTechniques() {
    this.articleFt = [];
    this.isarticleFt = this.isarticleFt;
  }

  getValorisationArticleFt() {
    this.inventaireService.getPeriode(this.exploitations.map(item => item.id ? item.id : 0), true).subscribe({
      next: (_periode: any) => {
        this.dates = {
          debut: new Date(this.getrealdate(_periode[0].debut)),
          fin: new Date(this.getrealdate(_periode[0].fin))
        }
        console.log(_periode)
        const articleid = 0;
        this.dashService.getArticlePlusUtilise(this.transformDate(_periode[0].debut), _periode[0].fin == null ? this.transformDate(_periode[0].fin) : this.transformDate(new Date()), this.exploitations.map(item => item.id ? item.id : 0), articleid).subscribe({
          next: (_articles: any) => {
            console.log(_articles)
            // const results = this.getSommeQuantiteEtValorisationArticle(_articles);
            for (const article of _articles) {
              const articleVendu = {
                id: article.articleId,
                libelle: article.libelle,
                quantite: article.qteArticle,
                valorisation: article.valorisation,
                fichetechnique: article.fichetechnique,
                unite: article.abreviation
              };
              this.valorisationarticlesFT.push(articleVendu);
            }
          },
        })
      },
    });
  }

  getSommeQuantiteEtValorisationArticle(data: any) {
    const resultMap: { [key: string]: any } = {};
    data.forEach((item: any) => {
      const key = `${item.articleId}`;
      const fichetechnique = {
        id: item.fichetechniqueId,
        libelleFT: item.fichetechnique,
        articleId: item.articleId
      };
      if (!resultMap[key]) {
        resultMap[key] = { ...item, qteArticle: '0', valorisation: '0', fichetechnique: [] };
      }

      if (!resultMap[key].fichetechnique.some((ft: any) => ft.id === fichetechnique.id)) {
        resultMap[key].fichetechnique.push(fichetechnique);
      }

      resultMap[key].qteArticle = (parseFloat(resultMap[key].qteArticle || 0) + parseFloat(item.qteArticle || 0)).toFixed(2);
      resultMap[key].valorisation = (parseFloat(resultMap[key].valorisation || 0) + parseFloat(item.valorisation || 0)).toFixed(2);

    });
    return Object.values(resultMap);
  }

  getValorisationStock() {

    this.dashService.getValorisationStock(this.operateurId, this.exploitations.map(item => item.id ? item.id : 0)).subscribe({
      next: (_valorisations) => {
        const _valeur: any[] = [];
        for (const valeur of _valorisations) {
          _valeur.push({ date: this.getrealdate(valeur.date_inventaire), idarticle: valeur.articleId, idexploitation: this.exploitations.map(item => item.id ? item.id : 0) })
        }
        this.dashService.getvaleurStockTheorique(_valeur).subscribe({
          next: (_stocks) => {
            for (const _articles of _stocks) {
              for (const valeur of _valorisations) {
                if (valeur.articleId === _articles.articleId) {
                  const inventaire = {
                    articleId: valeur.articleId,
                    articleLibelle: valeur.libelle,
                    stockInventaire: _articles.quantite,
                    stockTheorique: Number(valeur.quantite) + Number(_articles.qteAchat) - Number(_articles.qteVente) - Number(_articles.qtePerte),
                    dateInventaire: new Date(valeur.date_inventaire),
                    valorisationInventaire: valeur.cout * valeur.quantite,
                    valorisationTechnique: (Number(valeur.quantite) + Number(_articles.qteAchat) - Number(_articles.qteVente) - Number(_articles.qtePerte)) * valeur.cout,
                    unite: valeur.abreviation,
                    stockmin: valeur.stockminimum
                  };
                  this.valorisationStock.push(inventaire);
                }
              }
            }
          },
        });
      },
    })
  }

  getMontantPerteEnCours(): number {
    let montant = 0;
    for (const _perte of this.perte) {
      montant += +_perte.perteprecedent * _perte.cout;
    }
    return montant;
  }

  getMontantPertePrecedent(): number {
    let montant = 0;
    for (const _perte of this.perte) {
      montant += +_perte.perte * _perte.cout;
    }
    return montant;
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

    let _id: number[] = [];
    const data = [];
    const categories = [];
    for (const item of article?.article.achatDetail) {
      data.push(item.prixArticle)
      const date = item.achat.dateAchat.split('-')[2].substring(0, 2) + '/' + item.achat.dateAchat.split('-')[1] + '/' + item.achat.dateAchat.split('-')[0];
      categories.push(date)
    }
    console.log(article)
    return { data: data, categories: categories }
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  screenHour(_date: Date) {
    const date = new Date(_date);
    return date.getHours() + ':' + date.getMinutes()

  }

  onSortArticleVariation(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.articlesvariations, colonne, type, this.articlesvariationsBack);
  }

  onSearchArticleVariation(event: any, colonne: any) {
    this.articlesvariations = this.sortFilterSearchService.handleSearch(event, this.articlesvariations, colonne, this.articlesvariationsBack);
  }

  onSortAnalyseVentes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.fichetechniques, colonne, type, this.fichetechniquesBack);
  }

  onSearchAnalyseVentes(event: any, colonne: any) {
    this.fichetechniques = this.sortFilterSearchService.handleSearch(event, this.fichetechniques, colonne, this.fichetechniquesBack);
  }

  onSortPertes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.perte, colonne, type, this.perteBack);
  }

  onSearchPertes(event: any, colonne: any) {
    this.perte = (this.sortFilterSearchService.handleSearch(event, this.perte, colonne, this.perteBack));
  }

}
