import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { CentreRevenuService } from "../../../shared/service/centre-revenu.service";
import { ExploitationService } from "../../../shared/service/exploitation.service";
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { PpoService } from 'src/app/shared/service/ppo.service';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { InterfaceFamilles } from 'src/app/shared/model/interface-familles';
import { FamillesService } from 'src/app/shared/service/familles.service';
import { InterfacePpoDetail, InterfacePpos } from 'src/app/shared/model/interface-ppos';

@Component({
  selector: 'app-synthese-ppos',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, FormsModule, NgbNavModule, HighchartsChartModule],
  templateUrl: './synthese-ppos.component.html',
  styleUrl: './synthese-ppos.component.scss'
})
export class SynthesePposComponent implements OnInit {

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusselected: number[];
  public exploitations: InterfaceExploitations[];
  public exploitationsselected: number[];
  public famillesarticles: InterfaceFamilles[];
  public famillesfichetechniques: InterfaceFamilles[];
  public pposarticle: InterfacePpos[] = [];
  public ppodetailsarticle: InterfacePpoDetail[] = [];
  public pposft: InterfacePpos[] = [];
  public ppodetailsft: InterfacePpoDetail[] = [];

  public ppodetails: InterfacePpoDetail[];
  public ppodetails_all: InterfacePpoDetail[];
  public nbarticle = 0;
  public nbft = 0;
  public nbfamille: { famille: '', famillecolor: '', nombre: 0 }[] = [];

  public ppodetailsarticlebyfamille: { libelle: '', id: 0, unite: '', familleColor: '', totalCost: '', totalQuantity: '' }[];
  public ppodetailsftbyfamille: { libelle: '', id: 0, unite: '', familleColor: '', totalCost: '', totalQuantity: '' }[];
  public ppodetailsftarticlebyfamille: { libelle: '', id: 0, unite: '', familleColor: '', totalCost: '', totalQuantity: '' }[];
  Highcharts: typeof Highcharts = Highcharts;

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';
  public bordercolor = '#FFFFFF';
  tranchedatesemaine: { debut: Date; fin: Date; }[];
  tranchedatemois: { debut: Date; fin: Date; }[];
  tranchedateannee: { debut: Date; fin: Date; }[];
  public headerchoice = '';

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

  public isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;

