import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InterfaceInventaires, InterfaceInventairesDetails } from '../../../shared/model/interface-inventaires';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';

import { InventairesService } from '../../../shared/service/inventaires.service';
import { CentreRevenuService } from "../../../shared/service/centre-revenu.service";
import { ExploitationService } from "../../../shared/service/exploitation.service";
import { ZonestockagesService } from "../../../shared/service/zonestockages.service";

import { InterfaceExploitations, InterfaceExploitationss } from 'src/app/shared/model/interface-exploitations';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { InterfaceArticleExploitation } from 'src/app/shared/model/interface-articleexploitations';
import { ArticleService } from 'src/app/shared/service/article.service';

@Component({
  selector: 'app-inventaires',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule],
  templateUrl: './inventaires.component.html',
  styleUrl: './inventaires.component.scss'
})
export class InventairesComponent {

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle = true;
  public toggleEtat = false;
  public addToggle = true;
  public modifToggle = true;
  public exploitationToggle = true;

  private modalService = inject(NgbModal);
  closeResult = '';

  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public idinventaire: number = 0;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public inventaire: InterfaceInventaires;
  public inventaires: InterfaceInventaires[];
  public inventaireDetail: InterfaceInventairesDetails;
  public inventaireDetails: InterfaceInventairesDetails[];
  public lieustockages: InterfaceLieustockages[];
  public lieustockage: InterfaceLieustockages;
  public zonestockages: InterfaceZonestockages[];
  public zonestockage: InterfaceZonestockages;
  public articles: InterfaceArticle[];
  public inventaireArticle: InterfaceInventairesDetails;
  public inventaireArticles: InterfaceInventairesDetails[];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private inventaireService: InventairesService,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private zonelieuService: ZonestockagesService,
    private articleService: ArticleService,
    private datePipe: DatePipe,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.resetinventaire()
  }

  private resetinventaire() {
    this.inventaire = {
      date_inventaire: new Date(),
      commentaire: '',
      etat: false,
      zonestockageId: 0,
      operateurId: 0,
      centreRevenuId: 0,
      selected: false,

      centre: this.centrerevenu,
      operateur: {
        nom: '',
        prenom: '',
        email: '',
        mdp: '',
        compteConnecte: false,
        actif: false,
        login_count: 0,
        code: '',
        fournisseurId: null,
        telephone: '',
        civilite: ''
      },
      zonestockage: {
        zone: '',
        lieuId: 0,
        lieu: {
          lieu: '',
          centreId: 0,
          centreRevenu: {
            code: '',
            libelle: '',
            exploitationsId: 0,
            adressesId: 0,
            email: '',
            telephone: '',
            exploitations: {
              code_couleur: '',
              libelle: '',
              nbDecimal: 0,
              commentaire: '',
              siteWeb: '',
              codenaf: '',
              siret: '',
              logo: '',
              actif: false,
              adressesId: 0
            },
            adresses: {
              rue: '',
              ville: '',
              code_postal: null,
              pays: '',
              centreRevenu: [],
              exploitation: [],
              operateur: []
            }
          }
        }
      },
      inventairedetail: []
    }
  }

  private resetCentreRevenu() {
    this.centrerevenu = {
      code: '',
      libelle: '',
      exploitationsId: this.idexploitation,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: this.exploitation,
      adresses: new Adress()
    }
  }

  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }


  ngOnInit(): void {
    // console.log(this.dates.debut, this.dates.fin)
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: (_centreRevenu) => {
        this.centrerevenus = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];
        if (this.idexploitation === 3) {
          this.exploitationService.getExploitation().subscribe({
            next: (_exploitation) => {
              this.exploitations = _exploitation;
            }
          })
        } else {
          this.exploitationService.getExploitationById(this.idexploitation).subscribe({
            next: (_exploitation) => {
              this.exploitations.push(_exploitation);
            }
          })
        }
      }
    })
  }

  selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
    this.inventaireService.getInventaireByCrAndDate(this.idcentrerevenu, this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true)).subscribe({
      next: (_inventaires: any) => {
        this.inventaires = _inventaires;
      }
    })
  }

  selectExploitation(_exploitation: InterfaceExploitations) {
    this.centrerevenuService.getCrExploitation(_exploitation.id || 0).subscribe({
      next: (_centrerevenus) => {
        this.exploitation = _exploitation;
        this.centrerevenus = _centrerevenus;
        this.inventaire.centre.exploitations = _exploitation;
        // this.inventaire.centreRevenuId = _centrerevenus.id;
      }
    })
  }

  selectCentreRevenu(_centrerevenu: InterfaceCentreRevenu) {
    this.zonelieuService.getLieuStockageByCentreId(_centrerevenu.id || 0).subscribe({
      next: (_lieustockage: any) => {
        this.centrerevenu = _centrerevenu;
        this.lieustockages = _lieustockage;
        this.inventaire.centre = _centrerevenu;
        this.inventaire.centreRevenuId = _centrerevenu.id || 0;
      }
    })
  }

  selectLieuStockage(_lieustockage: InterfaceLieustockages) {
    this.zonelieuService.getZoneStockageByLieuId(_lieustockage.id || 0).subscribe({
      next: (_zonestockage: any) => {
        this.zonestockages = _zonestockage;
        this.lieustockage = _lieustockage;
        this.inventaire.zonestockage.lieu = _lieustockage;
      }
    })
  }

  selectZoneStockage(_zonestockage: InterfaceZonestockages, _lieustockage: InterfaceLieustockages) {
    this.inventaire.zonestockage = _zonestockage;
    this.inventaire.zonestockageId = _zonestockage.id || 0;
    this.inventaire.zonestockage.lieu = _lieustockage;
  }

  show(_inventaire: InterfaceInventaires) {
    this.inventaire = _inventaire;
    this.idinventaire = _inventaire.id || 0;
    this.inventaire.inventairedetail = _inventaire.inventairedetail;
    this.inventaire.date_inventaire = new Date(this.inventaire.date_inventaire);
    console.log(this.inventaire)
    this.zonelieuService.getLieuStockageByCentreId(this.inventaire.centre.id || 0).subscribe({
      next: (_lieustockage: any) => {
        this.lieustockages = _lieustockage;
        this.zonelieuService.getZoneStockageByLieuId(this.inventaire.zonestockage.lieu.id || 0).subscribe({
          next: (_zonestockage: any) => {
            this.zonestockages = _zonestockage;
          }
        })
      }
    })
  }

  formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (fin == true) {
      return `${year}-${month}-${day} 23:59:59`;
    }
    return `${year}-${month}-${day} 00:00:00`;
    // return this.datePipe.transform(date, format);
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  cancel() {

  }

  submit() {
    this.inventaire.operateurId = this.idoperateur;
    this.inventaireService.createInventaire(this.inventaire, this.inventaire.inventairedetail).subscribe({
      next: () => {
        alert('Inventaire créer');
      }
    })
  }

  toggleModal(_etat: boolean = false) {
    this.toggle = !this.toggle;
    this.addToggle = !this.addToggle;
    if (this.toggleEtat === false) {
      this.toggleEtat = !this.toggleEtat;
    }
    if (_etat !== true) {
      this.toggleEtat = !this.toggleEtat;
    }
  }

  modifToggleModal() {

  }

  addToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.idinventaire = 0;
    this.resetinventaire()
    this.selectCentreRevenu(this.centrerevenu);
  }

  delete() {

  }

  deletes() {

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

  openArticle(content: TemplateRef<any>) {
    this.articleService.getArticlesByExploitation(this.idexploitation).subscribe({
      next: (_articles) => {
        this.articles = _articles;
        this.inventaireArticles = [];
        for (const _a of this.articles) {
          // console.log(_a)
          this.inventaireArticle = {
            articleId: _a.id || 0,
            quantite: 0,
            uniteId: _a.uniteId,
            inventaireId: 0,
            selected: false,

            article: _a,
          }
          this.inventaireArticles.push(this.inventaireArticle);
        }
        this.inventaireArticles = this.inventaireArticles.filter(article => {
          return !this.inventaire.inventairedetail.some(fondArticle => fondArticle.articleId === article.articleId);
        });
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            // console.log(this.closeResult)
            if (this.closeResult == 'Closed with: Save click') {
              for (const _a of this.inventaireArticles) {
                if (_a.selected === true) {
                  _a.selected = false;
                  this.inventaire.inventairedetail.push(_a);
                }
              }
              console.log(this.inventaire.inventairedetail)
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult)

          },
        );
      }
    });
  }

  deselectArticles(_inventairedetais: InterfaceInventairesDetails[]) {
    this.inventaire.inventairedetail = _inventairedetais.filter(_i => _i.selected === false)
  }

}
