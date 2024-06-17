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
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { LieustockageService } from 'src/app/shared/service/lieustockage.service';
import { ZonestockagesService } from 'src/app/shared/service/zonestockages.service';

@Component({
  selector: 'app-lieustockage',
  standalone: true,
  imports: [CommonModule, FormsModule,NgbNavModule,NgbDropdownModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './lieustockage.component.html',
  styleUrl: './lieustockage.component.scss'
})
export class LieustockageComponent implements OnInit{

  public adresse: Adress;
  public adresses: Adresse;
  public centre: InterfaceCentreRevenu;
  public centres: InterfaceCentreRevenu[];
  public lieustockage: InterfaceLieustockages;
  public lieustockages: InterfaceLieustockages[];
  public zonestockage: InterfaceZonestockages;
  public zonestockages: InterfaceZonestockages[];
  public exploitation : InterfaceExploitations;

  public lieuStockageForm = FormGroup;
  public centreForm =  FormGroup;
  closeResult = '';

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  private centreId = sessionStorage.getItem('centre');
  public lieuId = 0;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;
  public addCentre = false;
  public addZone = false;

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
    public centreService: CentreRevenuService,
    public fournisseurService: FournisseurService,
    public lieuStockageService : LieustockageService,
    public zonestockageService: ZonestockagesService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop =  'static';
    config.keyboard = false;
    this.resetLieuStockage();
    this.resetCentre();
    this.resetZonestockage();
  }

  ngOnInit(): void {
    this.showAllLieuStockage();
  }

  showAllLieuStockage(){
    this.lieuStockageService.getAllLieuStockage().subscribe({
      next:(_lieustocks) =>{
        this.lieustockages = _lieustocks;
        this.lieustockage = _lieustocks[0];
      },
    });    
  }

  public resetLieuStockage(){
    this.lieustockage = {
      lieu : '',
      centreId:0,
      selected:false,
      centre:this.centre,
      zonestockage:this.zonestockages
    }
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

  public resetZonestockage(){
    this.zonestockage = {
      zone:'',
      lieuId: 0,
      selected: false,
      lieu: this.lieustockage,
    }
  }

  getAllCentreRevenu(){
    this.centreService.getcentrerevenu().subscribe({
      next:(_centres) =>{
        this.centres = _centres
        this.centre = _centres[0];
      },
    });
  }

  getAllZoneStockageWithoutLinks(){
    this.zonestockageService.getAllZoneStockageWithoutLinks().subscribe({
      next:(_zones) =>{
        this.zonestockages = _zones;
        this.zonestockage = _zones[0];
      },
    })
  }

  toggleModal(){
    if (this.isAdmin) {
      this.resetLieuStockage();
      this.modifToggle = !this.modifToggle;
      this.toggle = !this.toggle;
      this.centreService.getcentrerevenu().subscribe({
        next:(_centres) =>{
          this.centres = _centres
          this.centre = _centres[0];

          this.zonestockageService.getAllZoneStockageWithoutLinks().subscribe({
            next:(_zones) =>{
              this.zonestockages = _zones;
              this.zonestockage = _zones[0];

              this.lieustockage = {
                lieu : '',
                centreId:this.centre.id ? this.centre.id:0,
                selected:false,
                centre:this.centre,
                zonestockage:this.zonestockages
              }
            },
          })
        },
      });
    }
  }

  selectAdress(data: Adress){
    this.adresse = data;
    this.adresse.id = data.id;
  }

  updateSelect(data:Adress){
    this.adresse = data;
  }

  changeAdress(content: TemplateRef<any>) {
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

  addFormCentre(){
    if (this.isAdmin) {
      this.resetCentre();
      this.addCentre = (this.addCentre === false ? true:false);
    }
  }

  saveCentre(){
    this.lieustockages = [];
    this.centreService.createCentreRevenu(this.centre,this.lieustockages).subscribe({
      next:(value) =>{
        this.toggleToast('Nouveau centre de revenu crée avec succès !');
        this.addCentre = (this.addCentre === false ? true:false);
        this.getAllCentreRevenu();
      },
    })
  }

  saveZoneDeStockage(){
    this.zonestockageService.createZoneDeStockage(this.zonestockage).subscribe({
      next:(value) =>{
        this.toggleToast('Nouveau zone de stockage crée avec succès !');
        this.addZone = (this.addZone === false ? true:false);
        this.getAllZoneStockageWithoutLinks();
      },
    });
  }

  addFormZoneStockage(){
    if (this.isAdmin) {
      this.resetZonestockage();
      this.addZone = (this.addZone === false ? true:false);
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

  cancel(){
    this.modifToggle = true;
    this.toggle = !this.toggle;
    this.addCentre = false;
    this.addZone = false;
    this.resetCentre();
    this.showAllLieuStockage();
  }

  submit(){
    
      this.lieuId = this.lieustockage.id ? this.lieustockage.id : 0;
      if(this.lieuId == 0){
        const zoneStockageSelect = this.zonestockages.filter(line => line.selected);
        if (zoneStockageSelect.length >0) {
          this.lieustockage.zonestockage = zoneStockageSelect;
          for(const _centre of this.centres){
            if (_centre.selected) {
              this.lieustockage.centre = _centre;
              this.lieustockage.centreId = _centre.id? _centre.id :0;
              this.lieuStockageService.createLieuStockage(this.lieustockage,zoneStockageSelect).subscribe({
                next:(value) =>{
                  this.toggleToast('Nouveau lieu de stockage crée avec succès !');
                  this.inputModif = !this.inputModif;
                  this.modifToggle = true;
                },
              })
            }
          }
        } else {
          alert('Veuillez sélectionner au moins un lieu de stockage et centre de revenu');
        }
      }else{
        const zoneStockageSelect = this.zonestockages.filter(line => line.selected);
        if (zoneStockageSelect.length >0) {
          this.lieustockage.zonestockage = zoneStockageSelect;
          for(const _centre of this.centres){
            if (_centre.selected) {
              this.lieustockage.centre = _centre;
              this.lieustockage.centreId = _centre.id? _centre.id :0;
              this.lieuStockageService.updateLieuDeStockage(this.lieustockage,zoneStockageSelect).subscribe({
                next:(value) =>{
                  this.toggleToast('Lieu de stockage modifié avec succès !');
                  this.inputModif = !this.inputModif;
                  this.modifToggle = true;
                },
              })
            }
          }
        }else {
          alert('Veuillez sélectionner au moins un lieu de stockage et centre de revenu');
        }
      }
  }

  showOneLieuStockage(lieustockage:InterfaceLieustockages){
    this.resetLieuStockage();
    this.resetCentre();
    this.lieustockage = lieustockage;
    
    this.lieuId = this.lieustockage.id ? this.lieustockage.id :0;

    this.centreService.getcentrerevenu().subscribe({
      next:(_centres) =>{
        this.centres = [];
        this.inputModif = true;
        this.toggle = !this.toggle;
        for(const centre of _centres){
          if (centre.id == lieustockage.centreId ) {
            this.centre = {
              code: centre.code,
              libelle: centre.libelle,
              exploitationsId: centre.exploitationId ? centre.exploitationId :0,
              adressesId: centre.adresseId ? centre.adresseId :0,
              email: centre.email,
              telephone: centre.telephone,
              exploitations:centre.exploitation,
              adresses: centre.adresse,
              selected:false,
              lieuStockage:[]
            }
            this.centres.push(this.centre);
          }
        }
        this.zonestockageService.getListZoneWithoutLinksByLieuId(this.lieuId).subscribe({
          next:(_zonestockages) =>{
            
            for(const zonestock of _zonestockages){
              let selected = false;
              this.zonestockages = [];
              for(const _lieustock of this.lieustockage.zonestockage){
                if(zonestock.id === _lieustock.id){
                  selected = true;
                }
                this.zonestockage = {
                  zone:_lieustock.zone,
                  lieuId: _lieustock.lieuId,
                  selected: selected,
                  lieu: this.lieustockage,
                }
                this.zonestockages.push(this.zonestockage);
              }
            }
          },
        })
      },
    })
  }

  modifLieuStockage(){
    this.inputModif = ! this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  deleteLieuStockage(){
    this.lieuStockageService.deleteOneLieuDeStockage(this.lieustockage).subscribe({
      next:(value) =>{
        this.resetLieuStockage();
        this.toggleToast('Ce lieu de stockage a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllLieuStockage(); 
      },
    })
  }
}
