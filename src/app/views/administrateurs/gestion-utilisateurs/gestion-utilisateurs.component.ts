import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { ModalDismissReasons, NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { InterfaceOperateur } from 'src/app/shared/model/interface-operateur';
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';
import { InterfaceOperateurCentreExploitation } from 'src/app/shared/model/interface-operateurcentreexploitation';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { LieustockageService } from 'src/app/shared/service/lieustockage.service';
import { OperateursService } from 'src/app/shared/service/operateurs.service';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule,NgbDropdownModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrl: './gestion-utilisateurs.component.scss'
})
export class GestionUtilisateursComponent implements OnInit{

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
  public operateur : InterfaceOperateur;
  public operateurs: InterfaceOperateur[];
  public operateurExploitationCentre: InterfaceOperateurCentreExploitation;
  public operateurExploitationCentres: InterfaceOperateurCentreExploitation[];

  public operateurForm = FormGroup;
  closeResult = '';
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  private operateurid = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) :0;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;
  public addExploitation = false;

  public operateurId = 0;

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
    private operateurService : OperateursService,
    private modalService: NgbModal,
    config:NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.resetOperateur();
    this.resetOperateurCentreExploitation();
  }

  ngOnInit(): void {
    this.showAllOperateur();
  }

  showAllOperateur(){
    if(this.isAdmin){
      this.operateurService.getAllOperateur().subscribe({
        next:(_operateurs) =>{
          this.operateurs = _operateurs;
          this.operateur =_operateurs[0];
          
        },
      })
    }else{
      this.operateurService.findOperateurById(this.operateurid).subscribe({
        next:(_operateurs) =>{
          this.operateurs = _operateurs;
          this.operateur =_operateurs[0];
          console.log(this.operateurs);
        },
      })
    }
  }

  public resetOperateur(){
    this.operateur ={
      nom: '',
      prenom: '',
      email: '',
      mdp: '',
      compteConnecte: false,
      actif: true,
      login_count: 0,
      code: '',
      fournisseurId: null,
      telephone: '',
      civilite: ''
    }
  }

  public resetOperateurCentreExploitation(){
    this.operateurExploitationCentre = {
      centreId: 0,
      exploitationId: 0,
      operateurId: 0,

      operateur: this.operateur,
      centre: this.centre,
      exploitation: this.exploitation,
    }
  }

  cancel(){
    this.modifToggle = true;
    this.toggle = !this.toggle;
    this.resetOperateur();
    this.showAllOperateur();
  }

  submit(){
    this.operateurId = this.operateur.id ? this.operateur.id:0;
    if (this.operateurId == 0) {
      const exploitationSelected = this.exploitations.filter(line => line.selected);
      if (exploitationSelected.length >0) {
        for(const exploitation of exploitationSelected){
          const centreSelected = exploitation.centreRevenu.find(item=>item.selected);
          if (centreSelected) {
            this.operateurExploitationCentre.centreId = centreSelected.id ? centreSelected.id :0;
            this.operateurExploitationCentre.exploitationId = exploitation.id ? exploitation.id :0;
            console.log(this.operateurExploitationCentre);
            
            this.operateurService.createNewOperateur(this.operateur,this.operateurExploitationCentre).subscribe({
              next:(value) =>{
                this.toggleToast('Nouveau utilisateur crée avec succès !');
                  this.inputModif = !this.inputModif;
                  this.modifToggle = true;
              },
            })
          }
        } 
        }else{
          alert('Veuillez sélectionner un exploitation et un centre de revenu!');
        }
    } else {
      const exploitationSelected = this.exploitations.filter(line => line.selected);
      if (exploitationSelected.length >0) {
        for(const exploitation of exploitationSelected){
          const centreSelected = exploitation.centreRevenu.find(item=>item.selected);
          if (centreSelected) {
            this.operateurExploitationCentre.centreId = centreSelected.id ? centreSelected.id :0;
            this.operateurExploitationCentre.exploitationId = exploitation.id ? exploitation.id :0;
            
            this.operateurService.updateOperateurs(this.operateur,this.operateurExploitationCentre).subscribe({
              next:(value) =>{
                this.toggleToast('Utilisateur a été modifié avec succès !');
                  this.inputModif = !this.inputModif;
                  this.modifToggle = true;
              },
            })
          }
        } 
        }else{
          alert('Veuillez sélectionner un exploitation et un centre de revenu!');
        }
    }

  }

  selectExploitation(exploitation:InterfaceExploitations){
    this.centres = exploitation.centreRevenu;
  }

  modifyOperateur(){
    this.inputModif =!this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  toggleModal(){
    if(this.isAdmin){
      this.resetOperateur();
      this.resetOperateurCentreExploitation();
      this.toggle = !this.toggle;
      this.modifToggle = !this.modifToggle;
      this.inputModif = false;
      this.exploitationService.getExploitation().subscribe({
        next:(_exploitations) =>{
          this.exploitations = _exploitations;
          this.exploitation = _exploitations[0];
          this.centreService.getcentrerevenu().subscribe({
            next:(_centres) =>{
              this.centres = _centres;
              this.centre = _centres[0];
            },
          });
        },
      })
    }
  }

  deleteOperateur(){
    this.operateurService.deleteOperateur(this.operateur).subscribe({
      next:(value) =>{
        this.resetOperateur();
        this.resetOperateurCentreExploitation();
        this.toggleToast('Cet utilisateur a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllOperateur();
      },
    });
  }

  showOperateur(operateur:InterfaceOperateur){
    this.resetOperateur();
    this.resetOperateurCentreExploitation();
    this.operateur = operateur;
    this.operateurId = operateur.id ? operateur.id :0;
    this.inputModif = true;
    this.toggle = !this.toggle;
    this.operateurService.findOperateurCentreExploitationByOperateurId(this.operateurId).subscribe({
      next:(_operateur) =>{
        this.exploitationService.getExploitation().subscribe({
          next:(_exploitations) =>{
            this.exploitations = [];
            for (const _exploitation of _exploitations) {
             if (_exploitation.id == _operateur.exploitationId) {
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
                adressesId:_exploitation.adressesId,
                adresses:_exploitation.adresse,
                selected:false,
                centreRevenu:_exploitation.centreRevenu
              }
              this.exploitations.push(this.exploitation);
             }else{
              this.exploitations = _exploitations;
             }              
            }
            this.centreService.getcentrerevenu().subscribe({
              next:(_centres) =>{
                this.centres = [];
                for (const _centre of _centres) {
                 if (_centre.id == _operateur.centreId) {
                  this.centre = {
                    code: _centre.code,
                    libelle: _centre.libelle,
                    exploitationsId: _centre.exploitationId,
                    adressesId:_centre.adressesId,
                    email: _centre.email,
                    telephone: _centre.telephone,
                    exploitations:_centre.exploitations,
                    adresses: _centre.adresses,
                    selected:false,
                    lieuStockage:[],
                  }  
                  this.centres.push(this.centre);               
                 }else{
                  this.centres = _centres;
                 }
                }
              },
            });
          },
        })
      },
    })
    
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
}

