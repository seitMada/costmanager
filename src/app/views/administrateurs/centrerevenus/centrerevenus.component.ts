import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';

@Component({
  selector: 'app-centrerevenus',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule,NgbNavModule,NgbDropdownModule],
  templateUrl: './centrerevenus.component.html',
  styleUrl: './centrerevenus.component.scss'
})
export class CentrerevenusComponent implements OnInit {

  public adresse: Adress;
  public adresses: Adresse;
  public centre: InterfaceCentreRevenu;
  public centres: InterfaceCentreRevenu[];
  public lieuStockage: InterfaceLieustockages;
  public lieuStockages : InterfaceLieustockages[];
  public exploitation: InterfaceExploitations;
  public exploitations: InterfaceExploitations[];

  public centreForm = FormGroup;
  closeResult = '';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;

  public active_2 = 1;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private exploitationService: ExploitationService,
    private centreService: CentreRevenuService,
    private fournisseurService: FournisseurService,
    private modalService: NgbModal,
    config:NgbModalConfig,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;
    this.resetCentre();
  }

  ngOnInit(): void {
    this.centreService.getcentrerevenu().subscribe({
      next: async (_centres) => {
        this.centres = _centres;
      }
    })
  }

  public resetCentre() {
    this.adresse = {
      rue: '...',
      ville: '...',
      code_postal: '...',
      pays: '...',
      selected: false,
      centreRevenu: [],
      exploitation: [],
      operateur: []
    }
    this.exploitation = {
      code_couleur: '',
      libelle: '',
      nbDecimal: 0,
      commentaire: '',
      siteWeb: '',
      codenaf: '',
      siret: '',
      logo: '',
      actif: true,
      adressesId: 0,
      adresses: new Adress(),
      centreRevenu:[]
    }
    this.centre = {
      code: '',
      libelle: '',
      exploitationsId: 0,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: this.exploitation,
      adresses: this.adresse,
      lieuStockage:this.lieuStockages,
    }
  }

  toggleModal(){
    // if (this.isAdmin) {
      this.toggle = !this.toggle;
      this.modifToggle = !this.modifToggle;
      this.fournisseurService.getAllAdresse().subscribe({
        next :(adresses) => {
          this.adresses = adresses;
          this.adresse = adresses[0];
          this.exploitationService.getExploitation().subscribe({
            next:(_exploitations) =>{
              this.exploitations = _exploitations;
              this.exploitation = _exploitations[0];
              this.centre = {
                code: '',
                libelle: '',
                exploitationsId: _exploitations[0] ? _exploitations[0] :0,
                adressesId: adresses[0].id ? adresses[0].id :0,
                email: '',
                telephone: '',
                exploitations: _exploitations[0],
                adresses: adresses[0],
                lieuStockage:this.lieuStockages
              }
            },
          });
        },
      })
    // } else {
      
    // }

  }

  changeAdress(content: TemplateRef<any>) {
    if (this.modifToggle === false) {
      this.fournisseurService.getAllAdresse().subscribe({
        next: (adresses) => {
          for (const adresse of adresses) {
            if (this.centre.adresses) {
              if (adresse.id == this.centre.adresses.id) {
                adresse.selected = true;
              } else {
                adresse.selected = false;
              }
            }
          }
          console.log(adresses)
          this.adresses = adresses;
          this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                if (this.adresse) {
                  this.centre.adresses = this.adresse;
                  this.centre.adressesId = this.adresse.id ? this.adresse.id : 0;
                  
                }
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              console.log(this.closeResult)

            },
          );
        }
      })
    }
  }

  private getDismissReason(reason:any):string{
    switch(reason){
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  selectAdress(data: Adress){
    this.adresse = data;
    this.adresse.id = data.id;
  }

  updateSelect(data:Adress){
    this.adresse = data;
  }

  cancel(){
    this.modifToggle = true;
    this.toggle = !this.toggle;
    this.resetCentre();
  }

  submit(){
    this.centre = this.centre;
  }
}
