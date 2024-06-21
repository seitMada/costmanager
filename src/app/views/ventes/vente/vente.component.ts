import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
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
import { InterfaceFichetechnique } from 'src/app/shared/model/interface-fichetechnique';
import { InterfaceComposition } from 'src/app/shared/model/interface-compositions';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './vente.component.html',
  styleUrl: './vente.component.scss'
})
export class VenteComponent implements OnInit {

  @ViewChild("btnfile", { static: false })
  InputVar: ElementRef;

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';
  private modalService = inject(NgbModal);
  closeResult = '';

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

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  public toggle = true;
  public isimport = true;
  public addToggle = true;
  public deleteToggle = true;
  public modifToggle = true;
  public importToggle = false;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public idVente: number | undefined = 0;
  public active = 1;
  public nbvente = 0;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public ventes: InterfaceVentes[];
  public ventesBack: InterfaceVentes[];
  public vente: InterfaceVentes;
  public ventedetails: InterfaceVentesDetails[];
  public ventedetail: InterfaceVentesDetails;
  public fichetechniques: InterfaceFichetechnique[];
  public files: any[] = [];
  public fichierventes: any[] = [];
  public fichierventesdefaut: any[] = [];

  private today = new Date();
  public datevente = this.today;
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }
  public numticket = "000000";

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
    private pdfService: PdfserviceService,
    private sortFilterSearchService:SortFilterSearchService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.resetVente();
    this.venteService.getcount().subscribe({
      next: (count) => {
        this.nbvente = count == 0 ? count : count + 1;
        this.numticket = ((this.formatDate(this.today))?.replaceAll('-', '')).split(' ')[0] + this.nbvente.toString().padStart(3, '0');
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
    });
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
        this.ventesBack = _ventes;
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

  public resetVente() {
    this.vente = {
      num_ticket: ((this.formatDate(this.today))?.replaceAll('-', '')).split(' ')[0] + (this.nbvente + 1).toString().padStart(3, '0'),
      montantht: 0,
      montantttc: 0,
      date_vente: new Date(),
      operateurId: this.idoperateur,
      caisseId: undefined,
      centreId: this.idcentrerevenu,
      exploitationId: this.idexploitation,
      selected: false,
      ventedetail: [],
    }
    this.numticket = this.vente.num_ticket;
    this.datevente = new Date(this.vente.date_vente);
  }

  calculprix(_vente: InterfaceVentesDetails[]) {
    let montantht = 0;
    let montantttc = 0;
    if (_vente.length > 0) {
      for (const vente of _vente) {
        montantht += +vente.prixht * +vente.quantite;
        montantttc += +vente.prixht * +vente.quantite;
      }
    }
    return { montantht: montantht, montantttc: montantttc }
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  submit() {
    this.vente.montantht = this.calculprix(this.vente.ventedetail).montantht;
    this.vente.montantttc = this.calculprix(this.vente.ventedetail).montantttc;
    console.log(this.vente)
    this.venteService.addVente(this.vente).subscribe({
      next: async (vente) => {
        // console.log(vente)
        alert('Vente enregistrer');
        await this.selectCentreRevenus(this.centrerevenu);
        this.modifToggle = !this.modifToggle;
        this.toggle = !this.toggle;
      }
    })
  }

  async cancel() {
    await this.selectCentreRevenus(this.centrerevenu);
    this.modifToggle = !this.modifToggle;
    this.toggle = !this.toggle;
  }

  addvente() {
    this.modifToggle = false;
  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.isimport = true;
  }

  importModal() {
    this.toggle = !this.toggle;
    this.isimport = false;
    let idexploitations: number[] = [];
    for (const item of this.exploitations) {
      idexploitations.push(item.id || 0)
    }
    this.venteService.getimportedvente(idexploitations).subscribe({
      next: (_venteimporter: any) => {
        for (const item of _venteimporter) {
          Object.assign(item, {
            datevente: this.screenDateFile(item.fichier)
          })
        }
        console.log(_venteimporter)
        this.fichierventesdefaut = _venteimporter;
        this.fichierventes = _venteimporter;
      }
    })
  }

  filtreventefichier(isimport: boolean = true) {
    if (isimport == true) {
      this.fichierventes = this.fichierventesdefaut.filter(file => file.isimport == 1)
      console.log(this.fichierventes, this.fichierventesdefaut)
    } else {
      this.fichierventes = this.fichierventesdefaut.filter(file => file.isimport == 0)
      console.log(this.fichierventes, this.fichierventesdefaut)
    }
  }

  screenDateFile(_file: string = '') {
    const date = this.getdate(_file.split('-')[0]);
    return date;
  }

  getdate(stringDate: string) {
    const year = parseInt(stringDate.substring(0, 4));
    const month = parseInt(stringDate.substring(4, 6)) - 1;
    const day = parseInt(stringDate.substring(6, 8));

    return new Date(year, month, day);
  }

  show(_vente: InterfaceVentes) {
    this.vente = _vente;
    this.numticket = this.vente.num_ticket;
    this.datevente = new Date(this.vente.date_vente);
  }

  calculeCoutComposition(_composition: InterfaceComposition[]) {
    return 0;
  }

  fileChangeEvent(event: any) {
    if (event.target) {
      this.files = event.target.files;
    }
  }

  importfile() {
    for (let index = 0; index < this.files.length; index++) {
      const file = this.files[index];
      const fileName = file.name;
      this.venteService.uploadFileToBackend(file, fileName, this.idexploitation).subscribe({
        next: (value) => {
          if (index == (this.files.length - 1)) {
            this.files = [];
            alert('Les fichiers ont été importé');
            let idexploitations: number[] = [];
            for (const item of this.exploitations) {
              idexploitations.push(item.id || 0)
            }
            this.venteService.getimportedvente(idexploitations).subscribe({
              next: (_venteimporter: any) => {
                for (const item of _venteimporter) {
                  Object.assign(item, {
                    datevente: this.screenDateFile(item.fichier)
                  })
                }
                console.log(_venteimporter)
                this.fichierventesdefaut = _venteimporter;
                this.fichierventes = _venteimporter;
              }
            })
          }
          // alert(index);
        }
      })
    }
  }

  calculmontant(_ventes: InterfaceVentes[]) {
    let montantht = 0;
    let montantttc = 0;
    if (_ventes && _ventes.length > 0) {
      for (const vente of _ventes) {
        montantht += +vente.montantht;
        montantttc += +vente.montantttc;
      }
    }
    return { montantht: montantht, montantttc: montantttc }
  }

  deletefile(index: number = 0) {
    this.files = this.removeFileFromList(this.files, index);
  }

  private removeFileFromList(fileList: any, indexToRemove: number) {
    const filesArray = Array.from(fileList);
    if (indexToRemove < 0 || indexToRemove >= filesArray.length) {
      return fileList;
    }
    filesArray.splice(indexToRemove, 1);

    const dataTransfer = new DataTransfer();
    filesArray.forEach((file: any) => dataTransfer.items.add(file));

    return dataTransfer.files;
  }

  countfiles(fileList: any[]) {
    if (fileList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  openArticle(content: TemplateRef<any>) {
    this.fichetetchniqueService.getFichetechniqueByExploitation(this.idexploitation).subscribe({
      next: (_fichetechniques) => {
        this.fichetechniques = _fichetechniques;
        // this.fichetechniques = this.fichetechniques.filter(ft => {
        //   return !lieu.inventairedetail.some(fondArticle => fondArticle.articleId === article.articleId);
        // });
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            // console.log(this.closeResult)
            if (this.closeResult == 'Closed with: Save click') {
              for (const ft of this.fichetechniques) {
                if (ft.selected == true) {
                  const fichetechnique: InterfaceVentesDetails = {
                    fichetechniqueId: ft.id || 0,
                    prixht: ft.prix,
                    prixttc: ft.prix,
                    quantite: 0,
                    venteId: 0,
                    fichetechnique: ft
                  }
                  this.vente.ventedetail.push(fichetechnique)
                }
              }
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult)

          },
        );
      }
    });
  }

  onSortVentes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.ventes, colonne, type, this.ventesBack ) ;
  }

  onSearchVentes(event: any, colonne: any) {
     this.ventes   =  (this.sortFilterSearchService.handleSearch(event, this.ventes , colonne, this.ventesBack )) ;
  }

}
