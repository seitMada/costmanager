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
  public artFournis: any;
  public exploitation: InterfaceExploitations;
  public achat: InterfaceAchat;
  public article: Article;
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
  public commandeDetails: InterfaceCommandeDetails;
  public reason: any;
  public validateArticles: any[] = [];
  public artExploitationArticleId: any[] = [];

  public idFournisseur = 0;
  public idBonCommande = 0;
  public articleFournisseurId = 0;
  public montantTTc=0;
  public montantRemise =0;

  public toggle = true;
  public modifToggle = true;
  closeResult = '';
  public showlist = true;
  public bonCommandeForm = FormGroup;
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  private today = new Date();
  public dates = {
    today: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())
  }

  public num_commande: string;
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
    private datePipe: DatePipe,
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
   
    this.num_commande = "COM-" + (this.formatDate(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.showAllFournisseur();
    this.showExploitationFournisseur();
    this.selectDixDernierCommandeByFournisseurId();

    this.commandeService.getAllCommande().subscribe({
      next: (boncommande) => {
        this.boncommandes = boncommande;
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    })

  }

  showListCommande(){
    this.toggle =true;
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
  toggleModal() {
    this.toggle = !this.toggle;
    this.selectDixDernierCommandeByFournisseurId(); 
    this.idBonCommande =0;
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
              dateCommande: (this.dates.today),
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
  cancel() { }

  selectDixDernierCommandeByFournisseurId() {
    const fournisseur = this.fournisseur;
    this.commandeService.getDixDernierCommandes(fournisseur.id ? fournisseur.id : 0).subscribe({
      next: (commandeDetails) => {
        this.commandes = commandeDetails;
      }
    })
  }

  showCommande(comm: any) {
    this.boncommandes = comm;
    console.log(this.boncommandes);
  }

  addBonCommande() {
    this.boncommande = this.boncommande;
    if (this.idBonCommande ===0 ) {
      this.commandeService.createBonCommande(this.boncommande).subscribe({
        next:(bonCommande) => {
          this.commandeService.createCommandeDetail(bonCommande.id,this.commandes).subscribe({
            next:(value) =>{
              
            },
          });
        }
      });
    } 
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
    const exploitationId = Number(this.exploitationId);
    this.commandeService.getArticleExploitaionByExploitationId(exploitationId).subscribe({
      next: (artExploitation) => {
        const fournisseur = this.fournisseur;
        if (artExploitation) {
          this.artExploitationArticleId = artExploitation.map((i: any) => i.articleId);
          this.commandeService.getArticleFournisseurByArticleId(fournisseur.id ? fournisseur.id : 0, this.artExploitationArticleId).subscribe({
            next: (artFournisseur: any) => {
              this.articleFournisseurs = artFournisseur;
              console.log(this.articleFournisseurs);

              this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                  console.log(this.closeResult)
                  if (this.closeResult == 'Closed with: Save click') {
                    for (const _articlefournisseur of this.articleFournisseurs) {
                      if (_articlefournisseur.selected == true) {
                        this.commandeDetails = {
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
                        this.commandes.push(this.commandeDetails)
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



  selectFounisseur(data: InterfaceFournisseur) {
    this.fournisseur = data;
    this.fournisseur.id = data.id;
  }

  selectCentreRevenu(data: InterfaceCentreRevenu) {
    this.centre = data;
    this.centre.id = data.id;
  }

}