  public toggle = false;
  private modalService = inject(NgbModal);
  closeResult = '';
  active = 1;
  activeperte = 5;
  activeperteft = 1;
  activehistogramme = 1;

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }
  public categoriesfamille: any[] = [];

  public chartOptionsQuantitePerteArticle: Highcharts.Options;
  public chartOptionsMontantPerteArticle: Highcharts.Options;
  public chartOptionsQuantitePerteFt: Highcharts.Options;
  public chartOptionsMontantPerteFt: Highcharts.Options;
  public chartOptionsMontantPerteFtArticle: Highcharts.Options;
  public chartOptionsHistogramme: Highcharts.Options;
  public chartOptionsHistogrammeSemaine: Highcharts.Options;
  public chartOptionsHistogrammeMois: Highcharts.Options;
  public chartOptionsHistogrammeAnnee: Highcharts.Options;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private familleService: FamillesService,
    private ppoService: PpoService,
    private datePipe: DatePipe,
  ) {
    this.headerchoice = '';
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.exploitations = [];
    this.centrerevenus = [];
    this.initialiseChart();
    this.exploitationService.getExploitation().subscribe({
      next: async (_exploitations) => {
        this.exploitations = _exploitations;
        this.exploitations[0].selected = true;
        this.exploitationsselected = [this.exploitations[0].id || 0];
        this.headerchoice = this.exploitations[0].libelle;
        this.centrerevenuService.getcentrerevenu().subscribe({
          next: async (_centrerevenus) => {
            this.centrerevenus = _centrerevenus;
            if (this.isAdmin === true) {
              this.exploitations = this.exploitations.filter(e => e.id !== this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId !== this.idexploitation);
            } else {
              this.exploitations = this.exploitations.filter(e => e.id == this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId == this.idexploitation);
            }
          }
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.familleService.getFamilleByType('A').subscribe({
      next: (_familles) => {
        this.famillesarticles = _familles;
        this.ppodetailsarticlebyfamille = [{
          libelle: "",
          id: 0,
          unite: "",
          familleColor: "",
          totalCost: "",
          totalQuantity: "",
        }];
        this.ppodetailsftarticlebyfamille = [{
          libelle: "",
          id: 0,
          unite: "",
          familleColor: "",
          totalCost: "",
          totalQuantity: "",
        }];
      }
    });
    this.familleService.getFamilleByType('FT').subscribe({
      next: (_familles) => {
        this.famillesfichetechniques = _familles;
        this.ppodetailsftbyfamille = [{
          libelle: "",
          id: 0,
          unite: "",
          familleColor: "",
          totalCost: "",
          totalQuantity: "",
        }];
      }
    });
  }

  formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (fin == true) {
      return `${year}-${month}-${day} 23:59:59`;
    }
    return `${year}-${month}-${day} 00:01:00`;
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  initialise() {
    for (const _exploitation of this.exploitations) {
      _exploitation.selected = false;
    }
    for (const _centrerevenu of this.centrerevenus) {
      _centrerevenu.selected = false;
    }
  }

  generateRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private removeDuplicates<T>(array: T[]): T[] {
    const uniqueSet = new Set(array);
    return Array.from(uniqueSet);
  }

  private async initialiseChart() {
    this.chartOptionsMontantPerteFtArticle = {
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
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
          events: {
            click: (event) => {
              this.getTableauPerteFtArticle(event);
            }
          }
        }
      },
      title: {
        text: "Montant",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: []
        },
      ],
    };

    this.chartOptionsMontantPerteFt = {
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
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
          events: {
            click: (event) => {
              this.getTableauPerteFt(event);
            }
          }
        }
      },
      title: {
        text: "Montant",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: []
        },
      ],
    };

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
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
          events: {
            click: (event) => {
              this.getTableauPerteArticle(event);
            }
          }
        }
      },
      title: {
        text: "Montant",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: []
        },
      ],
    };

    this.chartOptionsQuantitePerteFt = {
      time: {
        Date: new Date(),
      },
      accessibility: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
            softConnector: true,
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
          events: {
            click: (event) => {
              this.getTableauPerteFt(event);
            }
          }
        }
      },
      title: {
        text: "Quantité",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: []
        },
      ],
    };

    this.chartOptionsQuantitePerteArticle = {
      time: {
        Date: new Date(),
      },
      accessibility: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.options.y:.2f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.options.y:.2f} %',
            distance: -50,
            softConnector: true,
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '98%',
          events: {
            click: (event) => {
              this.getTableauPerteArticle(event);
            }
          }
        }
      },
      title: {
        text: "Quantité",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        }
      },
      series: [
        {
          type: 'pie',
          data: []
        },
      ],
    };

    this.chartOptionsHistogramme = {
      time: {
        Date: new Date(),
      },
      chart: {
        type: 'column'
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        categories: [],

        accessibility: {
          description: 'Familles'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Euro €'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        backgroundColor:
          Highcharts.defaultOptions.legend?.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,

            formatter: function () {
              return this.y !== 0 ? this.y : null; // Hide label if y-value is 0
            }
          }
        }
      },
      title: {
        text: "€",
        align: "right",
        style: {
          fontSize: "5px",
          fontWeight: "bold"
        }
      },
      series: [],
    }

    this.chartOptionsHistogrammeSemaine = {
      time: {
        Date: new Date(),
      },
      chart: {
        type: 'column'
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        categories: [],

        accessibility: {
          description: 'Familles'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Euro €'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        backgroundColor:
          Highcharts.defaultOptions.legend?.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,

            formatter: function () {
              return this.y !== 0 ? this.y : null; // Hide label if y-value is 0
            }
          }
        }
      },
      title: {
        text: "€",
        align: "right",
        style: {
          fontSize: "5px",
          fontWeight: "bold"
        }
      },
      series: [],
    }

    this.chartOptionsHistogrammeMois = {
      time: {
        Date: new Date(),
      },
      chart: {
        type: 'column'
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        categories: [],

        accessibility: {
          description: 'Familles'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Euro €'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        backgroundColor:
          Highcharts.defaultOptions.legend?.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,

            formatter: function () {
              return this.y !== 0 ? this.y : null; // Hide label if y-value is 0
            }
          }
        }
      },
      title: {
        text: "€",
        align: "right",
        style: {
          fontSize: "5px",
          fontWeight: "bold"
        }
      },
      series: [],
    }

    this.chartOptionsHistogrammeAnnee = {
      time: {
        Date: new Date(),
      },
      chart: {
        type: 'column'
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        categories: [],
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Euro €'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        backgroundColor:
          Highcharts.defaultOptions.legend?.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,

            formatter: function () {
              return this.y !== 0 ? this.y : null; // Hide label if y-value is 0
            }
          }
        }
      },
      title: {
        text: "€",
        align: "right",
        style: {
          fontSize: "5px",
          fontWeight: "bold"
        }
      },
      series: [],
    }
  }

  private async syntheseMontantPerteFtArticle(_categories: string[], _data: { y: number, name: string, color: string }[]) {
    Object.assign(this.chartOptionsMontantPerteFtArticle, {
      series: [
        {
          type: 'pie',
          data: _data
        },
      ],
    });
  }

  private async syntheseMontantPerteFt(_categories: string[], _data: { y: number, name: string, color: string }[]) {
    Object.assign(this.chartOptionsMontantPerteFt, {
      series: [
        {
          type: 'pie',
          data: _data
        },
      ],
    });
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

  private async syntheseQuantitePerteFt(_categories: string[], _data: { y: number, name: string, color: string }[]): Promise<any> {
    return new Promise<void>(resolve => {
      Object.assign(this.chartOptionsQuantitePerteFt, {
        series: [
          {
            type: 'pie',
            data: _data
          },
        ],
      });
      resolve()
    })
  }

  private async syntheseQuantitePerteArticle(_categories: string[], _data: { y: number, name: string, color: string }[]): Promise<any> {
    return new Promise<void>(resolve => {
      Object.assign(this.chartOptionsQuantitePerteArticle, {
        series: [
          {
            type: 'pie',
            data: _data
          },
        ],
      });
      resolve()
    })
  }

  public histogramme(ppodetails: InterfacePpoDetail[], familles: string[], type: number = 1) {


    this.tranchedatesemaine = this.getWeeklySlices(new Date(this.dates.debut), new Date(this.dates.fin));
    this.tranchedatemois = this.getMonthlySlices(new Date(this.dates.debut), new Date(this.dates.fin));
    this.tranchedateannee = this.getYearlySlices(new Date(this.dates.debut), new Date(this.dates.fin));

    let data: any[] = [];

    data = [];
    const datadetail: any[] = [];
    for (const famille of familles) {
      let _valorisation = 0;
      let color = '#FFFFFF';
      for (const ppodetail of ppodetails) {
        if ((ppodetail.article != null && ppodetail.article.familles.libelle + '  (Article)' === famille) || (ppodetail.fichetechnique != null && ppodetail.fichetechnique.famille.libelle + '  (FT)' === famille)) {
          _valorisation += (ppodetail.cout);
          color = ppodetail.article ? ppodetail.article.familles.code_couleur : ppodetail.fichetechnique.famille.code_couleur;
        }
      }
      datadetail.push({
        name: famille,
        y: +_valorisation.toFixed(2),
        color: color
      });
    }
    Object.assign(this.chartOptionsHistogramme, {
      xAxis: {
        categories: familles,
      },
    });
    data.push({ data: datadetail });
    Object.assign(this.chartOptionsHistogramme, {
      series: data,
    });


    this.ppoService.getPpoDetails(this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected, this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), this.exploitationsselected.length > 0).subscribe({
      next: (_ppo: any) => {
        data = [];
        let ppodetails_tranche = [];
        for (const _date of this.tranchedatesemaine) {
          ppodetails_tranche = _ppo.filter((details: { ppo: { date_ppo: string | number | Date; }; }) => this.formatDate(new Date(details.ppo.date_ppo)) >= this.formatDate(new Date(_date.debut)) && this.formatDate(new Date(details.ppo.date_ppo)) <= this.formatDate(new Date(_date.fin)));
          const datadetail: any[] = [];
          if (ppodetails_tranche.length > 0) {
            for (const famille of familles) {
              let _valorisation = 0;
              for (const ppodetail of ppodetails_tranche) {
                if ((ppodetail.article != null && ppodetail.article.familles.libelle + '  (Article)' === famille) || (ppodetail.fichetechnique != null && ppodetail.fichetechnique.famille.libelle + '  (FT)' === famille)) {
                  _valorisation += (+ppodetail.cout * ppodetail.quantite);
                }
              }
              datadetail.push(+_valorisation.toFixed(2));
            }
            data.push({ data: datadetail, name: this.screenDate(new Date(_date.debut)) + '-' + this.screenDate(new Date(_date.fin)) });
          }
        }

        Object.assign(this.chartOptionsHistogrammeSemaine, {
          xAxis: {
            categories: familles,
          },
        });
        Object.assign(this.chartOptionsHistogrammeSemaine, {
          series: data,
        });


        data = [];
        ppodetails_tranche = [];
        for (const _date of this.tranchedatemois) {
          ppodetails_tranche = _ppo.filter((details: { ppo: { date_ppo: string | number | Date; }; }) => this.formatDate(new Date(details.ppo.date_ppo)) >= this.formatDate(new Date(_date.debut)) && this.formatDate(new Date(details.ppo.date_ppo)) <= this.formatDate(new Date(_date.fin)));
          const datadetail: any[] = [];
          if (ppodetails_tranche.length > 0) {
            for (const famille of familles) {
              let _valorisation = 0;
              for (const ppodetail of ppodetails_tranche) {
                if ((ppodetail.article != null && ppodetail.article.familles.libelle + '  (Article)' === famille) || (ppodetail.fichetechnique != null && ppodetail.fichetechnique.famille.libelle + '  (FT)' === famille)) {
                  _valorisation += (+ppodetail.cout * ppodetail.quantite);
                }
              }
              datadetail.push(+_valorisation.toFixed(2));
            }
            data.push({ data: datadetail, name: this.screenDate(new Date(_date.debut)) + '-' + this.screenDate(new Date(_date.fin)) });
          }
        }

        Object.assign(this.chartOptionsHistogrammeMois, {
          xAxis: {
            categories: familles,
          },
        });
        Object.assign(this.chartOptionsHistogrammeMois, {
          series: data,
        });



        data = [];
        ppodetails_tranche = [];
        for (const _date of this.tranchedateannee) {
          ppodetails_tranche = _ppo.filter((details: { ppo: { date_ppo: string | number | Date; }; }) => this.formatDate(new Date(details.ppo.date_ppo)) >= this.formatDate(new Date(_date.debut)) && this.formatDate(new Date(details.ppo.date_ppo)) <= this.formatDate(new Date(_date.fin)));
          const datadetail: any[] = [];
          if (ppodetails_tranche.length > 0) {
            for (const famille of familles) {
              let _valorisation = 0;
              for (const ppodetail of ppodetails_tranche) {
                if ((ppodetail.article != null && ppodetail.article.familles.libelle + '  (Article)' === famille) || (ppodetail.fichetechnique != null && ppodetail.fichetechnique.famille.libelle + '  (FT)' === famille)) {
                  _valorisation += (+ppodetail.cout * ppodetail.quantite);
                }
              }
              datadetail.push(+_valorisation.toFixed(2));
            }
            data.push({ data: datadetail, name: this.screenDate(new Date(_date.debut)) + '-' + this.screenDate(new Date(_date.fin)) });
          }
        }

        Object.assign(this.chartOptionsHistogrammeAnnee, {
          xAxis: {
            categories: familles,
          },
        });
        Object.assign(this.chartOptionsHistogrammeAnnee, {
          series: data,
        });
      }
    })
  }



  private getTableauPerteArticle(event: any) {

    this.bordercolor = event.point.color;
    let _id: number[] = [];
    const data = {
      date: this.dates,
      id: this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected,
      isexploitation: this.exploitationsselected.length > 0,
      idfamille: event.point.id
    };
    this.ppoService.getPpoDetailDataFamille(data).subscribe({
      next: (_data: any) => {
        this.ppodetailsarticlebyfamille = _data.article;


      }
    });
  }

  private getTableauPerteFtArticle(event: any) {
    this.bordercolor = event.point.color;
    let _id: number[] = [];


    const data = {
      date: this.dates,
      id: this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected,
      isexploitation: this.exploitationsselected.length > 0,
      idfamille: event.point.id
    };
    this.ppoService.getPpoDetailDataFamille(data).subscribe({
      next: (_data: any) => {

        this.ppodetailsftarticlebyfamille = _data.fichetechniquearticle;
      }
    });
  }

  private getTableauPerteFt(event: any) {
    this.bordercolor = event.point.color;
    let _id: number[] = [];
    const data = {
      date: this.dates,
      id: this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected,
      isexploitation: this.exploitationsselected.length > 0,
      idfamille: event.point.id
    };
    this.ppoService.getPpoDetailDataFamille(data).subscribe({
      next: (_data: any) => {

        this.ppodetailsftbyfamille = _data.fichetechnique;
      }
    });
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  calculCout(table: { libelle: '', id: 0, familleColor: '', totalCost: '', totalQuantity: '' }[]) {
    let data = { cout: 0, quantite: 0 };

    for (const item of table) {
      data.cout += +item.totalCost;
      data.quantite += +item.totalQuantity;
    }
    return data;
  }

  valorisationppodetails(_ppodetails: InterfacePpoDetail[], isArticle: boolean = true, familleId: number = 0) {
    let _famille: { famille: string, quantite: number, cout: number }[] = [];
    let dataarticle = { cout: 0, quantite: 0, famille: _famille };
    let dataft = { cout: 0, quantite: 0, famille: _famille };
    let data = { article: dataarticle, ft: dataft };
    if (_ppodetails) {
      for (const item of _ppodetails) {
        if (isArticle) {
          if (item.article != null) {
            dataarticle.quantite += item.quantite;
            dataarticle.cout += +item.cout;
            if (!dataarticle.famille.some(existingValue => JSON.stringify(existingValue.famille) === JSON.stringify(item.article.familles.libelle))) {
              dataarticle.famille.push({ famille: item.article.familles.libelle, quantite: +item.quantite, cout: +item.cout });
            } else {
              dataarticle.famille.forEach(element => {
                if (element.famille === item.article.familles.libelle) {
                  element.quantite += +item.quantite;
                  element.cout += +item.cout;
                }
              });
            }
          }
        } else {
          if (item.article == null) {
            dataft.quantite += item.quantite;
            dataft.cout += +item.cout;
            if (!dataft.famille.some(existingValue => JSON.stringify(existingValue.famille) === JSON.stringify(item.fichetechnique.famille.libelle))) {
              dataft.famille.push({ famille: item.fichetechnique.famille.libelle, quantite: +item.quantite, cout: +item.cout });
            } else {
              dataft.famille.forEach(element => {
                if (element.famille === item.fichetechnique.famille.libelle) {
                  element.quantite += +item.quantite;
                  element.cout += +item.cout;
                }
              });
            }
          }
        }
        data.article = dataarticle;
        data.ft = dataft;
      }
    }
    return data;
  }

  open() {
    this.toggle = !this.toggle;
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  dismiss(reason: any) {
    this.toggle = false;
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  validate() {
    this.exploitationsselected = [];
    this.centrerevenusselected = [];
    this.toggle = true;
    this.headerchoice = '';
    this.bordercolor = '#FFFFFF';
    this.categoriesfamille = [];
    for (const _exploitation of this.exploitations) {
      if (_exploitation.selected === true) {
        this.exploitationsselected.push(_exploitation.id || 0);
        this.headerchoice += _exploitation.libelle + ', ';
      }
    }
    for (const _centrerevenu of this.centrerevenus) {
      if (_centrerevenu.selected === true) {
        this.centrerevenusselected.push(_centrerevenu.id || 0);
        this.headerchoice += _centrerevenu.libelle + ', ';
      }
    }
    this.headerchoice.substring(0, this.headerchoice.length - 2);
    const data = {
      exploitation: this.exploitationsselected.length > 0,
      id: this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected,
      date: this.dates
    }
    this.ppoService.getPpoDetailData(data).subscribe({
      next: async (_response: any) => {

        this.ppoService.getPpoDetails(this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected, this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), this.exploitationsselected.length > 0).subscribe({
          next: (_ppo: any) => {
            let _categories: any[] = [];
            const _dataquantityarticle: { y: number; name: any; color: any; id: any; exploitation: boolean; }[] | { y: number; name: string; color: string; }[] = [];
            const _datacostarticle = [];
            this.ppodetailsarticle = [];
            for (const _ppodetails of _response.article) {
              this.ppodetailsarticle.push(_ppodetails);
              _categories.push(_ppodetails.familleLibelle);
              this.categoriesfamille.push(_ppodetails.familleLibelle + '  (Article)');
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

            this.syntheseMontantPerteArticle(_categories, _datacostarticle).then();




            _categories = [];
            const _dataquantityft = [];
            const _datacostft: { y: number; name: string; color: string; }[] | { y: number; name: any; color: any; id: any; exploitation: boolean; }[] = [];
            this.ppodetailsft = [];
            for (const _ppodetails of _response.fichetechnique) {
              this.ppodetailsft.push(_ppodetails);
              _categories.push(_ppodetails.familleLibelle);
              this.categoriesfamille.push(_ppodetails.familleLibelle + '  (FT)');
              const dataqtyft = {
                y: +_ppodetails.totalQuantity,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              const datacostft = {
                y: +_ppodetails.totalCost,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              _dataquantityft.push(dataqtyft);
              _datacostft.push(datacostft);
              this.syntheseMontantPerteFt(_categories, _datacostft).then();





            }

            _categories = [];
            const _dataquantityftarticle = [];
            const _datacostftarticle: { y: number; name: string; color: string; }[] | { y: number; name: any; color: any; id: any; exploitation: boolean; }[] = [];
            for (const _ppodetails of _response.fichetechniquearticle) {

              _categories.push(_ppodetails.familleLibelle);

              const dataqtyftarticle = {
                y: +_ppodetails.totalQuantity,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              const datacostftarticle = {
                y: +_ppodetails.totalCost,
                name: _ppodetails.familleLibelle,
                color: _ppodetails.familleColor,
                id: _ppodetails.familleId,
                exploitation: data.exploitation
              }
              _dataquantityftarticle.push(dataqtyftarticle);
              _datacostftarticle.push(datacostftarticle);
              this.syntheseMontantPerteFtArticle(_categories, _datacostftarticle).then()
            }
            this.ppodetails = [];


            for (const item of _ppo) {
              if (item.article == null) {
                if (!this.ppodetails.some(existingValue => JSON.stringify(existingValue.fichetechniqueId) === JSON.stringify(item.fichetechniqueId))) {
                  item.cout = (+item.cout * +item.quantite);
                  this.ppodetails.push(item);
                  this.nbft++;
                } else {

                  this.ppodetails.forEach(ppodetail => {
                    if (ppodetail.fichetechniqueId === item.fichetechniqueId) {
                      ppodetail.quantite += +item.quantite;
                      ppodetail.cout += (+item.quantite * +item.cout);
                    }
                  });
                }
              }
              if (item.fichetechnique == null) {
                if (!this.ppodetails.some(existingValue => JSON.stringify(existingValue.articleId) === JSON.stringify(item.articleId))) {
                  item.cout = (+item.cout * +item.quantite);
                  this.ppodetails.push(item);
                  this.nbarticle++;
                } else {

                  this.ppodetails.forEach(ppodetail => {
                    if (ppodetail.articleId === item.articleId) {
                      ppodetail.quantite += +item.quantite;
                      ppodetail.cout += (+item.quantite * +item.cout);
                    }
                  });
                }
              }

            }
            this.histogramme(this.ppodetails, this.categoriesfamille, 1);
          }
        })
      }
    })
  }

  private getWeeklySlices(dateDebut: Date, dateFin: Date) {
    let debut = new Date(dateDebut);
    let fin = new Date(dateFin);
    let tranches = [];
    debut.setDate(debut.getDate() - (debut.getDay() + 6) % 7);
    let index = 0;
    while (debut <= fin) {
      let finSemaine = new Date(debut);
      finSemaine.setDate(finSemaine.getDate() + 6);
      if (finSemaine > fin) {
        finSemaine = new Date(fin);
      }
      tranches.push({ debut: new Date(index === 0 ? dateDebut : debut), fin: finSemaine });
      index++;
      debut.setDate(debut.getDate() + 7);
    }
    return tranches;
  }

  private getMonthlySlices(dateDebut: Date, dateFin: Date) {

    let debut = new Date(dateDebut);
    let fin = new Date(dateFin);

    let tranches = [];
    debut.setDate(1);
    let index = 0;
    while (debut <= fin) {
      let finMois = new Date(debut.getFullYear(), debut.getMonth() + 1, 0);
      if (finMois > fin) {
        finMois = new Date(fin);
      }
      tranches.push({ debut: new Date(index === 0 ? dateDebut : debut), fin: finMois });
      index++;
      debut.setMonth(debut.getMonth() + 1);
      debut.setDate(1);
    }
    return tranches;
  }

  private getYearlySlices(dateDebut: Date, dateFin: Date) {
    let debut = new Date(dateDebut);
    let fin = new Date(dateFin);

    let tranches = [];

    debut.setMonth(0, 1);
    let index = 0;
    while (debut <= fin) {
      let finAnnee = new Date(debut.getFullYear(), 11, 31);

      if (finAnnee > fin) {
        finAnnee = new Date(fin);
      }
      tranches.push({ debut: new Date(index === 0 ? dateDebut : debut), fin: finAnnee });
      index++;
      debut.setFullYear(debut.getFullYear() + 1);
      debut.setMonth(0, 1);
    }

    return tranches;
  }
}
