import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { ModalDismissReasons, NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { subscribe } from 'diagnostics_channel';

import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { Exploitation } from 'src/app/shared/model/exploitations';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';

import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { LieustockageService } from 'src/app/shared/service/lieustockage.service';

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
  public zoneStockage : InterfaceZonestockages;
  public zoneStockages : InterfaceZonestockages[];
  public exploitation: InterfaceExploitations;
  public exploitations: InterfaceExploitations[];

  public centreForm = FormGroup;
  public exploitationForm = FormGroup;
  public lieuStockageForm = FormGroup;

  closeResult = '';
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public centreId = 0;
  selectedExploitationId: number | null = null;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;
  public addExploitation = false;
  public addLieuStockage = false;

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
    private lieustockageService : LieustockageService,
    private modalService: NgbModal,
    config:NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.resetCentre();
    this.resetExploitation();
    this.resetLieuStockage();
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

  public resetLieuStockage(){
    this.lieuStockage = {
      lieu : '',
      centreId:0,
      selected:false,
      centre:this.centre,
      zonestockage:this.zoneStockages
    }
  }

  public resetExploitation() {
    this.adresse = {
      rue: '',
      ville: '',
      code_postal: null,
      pays: '',
      selected: false,
      centreRevenu: [],
      exploitation: [],
      operateur: [],
    }
    this.exploitation = {
      code_couleur: "...",
      libelle: "...",
      nbDecimal: 0,
      commentaire:"...",
      siteWeb:"...",
      codenaf:"...",
      siret:"...",
      logo:"...",
      actif:true,
      adressesId:0,
      adresses: new Adress(),
      selected:false,
      centreRevenu:[]
    }
  }

  addFormExploitation(){
    this.resetExploitation();
    this.addExploitation = (this.addExploitation === false ? true:false);
  }

  getAllExploitation(){
    this.exploitationService.getExploitation().subscribe({
      next:(_exploitations) =>{
        this.exploitations = _exploitations;
      },
    })
  }

  public resetCentre() {
    this.centre = {
      code: '',
      libelle: '',
      exploitationsId: 0,
      adressesId:0,
      email: '',
      telephone: '',
      exploitations:this.exploitation,
      adresses: this.adresse,
      selected:false,
      lieuStockage:[],
    }
  }

  toggleModal(){
    this.resetCentre();
    this.resetExploitation();
      this.toggle = !this.toggle;
      this.modifToggle = !this.modifToggle;
      this.inputModif = false;
      this.fournisseurService.getAllAdresse().subscribe({
        next :(adresses) => {
          this.adresses = adresses;
          this.adresse = adresses[0];
          this.exploitationService.getExploitation().subscribe({
            next:(_exploitations) =>{
              this.exploitations = [];
              for(const _exploitation of _exploitations){
                this.exploitation = {
                  code_couleur: _exploitation.code_couleur,
                  libelle: _exploitation.libelle,
                  nbDecimal: _exploitation.nbDecimal,
                  commentaire:_exploitation.commentaire,
                  siteWeb:_exploitation.siteWeb,
                  codenaf:_exploitation.codenaf,
                  siret:_exploitation.siret,
                  logo:_exploitation.logo,
                  actif:_exploitation.actif,
                  adressesId:adresses[0].id ? adresses[0].id :0,
                  adresses: adresses[0],
                  selected:_exploitation.selected,
                  centreRevenu:[]
                }
                this.exploitations.push(this.exploitation);
              }
              // this.exploitations = _exploitations;
              this.lieustockageService.findAllLieuStockageWithoutLinks().subscribe({
                next:(_lieuStockages)=>{
                  this.lieuStockages = _lieuStockages;
                  this.lieuStockage = _lieuStockages[0];

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
                }
              })
              
            },
          });
        },
      })

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
            if (this.exploitation.adresses) {
              if (adresse.id == this.exploitation.adresses.id) {
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
                  if (this.addExploitation ===false) {
                    this.centre.adresses = this.adresse;
                    this.centre.adressesId = this.adresse.id ? this.adresse.id : 0;
                  } else {
                    this.exploitation.adresses = this.adresse;
                    this.exploitation.adressesId = this.adresse.id ? this.adresse.id : 0;
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
    this.addExploitation = false;
    this.addLieuStockage = false;
    this.resetCentre();
    this.showAllCentreRevenu();
  }

  addFormLieuStockage(){
    this.resetLieuStockage();
    this.addLieuStockage = (this.addLieuStockage === false ? true:false);
  }

  saveExploitation(){
    this.centres = [];
    this.exploitationService.createExploitation(this.exploitation,this.centres).subscribe({
      next:(value) =>{
        this.getAllExploitation();
        this.toggleToast('Nouveau centre de revenu crée avec succès!');
        this.addExploitation = (this.addExploitation === false ? true : false);
      },
    })
  }

  saveLieuDeStockage(){
   this.centreId = this.centre.id ? this.centre.id : 0;
   this.zoneStockages = [];
   if (this.centreId == 0) {
    this.lieustockageService.createLieuStockage(this.lieuStockage,this.zoneStockages).subscribe({
      next:() =>{
        this.findAllLieuStockageWithoutLinks();
        this.toggleToast('Nouveau lieu de stockage crée avec succès !');
        this.addLieuStockage = (this.addLieuStockage === false ? true:false);
      }
    })
   } 
  }

  findAllLieuStockageWithoutLinks(){
    this.lieustockageService.findAllLieuStockageWithoutLinks().subscribe({
      next:(_lieuStockages)=>{
        this.lieuStockages = _lieuStockages;
      }
    })
  }

  modifyCentre(){
    this.inputModif =!this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  submit(){
    this.centreId = this.centre.id ? this.centre.id :0;
    if (this.centreId ==0) {
      const lieuStockagesSelect = this.lieuStockages.filter(line =>line.selected);
      if (lieuStockagesSelect.length > 0) {
        this.centre.lieuStockage = lieuStockagesSelect;
        for(const _exploitation of this.exploitations){
          if (_exploitation.selected) {
            this.centre.exploitationsId = _exploitation.id ? _exploitation.id :0;
            this.centre.exploitations = _exploitation;
          
            this.centreService.createCentreRevenu(this.centre,lieuStockagesSelect).subscribe({
              next:(value) =>{
                this.toggleToast('Nouveau centre de revenu crée avec succès !');
                this.inputModif = !this.inputModif;
                this.modifToggle = true;
              },
            });
          } 
        }
      } else {
        alert('Veuillez sélectionner au moins un lieu de stockage et exploitation');
      }
    } else {
      const lieuStockagesSelect = this.lieuStockages.filter(line =>line.selected);
      if (lieuStockagesSelect.length > 0) {
        this.centre.lieuStockage = lieuStockagesSelect;
        for(const _exploitation of this.exploitations){
          if (_exploitation.selected) {
            this.centre.exploitationsId = _exploitation.id ? _exploitation.id :0;
            this.centre.exploitations = _exploitation;

            this.centreService.updateCentreRevenu(this.centre,lieuStockagesSelect).subscribe({
              next:(value) =>{
                this.toggleToast('Centre de revenu modifié avec succès !');
                this.inputModif = !this.inputModif;
                this.modifToggle = true;
              },
            });
          } 
        }
      } else {
        alert('Veuillez sélectionner au moins un lieu de stockage et exploitation');
      }
      
    }
  }

  showCentreRevenu(centreRevenu:InterfaceCentreRevenu){
    this.resetCentre();
    this.resetExploitation();
    this.resetLieuStockage();
    this.centre = centreRevenu;
    this.centreId  = centreRevenu.id ? centreRevenu.id :0;
    
    this.exploitationService.getExploitation().subscribe({
      next:(_exploitations) =>{
        this.exploitations = [];
        this.inputModif = true;
        this.toggle = !this.toggle;
        for(const exploitation of _exploitations){
          let selected = false;
          if (exploitation.id == this.centre.exploitationsId) {
            selected = true;
          }
          this.exploitation = {
            code_couleur: exploitation.code_couleur,
            libelle: exploitation.libelle,
            nbDecimal: exploitation.nbDecimal,
            commentaire:exploitation.commentaire,
            siteWeb:exploitation.siteWeb,
            codenaf:exploitation.codenaf,
            siret:exploitation.siret,
            logo: exploitation.logo,
            actif:exploitation.actif,
            adressesId:exploitation.adresseId,
            adresses: exploitation.adresses,
            selected:selected,
            centreRevenu:exploitation.centreRevenu
          }
          this.exploitations.push(this.exploitation);
        }
        this.lieustockageService.findListLieuStockage(this.centreId).subscribe({
          next:(_lieuStockages)=>{
            
            for(const lieustock of _lieuStockages){
              let selected = false;
              this.lieuStockages = [];
              for(const _centrelieu of this.centre.lieuStockage){
                if(lieustock.id == _centrelieu.id){
                  selected = true;
                }
                this.lieuStockage = {
                  lieu : lieustock.lieu,
                  centreId: lieustock.centreId,
                  selected:selected,
                  centre: lieustock.centre,
                  zonestockage:lieustock.zoneStockage
                }
                this.lieuStockages.push(this.lieuStockage);
              }
            }
          }
        })
      },
    })
  }

  deleteCentreRevenu(){
    this.centreService.deleteCentreRevenu(this.centre).subscribe({
      next:(value) =>{
        this.resetCentre();
        this.toggleToast('Ce centre de revenu a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllCentreRevenu();
      },
    });
  }
  
}
