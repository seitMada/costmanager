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

  Highcharts: typeof Highcharts = Highcharts;

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

  public isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;

  public toggle = true;
  private modalService = inject(NgbModal);
  closeResult = '';
  active = 1;
  activeperte = 2;
  activeperteft = 1;

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }

  public chartOptionsQuantitePerte: Highcharts.Options;
  public chartOptionsMontantPerte: Highcharts.Options;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private ppoService: PpoService,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.exploitations = [];
    this.centrerevenus = [];
    // this.chartOptions = {};
    // Highcharts.setOptions({
    //   accessibility: {
    //     enabled: true // Enable accessibility features
    //   }
    // });
    if (this.isAdmin === true) {
      this.exploitationService.getExploitation().subscribe({
        next: (_exploitations) => {
          this.exploitations = _exploitations;
          if (this.isAdmin === true) {
            this.exploitations = this.exploitations.filter(e => e.id !== this.idexploitation)
          }
          this.exploitations[0].selected = true;
          this.exploitationsselected = [_exploitations[0].id];
          this.centrerevenuService.getcentrerevenu().subscribe({
            next: (_centrerevenus) => {
              this.centrerevenus = _centrerevenus;
              if (this.isAdmin === true) {
                this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId !== this.idexploitation);
                const data = {
                  date: {
                    dateDebut: new Date(this.dates.debut),
                    dateFin: new Date(this.dates.fin)
                  },
                  idexploitation: this.exploitationsselected
                }
                this.ppoService.getPpoExploitation(data).subscribe({
                  next: (_ppo) => {
                    console.log(_ppo)
                  }
                })
              }
            }
          });
        }
      });
    } else {
      this.exploitationService.getExploitationById(this.idexploitation).subscribe({
        next: (_exploitations) => {
          this.exploitations = _exploitations;
          this.exploitationsselected = [_exploitations.id];
          this.exploitations[0].selected = true;
          this.centrerevenuService.getCrExploitation(_exploitations.id).subscribe({
            next: (_centrerevenus) => {
              this.centrerevenus = _centrerevenus;
              const data = {
                date: {
                  dateDebut: new Date(this.dates.debut),
                  dateFin: new Date(this.dates.fin)
                },
                idexploitation: this.exploitationsselected
              }
              this.ppoService.getPpoExploitation(data).subscribe({
                next: (_ppo) => {
                  console.log(_ppo)
                }
              })
            }
          })
        }
      })
    }
  }

  ngOnInit(): void {
    this.syntheseQuantitePerte();
    this.syntheseMontantPerte();
  }

  private syntheseMontantPerte() {
    this.chartOptionsMontantPerte = {
      accessibility: {
        enabled: false,
      },
      title: {
        text: "Montant",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        },
      },
      xAxis: {
        categories: ['Pertes', 'Personnels', 'Offerts']
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
          headerFormat: '',
          pointFormat: '<span>{series.name} {point.name}</span> : <b>{point.y:.2f} €</b>'
      },
      series: [{
        type: 'column',
        data: [
          {
            y: 2,
            name: 'Pertes',
            color: '#D83636'
          },
          {
            y: 5,
            name: 'Personnels',
            color: '#3671D8'
          },
          {
            y: 2,
            name: 'Offerts',
            color: '#36D86C'
          }]
      }]
    };
  }

  private syntheseQuantitePerte() {
    this.chartOptionsQuantitePerte = {
      accessibility: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
            // connectorColor: 'silver'
            softConnector: true,
            connectorWidth: 2
          },
          showInLegend: true,
          allowPointSelect: true,
          size: '90%',
        }
      },
      title: {
        text: "Quantité",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold"
        },
      },
      series: [
        {
          type: 'pie',
          // data: [1, 2, 3, 4, 5],
          // name: 'Percentage',
          // colorByPoint: true,
          data: [
            {
              name: 'Water',
              y: 55.02,
              color: '#36D86C'
            },
            {
              name: 'Fat',
              // sliced: true,
              // selected: true,
              y: 26.71
            },
            {
              name: 'Carbohydrates',
              y: 1.09
            },
            {
              name: 'Protein',
              y: 15.5
            },
            {
              name: 'Ash',
              y: 1.68
            }
          ]
        },
      ],
    };
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          this.exploitationsselected = [];
          for (const _exploitation of this.exploitations) {
            if (_exploitation.selected === true) {
              this.exploitationsselected.push(_exploitation.id || 0);
            }
          }
          console.log(this.dates, this.exploitationsselected, this.active)
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)

      },
    );
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

}
