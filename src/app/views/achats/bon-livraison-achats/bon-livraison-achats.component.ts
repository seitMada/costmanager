import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
import { InterfaceLivraisonDetail } from 'src/app/shared/model/interface-livraisondetail';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InterfaceArticleExploitation, InterfaceArticleExploitations } from 'src/app/shared/model/interface-articleexploitations';
import { InterfaceBonCommande, InterfaceBonCommandes } from 'src/app/shared/model/interface-bonCommande';
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from 'src/app/shared/model/interface-commandedetail';
import { CommandeService } from 'src/app/shared/service/commande.service';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { PAYS } from 'src/assets/pays';
import { Conditionnement } from 'src/app/shared/model/conditionnements';
import { IntefaceConditionnement } from 'src/app/shared/model/inteface-conditionnements';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-bon-livraison-achats',
  standalone: true,
  imports: [CommonModule, FormsModule,BsDatepickerModule,TooltipModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './bon-livraison-achats.component.html',
  styleUrl: './bon-livraison-achats.component.scss',
  providers:[NgbModalConfig,NgbModal]
})
export class BonLivraisonAchatsComponent implements OnInit{

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

  public country = PAYS;
  public flags: string = '';

  public fournisseurs: Fournisseur;
  public fournisseur: Fournisseurs;
  public centres: Centrerevenus;
  public centre: Centrerevenu;
  public adresse: Adress;
  public adresses: Adresse;

