import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';

import { InterfaceAchat } from "../../../shared/model/interface-achats";
import { Achat } from "../../../shared/model/achats";
import { Article } from 'src/app/shared/model/articles';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { Centrerevenu, Centrerevenus } from "src/app/shared/model/centrerevenu";
import { InterfaceArticleExploitation, InterfaceArticleExploitations } from 'src/app/shared/model/interface-articleexploitations';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { Observable } from 'rxjs';
import { InterfaceBonCommandes } from 'src/app/shared/model/interface-bonCommande';
import { InterfaceCommandeDetails } from 'src/app/shared/model/interface-commandedetail';
import { BonCommande } from 'src/app/shared/model/bonCommande';

import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss',
  providers: [NgbModalConfig, NgbModal]
})
export class BonCommandeAchatsComponent implements OnInit {

  public fournisseur: Fournisseurs;
  public fournisseurs: Fournisseur;
  public centres: Centrerevenus;
  public centre: Centrerevenu;
  public exploitation: InterfaceExploitations;
  public achat: InterfaceAchat;
  public article: InterfaceArticle;
  public articles: InterfaceArticle[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleExploitation: InterfaceArticleExploitation;
  public articleExploitations: InterfaceArticleExploitations;
  public achats: Achat;
  public adresse: Adress;

  public commandes: InterfaceCommandeDetails[];
  public boncommande: InterfaceBonCommandes;
  public boncommandes: InterfaceBonCommandes[];
  public commandeDetail: InterfaceCommandeDetails;
  public reason: any;
  public validateArticles: any[] = [];
  public artExploitationArticleId: any[] = [];

  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);
  public idFournisseur = 0;
  public idBonCommande = 0;
  public articleFournisseurId = 0;
  public montantTTc=0;
  public montantRemise =0;

  public num_commande: string;

  public toggle = true;
  public modifToggle = true;
  public addTogle = true;
  public addCommande = true;
  public listArts = true;
  public btnC = false;
  public addBtn = false;
  public showDeleteBtn = false;
  public showDeleteBtnCom = false;
  public btnTenRecord = false;
  public inputModif = false;

