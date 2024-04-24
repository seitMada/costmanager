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
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { ArticleService } from 'src/app/shared/service/article.service';
import { InterfaceFichetechnique } from 'src/app/shared/model/interface-fichetechnique';
import { FichetechniqueService } from 'src/app/shared/service/fichetechnique.service';
import { InterfaceComposition } from 'src/app/shared/model/interface-compositions';

import {
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';


@Component({
  selector: 'app-ppos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, BsDatepickerModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './ppos.component.html',
  styleUrl: './ppos.component.scss'
})
export class PposComponent {

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
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.exploitations = [];
    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.centrerevenus = _centreRevenu;
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
    this.ppoService.getPpoByCrAndDate(this.idcentrerevenu, this.formatDate(this.dates.debut), this.formatDate(this.dates.fin, true)).subscribe({
      next: (_ppos: any) => {
        this.ppos = _ppos;
        console.log(_ppos)
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
    console.log(this.ppo)
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
    this.toggle = !this.toggle;
    this.addToggle = !this.addToggle;
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  addToggleModal() {
    this.resetPpo();
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.addToggle = (this.addToggle === false ? true : false);
  }

  delete() {
    throw new Error('Method not implemented.');
  }

  deletes() {
    throw new Error('Method not implemented.');
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
    let cout = 0;
    for (const _ppodetail of _ppodetails) {
      if (_ppodetail.article && !_ppodetail.fichetechnique) {
        cout += _ppodetail.article.cout * _ppodetail.quantite || 0;
      } else if (_ppodetail.fichetechnique && !_ppodetail.article) {
        cout += _ppodetail.fichetechnique.cout * _ppodetail.quantite || 0;
      }
    }
    return cout;
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
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

  // calculePerte(_perte: InterfacePpoDetail) {
  //   let cout = 0;
  //   for (const _c of _composition) {
  //     cout += (_c.article ? _c.article.cout : 0) * _c.quantite;
  //   }
  //   return cout;
  // }

  calculeCoutComposition(_composition: InterfaceComposition[]) {
    let cout = 0;
    for (const _c of _composition) {
      cout += (_c.article ? _c.article.cout : 0) * _c.quantite;
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
                      cout: 0,
                      fichetechnique: this.fichetetchniqueService.resetFichetechnique(),
                      fichetechniqueId: 0,
                      ppoId: this.idPpo,
                      quantite: 0,
                      unite: _article.unite,
                      uniteId: _article.unite.id || 0,
                    }
                    if (_article.selected === true) {
                      this.ppodetailsarticles.push(this.ppodetailsarticle)
                    }
                  }
                  for (const _fichetechnique of this.fichetechniques) {
                    this.ppodetailsfichetechnique = {
                      article: this.articleService.resetArticle(),
                      articleId: 0,
                      // code: null,
                      cout: 0,
                      fichetechnique: _fichetechnique,
                      fichetechniqueId: _fichetechnique.id || 0,
                      ppoId: this.idPpo,
                      quantite: 0,
                      unite: _fichetechnique.unite,
                      uniteId: _fichetechnique.unite.id || 0,
                    }
                    if (_fichetechnique.selected === true) {
                      this.ppodetailsfichetechniques.push(this.ppodetailsfichetechnique)
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
