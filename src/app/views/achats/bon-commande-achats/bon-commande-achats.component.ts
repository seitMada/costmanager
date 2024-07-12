import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";
import { ExploitationService } from '../../../shared/service/exploitation.service';
import { CentreRevenuService } from '../../../shared/service/centre-revenu.service';
import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';

import { Article } from '../../../shared/model/articles';
import { InterfaceArticle } from '../../../shared/model/interface-articles';
import { InterfaceFournisseur } from '../../../shared/model/interface-fournisseurs';
import { Fournisseur, Fournisseurs } from '../../../shared/model/fournisseurs';
import { Adress } from '../../../shared/model/adresse';
import { BonCommande } from '../../../shared/model/bonCommande';
import { InterfaceCentreRevenu } from '../../../shared/model/interface-centrerevenu';
import { InterfaceExploitations } from '../../../shared/model/interface-exploitations';
import { Centrerevenu, Centrerevenus } from "../../../shared/model/centrerevenu";
import { InterfaceArticleExploitation, InterfaceArticleExploitations } from '../../../shared/model/interface-articleexploitations';
import { InterfaceArticlefournisseurs } from '../../../shared/model/interface-articlefournisseurs';

import { InterfaceBonCommande, InterfaceBonCommandes } from '../../../shared/model/interface-bonCommande';
import { InterfaceCommandeDetail, InterfaceCommandeDetails } from '../../../shared/model/interface-commandedetail';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { Conditionnement } from 'src/app/shared/model/conditionnements';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Categorie } from 'src/app/shared/model/categories';
import { Famille } from 'src/app/shared/model/familles';
import { Unite, Unites } from 'src/app/shared/model/unite';
import { Groupeanalytique } from 'src/app/shared/model/groupeanalytiques';
import { SousFamille } from 'src/app/shared/model/sousfamilles';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule,NgbNavModule, AlertModule,TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss',
  providers: [NgbModalConfig, NgbModal]
})
export class BonCommandeAchatsComponent implements OnInit {

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

  public commandes: InterfaceCommandeDetail[];
  public boncommande: InterfaceBonCommande;
  public boncommandes: InterfaceBonCommande[];
  public boncommandesBack: InterfaceBonCommande[];
  public commandeDetail: InterfaceCommandeDetail;
  public reason: any;
  public validateArticles: any[] = [];
  public artExploitationArticleId: any[] = [];

  public exploitationId = +(sessionStorage.getItem('exploitation') || 3);
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;

  public idFournisseur = 0;
  public idBonCommande = 0;
  public articleFournisseurId = 0;
  public montantTTc = 0;

  public num_commande: string;