  public article: InterfaceArticle;
  public articles: InterfaceArticle[];
  public exploitation: InterfaceExploitations;
  public bonCommande: InterfaceBonCommande;
  public bonCommandes: InterfaceBonCommande[];
  public bonLivraison: InterfaceBonLivraisons;
  public bonLivraisons: InterfaceBonLivraisons[];
  public commandeDetail : InterfaceCommandeDetail;
  public commadeDetails :InterfaceCommandeDetail[];
  public livraisonDetail : InterfaceLivraisonDetail;
  public livraisonDetails : InterfaceLivraisonDetail[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleExploitation: InterfaceArticleExploitation;
  public articleExploitations: InterfaceArticleExploitations;
  public conditionnement : IntefaceConditionnement;

  public artExploitationArticleId: any[] = [];
  public artFournisseurArticleId : any[] = [];

  public idFournisseur =0;
  public idBonLivraison = 0;
  public montantTTc=0;
  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;

  public num_livraison:string;
  public newNumLivraison: string[];

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today:new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
    tomorrow: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1)
  }

  public bonLivraisonForm = FormGroup;
  closeResult = '';

  public toggle = true;
  public addLivraison = true;
  public listLivraison = true;
  public modifToggle = true;
  public deleteLivraison = false;
  public showDeleteBtn = false;
  public inputModif = false;
  public addBtn = false;
  public showvalidateBtn = false;
  

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
    this.num_livraison = "LIV-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.resetFournisseur();
    this.resetCentre();
    this.resetLivraison();
    this.resetDetailLivraison();
    this.resetArticleFournisseur();
 }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }


  ngOnInit(): void {   
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

  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
        if (this.isAdmin == true) {
          this.livraisonService.getListLivraisons(this.idFournisseur).subscribe({
            next: (_livraisons) => {
              this.bonLivraisons = _livraisons;
              console.log(this.bonLivraisons);
              
            },
          })
        } else {
          this.livraisonService.getListLivraisonByFournisseurExploitation(this.idFournisseur, this.exploitation.id ? this.exploitation.id :0).subscribe({
            next: (_livraisons) => {
              this.bonLivraisons = _livraisons;
            },
          });
        }
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
              validation:0,
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
    if (this.isAdmin == true) {
      this.livraisonService.getListLivraisons(this.fournisseur.id).subscribe({
        next: (_livraisons) => {
          this.bonLivraisons = _livraisons;
          console.log(this.bonLivraisons);
          
        },
      })
    } else {
      this.livraisonService.getListLivraisonByFournisseurExploitation(this.fournisseur.id,this.exploitation.id ? this.exploitation.id:0).subscribe({
        next: (livraisons) =>{
          this.livraisonDetails = [];
          this.bonLivraisons = livraisons;
        },
      }) 
    } 
    
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
      adresses: new Adress(),
      centreRevenu: []
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
      lieuStockage:[]
    }
  }

  public resetDetailLivraison(){
    this.livraisonDetail = {
      articlefournisseurId:0,
      livraisonId: 0,
      articleId:0,
      quantiteCommandeeFT:0,
      quantiteCommandee: 0,
      conditionnementId:0,
      quantiteLivree: 0,
      quantiteLivreeFT:0,
      quantiteFT:0,
      prixarticle: 0,
      remise: 0,
      valeurTva: 0,
      selected:false,
      articlefournisseur:this.articleFournisseur,
      livraison:[],
      conditionnement: this.conditionnement,
      article:this.article
    }
  }

  public resetArticleFournisseur(){
    this.articleFournisseur = {
      articleId: 0,
      fournisseurId: this.fournisseur.id ? this.fournisseur.id:0,
      marque: '',
      prixReference: 0,
      prixReferencePrecedent: 0,
      commentaire: '',
      selected: false,

      article: this.article,
      fournisseur: this.fournisseur,
      conditionnement: []
    }
  }

  public resetLivraison(){
    this.num_livraison = "LIV-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.bonLivraison = {
      numLivraison:this.num_livraison,
      dateCommande: this.dates.today,
      dateLivraison: this.dates.tomorrow,
      remise:0,
      montantHt:0,
      montantTva:0,
      validation:0,
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

  public selectArticle(contentCommandeArticle:TemplateRef<any>,commande:InterfaceBonCommande){
    this.commadeDetails = commande.commandeDetail;
    this.bonCommande = commande;
    
    this.modalService.open(contentCommandeArticle, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {}},
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log(this.closeResult)
        },
      );
  }

  public openModalArticle(contentArticle: TemplateRef<any>){
    if (this.livraisonDetails.length > 0) {
      const articlesId = this.livraisonDetails.map((i:any) => i.articleId);

        this.livraisonService.getArticleFournisseurByArticle(articlesId,this.fournisseur.id ? this.fournisseur.id: 0,this.artExploitationArticleId).subscribe({
          next:(_articlefournisseurs) =>{
            this.articleFournisseurs = _articlefournisseurs;
            
            this.modalService.open(contentArticle, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
              (result) => {
                this.closeResult = `Closed with: ${result}`;
                console.log(this.closeResult)
                if (this.closeResult == 'Closed with: Save click') {
                  for (const articlefournisseur of this.articleFournisseurs) {  
                    for(const condition of articlefournisseur.conditionnement){
                      if (condition.selected != undefined ) {
                        this.livraisonDetail = {
                          articlefournisseurId:articlefournisseur.id ? articlefournisseur.id :0,
                          articleId: articlefournisseur.articleId,
                          livraisonId: 0,
                          quantiteCommandee: 0,
                          quantiteCommandeeFT:0,
                          conditionnementId:condition.id ? condition.id:0,
                          quantiteLivree: 0,
                          quantiteLivreeFT:0,
                          quantiteFT:0,
                          prixarticle:condition.prixAchat ? condition.prixAchat: 0,
                          remise: 0,
                          valeurTva: 0,
                          selected:false,
                          articlefournisseur:articlefournisseur,
                          livraison:[],
                          conditionnement: condition,
                          article:articlefournisseur.article
                        }
                        this.livraisonDetails.push(this.livraisonDetail);
                      }
                    }
                  }
                  this.addBtn = false;
                }
              },
              (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                console.log(this.closeResult)
              },
            );
          },
        })
      
    } else {
      const exploitationId = Number(this.exploitationId);
      this.selectFounisseur(this.fournisseur);
      console.log(exploitationId );
      
      this.livraisonService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
        next: (artExploitation) => {         
          if (artExploitation) {
            this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
            
            this.livraisonService.getArticleFournisseurByArticleId(this.fournisseur.id ? this.fournisseur.id : 0, this.artExploitationArticleId).subscribe({
              next: (artFournisseur: any) => {
                this.articleFournisseurs = artFournisseur;
                this.modalService.open(contentArticle, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
                  (result) => {
                    this.closeResult = `Closed with: ${result}`;
                    console.log(this.closeResult)
                    if (this.closeResult == 'Closed with: Save click') {
                      this.livraisonDetails = [];
                      this.inputModif = this.inputModif;              
                      for (const articlefournisseur of this.articleFournisseurs) {  
                        for(const condition of articlefournisseur.conditionnement){
                          if (condition.selected != undefined ) {
                            this.livraisonDetail = {
                              articlefournisseurId:articlefournisseur.id ? articlefournisseur.id :0,
                              articleId: articlefournisseur.articleId,
                              livraisonId: 0,
                              quantiteCommandee: 0,
                              quantiteCommandeeFT:0,
                              conditionnementId:condition.id ? condition.id:0,
                              quantiteLivree: 0,
                              quantiteLivreeFT:0,
                              quantiteFT:0,
                              prixarticle:condition.prixAchat ? condition.prixAchat: 0,
                              remise: 0,
                              valeurTva: 0,
                              selected:false,
                              articlefournisseur:articlefournisseur,
                              livraison:[],
                              conditionnement: condition,
                              article:articlefournisseur.article
                            }
                            this.livraisonDetails.push(this.livraisonDetail);
                            this.addBtn = false;
                          }
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
      });
    }
  }

  public openModalCommande(content: TemplateRef<any>) { 
    this.livraisonDetails = [];
    this.montantTTc = 0;
    this.livraisonService.getCommandeByFournisseurExploitationValidate(this.fournisseur.id? this.fournisseur.id:0,this.exploitation.id ?this.exploitation.id:0).subscribe({
      next:(commandes) =>{    
        this.bonCommandes = commandes;  
        this.addLivraison = !this.addLivraison;
        this.listLivraison = !this.listLivraison;
        this.bonLivraison.fournisseurId = this.fournisseur.id ?this.fournisseur.id:0;
        
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: validate click') {
                this.modifToggle = !this.modifToggle;
                this.toggle = (this.toggle === false ? true : false);
                this.resetLivraison();
                this.inputModif = false;
                if (commandes.length) {
                  for(const commande of commandes){
                    if (commande.selected) {
                      this.bonCommande = commande;
                      this.livraisonService.getListDetailCommandeByCommandeId(commande.id ? commande.id:0).subscribe({
                        next :(commandeDetail) => {
                          this.bonLivraison.dateCommande = new Date(commande.dateCommande);
                          this.bonLivraison.dateLivraison = new Date();
                          const numLiv = commande.noPiece;
                          this.newNumLivraison = numLiv.split('-');
                          this.bonLivraison.numLivraison = 'LIV-'+this.newNumLivraison[1];
                          
                          for(const comm of commandeDetail){
                            if(comm.articlefournisseur){
                              this.livraisonDetail = {
                                articlefournisseurId:comm.articlefournisseurId,
                                livraisonId: 0,
                                articleId: comm.articleId,
                                quantiteCommandee: comm.QteCommande,
                                quantiteCommandeeFT:comm.quantiteCommandeeFT,
                                conditionnementId:comm.conditionnementId,
                                quantiteFT:0,
                                quantiteLivree: comm.QteCommande,
                                quantiteLivreeFT:0,
                                prixarticle: comm.prixarticle,
                                remise: comm.remise,
                                valeurTva: 0,
                                selected:false,
                                articlefournisseur:comm.articlefournisseur,
                                livraison:[],
                                conditionnement:comm.conditionnement,
                                article:comm.article
                              };
                              if (this.livraisonDetail.valeurTva != 0) {
                                const taxe = ((this.livraisonDetail.quantiteLivree * this.livraisonDetail.prixarticle -this.livraisonDetail.remise) * this.livraisonDetail.valeurTva)/100;
                                this.montantTTc += (this.livraisonDetail.quantiteLivree * this.livraisonDetail.prixarticle -this.livraisonDetail.remise) + (+taxe);
                              } else {
                                this.montantTTc += (this.livraisonDetail.quantiteLivree * this.livraisonDetail.prixarticle) -this.livraisonDetail.remise;
                              }
                              
                              this.livraisonDetails.push(this.livraisonDetail);
                              // console.log(this.livraisonDetails);
                              
                            }
                          }
                          this.addBtn = false;
                        },
                      })
                    }else{
                      this.addBtn = true;
                      this.livraisonDetails = [];
                      this.bonLivraison.dateCommande = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
                      this.bonLivraison.dateLivraison = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1);
                    }
                  }
                } else {
                  this.addBtn = true;
                  this.bonLivraison.dateCommande = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
                  this.bonLivraison.dateLivraison = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1);
                }
                
              }else if(this.closeResult == 'Closed with: Create click'){
                this.modifToggle = !this.modifToggle;
                this.toggle = (this.toggle === false ? true : false);
                // this.resetLivraison();
                this.addBtn = true;
                this.inputModif = false;
                this.livraisonDetails = [];
                this.bonLivraison.dateCommande = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
                this.bonLivraison.dateLivraison = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1);
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              console.log(this.closeResult)
              this.toggle = this.toggle;
              this.addLivraison = true;
              this.inputModif = false;
              this.modifToggle = true;
              this.livraisonDetails = [];
              // console.log(this.livraisonDetails);
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
    this.toggle = (this.toggle === false ? true : false);
    this.addLivraison = true;
    this.listLivraison = true;
    this.inputModif = !this.inputModif;
    this.deleteLivraison = false;
    this.showvalidateBtn =false;
    this.modifToggle = true;
    this.showAllFournisseur();
    this.resetLivraison();
    this.resetDetailLivraison();
  }

  showLivraison(bonLivraison:InterfaceBonLivraisons){
    this.bonLivraison = bonLivraison;
    this.montantTTc = 0;
    if (bonLivraison.validation == 0) {
      this.showvalidateBtn = !this.showvalidateBtn;
    }
    this.toggle = !this.toggle;
    this.bonLivraison.dateCommande = new Date(this.bonLivraison.dateCommande);
    this.bonLivraison.dateLivraison = new Date(this.bonLivraison.dateLivraison);
    this.livraisonDetails = this.bonLivraison.livraisonDetail;
    for (const livraison of this.livraisonDetails) {
      if (livraison.valeurTva !=0 || livraison.valeurTva !=null) {
        const taxe = ((livraison.quantiteLivree * livraison.prixarticle -livraison.remise) *livraison.valeurTva)/100
        this.montantTTc += (livraison.quantiteLivree * livraison.prixarticle -livraison.remise) + (+taxe);
      } else {
        this.montantTTc += (livraison.quantiteLivree * livraison.prixarticle -livraison.remise);
      }
    }
    
    this.addLivraison = !this.addLivraison;
    this.listLivraison = !this.listLivraison;
    this.inputModif = !this.inputModif;
  }

  getTotalMontant():number {    
    let montantTTc=0;
    for (const line of this.livraisonDetails) {
      if (line.valeurTva!=0 || line.valeurTva != null) {
        const taxe = (((line.quantiteLivree * line.prixarticle) - line.remise) *line.valeurTva)/100;
        montantTTc += ((line.quantiteLivree * line.prixarticle) - line.remise) + (+taxe);
      } else {
        montantTTc += ((line.quantiteLivree * line.prixarticle) - line.remise);
      }
    }
    return montantTTc;
  }

  addBonLivraison(){
    if (!this.isAdmin) {
      this.bonLivraison = this.bonLivraison;
      console.log(this.bonLivraison );
      
      this.livraisonDetails = this.livraisonDetails;
      if (this.livraisonDetails.length>0) {
        this.livraisonService.createNewBonLivraison(this.bonLivraison,this.livraisonDetails,this.bonCommande).subscribe({
          next:(livraison:any) =>{
            this.toggleToast('Bon de livraison n° '+ this.bonLivraison.numLivraison+ ' crée avec succès!');
            this.addBtn = false;
            this.inputModif = !this.inputModif;
            this.modifToggle = !this.modifToggle;
            this.showvalidateBtn = !this.showvalidateBtn;
            this.resetLivraison();
          },
        })
      }else{
        alert('Veuillez réessayer!');
      }
    }else{
      alert('Il est impossible de créer une bon de livraison.!');
    }
  }

  checkSelectedRows(){
    this.showDeleteBtn = this.livraisonDetails.some(line => line.selected);
  }

  deleteSelectedRows() {
    if (!this.isAdmin) {
      if (this.livraisonDetails) {
        this.livraisonDetails = this.livraisonDetails.filter(line => !line.selected);
      }
      this.showDeleteBtn = false;
      this.addBtn = true;
      if (this.articleFournisseurs && this.livraisonDetails) {
        for (const _livrDetail of this.livraisonDetails) {
          this.articleFournisseurs = this.articleFournisseurs.filter(line => line.id != _livrDetail.articlefournisseurId);
        }
      }
    }else{
      alert('Il est impossible de supprimer ces articles.!');
    }
  }

  selectBonLivraison(){
    this.deleteLivraison = this.bonLivraisons.some(line => line.selected);
    this.showvalidateBtn = this.bonLivraisons.some(line => line.selected);
  }

  deleteSelectedRowsLivraison() {
    if (!this.isAdmin) {
      const selectedBonLivraisons = this.bonLivraisons.filter(line => line.selected);
      for (const bonLivraison of selectedBonLivraisons) {
        if (!bonLivraison.validation) {
          this.livraisonService.deleteBonLivraison(bonLivraison).subscribe({
            next:(value) =>{
              this.bonLivraisons = this.bonLivraisons.filter(line => line !== bonLivraison);
              this.deleteLivraison = this.bonLivraisons.some(line => line.selected);
              this.showvalidateBtn = this.bonLivraisons.some(line => line.selected);
            },
          });
        }else{
          alert(`Ce bon de livraison n° ${bonLivraison.numLivraison} ne peut pas supprimer!`)
        }      
      }
    }else{
      alert('Il est impossible de supprimer cette bon de livraison.!');
    }
  }

  validateLivraison(){
    if (!this.isAdmin) {
      this.idBonLivraison = this.bonLivraison.id ? this.bonLivraison.id :0;
      const selectedBonLivraisons = this.bonLivraisons.filter(line => line.selected) || [];
      if (selectedBonLivraisons.length > 0) {
        for (const bonLivraison of selectedBonLivraisons) {
          if (bonLivraison.validation == 0) {
            this.livraisonService.validateLivraison(bonLivraison).subscribe({
              next:(value) =>{
                this.toggle = this.toggle;
                this.deleteLivraison = false;
                this.showvalidateBtn = !this.showvalidateBtn;
                this.toggleToast('Bon de livraison n° '+bonLivraison.numLivraison+' a été validé');
                this.showAllFournisseur();              
              },
            });
          }else{
            alert('Ce bon de livraison est déjà validé!');
            this.deleteLivraison = false;
            this.showvalidateBtn = !this.showvalidateBtn;
          }      
        }
      } else {
        this.livraisonService.validateLivraison(this.bonLivraison).subscribe({
          next:(value) =>{
            this.toggleToast('Bon de livraison n° '+this.bonLivraison.numLivraison+' a été validé');
            this.deleteLivraison = false;
            this.showvalidateBtn = !this.showvalidateBtn;
            this.inputModif = true;
          },
        });
      }
    }else{
      alert('Il est impossible de valider cette bon de livraison.!');
    }
    
  }
}