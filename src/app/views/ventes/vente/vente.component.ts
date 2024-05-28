import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from '@coreui/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';
import { NgbDropdownModule, NgbModal, NgbNavModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceVentes, InterfaceVentesDetails } from 'src/app/shared/model/interface-ventes';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ArticleService } from 'src/app/shared/service/article.service';
import { VentesService } from 'src/app/shared/service/ventes.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FichetechniqueService } from 'src/app/shared/service/fichetechnique.service';
import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';
import { Adress } from 'src/app/shared/model/adresse';

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './vente.component.html',
  styleUrl: './vente.component.scss'
})
export class VenteComponent implements OnInit {

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

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  public toggle = true;
  public addToggle = true;
  public deleteToggle = true;
  public modifToggle = true;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public idVente: number | undefined = 0;
  public active = 1;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public ventes: InterfaceVentes[];
  public vente: InterfaceVentes;
  public ventedetails: InterfaceVentesDetails[];
  public ventedetail: InterfaceVentesDetails;

  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }

  formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    if (fin == true) {
      return `${year}-${month}-${day} 23:59:59`;
    }
    return `${year}-${month}-${day} 00:00:00`;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private articleService: ArticleService,
    private venteService: VentesService,
    private fichetetchniqueService: FichetechniqueService,
    private datePipe: DatePipe,
    private pdfService: PdfserviceService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.exploitations = [];
        this.centrerevenus = _centreRevenu;
        this.centrerevenusdefault = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];
        await this.selectCentreRevenus(this.centrerevenu);
        if (this.isAdmin === true) {
          this.exploitationService.getExploitation().subscribe({
            next: (_exploitation) => {
              this.exploitations = _exploitation;
              this.exploitation = _exploitation[0];
              // this.resetPpo(new Date());
            }
          })
        } else {
          this.exploitationService.getExploitationById(this.idexploitation).subscribe({
            next: (_exploitation) => {
              console.log(_exploitation)
              this.exploitations.push(_exploitation);
              this.exploitation = this.exploitations[0];
              // this.resetPpo(new Date());
            }
          })
        }
      }
    })
  }

  ngOnInit(): void {

  }


  async selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
    this.venteService.getVenteCrDate([this.idcentrerevenu], this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), false).subscribe({
      next: (_ventes: any) => {
        console.log(_ventes)
        this.ventes = _ventes;
      }
    })
    // this.ppoService.getPpoByCrAndDate([this.idcentrerevenu], this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), false).subscribe({
    //   next: (_ppos: any) => {
    //     this.ppos = _ppos;
    //   }
    // })
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

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  submit() {

  }

  cancel() {

  }

  toggleModal() {
    
  }

  show(_vente: InterfaceVentes) {
    
  }
}
