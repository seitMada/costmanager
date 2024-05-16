import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { FactureService } from 'src/app/shared/service/facture.service';
import { BonlivraisonService } from 'src/app/shared/service/bonlivraison.service';
import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';

import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { Centrerevenu, Centrerevenus } from 'src/app/shared/model/centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceAchat } from 'src/app/shared/model/interface-achats';
import { InterfaceAchatDetail } from 'src/app/shared/model/interface-achatdetail';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InterfaceArticleExploitation, InterfaceArticleExploitations } from 'src/app/shared/model/interface-articleexploitations';
import { InterfaceLivraisonDetails } from 'src/app/shared/model/interface-livraisondetail';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { InterfaceBonLivraisons } from 'src/app/shared/model/interface-bonLivraison';

import { ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './factures.component.html',
  styleUrl: './factures.component.scss',
  providers: [NgbModalConfig, NgbModal]
})
export class FacturesComponent implements OnInit {

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

  public fournisseur: Fournisseurs;
  public fournisseurs: Fournisseur;
  public centre: Centrerevenu;
  public centres: Centrerevenus;
  public adresse: Adress;
  public adresses: Adresse;
  public facture: InterfaceAchat;
  public factures: InterfaceAchat[];
  public article: InterfaceArticle;
  public articles: InterfaceArticle[];
  public detailFacture: InterfaceAchatDetail;
  public detailFactures : InterfaceAchatDetail[];
  public exploitation: InterfaceExploitations;
  public bonLivraison: InterfaceBonLivraisons;
  public bonLivraisons: InterfaceBonLivraisons[];
  public livraisonDetail : InterfaceLivraisonDetails;
  public livraisonDetails : InterfaceLivraisonDetails[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleExploitation: InterfaceArticleExploitation;
  public articleExploitations: InterfaceArticleExploitations;

  public num_facture:string;

  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);
  public idFournisseur = 0;
  public idFacture = 0;
  public montantTTc = 0;

  public toggle = true;
  public addFacture = true;
  public listFacture = true;
  public modifToggle = true;
  public toggleArticle = true;
  public deleteFacture = false;
  public showDeleteBtn = false;
  public inputModif = false;
  public addBtn = false;
  public showvalidateBtn = false;

  public newNumFacture:string[] = [];
  public artExploitationArticleId: any[] = [];