  public bonCommandeForm = FormGroup;
  closeResult = '';

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  }


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private commandeService: CommandeService,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private datePipe: DatePipe,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;

    this.resetFournisseur();
    this.resetCentre();
    this.resetCommande();
    this.resetDetailCommande();
    this.resetArticleFournisseur();
  }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }

  ngOnInit(): void {
   
    this.num_commande = "COM-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    
    this.showExploitationFournisseur();
    this.showAllFournisseur();
    this.listArticleFournisseurs();
  }


  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
        this.commandeService.getCommandeByFournisseurExploitation(this.idFournisseur,this.exploitation.id? this.exploitation.id:0).subscribe({
          next: (boncommande) => {
            this.commandes = [];
            this.boncommandes = boncommande;
          },
          error: (error) => {
            alert('Liste de bon de commande vide');
          }
        })
      },
      error: (error) => {
        alert('Liste fournisseur vide')
      }
    });
  }
  
  showExploitationFournisseur() {
    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next: (exploitation) => {
        this.exploitation = exploitation;
        this.centreRevenuService.getCrExploitation(this.exploitation.id ? this.exploitation.id : 0).subscribe({
          next: (_centre) => {
            this.centres = _centre;
            this.centre = _centre[0];
            this.boncommande = {
              quantiteCommande: 0,
              remise: 0,
              montantHT:0,
              montantTva: 0,
              noPiece: this.num_commande,
              validation: false,
              commentaire: '',
              dateCommande: this.dates.today,
              fournisseurId: this.fournisseur.id ? this.fournisseur.id: 0,
              exploitationId: this.exploitationId,
              centreId: this.centre.id ? this.centre.id: 0,
              fournisseur: this.fournisseur,
              selected:false,
              centre: _centre,
              exploitation:exploitation,
              commandeDetail:[],
              achat: [],
            };
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    });
  }

  listArticleFournisseurs(){
    const exploitationId = Number(this.exploitationId);
    this.commandeService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
      next: (artExploitation) => {
        const fournisseur = this.fournisseur;
        if (artExploitation) {
          this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
          this.commandeService.getArticleFournisseurByArticleId(fournisseur.id ? fournisseur.id : 0, this.artExploitationArticleId).subscribe({
            next: (artFournisseur: any) => {
              this.articleFournisseurs = artFournisseur;
              this.commandes = [];
    
              for (const articlefournisseur of artFournisseur) {
                  this.commandeDetail = {
                    commandeId: 0,
                    articlefournisseurId: articlefournisseur.articleId,
                    QteCommande: 0,
                    QteLivre: 0,
                    prixarticle: articlefournisseur.prixReference,
                    remise: 0,
                    validationdetailbc: false,
                    articlefournisseur: articlefournisseur,
                    selected:false
                  }
                  this.commandes.push(this.commandeDetail)
              }
            }
          })
        }
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

  public resetCommande(){
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
    this.boncommande = {
      quantiteCommande: 0,
      remise: 0,
      montantHT: 0,
      montantTva: 0,
      noPiece: '',
      validation: false,
      commentaire: '',
      dateCommande: new Date,
      fournisseurId: 0,
      exploitationId: 0,
      selected: false,
      centreId: 0,
      fournisseur: this.fournisseur,
      centre: this.centre,
      exploitation: this.exploitation,
      commandeDetail:[],
      achat:[]
    }
  }

  public resetArticleFournisseur(){
   
    this.articleFournisseur = {
      articleId: 0,
      fournisseurId: 0,
      marque: '',
      prixReference: 0,
      prixReferencePrecedent: 0,
      commentaire: '',

      article:this.article,
      fournisseur:this.fournisseur,
      conditionnement: [],
    }
  }

  public resetDetailCommande(){
    this.commandeDetail = {
      commandeId:0,
      articlefournisseurId:0,
      QteCommande: 0,
      QteLivre:0,
      prixarticle:0,
      remise:0,
      validationdetailbc:false,
      commande:this.boncommande,
      articlefournisseur:this.articleFournisseur,
      selected:false,
    }
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

  getTotalMontant(): number {
    let montantTTc=0;
    for (const line of this.commandes) {
      montantTTc += line.QteCommande * line.prixarticle;
    }
    return montantTTc;
  }

  getTotalRemise(): number {
    let montantRemise=0;
    for (const line of this.commandes) {
      montantRemise += line.remise;
    }
    return montantRemise;
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          for (const _articlefournisseur of this.articleFournisseurs) {
            if (_articlefournisseur.selected == true) {
              this.commandeDetail = {
                commandeId: 0,
                articlefournisseurId: _articlefournisseur.articleId,
                QteCommande: 0,
                QteLivre: 0,
                prixarticle: _articlefournisseur.prixReference,
                remise: 0,
                validationdetailbc: false,
                articlefournisseur: _articlefournisseur,
                selected:false
              }
              this.commandes.push(this.commandeDetail)
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

  generatePDF(commande:InterfaceBonCommandes) {
    console.log(commande);
    
    // const doc = new jsPDF();
    // doc.text('Bon de commande N° '+ commande.noPiece, 10, 10);
    // doc.save('commande.pdf');
  }

  

  listArticleDixDernierCommande(){
    const fournisseurId = this.fournisseur.id ? this.fournisseur.id:0;
    const exploitationId = this.exploitation.id ? this.exploitation.id: 0;
    this.commandeService.getDixDernierCommandes(fournisseurId,Number(exploitationId)).subscribe({
      next:(commandeDetail) =>{
        this.commandes = commandeDetail; 
        console.log(this.commandes);
               
      },
    })
    
  }


  showCommande(bonCommande: BonCommande) {
    this.boncommande = bonCommande;
    this.idBonCommande =bonCommande.id ? bonCommande.id :0;
    this.commandeService.getCommandeDetailByCommandeId(this.idBonCommande).subscribe({
      next:(commandeDetail) =>{
        this.commandes =[];        
        for(const detailComm of commandeDetail){
          this.commandeDetail = {
            commandeId: detailComm.commandeId,
            articlefournisseurId: detailComm.articlefournisseurId,
            QteCommande: detailComm.QteCommande,
            QteLivre: detailComm.QteLivre,
            prixarticle: detailComm.prixarticle,
            remise: detailComm.remise,
            validationdetailbc: detailComm.validationdetailbc,
            articlefournisseur: detailComm.articlefournisseur,
            selected:false
          }
          this.commandes.push(this.commandeDetail)
        }
        this.addCommande = !this.addCommande;
        this.addTogle = !this.addTogle;
        this.listArts = !this.listArts;
        this.toggle = !this.toggle;
        this.btnTenRecord = this.btnTenRecord;
        this.inputModif = !this.inputModif;
      },
    })
  }


  addBonCommande() {
    this.boncommande = this.boncommande;
    if (this.idBonCommande ===0 ) {
      this.commandeService.createBonCommande(this.boncommande,this.commandes).subscribe({
        next:(commande:any) => {
          alert('Bon de commande n° '+ this.boncommande.noPiece+ ' crée avec succès!');
          this.inputModif = !this.inputModif;
          this.addCommande = false;
          this.listArts = false;
          this.addTogle = false;
        },
        error:(error) =>{
          alert('veuillez réessayer!');
        }
      });
    } 
  }

  annuler(){
    this.toggle = !this.toggle;
    this.addTogle = true;
    this.addCommande = true;
    this.listArts = true;
    this.showAllFournisseur();
  }

  selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur = data;
    this.fournisseur.id = data.id;
  }

  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }

  checkSelectedRows(){
    this.showDeleteBtn = this.commandes.some(line => line.selected);
    this.modifToggle = false;
  }
  deleteSelectedRows() {
    this.commandes = this.commandes.filter(line => !line.selected);
    this.showDeleteBtn = false;
    this.modifToggle = true;
  }

  selectBoncomm(){
    this.showDeleteBtnCom = this.boncommandes.some(line => line.selected);
  }

  deleteSelectedRowsComm() {
    const selectedBonCommandes = this.boncommandes.filter(line => line.selected);
    for (const bonCommande of selectedBonCommandes) {
     if (!bonCommande.validation) {
      this.commandeService.deleteOneCommande(bonCommande).subscribe({
        next:(value) =>{
          this.boncommandes = this.boncommandes.filter(line => line !== bonCommande);
          this.showDeleteBtnCom = this.boncommandes.some(line => line.selected);
        },
      });
     }      
    }
  }

  toggleModal() {
    this.addBtn = this.addBtn;
    this.idBonCommande =0;
    this.toggle = !this.toggle;
    this.addCommande = !this.addCommande;
    this.btnTenRecord = false;
    this.listArts = !this.listArts;
    this.inputModif = false;
  }

  addCommandeModal(){
    this.toggle = !this.toggle;
    this.addBtn = !this.addBtn;
    this.addTogle = !this.addTogle;
    this.listArts = !this.listArts;
    this.commandes = [];
    this.inputModif = false;
  }

  showListCommande(){
    this.toggle = !this.toggle;
    this.addTogle = !this.addTogle;
    this.addCommande = !this.addCommande;
    this.btnTenRecord = !this.btnTenRecord;
    this.inputModif = false;
  }

}