  public toggle = true;
  public modifToggle = true;
  public toggleArticle = true;
  public addTogle = true;
  public addCommande = true;
  public listArts = true;
  public btnC = false;
  public addBtn = false;
  public showDeleteBtn = false;
  public showDeleteBtnCom = false;
  public showvalidateBtn = false;
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
    private pdfService: PdfserviceService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private datePipe: DatePipe,
    private sortFilterSearchService:SortFilterSearchService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;
    this.num_commande = "COM-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.resetFournisseur();
    this.resetCentre();
    this.resetCommande();
    this.resetArticleFournisseur();
  }

  formatDate(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }

  ngOnInit(): void {
    this.showExploitationFournisseur();
    this.showAllFournisseur();
  }

  listArticleFournisseurs() {
    // this.dates.today = new Date();
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
                const conditionnement = articlefournisseur.conditionnement.reduce((min:any, current:any) => {
                  return current.prixAchat < min.prixAchat ? current : min;
                });
                this.commandeDetail = {
                  commandeId: 0,
                  articlefournisseurId: articlefournisseur.id ? articlefournisseur.id : 0,
                  articleId: articlefournisseur.articleId,
                  QteCommande: 0,
                  QteCommandeFT: 0,
                  conditionnementId: conditionnement.id,
                  prixarticle: conditionnement.prixAchat,
                  remise: 0,
                  validationdetailbc: false,
                  articlefournisseur: articlefournisseur,
                  selected: false,
                  conditionnement:conditionnement,
                  article: articlefournisseur.article
                }
                this.commandes.push(this.commandeDetail);
              }
              console.log(this.commandes);
            }
          })
        } else {
          this.commandes = [];
        }
      }
    });
  }

  showAllFournisseur() {
    this.fournisseurService.getAllFournisseurByExploitation(this.exploitationId).subscribe({
      next: (_fournisseur) => {
        this.fournisseurs = _fournisseur;
        this.fournisseur = _fournisseur[0];
        this.idFournisseur = this.fournisseur.id ? this.fournisseur.id : 0;
        if (this.isAdmin) {
          this.commandeService.getAllCommande(this.idFournisseur).subscribe({
            next: (boncommande) => {
              this.commandes = [];
              this.boncommandes = boncommande;  
            },
            error: (error) => {
              alert('Liste de bon de commande vide');
            }
          })
        } else {
          this.commandeService.getCommandeByFournisseurExploitation(this.idFournisseur, this.exploitation.id ? this.exploitation.id : 0).subscribe({
            next: (boncommande) => {
              this.commandes = [];
              this.boncommandes = boncommande;  
            },
            error: (error) => {
              alert('Liste de bon de commande vide');
            }
          })
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
            this.boncommande = {
              remise: 0,
              montantHT: 0,
              montantTva: 0,
              noPiece: this.num_commande,
              validation: 0,
              commentaire: '',
              dateCommande: this.dates.today,
              fournisseurId: this.fournisseur.id ? this.fournisseur.id : 0,
              exploitationId: this.exploitationId,
              centreId: this.centre.id ? this.centre.id : 0,
              fournisseur: this.fournisseur,
              selected: false,
              centre: _centre,
              exploitation: exploitation,
              commandeDetail: this.commandes ? this.commandes : []
            };
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    });
  }

  public resetArticleFournisseur() {
    this.articleFournisseur = {
      articleId: 0,
      fournisseurId: this.fournisseur.id ? this.fournisseur.id : 0,
      marque: '',
      prixReference: 0,
      prixReferencePrecedent: 0,
      commentaire: '',
      selected: false,

      article: this.article,
      fournisseur:this.fournisseur,
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
      lieuStockage: []
    }
  }

  public resetCommande() {
    this.num_commande = "COM-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.boncommande = {
      remise: 0,
      montantHT: 0,
      montantTva: 0,
      noPiece: this.num_commande,
      validation: 0,
      commentaire: '',
      dateCommande: new Date(),
      fournisseurId: this.fournisseur.id ? this.fournisseur.id : 0,
      exploitationId: this.exploitationId ? this.exploitationId : 0,
      selected: false,
      centreId: this.centre.id ? this.centre.id : 0,
      fournisseur: this.fournisseur,
      centre: this.centre,
      exploitation: this.exploitation,
      commandeDetail: [],
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
    let montantTTc = 0;
    for (const line of this.commandes) {
      montantTTc += (line.QteCommande * line.prixarticle) - line.remise;
    }
    return montantTTc;
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

  validateCommande() {
    if (!this.isAdmin) {
      const selectedBonCommandes = this.boncommandes.filter(line => line.selected);

      if (selectedBonCommandes.length >0) {
        for (const bonCommande of selectedBonCommandes) {
          if (bonCommande.validation == 0) {
            this.commandeService.validateCommande(bonCommande).subscribe({
              next: (value) => {
                this.showAllFournisseur();
                this.toggleToast('Bon de commande n° ' + bonCommande.noPiece + ' a été validé');
                this.toggle = this.toggle;
                this.showvalidateBtn = !this.showvalidateBtn;
              },
            });
          } else {
            alert('Ce bon de commande est déjà validé!');
            this.showvalidateBtn = !this.showvalidateBtn;
          }
        }
      } else {
        this.commandeService.validateCommande(this.boncommande).subscribe({
          next: (value) => {
            this.toggleToast('Bon de commande n° ' + this.boncommande.noPiece + ' a été validé');
            this.inputModif = true;
            this.showvalidateBtn = !this.showvalidateBtn;
            this.addBtn = false;
          },
        });
      }
    }else{
        alert('Il est impossible de valider cette commande.!');
    }
  }

  toggleModal() {
    this.addBtn = false;
    this.idBonCommande = 0;
    this.toggle = !this.toggle;
    this.addCommande = !this.addCommande;
    this.addTogle = !this.addTogle;
    this.modifToggle = !this.modifToggle;
    this.btnTenRecord = false;
    this.listArts = !this.listArts;
    this.inputModif = false;
    this.resetCommande();
  }

  addCommandeModal() {
    this.toggle = !this.toggle;
    this.addBtn = true;
    this.addCommande = false;
    this.addTogle = !this.addTogle;
    this.listArts = !this.listArts;
    this.modifToggle = !this.modifToggle;
    this.resetCommande();
    this.commandes = [];
    this.inputModif = false;
    this.dates.today = new Date();
  }

  public openModalArticle(content: TemplateRef<any>) {
    if (this.commandes.length > 0) {
      const articlesId = this.commandes.map((i: any) => i.articlefournisseur.articleId);
      this.commandeService.getArticleFournisseurByArticle(articlesId, this.fournisseur.id ? this.fournisseur.id : 0, this.artExploitationArticleId).subscribe({
        next: (_articlefournisseurs) => {
          this.articleFournisseurs = _articlefournisseurs;
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                for (const articlefournisseur of this.articleFournisseurs) {
                  for(const condition of articlefournisseur.conditionnement){
                    if (condition.selected !== undefined) {
                      this.commandeDetail = {
                        commandeId: 0,
                        articlefournisseurId: articlefournisseur.id ? articlefournisseur.id : 0,
                        conditionnementId: condition.id ? condition.id : 0,
                        articleId: articlefournisseur.articleId,
                        QteCommande: 0,
                        QteCommandeFT: 0,
                        prixarticle: condition.prixAchat ? condition.prixAchat : 0,
                        remise: 0,
                        validationdetailbc: false,
                        articlefournisseur: articlefournisseur,
                        selected: false,
                        conditionnement: condition,
                        article: articlefournisseur.article
                      }
                      this.commandes.push(this.commandeDetail);
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
        },
      });
    }
    else {
      this.dates.today = new Date();
      const exploitationId = Number(this.exploitationId);
      this.selectFounisseur(this.fournisseur);
      this.commandeService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
        next: (artExploitation) => {
          if (artExploitation) {
            this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
            this.commandeService.getArticleFournisseurByArticleId(this.fournisseur.id ? this.fournisseur.id : 0, this.artExploitationArticleId).subscribe({
              next: (artFournisseur: any) => {
                this.articleFournisseurs = artFournisseur;
                this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
                  (result) => {
                    this.closeResult = `Closed with: ${result}`;
                    console.log(this.closeResult)
                    if (this.closeResult == 'Closed with: Save click') {
                      for (const articlefournisseur of artFournisseur) {
                        for(const condition of articlefournisseur.conditionnement){
                          if (condition.selected !== undefined) {
                            this.commandeDetail = {
                              commandeId: 0,
                              articlefournisseurId: articlefournisseur.id ? articlefournisseur.id : 0,
                              conditionnementId: condition.id ? condition.id : 0,
                              articleId: articlefournisseur.articleId,
                              QteCommande: 0,
                              QteCommandeFT: 0,
                              prixarticle: condition.prixAchat ? condition.prixAchat : 0,
                              remise: 0,
                              validationdetailbc: false,
                              articlefournisseur: articlefournisseur,
                              selected: false,
                              conditionnement: condition,
                              article: articlefournisseur.article
                            }
                            this.commandes.push(this.commandeDetail);
                            this.addBtn = false;
                          }
                        }
                      }
                      console.log(this.commandes);
                    }
                  },
                  (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    console.log(this.closeResult)
                  },
                );
              }
            })
          } else {
            this.commandes = [];
          }
        }
      });

    }

  }

  generatePDF(commande: InterfaceBonCommande) {
    console.log(commande);

    const dataCommande: any[] = [];
    const dateCommande = this.formatDate(commande.dateCommande, 'dd/MM/yyyy');
    let montant = 0;
    for (const com of commande.commandeDetail) {
      if (com.articlefournisseur) {
        const data = {
          'Réf': com.articlefournisseur.article.codeArticle,
          'Désignation': com.articlefournisseur.article.libelle,
          'Quantité': com.QteCommande,
          'Unité': com.articlefournisseur.conditionnement[0].uniteCommande.abreviation,
          'Prix': com.articlefournisseur.conditionnement[0].prixAchat,
          'Montant': com.QteCommande * com.articlefournisseur.conditionnement[0].prixAchat
        }
        montant += com.QteCommande * com.articlefournisseur.conditionnement[0].prixAchat;
        dataCommande.push(data);
      }

    }

    const docDefinition = {
      content: [
        {
          text: `Bon de commande du ${dateCommande} n° ${commande.noPiece}`,
          fontSize: 15, bold: true
        },
        '\n', '\n', '\n',
        {
          columns: [
            {
              text: [
                { text: 'N° commande : ', fontSize: 12, bold: true },
                `${commande.noPiece}\n`,
                { text: 'Date : ', fontSize: 12, bold: true },
                `${dateCommande}\n`,
                { text: 'Fournisseur : ', fontSize: 12, bold: true },
                `${commande.fournisseur.raison_social}\n`,
                { text: 'Adresse fournisseur : ', fontSize: 12, bold: true },
                `${commande.fournisseur.adresse.rue}` + ' ' + `${commande.fournisseur.adresse.code_postal}` + ' ' + `${commande.fournisseur.adresse.ville}` + ' ' + `${commande.fournisseur.adresse.pays} \n`,
                { text: 'Exploitation : ', fontSize: 12, bold: true },
                `${commande.exploitation.libelle}\n`,
              ]
            }
          ]
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: this.pdfService.buildTableBody(dataCommande, ['Réf', 'Désignation', 'Quantité', 'Unité', 'Prix', 'Montant'],
              [
                { text: 'Réf', style: 'tableHeader' },
                { text: 'Désignation', style: 'tableHeader' },
                { text: 'Quantité', style: 'tableHeader' },
                { text: 'Unité', style: 'tableHeader' },
                { text: 'Prix', style: 'tableHeader' },
                { text: 'Montant', style: 'tableHeader' },
              ]
            ),
          },
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: [420, '*'],
            body: [
              ['TOTAL', (montant).toString() + ' €'],
            ]
          }
        },
      ]
    };

    pdfMake.createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs).open();
  }


  listArticleDixDernierCommande() {
    this.dates.today = new Date();
    const fournisseurId = this.fournisseur.id ? this.fournisseur.id : 0;
    const exploitationId = this.exploitation.id ? this.exploitation.id : 0;
    this.commandeService.getDixDernierCommandes(fournisseurId, Number(exploitationId)).subscribe({
      next: (commandeDetail) => {
        this.commandes = commandeDetail;
        console.log(this.commandes);
      },
    })

  }


  showCommande(bonCommande: InterfaceBonCommande) {
    this.boncommande = bonCommande;
    this.idBonCommande = bonCommande.id ? bonCommande.id : 0;
    if (bonCommande.validation == 0) {
      this.showvalidateBtn = !this.showvalidateBtn;
    }
    this.boncommande.dateCommande = new Date(this.boncommande.dateCommande);
    this.commandeService.getCommandeDetailByCommandeId(this.idBonCommande).subscribe({
      next: (commandeDetail) => {
        this.commandes = [];
        this.montantTTc = 0;
        for (const detailComm of commandeDetail) {
          this.commandeDetail = {
            commandeId: detailComm.commandeId,
            articlefournisseurId: detailComm.articlefournisseurId,
            articleId: detailComm.articleId,
            QteCommande: detailComm.QteCommande,
            QteCommandeFT: detailComm.QteCommandeFT,
            prixarticle: detailComm.prixarticle,
            remise: detailComm.remise,
            validationdetailbc: detailComm.validationdetailbc,
            articlefournisseur: detailComm.articlefournisseur,
            selected: false,
            conditionnementId: detailComm.conditionnement.id ? detailComm.conditionnement.id : 0,
            conditionnement: detailComm.conditionnement,
            article: detailComm.article
          }

          this.montantTTc += (detailComm.QteCommande * detailComm.prixarticle) - detailComm.remise;
          this.commandes.push(this.commandeDetail)
        }
        this.addCommande = false;
        this.addTogle = false;
        this.listArts = false;
        this.toggle = false;
        this.btnTenRecord = false;
        this.inputModif = true;
        this.modifToggle = this.modifToggle;
        this.addBtn = false;
      },
    })
  }


  addBonCommande() {
    if (!this.isAdmin) {
      this.boncommande = this.boncommande;
    
      if (this.commandes.length > 0) {
        this.commandeService.createBonCommande(this.boncommande, this.commandes).subscribe({
          next: (commande: any) => {
            this.inputModif = !this.inputModif;
            this.addCommande = false;
            this.listArts = false;
            this.addTogle = false;
            this.modifToggle = !this.modifToggle;
            this.showvalidateBtn = !this.showvalidateBtn;
            this.addBtn = false;
            this.toggleToast('Bon de commande n° ' + this.boncommande.noPiece + ' crée avec succès!');
            this.resetCommande();
          },
          error: (error) => {
            alert('veuillez réessayer!');
          }
        });
      } else {
        alert('veuillez sélectionné un article!');
      }
    }else{
      alert('Il est impossible de créer une commande.!');
    }
  }

  cancel() {
    this.resetCommande();
    this.toggle = (this.toggle === false ? true : false);
    this.addTogle = true;
    this.addCommande = true;
    this.listArts = true;
    this.modifToggle = true;
    this.showvalidateBtn = false;
    this.montantTTc = 0;
    this.showAllFournisseur();
  }



  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }

  checkSelectedRows() {
    this.showDeleteBtn = this.commandes.some(line => line.selected);
    this.modifToggle = false;

  }
  deleteSelectedRows() {
    if(!this.isAdmin){
      this.commandes = this.commandes.filter(line => !line.selected);
      this.showDeleteBtn = false;
      this.addBtn = true;
      for (const _comDetail of this.commandes) {
        this.articleFournisseurs = this.articleFournisseurs.filter(line => line.id !== _comDetail.articlefournisseurId);
      }
    }else{
      alert('Il est impossible de supprimer ces articles.!');
    }
  }

  selectBoncomm() {
    this.showDeleteBtnCom = this.boncommandes.some(line => line.selected);
    this.showvalidateBtn = this.boncommandes.some(line => line.selected);
  }

  deleteSelectedRowsComm() {
    if (!this.isAdmin) {
      const selectedBonCommandes = this.boncommandes.filter(line => line.selected);
      for (const bonCommande of selectedBonCommandes) {
        if (bonCommande.validation == 0) {
          this.commandeService.deleteOneCommande(bonCommande).subscribe({
            next: (value) => {
              this.toggleToast('Bon de commande n° ' + bonCommande.noPiece + ' a été supprimé avec succès!');
              this.boncommandes = this.boncommandes.filter(line => line !== bonCommande);
              this.showDeleteBtnCom = this.boncommandes.some(line => line.selected);
              this.showvalidateBtn = this.boncommandes.some(line => line.selected);

            },
          });
        } else {
          alert('Ce bon de commande ne peut pas supprimer!')!
        }
      }
    }else{
      alert('Il est impossible de supprimer cette commande.!');
    }
  }



  async selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur = data;
    this.fournisseur.id = data.id ? data.id : 0;
    if (this.isAdmin) {
      this.commandeService.getAllCommande(this.fournisseur.id).subscribe({
        next: (boncommande) => {
          this.commandes = [];
          this.boncommandes = boncommande;
        },
        error: (error) => {
          alert('Liste de bon de commande vide');
        }
      })
    } else {
      this.commandeService.getCommandeByFournisseurExploitation(this.fournisseur.id, this.exploitation.id ? this.exploitation.id : 0).subscribe({
        next: (boncommande) => {
          this.commandes = [];
          this.boncommandes = boncommande;
        },
        error: (error) => {
          alert('Liste de bon de commande vide');
        }
      });
    }
  }

  showListCommande() {
    this.toggle = (this.toggle === false ? true : false);
    this.addBtn = false;
    this.modifToggle = !this.modifToggle;
    this.addTogle = !this.addTogle;
    this.listArts = false;
    this.addCommande = !this.addCommande;
    this.commandes = [];
    this.resetCommande();
    this.inputModif = false;
  }

  onSortBonDeCommandes(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.boncommandes, colonne, type, this.boncommandesBack ) ;
  }

  onSearchBonDeCommandes(event: any, colonne: any) {
     this.boncommandes   =  (this.sortFilterSearchService.handleSearch(event, this.boncommandes , colonne, this.boncommandesBack )) ;
  }

}