  public bonFactureForm = FormGroup;
  closeResult = '';

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
    tomorrow: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1)
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public fournisseurService: FournisseurService,
    public exploitationService:ExploitationService,
    public centreRevenuService: CentreRevenuService,
    public livraisonService : BonlivraisonService,
    public factureService : FactureService,
    private modalService:NgbModal,
    config:NgbModalConfig,
    private datePipe: DatePipe
  ) {
    this.bsConfig = Object.assign({},{ containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;

    this.resetFournisseur();
    this.resetCentre();
    this.resetFacture();
    this.resetArticleFournisseur();
    this.resetDetailFacture();
  }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }

  ngOnInit(): void {
    this.num_facture = "FAC-"+ (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();

    this.showExploitationFournisseur();
    this.showAllFournisseur();
    this.showAllAdresse();
    
  }

  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
        this.factureService.getListFactureByFournisseurExploitation(this.idFournisseur,this.exploitation.id? this.exploitation.id:0).subscribe({
          next :(_factures) =>{
            this.detailFactures = [];
            this.factures = _factures;
            console.log(this.factures);
            
            this.detailFactures  = _factures.map((_facture:any) => _facture.achatDetail);
          },
        })
        
      },
      error: (error) => {
        alert('Liste fournisseur vide')
      }
    });
  }

  showAllAdresse(){
    this.fournisseurService.getAllAdresse().subscribe({
      next :(adresses) => {
        this.adresses = adresses;
        this.adresse = adresses[0];
      },
    })
  }

  selectAdresse(data: Adress) {
    this.adresse = data;
    this.adresse.id = data.id;
  } 

  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }
  
  showExploitationFournisseur() {
    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next: (exploitation) => {
        this.exploitation = exploitation;
        this.centreRevenuService.getCrExploitation(this.exploitation.id ? this.exploitation.id : 0).subscribe({
          next: (_centre) => {
            this.centres = _centre;
            this.centre = _centre[0];
            this.facture = {
              dateAchat:this.dates.today,
              dateFacture:this.dates.today,
              dateLivraison:this.dates.tomorrow,
              numFacture:this.num_facture,
              montantHt:0,
              montantTva:0,
              montantRemise:0,
              fournisseurId:this.fournisseur.id ? this.fournisseur.id:0,
              exploitationId:this.exploitation.id ? this.exploitation.id :0,
              centreId:this.centre.id ? this.centre.id :0,
              selected:false,
              validation:false,
              exploitation:this.exploitation,
              centre:this.centre,
              fournisseur:this.fournisseur,
              achatDetail: this.detailFactures
            }
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    });
  }

  async selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur =data; 
    this.fournisseur.id = data.id ? data.id:0 ;   
    this.factureService.getListFactureByFournisseurExploitation(this.fournisseur.id,this.exploitation.id? this.exploitation.id:0).subscribe({
      next :(_factures) =>{
        this.detailFactures = [];
        this.factures = _factures;        
        // this.detailFactures  = _factures.map((_facture:any) => _facture.achatDetail);
      },
    });
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
      centreRevenu:[]
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

  public resetDetailFacture(){
    this.detailFacture = {
      achatId:0,
      articlefournisseurId:0,
      quantite: 0,
      prixArticle	:0,
      remise:0,
      valeurTva:0,
      selected:false,
      articlefournisseur :this.articleFournisseur,
      achat:this.facture,
    }
  }

  public resetFacture(){
    this.facture = {
      dateAchat:this.dates.today,
      dateFacture:this.dates.today,
      dateLivraison:this.dates.tomorrow,
      numFacture:this.num_facture,
      montantHt:0,
      montantTva:0,
      montantRemise:0,
      fournisseurId:this.fournisseur.id ? this.fournisseur.id :0,
      exploitationId:this.exploitation.id ? this.exploitation.id :0,
      centreId:this.centre.id ? this.centre.id :0,
      selected:false,
      exploitation: this.exploitation,
      centre:this.centre,
      fournisseur:this.fournisseur,
      achatDetail: this.detailFactures,
      validation:false,
    }
  }

  addToggle(){
    this.toggle = !this.toggle;
    this.resetFacture();
  }

  annuler(){
    this.detailFactures = [];
    this.toggle = !this.toggle;
    this.addFacture = true;
    this.listFacture = true;
    this.inputModif = !this.inputModif;
    this.modifToggle = true;
    this.addBtn = false;
    this.montantTTc = 0;
    this.showvalidateBtn =false;
    this.showAllFournisseur();
    this.resetFacture();
  }

  addNewFacture(){
    this.facture= this.facture;
    this.detailFactures = this.detailFactures;
    if (this.detailFactures.length > 0) {
      this.factureService.createFacture(this.facture,this.detailFactures,this.bonLivraison).subscribe({
        next:(value) =>{
          this.toggleToast('La facture n° '+this.facture.numFacture+' a été crée avec succès!');
          this.inputModif = !this.inputModif;
          this.toggleArticle = !this.toggleArticle;
          this.modifToggle = !this.modifToggle;
          this.showvalidateBtn =true;
        },
      })
    } else {
      alert('Veuillez réessayer!');
    }
  }

  public openModalLivraison(content: TemplateRef<any>) { 
    this.resetFacture();
    this.montantTTc = 0;
    const fournisseurId = this.fournisseur.id? this.fournisseur.id:0;
    const exploitationId = this.exploitation.id ?this.exploitation.id:0;
    this.factureService.getLivraisonByFournisseurExploitationValidate(fournisseurId,exploitationId).subscribe({
      next:(_livraisons) =>{
        this.bonLivraisons = _livraisons;
        if (_livraisons.length>0) {
          this.addBtn = false;
        } else {
          this.addBtn = true;
        }
        this.addFacture = !this.addFacture;
        this.listFacture = !this.listFacture;
        this.facture.fournisseurId = this.fournisseur.id ?this.fournisseur.id:0
        
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult)
            if (this.closeResult == 'Closed with: validate click') {
              this.modifToggle = !this.modifToggle;
              this.toggle = (this.toggle === false ? true : false);
              this.toggleArticle = this.toggleArticle;
              this.inputModif = false;

              for (const livraison of _livraisons) {
                this.bonLivraison = livraison;
                if (livraison.selected) {                
                  this.dates = {
                    today:new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
                    tomorrow: new Date(livraison.dateLivraison)
                  };
                  const numFact = livraison.numLivraison;
                  this.newNumFacture = numFact.split('-');
                  this.facture.numFacture = 'FAC-'+this.newNumFacture[1];
                  this.detailFactures = [];
                  for (const livDetail of livraison.livraisonDetail) {
                    const taxe =0;
                    if (livDetail.valeurTva !=0 || livDetail.valeurTva !=null ) {
                      const taxe = (((livDetail.quantiteLivree * livDetail.prixarticle) -livDetail.remise)*livDetail.valeurTva)/100;
                    }
                    this.detailFacture = {
                      achatId:0,
                      articlefournisseurId:livDetail.articlefournisseurId,
                      quantite: livDetail.quantiteLivree,
                      prixArticle	:livDetail.prixarticle,
                      remise:livDetail.remise,
                      valeurTva:taxe,
                      selected:false,
                      achat:this.facture,
                      articlefournisseur : livDetail.articlefournisseur,
                    };

                    this.montantTTc += ((( this.detailFacture.quantite * this.detailFacture.prixArticle) -this.detailFacture.remise) + (+taxe));
                                       
                    this.detailFactures.push(this.detailFacture);
                  }
                  console.log(this.detailFactures);
                  
                }else{
                  this.addBtn = true;
                  this.detailFactures = [];
                }                
              }
            }else if(this.closeResult == 'Closed with: Create click'){
              this.modifToggle = !this.modifToggle;
              this.toggle = (this.toggle === false ? true : false);
              this.toggleArticle = this.toggleArticle;
              this.resetFacture();
              this.addBtn = true;
              this.inputModif = false;
              this.detailFactures = [];
              this.dates = {
                today:new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
                tomorrow: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1)
              }
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult)
            this.toggle = this.toggle;
            this.addFacture = true;
            this.inputModif = false;
            this.detailFactures = [];
          },
        )
      },
    });
  }

  public openModalArticle(contentArticle: TemplateRef<any>){ 
    const exploitationId = Number(this.exploitationId);
    this.selectFounisseur(this.fournisseur);
    this.livraisonService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
      next: (artExploitation) => {         
        if (artExploitation) {
          this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
          this.livraisonService.getArticleFournisseurByArticleId(this.fournisseur.id ? this.fournisseur.id : 0, this.artExploitationArticleId).subscribe({
            next: (artFournisseurs: any) => {
              this.detailFactures=[];
              this.articleFournisseurs = artFournisseurs;
             
              this.modalService.open(contentArticle, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                  
                  console.log(this.closeResult)
                  if (this.closeResult == 'Closed with: Save click') {
                    
                    this.inputModif = this.inputModif; 
                    this.detailFactures =[];   
                    for (const articlefournisseur of artFournisseurs) {
                      if (articlefournisseur.selected == true) {
                        this.detailFacture = {
                          achatId:0,
                          articlefournisseurId:articlefournisseur.id ? articlefournisseur.id :0,
                          quantite: 0,
                          prixArticle	:articlefournisseur.conditionnement[0].prixAchat ? articlefournisseur.conditionnement[0].prixAchat : 0,
                          remise:0,
                          valeurTva:0,
                          selected:false,
                          achat:this.facture,
                          articlefournisseur : articlefournisseur,
                        }
                        this.detailFactures.push(this.detailFacture);
                      }
                    }
                    console.log(this.detailFactures);
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

  public selectArticle(contentLivraisonArticle:TemplateRef<any>,bonLivraison:InterfaceBonLivraisons){
    this.livraisonDetails = bonLivraison.livraisonDetail;
    this.bonLivraison = bonLivraison;
    this.modalService.open(contentLivraisonArticle, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
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

  checkSelectedRows(){
    this.showDeleteBtn = this.detailFactures.some(line => line.selected);
  }

  deleteSelectedRows() {
    this.detailFactures = this.detailFactures.filter(line => !line.selected);
    this.showDeleteBtn = false;
  }

  getTotalMontant(_datas : InterfaceAchatDetail[]):number {
    let montantTTc=0;    
    for (const line of _datas) {
      if (line.valeurTva != 0 || line.valeurTva !=null) {
        const taxe =  (((line.quantite * line.prixArticle	) -line.remise)* line.valeurTva) /100;
        montantTTc += ((line.quantite * line.prixArticle	) -line.remise) + (+taxe);
      } else {
        montantTTc += ((line.quantite * line.prixArticle	) -line.remise);
      }
    }    
    return montantTTc;
  }

  showFacture(facture:InterfaceAchat){
    this.facture = facture;
    this.dates = {
      today: new Date(this.facture.dateAchat),
      tomorrow: new Date(this.facture.dateLivraison)
    };
    this.detailFactures = this.facture.achatDetail;
    if (facture.validation == false) {
      this.showvalidateBtn = !this.showvalidateBtn;
    }
    for (const livraison of this.detailFactures) {
      console.log(livraison.valeurTva);
      
      if (livraison.valeurTva !=0 || livraison.valeurTva != null) {
        const taxe = (((livraison.quantite * livraison.prixArticle) - livraison.remise) * livraison.valeurTva)/100;
        this.montantTTc += ((livraison.quantite * livraison.prixArticle) - livraison.remise) + (+taxe);
      } else {
        this.montantTTc += (livraison.quantite * livraison.prixArticle) - livraison.remise;
      }
    }
    this.toggle = !this.toggle;
    this.addFacture = !this.addFacture;
    this.listFacture = !this.listFacture;
    this.inputModif = true;
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

  validateFacture(){
    this.idFacture = this.facture.id ? this.facture.id: 0;
    if (this.facture) {
      this.factureService.validateFacture(this.facture).subscribe({
        next: (value) => {
          this.showvalidateBtn = ! this.showvalidateBtn;
          this.inputModif =true;
          this.toggleToast('Facture n° '+this.facture.numFacture+' a été validé');
        },
      });
    }
  }

}
