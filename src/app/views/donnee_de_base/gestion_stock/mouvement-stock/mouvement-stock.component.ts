import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, TooltipModule } from '@coreui/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { ArticleService } from 'src/app/shared/service/article.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';
import { ZonestockagesService } from 'src/app/shared/service/zonestockages.service';

@Component({
  selector: 'app-mouvement-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, AlertModule, TooltipModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './mouvement-stock.component.html',
  styleUrl: './mouvement-stock.component.scss'
})
export class MouvementStockComponent implements OnInit {

  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;

  public mouvemenstock: {
    article_id: number,
    libelle: string,
    unite: string,
    inventaires: number,
    inventairesfinal: number,
    pertes: number,
    achats: number,
    ventes: number,
    stock_theorique: number,
    stock_reel: number,
    stock_initiale: number
  }[];

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle: any;
  public contentinventaire: any;
  public modifToggle: any;
  public inventaire: any;
  public addToggle: any;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today,
  }


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private zonelieuService: ZonestockagesService,
    private articleService: ArticleService,
    private datePipe: DatePipe,
    private pdfService: PdfserviceService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.centrerevenus = _centreRevenu;
        this.centrerevenusdefault = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];
        await this.selectCentreRevenus(this.centrerevenu);
        if (this.isAdmin === true) {
          this.exploitationService.getExploitation().subscribe({
            next: (_exploitation) => {
              this.exploitations = _exploitation;
              this.exploitation = _exploitation[0];
            }
          })
        } else {
          this.exploitationService.getExploitationById(this.idexploitation).subscribe({
            next: (_exploitation) => {
              this.exploitations.push(_exploitation);
              this.exploitation = _exploitation[0];
            }
          })
        }
      }
    })
  }

  ngOnInit(): void {
    this.articleService.getMouvementStock({ debut: '2024-05-08', fin: '2024-05-14', final: '2024-05-15' }, this.idexploitation, true).subscribe({
      next: (_articles: any) => {
        this.mouvemenstock = _articles;
        console.log(this.mouvemenstock)
      }
    })
  }

  private resetCentreRevenu() {
    this.centrerevenu = {
      code: '',
      libelle: '',
      exploitationsId: this.idexploitation,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: this.exploitation,
      adresses: new Adress(),
      lieuStockage: []
    }
  }

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

  submit() {
    throw new Error('Method not implemented.');
  }
  cancel() {
    throw new Error('Method not implemented.');
  }


  async selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
    // this.ppoService.getPpoByCrAndDate([this.idcentrerevenu], this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), false).subscribe({
    //   next: (_ppos: any) => {
    //     this.ppos = _ppos;
    //   }
    // })
  }

  tri() {

  }


  delete() {
    throw new Error('Method not implemented.');
  }
  deletes() {
    throw new Error('Method not implemented.');
  }
  openInventaire(arg0: any) {
    throw new Error('Method not implemented.');
  }
  modifToggleModal() {
    throw new Error('Method not implemented.');
  }
  toggleModal() {
    throw new Error('Method not implemented.');
  }
  validInventaire() {
    throw new Error('Method not implemented.');
  }

}
