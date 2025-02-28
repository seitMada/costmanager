import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InterfaceInventaires, InterfaceInventairesDetails, InterfaceInventairesDetailsZone } from '../../../shared/model/interface-inventaires';
import { InterfaceCentreRevenu } from '../../../shared/model/interface-centrerevenu';

import { InventairesService } from '../../../shared/service/inventaires.service';
import { CentreRevenuService } from "../../../shared/service/centre-revenu.service";
import { ExploitationService } from "../../../shared/service/exploitation.service";
import { ZonestockagesService } from "../../../shared/service/zonestockages.service";

import { InterfaceExploitations, InterfaceExploitationss } from '../../../shared/model/interface-exploitations';
import { Adress } from '../../../shared/model/adresse';
import { InterfaceLieustockages } from '../../../shared/model/interface-lieustockages';
import { InterfaceZonestockages } from '../../../shared/model/interface-zonestockages';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceArticle } from '../../../shared/model/interface-articles';

import { ArticleService } from '../../../shared/service/article.service';
import { PdfserviceService } from "../../../shared/service/pdfservice.service";

import { AlertModule } from '@coreui/angular';
import { TooltipModule } from '@coreui/angular';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-inventaires',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, AlertModule, TooltipModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './inventaires.component.html',
  styleUrl: './inventaires.component.scss'
})
export class InventairesComponent {

  position = 'top-end';
  visible = false;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';

  public periode: { debut: Date, fin: Date }[] = []

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

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle = true;
  public toggleEtat = false;
  public addToggle = true;
  public listToggle = true;
  public modifToggle = true;
  public exploitationToggle = true;


  public btnctrl = {
    btnsave: true,
    date: true,
    update: true,
    add: true,
    list: true,
    delete: true
  }

  private modalService = inject(NgbModal);
  closeResult = '';

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public idinventaire: number = 0;
  private numero: string;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public inventaire: InterfaceInventaires;
  public inventaires: InterfaceInventaires[];
  public inventairesBack: InterfaceInventaires[];
  public inventaireDetail: InterfaceInventairesDetails;
  public inventaireDetails: InterfaceInventairesDetails[];
  public lieustockages: InterfaceLieustockages[];
  public lieustockageszones: InterfaceLieustockages[];
  public lieustockage: InterfaceLieustockages;
  public zonestockages: InterfaceZonestockages[];
  public zonestockage: InterfaceZonestockages;
  public articles: InterfaceArticle[];
  public inventaireArticle: InterfaceInventairesDetails;
  public inventaireArticles: InterfaceInventairesDetails[];
  public inventairesDetailsZone: InterfaceInventairesDetailsZone[];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private inventaireService: InventairesService,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private zonelieuService: ZonestockagesService,
    private articleService: ArticleService,
    private datePipe: DatePipe,
    private pdfService: PdfserviceService,
    private sortFilterSearchService: SortFilterSearchService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.resetinventaire(new Date());
    this.numero = (this.formatDateUS(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
  }

  private async resetinventaire(_date: Date) {
    this.numero = (this.formatDateUS(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
    this.inventaire = {
      id: 0,
      date_inventaire: _date,
      numero: this.numero,
      commentaire: '',
      etat: false,
      zonestockageId: 0,
      operateurId: this.idoperateur,
      centreRevenuId: this.centrerevenu.id || 0,
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
          centre: {
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
              adressesId: 0,
              adresses: new Adress(),
              centreRevenu: []
            },
            adresses: {
              rue: '',
              ville: '',
              code_postal: null,
              pays: '',
              centreRevenu: [],
              exploitation: [],
              operateur: []
            },
            lieuStockage: []
          },
          zonestockage: []
        },

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
      adresses: new Adress(),
      lieuStockage: []
    }
  }

  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
  }

  public depotSelectedId: number;
  public depotSelected: string;

