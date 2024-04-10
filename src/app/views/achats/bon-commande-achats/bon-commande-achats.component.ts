import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";

import { FournisseurModalComponent } from '../../../modal/fournisseur-modal/fournisseur-modal.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { InterfaceBonCommande } from '../../../shared/model/interface-bonCommande';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { InterfaceAchat } from "../../../shared/model/interface-achats";
import { Achat } from "../../../shared/model/achats";
import { Article } from 'src/app/shared/model/articles';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { forkJoin } from 'rxjs';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';

@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss',
  providers: [NgbModalConfig, NgbModal]
})
export class BonCommandeAchatsComponent implements OnInit {

  // @ViewChild('contentFournisseur') contentFournisseur: ElementRef;

  public fournisseur: Fournisseurs;
  public fournisseurs: Fournisseur;
  public idFournisseur = 0;
  public idBonCommande = 0;
  // public exploitationId = sessionStorage.getItem('exploitation');
  public centres: InterfaceCentreRevenu[];
  public centre: InterfaceCentreRevenu;
  public artFournis: any;
  public exploitation: InterfaceExploitations;
  public achat: InterfaceAchat;
  public article: Article;
  public articles: InterfaceArticle[];
  public articleFournisseur: any;
  public articleFournisseurs: any;
  public articleExploitation: any;
  public articleExploitations: any;
  public achats: Achat;
  public adresse: Adress;
  public bonCommande: InterfaceBonCommande;
  
  public commandes: InterfaceBonCommande[];
  public commande: InterfaceBonCommande;
  public reason: any
  public isChecked: boolean = false;
  public validateArticles: any[];
  
  public toggle = true;
  public modifToggle = true;
  // private modalService = inject(NgbModal);
  closeResult = '';
  public showlist = true;
  public bonCommandeForm = FormGroup;
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  private today = new Date();
  public dates = {
    today: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  }

  public num_commande: string = "COM-" + this.today.toLocaleDateString().replaceAll('/', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private commandeService: CommandeService,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;

    this.resetFournisseur();
  }

  

  ngOnInit(): void {
    this.showAllFournisseur();    
   
    this.commandeService.getAllCommande().subscribe({
      next: (commande) => {
        this.commandes = commande;

      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    })
    
  }

  showAllFournisseur(){
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id? this.fournisseur.id : 0;
      },
      error: (error) => {
        alert('Liste fournisseur vide')
      }
    });
  }
  toggleModal() {
    this.toggle = !this.toggle;
  }

  addToggleModal() {
    
    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next: (exploitation) => {
        this.exploitation = exploitation;
               console.log(this.exploitation);
               
        this.centreRevenuService.getCrExploitation(this.exploitation.id ? this.exploitation.id: 0).subscribe({
          next: (_centre) => {
            this.centres = _centre;
            this.centre = _centre[0];
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    });

    
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    
    this.modalService.dismissAll();
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

 
  cancel() { }


  ShowArticleFournisseurByExploitation() {
    const fournisseur = this.fournisseur;
    const exploitationId = Number(this.exploitationId)
    this.commandeService.getArticleFournisseurByFournisseurId(this.fournisseur.id ? this.fournisseur.id : 0 , this.exploitationId).subscribe({
      next: (artFournisseur) => {
        this.articleFournisseurs = artFournisseur;
        // console.log(this.articleFournisseurs);
      }
    });
  }
  showCommande(comm: any) {
    this.commandes = comm;
    console.log(this.commandes);
    this.toggleModal();
  }

  addBonCommande(bonCommande?: any) {
    this.commandeService.createBonCommande(bonCommande);
  }

  public selectOnFournisseur() {
    this.fournisseur = this.fournisseur;
    
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

  public openModalArticle(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl', ariaDescribedBy: 'modal-basic-title' });
    this.ShowArticleFournisseurByExploitation();

  }

  public openModalFournisseur() {
    // const modalRef = this.modalService.open(this.contentFournisseur).result.then(
    //   (result) => {
    //     this.closeResult = 'Closed with: ${result}';
    //     if (this.closeResult == 'Closed with: Save click') {
    //       this.showFournisseur(this.fournisseur);
    //     }
    //   },
    //   (reason) => {
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //   }
    // );

  }

  public onCheckboxChange(event: any) {
    // this.validateArticles.push(this.articleFournisseur);
    // console.log(this.articleFournisseur.id);
  }

  selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur = data;
    this.fournisseur.id = data.id;
  }

}
