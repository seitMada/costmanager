import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Adress } from 'src/app/shared/model/adresse';
import { Centrerevenu, Centrerevenus } from 'src/app/shared/model/centrerevenu';
import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';

@Component({
  selector: 'app-bon-livraison-achats',
  standalone: true,
  imports: [CommonModule, FormsModule,BsDatepickerModule],
  templateUrl: './bon-livraison-achats.component.html',
  styleUrl: './bon-livraison-achats.component.scss',
  providers:[NgbModalConfig,NgbModal]
})
export class BonLivraisonAchatsComponent implements OnInit{
  public fournisseurs: Fournisseur;
  public fournisseur: Fournisseurs;
  public centres: Centrerevenus;
  public centre: Centrerevenu;
  public adresse: Adress;

  public exploitation: InterfaceExploitations;

  // public bonLivraison = Interface

  public idFournisseur =0;
  public idBonLivraison = 0;
  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);

  public num_livraison:string;

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today:new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate())
  }

  public bonLivraisonForm = FormGroup;

  public toggle = true;

 constructor(
  public router: Router,
  public route: ActivatedRoute,
  private fournisseurService: FournisseurService,
  private exploitationService: ExploitationService,
  private centreRevenuService: CentreRevenuService,
  private modalService: NgbModal,
  private datePipe: DatePipe,
  config:NgbModalConfig,
 ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;

    this.resetFournisseur();
    this.resetCentre();
 }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }


  ngOnInit(): void {
    this.num_livraison = "LIV-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    
    this.showExploitationFournisseur();
    this.showAllFournisseur();
  }

  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
      },
      error: (error) => {
        alert('Liste fournisseur vide')
      }
    });
  }
  
  showExploitationFournisseur() {
    console.log(this.exploitationId);
    
    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next: (exploitation) => {
        this.exploitation = exploitation;
        this.centreRevenuService.getCrExploitation(this.exploitation.id ? this.exploitation.id : 0).subscribe({
          next: (_centre) => {
            this.centres = _centre;
            this.centre = _centre[0];
          },
        });
      },
      // error: (error) => {
      //   alert('Liste de bon de livraison vide');
      // }
    });
  }

  addToggle(){
    this.toggle = !this.toggle;
  }

  async selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur =data; 
    this.fournisseur.id = data.id ? data.id:0 ;    
  }

  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }

  public resetFournisseur() {
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
    this.fournisseur = {
      raison_social: '',
      actif: true,
      codeFournisseur: '',
      siret: '',
      codeNaf: '',
      tvaIntracom: '',
      web: '',
      codeComptable: '',
      modereglementId: 0,
      commentaires: '',
      selected: false,
      adresseId: null,
      adresse: this.adresse,
      operateur: []
    };
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
    }
    this.centre = {
      code: '',
      libelle: '',
      exploitationsId: 0,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: this.exploitation,
      adresses: this.adresse
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

  addToggleModal(){
    this.selectOnFournisseur();
    this.modalService.dismissAll();
  }

  public selectOnFournisseur() {

    this.fournisseurService.getOneFournisseur(this.fournisseur).subscribe({
      next: (fournisseur) => {
        this.fournisseur = fournisseur;
        console.log(this.fournisseur);

      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