  ngOnInit(): void {

    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation, this.isAdmin).subscribe({
      next: async (_centreRevenu) => {
        this.centrerevenus = _centreRevenu;
        this.centrerevenusdefault = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];
        await this.selectCentreRevenus(this.centrerevenu);
        if (this.isAdmin === true) {
          this.exploitationService.getExploitation().subscribe({
            next: (_exploitation) => {
              this.exploitations = _exploitation;
              this.exploitation = _exploitation[0];
            }
          })
        } else {
          this.exploitationService.getExploitationById(this.idexploitation).subscribe({
            next: (_exploitation) => {
              this.exploitations.push(_exploitation);
              this.exploitation = _exploitation[0];
            }
          })
        }
      }
    })
  }

  async selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
    this.inventaireService.getInventaireByCrAndDate(this.idcentrerevenu, this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true)).subscribe({
      next: (_inventaires: any) => {
        this.inventaires = _inventaires;
        this.inventairesBack = _inventaires;
      }
    })
  }

  selectExploitation(_exploitation: InterfaceExploitations) {

    this.centrerevenuService.getCrExploitation(_exploitation.id || 0, this.isAdmin).subscribe({
      next: (_centrerevenus) => {
        this.exploitation = _exploitation;
        this.centrerevenus = _centrerevenus;
        this.inventaire.centre.exploitations = _exploitation;
        this.inventaire.centre.libelle = '';
        this.inventaire.centreRevenuId = 0;

        const exploitationId: number[] = [];
        exploitationId.push(_exploitation.id || 0);
        this.zonelieuService.getZoneStockageByExploitationId(exploitationId).subscribe({
          next: (_data: any) => {
            this.lieustockageszones = _data;
            for (const _lieu of this.lieustockageszones) {
              for (const _zone of _lieu.zonestockage) {
                _zone.selected = true;
              }
            }
          }
        })
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

  async show(_inventaire: InterfaceInventaires) {
    this.inventaire = _inventaire;
    this.inventaire.etat = _inventaire.etat;
    this.idinventaire = _inventaire.id || 0;
    this.inventairesDetailsZone = [];

    this.inventaire.date_inventaire = new Date(this.inventaire.date_inventaire);
    this.numero = this.inventaire.numero;

    this.inventaireService.getInventaireDetailsByNumero(this.inventaire.numero).subscribe({
      next: (_inventaireDetails: any) => {
        this.zonelieuService.getLieuStockageByCentreId(this.inventaire.centre.id || 0).subscribe({
          next: (_lieustockage: any) => {
            this.lieustockages = _lieustockage;
            this.zonelieuService.getZoneStockageByLieuId(this.inventaire.zonestockage.lieu.id || 0).subscribe({
              next: (_zonestockage: any) => {
                this.zonestockages = _zonestockage;

                this.idinventaire = _inventaireDetails[0].id || 0;

                for (const _invZone of _inventaireDetails) {
                  Object.assign(_invZone, {
                    lieu: _invZone.zonestockage.lieu.lieu,
                    lieuId: _invZone.zonestockage.lieuId,
                    zone: _invZone.zonestockage.zone,
                    zoneId: _invZone.zonestockage.id,
                  })
                  this.inventairesDetailsZone.push(_invZone)
                }
              }
            })
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
  }

  formatDateUS(date: Date | string, format: string = 'yyyy-MM-dd') {
    return this.datePipe.transform(date, format);
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  cancel() {
    if (this.inventaire.id === 0) {
      this.toggle = true;
      this.modifToggle = true;
      this.addToggle = true;
      this.resetinventaire(new Date());
    } else {
      this.show(this.inventaire);
      this.modifToggle = !this.modifToggle;
    }
  }

  async submit() {
    if (this.idinventaire == 0) {
      this.inventaire.operateurId = this.idoperateur;
      const inventairetable = [];
      for (const _lieu of this.inventairesDetailsZone) {
        await this.resetinventaire(this.inventaire.date_inventaire);
        this.inventaire.inventairedetail = _lieu.inventairedetail;
        this.inventaire.zonestockageId = +(_lieu.zoneId || 0);
        inventairetable.push(this.inventaire);
      }
      

      this.inventaireService.createInventaire(inventairetable).subscribe({
        next: async (value) => {
          this.modifToggle = !this.modifToggle;
          this.show(this.inventaire)
          this.toggleToast('Inventaire du ' + this.screenDate(this.inventaire.date_inventaire) + ' enregistrer');
        }
      })
    } else {
      for (const _lieu of this.inventairesDetailsZone) {

        this.inventaire.inventairedetail = _lieu.inventairedetail;
        this.inventaire.zonestockageId = +(_lieu.zoneId || 0);
      }
      this.inventaireService.updateInventaire(this.inventairesDetailsZone, this.inventaire.numero).subscribe({
        next: () => {
          this.toggleToast('Inventaire du ' + this.screenDate(this.inventaire.date_inventaire) + ' enregistrer');
          this.show(this.inventaire)
          this.modifToggle = !this.modifToggle;
        }
      })
    }
  }

  async toggleModal(_etat: boolean = true) {

    await this.selectCentreRevenus(this.centrerevenu);
    this.toggle = !this.toggle;

    this.addToggle = !this.addToggle;
    this.listToggle = !this.listToggle;
    if (this.toggleEtat === false) {
      this.toggleEtat = !this.toggleEtat;
    }
    if (_etat === true) {
      this.toggleEtat = !this.toggleEtat;
    }
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.listToggle = (this.listToggle === false ? true : false);
  }

  addToggleModal() {

    this.centrerevenuService.getCrExploitation(this.idexploitation, this.isAdmin).subscribe({
      next: async (_centrerevenu) => {
        this.modifToggle = !this.modifToggle;
        this.toggle = (this.toggle === false ? true : false);
        this.toggleEtat = (this.toggleEtat !== false ? true : false);
        this.addToggle = (this.addToggle === false ? true : false);
        this.listToggle = (this.listToggle !== false ? true : false);
        this.idinventaire = 0;
        this.numero = (this.formatDateUS(this.today))?.replaceAll('-', '') + this.today.toLocaleTimeString().replaceAll(':', '') + this.today.getMilliseconds();
      }
    })
  }

  deleteZero(_inventaires: InterfaceInventairesDetailsZone) {
    _inventaires.inventairedetail = _inventaires.inventairedetail.filter(_i => _i.quantite > 0);
    if (_inventaires.inventairedetail.length === 0) {
      let index = 0;
      for (const _inventairedetail of this.inventairesDetailsZone) {

        if (_inventaires.lieuId == _inventairedetail.lieuId && _inventaires.zoneId == _inventairedetail.zoneId) {

          this.inventairesDetailsZone.splice(index, 1);
        }
        index++;
      }
    }
  }

  delete() {
    this.inventaireService.deleteInventaire(this.inventaire.numero).subscribe({
      next: () => {
        this.toggleToast('Inventaire du ' + this.screenDate(this.inventaire.date_inventaire) + ' supprimer');
        this.resetinventaire(new Date());
        this.selectCentreRevenus(this.centrerevenu);
        this.toggle = !this.toggle;
        this.modifToggle = !this.modifToggle ? false : true;
      }
    });
  }

  deletes() {
    const selectedNumero: string[] = [];
    for (const _inventaire of this.inventaires) {
      if (_inventaire.selected) {
        selectedNumero.push(_inventaire.numero !== undefined ? _inventaire.numero : '0');
      }
    }
    if (selectedNumero.length > 0) {

      this.inventaireService.deleteInventaires(selectedNumero).subscribe(() => {
        this.toggleToast('Les inventaire ont été supprimer');
        this.resetinventaire(new Date());
        this.selectCentreRevenus(this.centrerevenu);
      })
    }
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

  openPdf(_inventaire: InterfaceInventairesDetailsZone, action: number) {
    const dateinventaire = this.screenDate(new Date(this.inventaire.date_inventaire));
    const dataInventaire: any[] = [];
    let quantite = 0;
    let prix = 0;
    for (const _inv of _inventaire.inventairedetail) {
      const data = {
        'Article': _inv.article.libelle,
        'Quantite': _inv.quantite,
        'Unite': _inv.article.unite.libelle,
        'Prix': _inv.article.cout * _inv.quantite,
        'Famille': this.truncateWord(_inv.article.familles.libelle),
        'SousFamille': this.truncateWord(_inv.article.sousfamilles.libelle)
      }
      quantite += _inv.quantite;
      prix += _inv.article.cout;
      dataInventaire.push(data);
    }

    const docDefinition = {
      content: [
        {
          text: `Inventaire du ${dateinventaire} n° ${this.inventaire.numero} -- ${_inventaire.lieu} - ${_inventaire.zone}`,
          fontSize: 15, bold: true
        },
        '\n', '\n', '\n',
        {

          columns: [
            {
              text: [
                { text: 'N° inventaire : ', fontSize: 12, bold: true },
                `${this.inventaire.numero}\n`,
                { text: 'Date : ', fontSize: 12, bold: true },
                `${dateinventaire}\n`,
                { text: 'Lieu de stockage : ', fontSize: 12, bold: true },
                `${_inventaire.lieu}\n`,
                { text: 'Zone de stockage : ', fontSize: 12, bold: true },
                `${_inventaire.zone}\n`,
                { text: 'Opérateur : ', fontSize: 12, bold: true },
                `${this.inventaire.operateur.nom} ${this.inventaire.operateur.prenom}\n`,
              ],
            },
          ],
        },
        '\n', // Add a line break after inventory details
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: this.pdfService.buildTableBody(dataInventaire, ['Article', 'Quantite', 'Unite', 'Prix', 'Famille', 'SousFamille'],
              [

                { text: 'Articles', style: 'tableHeader' },
                { text: 'Quantité', style: 'tableHeader' },
                { text: 'Unité', style: 'tableHeader' },
                { text: 'Prix', style: 'tableHeader' },
                { text: 'Familles', style: 'tableHeader' },
                { text: 'Sous Familles', style: 'tableHeader' },
              ]
            ),
          },
        },
        '\n', // Add a line break after inventory details
        {
          style: 'tableExample',
          table: {
            widths: [120, '*'],
            body: [
              ['TOTAL', (this.calculsoustotal(_inventaire.inventairedetail)).toString() + ' €'],
            ]
          }
        },

      ],
      defaultStyle: {

      }
    };
    switch (action) {
      case 1:
        pdfMake.createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs).open();
        break;

      case 2:
        pdfMake.createPdf(docDefinition, undefined, undefined, pdfFonts.pdfMake.vfs).print();
        break;
      default:
        break;
    }
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }



  openArticle(content: TemplateRef<any>, lieu: InterfaceInventairesDetailsZone) {
    this.articleService.getArticlesByExploitation(this.idexploitation).subscribe({
      next: (_articles) => {
        this.articles = _articles;
        console.log(_articles);
        
        this.inventaireArticles = [];
        for (const _a of this.articles) {

          this.inventaireArticle = {
            articleId: _a.id || 0,
            quantite: 0,
            uniteId: _a.uniteId,
            inventaireId: 0,
            selected: false,
            numero: '',

            article: _a,
          }
          this.inventaireArticles.push(this.inventaireArticle);
        }
        this.inventaireArticles = this.inventaireArticles.filter(article => {
          return !lieu.inventairedetail.some(fondArticle => fondArticle.articleId === article.articleId);
        });
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;

            if (this.closeResult == 'Closed with: Save click') {
              for (const _a of this.inventaireArticles) {
                if (_a.selected === true) {
                  console.log(_a);
                  
                  _a.selected = false;
                  lieu.inventairedetail.push(_a);
                 
                }
              }

            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;


          },
        );
      }
    });
  }

  deselectArticles(lieu: InterfaceInventairesDetailsZone) {
    lieu.inventairedetail = lieu.inventairedetail.filter(_i => _i.selected === false || _i.selected == undefined)
    if (lieu.inventairedetail.length === 0) {
      let index = 0;
      for (const _inventairedetail of this.inventairesDetailsZone) {

        if (lieu.lieuId == _inventairedetail.lieuId && lieu.zoneId == _inventairedetail.zoneId) {

          this.inventairesDetailsZone.splice(index, 1);
        }
        index++;
      }
    }
  }

  validInventaire() {


    for (const _lieu of this.inventairesDetailsZone) {
      _lieu.etat = true;
    }
    this.inventaireService.updateInventaire(this.inventairesDetailsZone, this.numero).subscribe({
      next: () => {
        this.inventaire.etat = true;
        this.toggleToast('L\'inventaire du ' + this.screenDate(this.inventaire.date_inventaire) + ' pour le centre de revenu ' + this.centrerevenu.libelle + ' a été cloturer');
      }
    })
  }

  openInventaire(content: TemplateRef<any>) {
    this.today = new Date();
    this.resetinventaire(new Date())
    this.selectCentreRevenu(this.centrerevenu);
    const exploitationId: number[] = [];
    exploitationId.push(this.inventaire.centre.exploitations.id || 0);
    const dateFin = new Date(this.dates.fin);
    
    console.log(this.inventaire.centre.exploitations.id);
    this.zonelieuService.getZoneStockageByExploitationId(exploitationId).subscribe({
      next: (_data: any) => {
        this.lieustockageszones = _data.filter((item: { centreId: number | undefined; }) => item.centreId === this.inventaire.centre.id);
        for (const _lieu of this.lieustockageszones) {
          for (const _zone of _lieu.zonestockage) {
            _zone.selected = true;
          }
        }
      }
    })

    this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.dates.debut)), fin: this.formatDate(new Date(dateFin)), final: this.formatDate(new Date(this.dates.fin)) }, exploitationId,true ).subscribe({
        next:(_articles:any) => {
          this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              const zonestockageId: number[] = [0];
              if (this.closeResult == 'Closed with: Save click') {
                for (const _lieu of this.lieustockageszones) {
                  for (const _zone of _lieu.zonestockage) {
                    if (_zone.selected === true) {
                      zonestockageId.push(_zone.id || 0);
                    }
                  }
                }
                this.articleService.getArticlesByZone(zonestockageId).subscribe({
                  next: (_article: any) => {
                    this.inventaire.inventairedetail = [];
                    this.inventairesDetailsZone = [];
                    let _inventairesDetailsZone: InterfaceInventairesDetailsZone;
                    for (const _lieu of _article) {
                      for (const _zone of _lieu.zonestockage) {
                        _inventairesDetailsZone = {
                          lieu: _lieu.lieu,
                          lieuId: _lieu.id,
                          zone: _zone.zone,
                          zoneId: _zone.id,
                          etat: _lieu.etat,
    
                          inventairedetail: [],
                        }
                        for (const _article of _zone.articlezonestockages) {
                          const articleinventaire = _articles.filter((line:any) => line.article_id == _article.articlesId);
                          // console.log(articleinventaire);
                          
                          this.inventaireArticle = {
                            articleId: _article.articlesId || 0,
                            quantite: articleinventaire.inventaires + articleinventaire.achats - articleinventaire.pertes - articleinventaire.ventes,
                            uniteId: _article.articles.uniteId,
                            inventaireId: 0,
                            selected: false,
                            numero: '',
                            article: _article.articles,
                            
                          }
                          _inventairesDetailsZone.inventairedetail.push(this.inventaireArticle);
                        }
                        this.inventairesDetailsZone.push(_inventairesDetailsZone)
                      }
                    }
                    this.addToggleModal()

                  }
                })
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
          );
        },
    });
    
  }

  calculsoustotal(_datas: InterfaceInventairesDetails[]) {
    let prix = 0;
    for (const _data of _datas) {
      prix += _data.quantite * _data.article.cout || 0
    }
    return prix;
  }

  calcultotal(_datas: InterfaceInventairesDetailsZone[]) {

    let prix = 0;
    for (const _data of _datas) {
      for (const _i of _data.inventairedetail) {
        prix += _i.quantite * _i.article.cout || 0
      }
    }
    return prix;
  }

  onSortInventaires(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.inventaires, colonne, type, this.inventairesBack);
  }

  onSearchInventaires(event: any, colonne: any) {
    this.inventaires = (this.sortFilterSearchService.handleSearch(event, this.inventaires, colonne, this.inventairesBack));
  }

}
