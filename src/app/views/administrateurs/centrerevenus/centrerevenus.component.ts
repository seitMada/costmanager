import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { ModalDismissReasons, NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { Exploitation } from 'src/app/shared/model/exploitations';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';

@Component({
  selector: 'app-centrerevenus',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule,NgbDropdownModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
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
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public centreId = 0;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;

  public active_2 = 1;

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
    private exploitationService: ExploitationService,
    private centreService: CentreRevenuService,
    private fournisseurService: FournisseurService,
    private modalService: NgbModal,
    config:NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.resetCentre();
  }

  ngOnInit(): void {
    this.showAllCentreRevenu();
  }

  showAllCentreRevenu(){
    this.centreService.getcentrerevenu().subscribe({
      next: async (_centres) => {
        this.centres = _centres;
        this.centre = _centres[0]
      }
    });
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
      adressesId:0,
      email: '',
      telephone: '',
      exploitations: new Exploitation(),
      adresses: new Adress(),
      lieuStockage:[],
    }
  }

  toggleModal(){
    this.resetCentre();
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
    this.showAllCentreRevenu();
  }

  modifyCentre(){
    this.inputModif =!this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  submit(){
    this.centreId = this.centre.id ? this.centre.id :0;
    if (this.centreId ==0) {
      // if (this.centre.lieuStockage!= undefined && this.centre.lieuStockage.length > 0) {
      //   this.lieuStockages = this.centre.lieuStockage;
        for(const _exploitation of this.exploitations){
          if (_exploitation.selected) {
            this.centre.exploitationsId = _exploitation.id ? _exploitation.id :0;
          this.centre.exploitations = _exploitation;
          
          console.log(this.centre);
          }
          // this.toggleToast('Nouveau exploitation crée avec succès !');
        }
      // } else {
      //   alert('Veuillez sélectionner au moins un lieu de stockage');
      // }
    } else {
      
    }
  }
}
