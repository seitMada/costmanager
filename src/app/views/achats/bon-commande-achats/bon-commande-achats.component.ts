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

import { InterfaceBonCommandes } from 'src/app/shared/model/interface-bonCommande';
import { InterfaceCommandeDetails } from 'src/app/shared/model/interface-commandedetail';
import { BonCommande } from 'src/app/shared/model/bonCommande';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// pdfMake.fonts = {
//   Roboto: {
//     normal: 'Roboto-Regular.ttf',
//     bold: 'Roboto-Bold.ttf',
//     italics: 'Roboto-Italic.ttf',
//     bolditalics: 'Roboto-BoldItalic.ttf'
//   }
// };


import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  public article: InterfaceArticle;
  public articles: InterfaceArticle[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleExploitation: InterfaceArticleExploitation;
  public articleExploitations: InterfaceArticleExploitations;
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
    this.resetArticleFournisseur();
  }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }

  ngOnInit(): void {
   
    this.num_commande = "COM-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    
    this.showExploitationFournisseur();
    this.showAllFournisseur();
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
              remise: 0,
              montantHT:0,
              montantTva: 0,
              noPiece: this.num_commande,
              validation: 0,
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
    this.selectFounisseur(this.fournisseur);
    this.commandeService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
      next: (artExploitation) => {         
        if (artExploitation) {
          this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
          this.commandeService.getArticleFournisseurByArticleId(this.fournisseur.id ? this.fournisseur.id : 0, this.artExploitationArticleId).subscribe({
            next: (artFournisseur: any) => {
              this.articleFournisseurs = artFournisseur;
              for (const articlefournisseur of artFournisseur) {
                  this.commandeDetail = {
                    commandeId: 0,
                    articlefournisseurId: articlefournisseur.id ? articlefournisseur.id :0,
                    QteCommande: 0,
                    prixarticle: articlefournisseur.conditionnement[0].prixAchat ? articlefournisseur.conditionnement[0].prixAchat: 0,
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
    this.boncommande = {
      remise: 0,
      montantHT: 0,
      montantTva: 0,
      noPiece: this.num_commande,
      validation: 0,
      commentaire: '',
      dateCommande: new Date(),
      fournisseurId: this.fournisseur.id ? this.fournisseur.id:0,
      exploitationId: this.exploitationId ? this.exploitationId:0,
      selected: false,
      centreId:  this.centre.id ? this.centre.id:0,
      fournisseur: this.fournisseur,
      centre: this.centre,
      exploitation: this.exploitation,
      commandeDetail:[],
      achat:[]
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

  validateCommande(){
    const selectedBonCommandes = this.boncommandes.filter(line => line.selected);
    for (const bonCommande of selectedBonCommandes) {
     if (bonCommande.validation == 0) {
      this.commandeService.validateCommande(bonCommande).subscribe({
        next:(value) =>{
          this.showAllFournisseur();
          this.toggle = this.toggle;
          this.showDeleteBtnCom = !this.showDeleteBtnCom;
          alert('Bon de commande n° '+bonCommande.noPiece+' a été validé');
        },
      });
     }else{
      alert('Ce bon de commande est déjà validé!');
      this.showDeleteBtnCom = !this.showDeleteBtnCom;
     }      
    }
  }

  public openModalArticle(content: TemplateRef<any>) { 
    this.resetArticleFournisseur();
    if(this.commandes.length >0){
      const articlesId = this.commandes.map((i: any) => i.articlefournisseur.articleId);
      this.commandeService.getArticleFournisseurByArticle(articlesId,this.fournisseur.id ? this.fournisseur.id :0,this.artExploitationArticleId).subscribe({
        next:(_articlefournisseurs)=> {
          this.articleFournisseurs = _articlefournisseurs;
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
            (result) => {
              
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                for (const articlefournisseur of this.articleFournisseurs) {
                  if (articlefournisseur.selected == true) {
                    this.commandeDetail = {
                      commandeId: 0,
                      articlefournisseurId: articlefournisseur.id ? articlefournisseur.id:0,
                      QteCommande: 0,
                      prixarticle: articlefournisseur.prixReference,
                      remise: 0,
                      validationdetailbc: false,
                      articlefournisseur: articlefournisseur,
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
        },
      }); 
    }
    else{
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          console.log(this.closeResult)
          if (this.closeResult == 'Closed with: Save click') {
            for (const articlefournisseur of this.articleFournisseurs) {
              if (articlefournisseur.selected == true) {
                this.commandeDetail = {
                  commandeId: 0,
                  articlefournisseurId: articlefournisseur.id ? articlefournisseur.id:0,
                  QteCommande: 0,
                  prixarticle: articlefournisseur.prixReference,
                  remise: 0,
                  validationdetailbc: false,
                  articlefournisseur: articlefournisseur,
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
          
  }

  generatePDF(commande: InterfaceBonCommandes){
    // playground requires you to assign document definition to a variable called dd

    // const documentDefinition = {
    //   content: [
    //     {text: 'Tables', style: 'header'},
    //     'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
    //     {text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader'},
    //     'The following table has nothing more than a body array',
    //     {
    //       style: 'tableExample',
    //       table: {
    //         body: [
    //           ['Column 1', 'Column 2', 'Column 3'],
    //           ['One value goes here', 'Another one here', 'OK?']
    //         ]
    //       }
    //     },
    //     {text: 'Optional border', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8]},
    //     'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
    //     {
    //       style: 'tableExample',
    //       table: {
    //         body: [
    //           [
    //             {
    //               border: [false, true, false, false],
    //               fillColor: '#eeeeee',
    //               text: 'border:\n[false, true, false, false]'
    //             },
    //             {
    //               border: [false, false, false, false],
    //               fillColor: '#dddddd',
    //               text: 'border:\n[false, false, false, false]'
    //             },
    //             {
    //               border: [true, true, true, true],
    //               fillColor: '#eeeeee',
    //               text: 'border:\n[true, true, true, true]'
    //             }
    //           ],
    //           [
    //             {
    //               rowSpan: 3,
    //               border: [true, true, true, true],
    //               fillColor: '#eeeeff',
    //               text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
    //             },
    //             {
    //               border: undefined,
    //               fillColor: '#eeeeee',
    //               text: 'border:\nundefined'
    //             },
    //             {
    //               border: [true, false, false, false],
    //               fillColor: '#dddddd',
    //               text: 'border:\n[true, false, false, false]'
    //             }
    //           ],
    //           [
    //             '',
    //             {
    //               colSpan: 2,
    //               border: [true, true, true, true],
    //               fillColor: '#eeffee',
    //               text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
    //             },
    //             ''
    //           ],
    //           [
    //             '',
    //             {
    //               border: undefined,
    //               fillColor: '#eeeeee',
    //               text: 'border:\nundefined'
    //             },
    //             {
    //               border: [false, false, true, true],
    //               fillColor: '#dddddd',
    //               text: 'border:\n[false, false, true, true]'
    //             }
    //           ]
    //         ]
    //       },
    //       layout: {
    //         defaultBorder: false,
    //       }
    //     },
    //   ],
    //   styles: {
    //     header: {
    //       fontSize: 18,
    //       bold: true,
    //     },
    //     subheader: {
    //       fontSize: 16,
    //       bold: true,
    //     },
    //     tableHeader: {
    //       bold: true,
    //       fontSize: 13,
    //       color: 'black'
    //     }
    //   },      
    // }
   

    // pdfMake.createPdf(documentDefinition).download('example.pdf');

    const documentDefinition = {
      content: [
        { text: 'Hello, World!', fontSize: 18, bold: true },
        { text: 'This is a PDF generated with pdfmake in Angular.', fontSize: 12 },
      ]
    };
  
    pdfMake.createPdf(documentDefinition).download('example.pdf');
  }

  // generatePDF(commande: InterfaceBonCommandes) {
    
  //   if (!commande || !commande.noPiece || !commande.dateCommande || !commande.fournisseur || !commande.commandeDetail) {
  //       console.error('Commande invalide.');
  //       return;
  //   }

  //   const doc = new jsPDF() as any;
  //   doc.setFont('Helvetica');
  //   doc.text('Bon de commande',80,20,{styles: { fontSize: 15 }} );
  //   doc.setFontSize(12);
  //   doc.text(`N° ${commande.noPiece}`, 15, 40);
  //   if (commande.fournisseur && commande.fournisseur.raison_social) {
  //     doc.text(`Fournisseur: ${commande.fournisseur.raison_social}`, 90, 40);
  //   } else {
  //     console.error('Fournisseur invalide.');
  //     return;
  //   }
    
  //   doc.text(`Exploitation: ${commande.exploitation.libelle}`, 15, 50);
  //   doc.text(`Adresse fournisseur: ${commande.fournisseur.adresse.rue}`+' ' +`${commande.fournisseur.adresse.code_postal}`+' ' +`${commande.fournisseur.adresse.ville}`+' ' +`${commande.fournisseur.adresse.pays}`, 90, 50);
  //   doc.text(`Date: ${this.formatDate(commande.dateCommande, 'dd/MM/yyyy')}`, 15, 60);

  //   const columns = ['Réf', 'Désignation', 'Quantité', 'Unité', 'Prix article', 'Montant'];
  //   const rows =  commande.commandeDetail;
    
    
  //   if (!rows || rows.length === 0) {
  //       console.error('Détails de commande vides ou non définis.');
  //       return;
  //   }
  //   let datas:any = [];
  //   let montant = 0;
    
  //   rows.forEach((detail, index) => {
  //       const row = [
  //           detail.articlefournisseur.article.codeArticle,
  //           detail.articlefournisseur.article.libelle,
  //           detail.QteCommande,
  //           detail.articlefournisseur.article.unite.abreviation,
  //           detail.prixarticle +' €',
  //           detail.QteCommande * detail.prixarticle+' €'
  //       ];
  //         montant += detail.prixarticle*detail.QteCommande;
  //       datas.push(row);
  //   });
  //   const options = {
  //     startY: 70, 
  //     styles: { fontSize: 11 }, 
  //     headStyles: { align: 'right' },
  //     bodyStyles: { align: 'right' }, 
  //     footerStyles: { align: 'right' }
  //   };
    
  //   const footers = [['', '', '', '', 'Montant total', `${montant} €`]];

  //   doc.autoTable({
  //     head: [columns],
  //     body: datas, 
  //     foot: footers, 
  //     columns: columns, 
  //     ...options
  //   });
  //   doc.save(`BonCommande_${commande.noPiece}.pdf`); 
  // }
 
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


  showCommande(bonCommande: InterfaceBonCommandes) {
    this.boncommande = bonCommande;
    this.idBonCommande =bonCommande.id ? bonCommande.id :0;
    this.dates = {
      today: new Date(this.boncommande.dateCommande)
    };
    this.commandeService.getCommandeDetailByCommandeId(this.idBonCommande).subscribe({
      next:(commandeDetail) =>{
        this.commandes =[];  
        this.montantTTc=0;      
        for(const detailComm of commandeDetail){
          this.commandeDetail = {
            commandeId: detailComm.commandeId,
            articlefournisseurId: detailComm.articlefournisseurId,
            QteCommande: detailComm.QteCommande,
            prixarticle: detailComm.prixarticle,
            remise: detailComm.remise,
            validationdetailbc: detailComm.validationdetailbc,
            articlefournisseur: detailComm.articlefournisseur,
            selected:false
          }
          
          this.montantTTc += (detailComm.QteCommande * detailComm.prixarticle) -detailComm.remise;
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
    if (this.commandes.length > 0) {
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
    }else{
      alert('veuillez sélectionné un article!');
    } 
  }

  annuler(){
    this.toggle = !this.toggle;
    this.addTogle = true;
    this.addCommande = true;
    this.listArts = true;
    this.showAllFournisseur();
    this.resetCommande();
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
     if (bonCommande.validation == 0) {
      this.commandeService.deleteOneCommande(bonCommande).subscribe({
        next:(value) =>{
          this.boncommandes = this.boncommandes.filter(line => line !== bonCommande);
          this.showDeleteBtnCom = this.boncommandes.some(line => line.selected);
        },
      });
     }else{
      alert('Ce bon de commande ne peut pas supprimer!')!
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
    this.resetCommande();
  }

  async selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur =data; 
    this.fournisseur.id = data.id ? data.id:0 ;
    this.commandeService.getCommandeByFournisseurExploitation(this.fournisseur.id,this.exploitation.id? this.exploitation.id:0).subscribe({
      next: (boncommande) => {
        this.commandes = [];
        this.boncommandes = boncommande;    
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    });
    
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
    this.toggle = (this.toggle === false ? true : false);
    this.addBtn = (this.addBtn !== false ? true : false);
    this.addTogle = !this.addTogle;
    this.listArts = this.listArts;
    this.addCommande = !this.addCommande;
    this.commandes = [];
    this.resetCommande();
    this.inputModif = false;
  }

}