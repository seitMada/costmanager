import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbNavModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { TooltipModule } from '@coreui/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { InterfaceCentreRevenu } from '../../../shared/model/interface-centrerevenu';
import { Adress } from '../../../shared/model/adresse';
import { InterfaceExploitations } from '../../../shared/model/interface-exploitations';
import { InterfacePpoDetail, InterfacePpos } from '../../../shared/model/interface-ppos';

import { CentreRevenuService } from "../../../shared/service/centre-revenu.service";
import { ExploitationService } from "../../../shared/service/exploitation.service";
import { PpoService } from "../../../shared/service/ppo.service";
import { InterfaceArticle } from '../../../shared/model/interface-articles';
import { ArticleService } from '../../../shared/service/article.service';
import { InterfaceFichetechnique } from '../../../shared/model/interface-fichetechnique';
import { FichetechniqueService } from '../../../shared/service/fichetechnique.service';
import { InterfaceComposition } from '../../../shared/model/interface-compositions';

import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';

import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-ppos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './ppos.component.html',
  styleUrl: './ppos.component.scss'
})
export class PposComponent implements OnInit {

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

  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  public toggle = true;
  public addToggle = true;
  public deleteToggle = true;
  public modifToggle = true;
  public exploitationToggle = true;

  private modalService = inject(NgbModal);
  closeResult = '';

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  public idPpo: number | undefined = 0;
  public active = 1;

  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public ppos: InterfacePpos[];
  public ppo: InterfacePpos;
  public ppodetails: InterfacePpoDetail[];
  public articles: InterfaceArticle[];
  public fichetechniques: InterfaceFichetechnique[];
  public fichetechnique: InterfaceFichetechnique;
  public ppodetailsarticles: InterfacePpoDetail[];
  public ppodetailsfichetechniques: InterfacePpoDetail[];
  public ppodetailsarticle: InterfacePpoDetail;
  public ppodetailsfichetechnique: InterfacePpoDetail;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private ppoService: PpoService,
    private articleService: ArticleService,
    private fichetetchniqueService: FichetechniqueService,
    private datePipe: DatePipe,
    private pdfService: PdfserviceService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
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
              this.resetPpo();
            }
          })
        } else {
          this.exploitationService.getExploitationById(this.idexploitation).subscribe({
            next: (_exploitation) => {
              this.exploitations.push(_exploitation);
              this.exploitation = _exploitation[0];
              this.resetPpo();
            }
          })
        }
      }
    })
  }

  async selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
    this.ppoService.getPpoByCrAndDate([this.idcentrerevenu], this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true), false).subscribe({
      next: (_ppos: any) => {
        this.ppos = _ppos;
      }
    })
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
    }
  }

  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today
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

  ngOnInit(): void {

  }

  submit() {
    this.ppo.ppodetail = [];
    this.ppo.ppodetail = this.ppo.ppodetail.concat(this.ppodetailsarticles);
    this.ppo.ppodetail = this.ppo.ppodetail.concat(this.ppodetailsfichetechniques);
    if (this.idPpo === 0) {
      this.ppoService.createPpo(this.ppo).subscribe({
        next: () => {
          this.toggleToast('Perte du ' + this.screenDate(this.ppo.date_ppo) + ' enregistrer');
          this.modifToggle = !this.modifToggle;
        }
      })
    } else {
      this.ppoService.updatePpo(this.ppo).subscribe({
        next: () => {
          this.toggleToast('Perte du ' + this.screenDate(this.ppo.date_ppo) + ' modifier')
          this.modifToggle = !this.modifToggle;
        }
      })
    }
  }

  cancel() {
    this.modifToggle = !this.modifToggle;
  }

  async toggleModal() {
    await this.selectCentreRevenus(this.centrerevenu);
    this.ppo.date_ppo = !this.toggle ? new Date() : this.ppo.date_ppo;
    this.toggle = !this.toggle;
    this.addToggle = !this.addToggle;
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  async addToggleModal() {
    // this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
    //   next: async (_centrerevenu) => {
        // this.centrerevenus = _centrerevenu;
        await this.resetPpo();
        this.modifToggle = !this.modifToggle;
        this.toggle = (this.toggle === false ? true : false);
        this.addToggle = (this.addToggle === false ? true : false);
    //   }
    // })
  }

  delete() {
    this.ppoService.deletePpo(this.idPpo || 0).subscribe({
      next: () => {
        // this.addToggleModal();
        this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
          next: async (_centrerevenu) => {
            this.centrerevenus = _centrerevenu;
            await this.selectCentreRevenus(_centrerevenu[0]);
            await this.resetPpo();
            this.toggle = (this.toggle === false ? true : false);
            this.addToggle = (this.addToggle === false ? true : false);
            this.toggleToast('Perte du ' + this.screenDate(this.ppo.date_ppo) + ' supprimer');
          }
        })
      }
    })
  }

  deletes() {
    const selectedIds: number[] = [];
    for (const _ppo of this.ppos) {
      if (_ppo.selected) {
        selectedIds.push(_ppo.id !== undefined ? _ppo.id : 0);
      }
    }
    this.ppoService.deletePpos(selectedIds).subscribe({
      next: () => {
        // this.addToggleModal();
        this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
          next: async (_centrerevenu) => {
            this.centrerevenus = _centrerevenu;
            await this.selectCentreRevenus(_centrerevenu[0]);
            await this.resetPpo();
            // this.addToggle = (this.addToggle === false ? true : false);
            this.toggleToast('Les pertes ont été supprimer');
          }
        })
      }
    })
  }

  deselect() {
    let index = 0;
    for (const _article of this.ppodetailsarticles) {
      if (_article.selected == true) {
        console.log(index)
        this.ppodetailsarticles.splice(index, 1);
      }
      index++;
    }
    index = 0;
    for (const _fichetechnique of this.ppodetailsfichetechniques) {
      if (_fichetechnique.selected == true) {
        console.log(index)
        this.ppodetailsfichetechniques.splice(index, 1);
      }
      index++;
    }
  }

  show(_ppo: InterfacePpos) {
    this.ppo = _ppo;
    this.idPpo = _ppo.id;
    this.ppo.date_ppo = new Date(this.ppo.date_ppo);
    console.log(_ppo);
    this.ppodetailsarticles = [];
    this.ppodetailsfichetechniques = [];
    for (const _ppodetail of _ppo.ppodetail) {
      if (_ppodetail.article && !_ppodetail.fichetechnique) {
        this.ppodetailsarticles.push(_ppodetail);
      } else if (_ppodetail.fichetechnique && !_ppodetail.article) {
        this.ppodetailsfichetechniques.push(_ppodetail);
      }
    }
    // console.log(this.ppodetailsarticle)
    // console.log(this.ppodetailsfichetechnique)
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  valorisation(_ppodetails: InterfacePpoDetail[]) {
    let _cout = 0;
    for (const _ppodetail of _ppodetails) {
      if (_ppodetail.articleId == null && _ppodetail.fichetechniqueId != null) {
        _cout += this.calculeCoutComposition(_ppodetail.fichetechnique.composition) * _ppodetail.quantite || 0;
      }
      if (_ppodetail.articleId != null && _ppodetail.fichetechniqueId == null) {
        _cout += _ppodetail.article.cout * _ppodetail.quantite || 0;
      }
    }
    return _cout;
  }

  openPdf(_ppo: InterfacePpos, action: number) {
    const dateppo = this.screenDate(new Date(this.ppo.date_ppo));
    const dataPpoArticle: any[] = [];
    const dataPpoFicheyechnique: any[] = [];

    // let quantite = 0;
    // let prix = 0;
    for (const _ppoArticle of this.ppodetailsarticles) {
      const data = {
        'Article': _ppoArticle.article.libelle,
        'Quantite': _ppoArticle.quantite,
        'Cout': _ppoArticle.article.cout,
        'Valorisation': _ppoArticle.article.cout * _ppoArticle.quantite,
        'Unite': _ppoArticle.unite.libelle,
        'Famille': this.truncateWord(_ppoArticle.article.familles.libelle),
        'SousFamille': this.truncateWord(_ppoArticle.article.sousfamilles.libelle)
      }
      // quantite += _inv.quantite;
      // prix += _inv.article.cout;
      console.log(data)
      dataPpoArticle.push(data);
    }
    for (const _ppoFichetechnique of this.ppodetailsfichetechniques) {
      const data = {
        'Article': _ppoFichetechnique.fichetechnique.libelle,
        'Quantite': _ppoFichetechnique.quantite,
        'Cout': this.calculeCoutComposition(_ppoFichetechnique.fichetechnique.composition),
        'Valorisation': this.calculeCoutComposition(_ppoFichetechnique.fichetechnique.composition) * _ppoFichetechnique.quantite,
        'Unite': _ppoFichetechnique.unite.libelle,
        'Famille': this.truncateWord(_ppoFichetechnique.fichetechnique.famille.libelle)
      }
      // quantite += _inv.quantite;
      // prix += _inv.article.cout;
      dataPpoFicheyechnique.push(data);

      const docDefinition = {
        content: [
          {
            text: `Perte du ${dateppo} -- Centre revenu ${this.centrerevenu.libelle}`,
            fontSize: 15, bold: true
          },
          '\n', '\n', '\n',
          {
            text: `ARTICLES`,
            fontSize: 15, bold: true
          },
          '\n', // Add a line break after inventory details
          {
            style: 'tableExample',
            table: {
              widths: ['*', '*', '*', '*', '*', '*', '*'],
              body: this.pdfService.buildTableBody(dataPpoArticle, ['Article', 'Quantite', 'Cout', 'Valorisation', 'Unite', 'Famille', 'SousFamille'],
                [
                  // { text: 'Réf', style: 'subheader' }, // subheader for 'Réf' column
                  { text: 'Articles', style: 'tableHeader' },
                  { text: 'Quantité', style: 'tableHeader' },
                  { text: 'Cout', style: 'tableHeader' },
                  { text: 'Valorisation', style: 'tableHeader' },
                  { text: 'Unité', style: 'tableHeader' },
                  { text: 'Familles', style: 'tableHeader' },
                  { text: 'Sous Familles', style: 'tableHeader' },
                ]
              ),
            },
          },
          '\n', // Add a line break after inventory details
          {
            text: `FICHE TECHNIQUES`,
            fontSize: 15, bold: true
          },
          '\n', // Add a line break after inventory details
          {
            style: 'tableExample',
            table: {
              widths: ['*', '*', '*', '*', '*', '*'],
              body: this.pdfService.buildTableBody(dataPpoFicheyechnique, ['Article', 'Quantite', 'Cout', 'Valorisation', 'Unite', 'Famille'],
                [
                  // { text: 'Réf', style: 'subheader' }, // subheader for 'Réf' column
                  { text: 'Articles', style: 'tableHeader' },
                  { text: 'Quantité', style: 'tableHeader' },
                  { text: 'Cout', style: 'tableHeader' },
                  { text: 'Valorisation', style: 'tableHeader' },
                  { text: 'Unité', style: 'tableHeader' },
                  { text: 'Familles', style: 'tableHeader' },
                ]
              ),
            },
          },
          // {
          //   style: 'tableExample',
          //   table: {
          //     widths: [120, '*'],
          //     body: [
          //       ['TOTAL', (prix * quantite).toString() + ' €'],
          //     ]
          //   }
          // },

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

  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          this.resetPpo();
          this.addToggleModal();
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)

      },
    );
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

  selectExploitation(_exploitation: InterfaceExploitations) {
    this.centrerevenuService.getCrExploitation(_exploitation.id || 0).subscribe({
      next: (_centrerevenus) => {
        this.exploitation = _exploitation;
        this.centrerevenus = _centrerevenus;
        this.ppo.centre.libelle = '';
        this.ppo.centreId = 0;
      }
    })
  }

  selectCentreRevenu(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.ppo.centre = _centrerevenu;
    this.ppo.centreId = _centrerevenu.id || 0;
  }

  private async resetPpo() {
    this.idPpo = 0;
    this.ppodetailsarticles = [];
    this.ppodetailsfichetechniques = [];
    this.ppo = {
      date_ppo: new Date(),
      centreId: this.centrerevenu.id || 0,
      centre: this.centrerevenu,
      exploitationId: this.exploitation.id || 0,
      exploitation: this.exploitation,
      operateurId: this.idoperateur,
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
      selected: false,
      ppodetail: []
    }
  }

  calculeCoutComposition(_composition: InterfaceComposition[]) {
    let cout = 0;
    for (const _c of _composition) {
      if (_c.articleId != null) {
        cout += (_c.article ? _c.article.cout : 0) * _c.quantite;
      } else {
        cout += (_c.fichetechniqueCompositon ? _c.fichetechniqueCompositon.cout : 0) * _c.quantite;
      }
    }
    return cout;
  }

  openArticle(content: TemplateRef<any>) {
    this.articleService.getArticlesByExploitation(this.idexploitation).subscribe({
      next: (_articles) => {
        this.articles = _articles;
        this.articles = this.articles.filter(article => {
          return !this.ppodetailsarticles.some(fondArticle => fondArticle.article.id === article.id);
        });
        this.fichetetchniqueService.getFichetechniqueByExploitation(this.idexploitation).subscribe({
          next: (_fichetetchniques) => {
            this.fichetechniques = _fichetetchniques;
            this.fichetechnique = _fichetetchniques[0];
            this.fichetechniques = this.fichetechniques.filter(fichetechnique => {
              return !this.ppodetailsfichetechniques.some(fondFichetechnique => fondFichetechnique.fichetechnique.id === fichetechnique.id);
            });
            this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
              (result) => {
                this.closeResult = `Closed with: ${result}`;
                // console.log(this.closeResult)
                if (this.closeResult == 'Closed with: Save click') {
                  for (const _article of this.articles) {
                    this.ppodetailsarticle = {
                      article: _article,
                      articleId: _article.id || 0,
                      // code: null,
                      cout: _article.cout,
                      fichetechnique: this.fichetetchniqueService.resetFichetechnique(),
                      fichetechniqueId: null,
                      ppoId: this.idPpo,
                      quantite: 0,
                      unite: _article.unite,
                      uniteId: _article.unite.id || 0,
                      // ppo: this.ppo
                    }
                    if (_article.selected === true) {
                      this.ppodetailsarticles.push(this.ppodetailsarticle)
                    }
                  }
                  for (const _fichetechnique of this.fichetechniques) {
                    this.ppodetailsfichetechnique = {
                      article: this.articleService.resetArticle(),
                      articleId: null,
                      // code: null,
                      cout: this.calculeCoutComposition(_fichetechnique.composition),
                      fichetechnique: _fichetechnique,
                      fichetechniqueId: _fichetechnique.id || 0,
                      ppoId: this.idPpo,
                      quantite: 0,
                      unite: _fichetechnique.unite,
                      uniteId: _fichetechnique.unite.id || 0,
                      // ppo: this.ppo
                    }
                    if (_fichetechnique.selected === true) {
                      this.ppodetailsfichetechniques.push(this.ppodetailsfichetechnique)
                      console.log(this.ppodetailsfichetechnique)
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
    })
  }

  selectFichetechnique(_fichetechnique: InterfaceFichetechnique) {
    this.fichetechnique = _fichetechnique;
  }
}
