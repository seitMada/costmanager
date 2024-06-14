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
    this.operateurService.getAllOperateur().subscribe({
      next:(_operateurs) =>{
        this.operateurs = _operateurs;
        this.operateur =_operateurs[0];
        
      },
    })
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

  cancel(){}

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
                this.toggleToast('Nouveau centre de revenu crée avec succès !');
                  this.inputModif = !this.inputModif;
                  this.modifToggle = true;
              },
            })
          }
        } 
        }else{

        }
    } else {
      
    }

  }

  selectExploitation(exploitation:InterfaceExploitations){
    this.centres = exploitation.centreRevenu;
  }

  modifyOperateur(){}

  toggleModal(){
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

  deleteOperateur(){}

  addFormExploitation(){}

  saveExploitation(){}

  showCentreRevenu(centre:InterfaceCentreRevenu){}

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

