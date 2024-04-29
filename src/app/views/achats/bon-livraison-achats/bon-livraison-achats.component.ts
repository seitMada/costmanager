import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
<<<<<<< Updated upstream

import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { BonlivraisonService } from 'src/app/shared/service/bonlivraison.service';

import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { Centrerevenu, Centrerevenus } from 'src/app/shared/model/centrerevenu';
import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { InterfaceBonLivraisons } from 'src/app/shared/model/interface-bonLivraison';
import { InterfaceLivraisonDetails } from 'src/app/shared/model/interface-livraisondetail';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InterfaceArticleExploitation, InterfaceArticleExploitations } from 'src/app/shared/model/interface-articleexploitations';
import { InterfaceBonCommandes } from 'src/app/shared/model/interface-bonCommande';
import { InterfaceCommandeDetails } from 'src/app/shared/model/interface-commandedetail';
=======
import { Adress } from '../../../shared/model/adresse';
import { Centrerevenu, Centrerevenus } from '../../../shared/model/centrerevenu';
import { Fournisseur, Fournisseurs } from '../../../shared/model/fournisseurs';
import { InterfaceCentreRevenu } from '../../../shared/model/interface-centrerevenu';
import { InterfaceExploitations } from '../../../shared/model/interface-exploitations';
import { InterfaceFournisseur } from '../../../shared/model/interface-fournisseurs';
import { CentreRevenuService } from '../../../shared/service/centre-revenu.service';
import { ExploitationService } from '../../../shared/service/exploitation.service';
import { FournisseurService } from '../../../shared/service/fournisseur.service';
>>>>>>> Stashed changes

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
  public adresses: Adresse;

  public article: InterfaceArticle;
  public articles: InterfaceArticle[];
  public exploitation: InterfaceExploitations;
  public bonCommande: InterfaceBonCommandes;
  public bonCommandes: InterfaceBonCommandes[];
  public bonLivraison: InterfaceBonLivraisons;
  public bonLivraisons: InterfaceBonLivraisons[];
  public commandeDetail : InterfaceCommandeDetails;
  public commadeDetails :InterfaceCommandeDetails[];
  public livraisonDetail : InterfaceLivraisonDetails;
  public livraisonDetails : InterfaceLivraisonDetails[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleExploitation: InterfaceArticleExploitation;
  public articleExploitations: InterfaceArticleExploitations;

  public artExploitationArticleId: any[] = [];

  public idFournisseur =0;
  public idBonLivraison = 0;
  public montantTTc=0;
  public montantRemise =0;
  public montantTva =0;
  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);

  public num_livraison:string;

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today:new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    tomorrow: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()+1)
  }

  public bonLivraisonForm = FormGroup;
  closeResult = '';

  public toggle = true;
  public addLivraison = true;
  public listLivraison = true;
  public deleteLivraison = false;
  public showDeleteBtn = false;
  public inputModif = false;

 constructor(
  public router: Router,
  public route: ActivatedRoute,
  private fournisseurService: FournisseurService,
  private exploitationService: ExploitationService,
  private centreRevenuService: CentreRevenuService,
  private livraisonService: BonlivraisonService,
  private modalService: NgbModal,
  private datePipe: DatePipe,
  config:NgbModalConfig,
 ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;

    this.resetFournisseur();
    this.resetCentre();
    this.resetLivraison();
    this.resetDetailLivraison();
 }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }


  ngOnInit(): void {
    this.num_livraison = "LIV-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    
    this.showExploitationFournisseur();
    this.showAllFournisseur();
    this.showAllAdresse();
  }

  

  showAllAdresse(){
    this.fournisseurService.getAllAdresse().subscribe({
      next :(adresses) => {
        this.adresses = adresses;
        this.adresse = adresses[0];
      },
    })
  }

  addBonLivraison(){
    this.bonLivraison = this.bonLivraison;
    this.livraisonDetails = this.livraisonDetails;
    if (this.livraisonDetails.length>0) {
      this.livraisonService.createNewBonLivraison(this.bonLivraison,this.livraisonDetails,this.bonCommande).subscribe({
        next:(livraison:any) =>{
          alert('Bon de livraison n° '+ this.bonLivraison.numLivraison+ ' crée avec succès!');
          this.inputModif = !this.inputModif;
        },
      })
    }else{
      alert('Veuillez réessayer!');
    }
    
  }


  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
        this.livraisonService.getListLivraisonByFournisseurExploitation(this.idFournisseur, this.exploitation.id ? this.exploitation.id :0).subscribe({
          next: (_livraisons) => {
            this.bonLivraisons = _livraisons;
            console.log(this.bonLivraisons);
            
          },
        });
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
            this.bonLivraison = {
              numLivraison:this.num_livraison,
              dateCommande: this.dates.today,
              dateLivraison: this.dates.tomorrow,
              remise:0,
              montantHt:0,
              montantTva:0,
              validation:false,
              commentaire:'',
              adresseId: this.adresse.id ? this.adresse.id :0,
              fournisseurId:this.fournisseur.id ? this.fournisseur.id :0,
              exploitationId:this.exploitation.id ? this.exploitation.id :0,
              centreId:this.centre.id ? this.centre.id :0,
              selected:false,
              adresse:this.adresse,
              fournisseur:this.fournisseur,
              exploitation:this.exploitation,
              centre:_centre,
              livraisonDetail:this.livraisonDetails
            }
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de livraison vide');
      }
    });
  }


  addToggle(){
    this.toggle = !this.toggle;
    this.listLivraison = !this.listLivraison;
    this.resetLivraison();
  }

  async selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur =data; 
    this.fournisseur.id = data.id ? data.id:0 ;   
    this.livraisonService.getListLivraisonByFournisseurExploitation(this.fournisseur.id,this.exploitation.id ? this.exploitation.id:0).subscribe({
      next: (livraisons) =>{
        this.livraisonDetails = [];
        this.bonLivraisons = livraisons;
        this.livraisonDetails = livraisons.map((livraison: any) => livraison.livraisonDetail);
      },
    }) 
  }

  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }

  selectAdresse(data: Adress) {
    this.adresse = data;
    this.adresse.id = data.id;
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

  public resetDetailLivraison(){
    this.livraisonDetail = {
      articlefournisseurId:0,
      livraisonId: 0,
      quantiteCommandee: 0,
      quantiteLivree: 0,
      prixarticle: 0,
      remise: 0,
      valeurTva: 0,
      selected:false,
      articlefournisseur:this.articleFournisseur,
      livraison:[]
    }
  }

  public resetLivraison(){
    this.bonLivraison = {
      numLivraison:this.num_livraison,
      dateCommande: this.dates.today,
      dateLivraison: this.dates.tomorrow,
      remise:0,
      montantHt:0,
      montantTva:0,
      validation:false,
      commentaire:'',
      adresseId: this.adresse.id ? this.adresse.id :0,
      fournisseurId:this.fournisseur.id ? this.fournisseur.id :0,
      exploitationId:this.exploitation.id ? this.exploitation.id :0,
      centreId:this.centre.id ? this.centre.id :0,
      selected:false,

      adresse:this.adresse,
      fournisseur:this.fournisseur,
      exploitation:this.exploitation,
      centre:this.centre,
      livraisonDetail:this.livraisonDetails
    }
  }

  public openModalArticle(content: TemplateRef<any>) { 
    this.livraisonService.getCommandeByFournisseurExploitationValidate(this.fournisseur.id? this.fournisseur.id:0,this.exploitation.id ?this.exploitation.id:0).subscribe({
      next:(commandes) =>{    
        this.bonCommandes = commandes;  
        this.toggle = !this.toggle;
        this.addLivraison = !this.addLivraison;
        this.listLivraison = !this.listLivraison;
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                for(const commande of commandes){
                  this.livraisonDetails = [];
                  this.bonCommande = commande;
                  if (commande.selected) {
                    this.livraisonService.getListDetailCommandeByCommandeId(commande.id ? commande.id:0).subscribe({
                      next :(commandeDetail) => {
                        this.dates = {
                          today:new Date(commande.dateCommande),
                          tomorrow: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate())
                        };
                        for(const comm of commandeDetail){
                          this.livraisonDetail = {
                            articlefournisseurId:comm.articlefournisseurId,
                            livraisonId: 0,
                            quantiteCommandee: comm.QteCommande,
                            quantiteLivree: 0,
                            prixarticle: comm.prixarticle,
                            remise: comm.remise,
                            valeurTva: 0,
                            selected:false,
                            articlefournisseur:comm.articlefournisseur,
                            livraison:[]
                          };
                          this.montantTTc += (this.livraisonDetail.quantiteLivree * this.livraisonDetail.prixarticle -this.livraisonDetail.remise) + this.livraisonDetail.valeurTva;
                          this.livraisonDetails.push(this.livraisonDetail);
                        }
                      },
                    })
                  }
                  console.log(this.bonCommande);
                }
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              console.log(this.closeResult)
            },
          ); 
      }, 
    });
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

  annuler(){
    this.livraisonDetails = [];
    this.toggle = !this.toggle;
    this.addLivraison = true;
    this.listLivraison = true;
    this.inputModif = !this.inputModif;
    this.showAllFournisseur();
    this.resetLivraison();
    this.resetDetailLivraison();
  }

  showLivraison(bonLivraison:InterfaceBonLivraisons){
    this.bonLivraison = bonLivraison;
    this.dates = {
      today: new Date(this.bonLivraison.dateCommande),
      tomorrow: new Date(this.bonLivraison.dateLivraison)
    };
    this.livraisonDetails = this.bonLivraison.livraisonDetail;
    this.montantTTc =0;
    for (const livraison of this.livraisonDetails) {
      this.montantTTc += livraison.quantiteLivree * livraison.prixarticle;
    }
    this.toggle = !this.toggle;
    this.addLivraison = !this.addLivraison;
    this.listLivraison = !this.listLivraison;
    this.inputModif = !this.inputModif;
    
  }

  getTotalMontant() {    
    let montantTTc=0;
    if (this.livraisonDetails) {
      for (const line of this.livraisonDetails) {
        montantTTc += (line.quantiteLivree * line.prixarticle - line.remise)+line.valeurTva;
      }
      return montantTTc;
    }else{
      return 0;
    }
  }

  checkSelectedRows(){
    this.showDeleteBtn = this.livraisonDetails.some(line => line.selected);
  }

  deleteSelectedRows() {
    this.livraisonDetails = this.livraisonDetails.filter(line => !line.selected);
    this.showDeleteBtn = false;
  }

  selectBonLivraison(){
    this.deleteLivraison = this.bonLivraisons.some(line => line.selected);
  }

  deleteSelectedRowsLivraison() {
    const selectedBonLivraisons = this.bonLivraisons.filter(line => line.selected);
    for (const bonLivraison of selectedBonLivraisons) {
     if (!bonLivraison.validation) {
      this.livraisonService.deleteBonLivraison(bonLivraison).subscribe({
        next:(value) =>{
          this.bonLivraisons = this.bonLivraisons.filter(line => line !== bonLivraison);
          this.deleteLivraison = this.bonLivraisons.some(line => line.selected);
        },
      });
     }else{
      alert(`Ce bon de livraison n° ${bonLivraison.numLivraison} ne peut pas supprimer!`)
     }      
    }
  }
}
