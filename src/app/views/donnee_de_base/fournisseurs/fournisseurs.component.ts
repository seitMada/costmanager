import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownModule, NgbModal, NgbNavModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { InterfaceExploitations } from '../../../shared/model/interface-exploitations';
import { InterfaceFournisseur } from '../../../shared/model/interface-fournisseurs';
import { InterfaceAdresse } from "../../../shared/model/interface-adresse";
import { ExploitationService } from '../../../shared/service/exploitation.service';
import { FournisseurService } from '../../../shared/service/fournisseur.service';
import { OperateursService } from "../../../shared/service/operateurs.service";
import { ArticleService } from "../../../shared/service/article.service";
import { Exploitations } from '../../../shared/model/exploitations';
import { InterfaceContact, InterfaceOperateur } from '../../../shared/model/interface-operateur';
import { PAYS } from "../../../../assets/pays";
import { Fournisseur, Fournisseurs } from '../../../shared/model/fournisseurs';
import { Adress, Adresse } from "../../../shared/model/adresse";
import { Article } from '../../../shared/model/articles';
import { InterfaceArticlefournisseurs } from '../../../shared/model/interface-articlefournisseurs';
import { InterfaceArticle } from '../../../shared/model/interface-articles';
import { Unite, Unites } from '../../../shared/model/unite';
import { InterfaceUnite } from '../../../shared/model/interface-unite';
import { UnitesService } from '../../../shared/service/unites.service';
import { IntefaceConditionnement } from '../../../shared/model/inteface-conditionnements';
import { TooltipModule } from '@coreui/angular';
import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';
import { SortFilterSearchService } from 'src/app/shared/service/sort-filter-search.service';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.scss'
})
export class FournisseursComponent implements OnInit {

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

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public fournisseurService: FournisseurService,
    public exploitationService: ExploitationService,
    public operateurService: OperateursService,
    public articleService: ArticleService,
    public uniteService: UnitesService,
    private sortFilterSearchService: SortFilterSearchService
  ) { }

  public toggle = true;
  public addToggle = true;
  public modifToggle = true;
  public modifContactToggle = false;
  public addToggleOperateur = false;
  public toggleArticle = false;
  public toggleAddConditionnement = false;

  public country = PAYS;
  public flags: string = '';

  public fournisseurs: InterfaceFournisseur[];
  public fournisseursBack: InterfaceFournisseur[];
  public fournisseur: Fournisseurs;
  public exploitations: Exploitations;
  public adresse: Adress;
  public adresses: Adresse;
  public operateur: InterfaceOperateur;
  public operateurs: InterfaceOperateur[];
  public articleFournisseurs: InterfaceArticlefournisseurs[];
  public articleFournisseur: InterfaceArticlefournisseurs;
  public articles: Article;
  public article: InterfaceArticle;
  public unites: Unites;
  public unite: InterfaceUnite;
  public conditionnement: IntefaceConditionnement;
  public adresseadd: InterfaceAdresse;

  public articleExclude: number[] = [];
  public checkContact: number[] = [];
  public checkAdress: InterfaceAdresse;

  public idFournisseur = 0;
  active = 1;
  private modalService = inject(NgbModal);
  closeResult = '';

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.resetFournisseur();
    this.initFournisseur();
    this.initOperateur();
  }

  public truncateWord(word: string, maxLength = 15) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  public initConditionnement(_article: InterfaceArticle) {
    this.conditionnement = {
      id: 0,
      articleId: _article.id ? _article.id : 0,
      idUniteCommande: 0,
      coefficientAchatCommande: 1,
      idUniteAchat: 0,
      coefficientInventaireAchat: 1,
      iduniteInventaire: 0,
      coefficientInventaire: 1,
      idUniteFt: _article.uniteId,
      articlefournisseurId: 0,
      prixAchat: 0,

      uniteAchat: {
        libelle: '',
        code: '',
        abreviation: '',
        step: 1,
        actif: true,
      },
      uniteCommande: {
        libelle: '',
        code: '',
        abreviation: '',
        step: 1,
        actif: true,
      },
      uniteInventaire: {
        libelle: '',
        code: '',
        abreviation: '',
        step: 1,
        actif: true,
      },
      uniteFt: _article.unite
    }
  }

  public initFournisseur() {
    forkJoin({
      fournisseurs: this.fournisseurService.getAllFournisseurByExploitation(this.exploitation),
      exploitations: this.exploitationService.getExploitation(),
      unites: this.uniteService.getUnite()
    }).subscribe({
      next: (data) => {
        const { fournisseurs, exploitations, unites } = data;

        for (const fournisseur of fournisseurs) {
          if (fournisseur.adresseId == null) {
            fournisseur.adresse = {
              rue: '...',
              ville: '...',
              code_postal: '...',
              pays: '...',
              selected: false,
              centreRevenu: [],
              exploitation: [],
              operateur: []
            }
          }
        }
        this.fournisseurs = fournisseurs;
        this.fournisseursBack = fournisseurs;
        if (this.isAdmin === true) {
          this.exploitations = exploitations.filter((item: any) => item.id !== this.exploitation);
        } else {
          this.exploitations = exploitations.filter((item: any) => item.id === this.exploitation);
        }
        this.unites = unites;
      }
    })
  }


  selectUnite(data: any) {
    this.article.unite = data;
    this.article.uniteId = data.id;
  }

  show(fournisseur: InterfaceFournisseur) {
    this.idFournisseur = fournisseur.id ? fournisseur.id : 0;
    this.fournisseur = fournisseur;
    this.fournisseur.flags = this.getFlag(fournisseur);
    console.log(this.fournisseur)
    this.exploitationService.getExploitation().subscribe({
      next: (exploitations) => {
        this.exploitations = exploitations;
        this.fournisseurService.getAllExploitationByFournisseur(this.idFournisseur).subscribe({
          next: (fournisseurExploitation: any) => {
            this.initOperateur(fournisseur.id)
            for (const e of this.exploitations) {
              const comparisonItem = fournisseurExploitation.find((i: any) => i.exploitationsId === e.id);
              if (comparisonItem != undefined) {
                e.selected = true;
              } else {
                e.selected = false;
              }
            }
          }
        })
      }
    })
  }

  private initOperateur(fournisseurId: any = null, _operateur: any = null) {
    this.operateur = {
      id: _operateur ? _operateur.id : 0,
      nom: _operateur ? _operateur.nom : '',
      prenom: _operateur ? _operateur.prenom : '',
      email: _operateur ? _operateur.email : '',
      mdp: _operateur ? _operateur.mdp : '',
      compteConnecte: _operateur ? _operateur.compteConnecte : false,
      actif: _operateur ? _operateur.actif : true,
      login_count: _operateur ? _operateur.login_count : 0,
      fournisseurId: fournisseurId,
      code: _operateur ? _operateur.code : '',
      telephone: _operateur ? _operateur.telephone : '',
      civilite: _operateur ? _operateur.civilite : 'Mr',
    };
  }

  public resetFournisseur() {
    forkJoin({
      exploitations: this.exploitationService.getExploitation()
    }).subscribe({
      next: (data) => {
        const { exploitations } = data;
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
        this.exploitations = exploitations;
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
      },
      error: (error) => {
        console.error('Une erreur est survenue ', error);
      }
    });
  }

  deletes() {
    const selectedIds: number[] = [];
    let exploitation: number[] = [];
    for (const fournisseur of this.fournisseurs) {
      if (fournisseur.selected) {
        selectedIds.push(fournisseur.id !== undefined ? fournisseur.id : 0);
      }
    }
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id || 0)
      }
      exploitation.push(this.exploitation);
    } else {
      exploitation = [this.exploitation]
    }
    if (selectedIds.length > 0) {
      const data = {
        fournisseurId: selectedIds,
        exploitationsId: exploitation
      }
      this.fournisseurService.desactiveFournisseursExploitation(data).subscribe(() => {
        this.toggleToast('Fournisseurs supprimer');
        this.initFournisseur();
      })
    }
    this.fournisseursBack = this.fournisseurs;

  }

  delete() {
    let exploitation: number[] = [];
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id || 0)
      }
      exploitation.push(this.exploitation)
    } else {
      exploitation = [this.exploitation]
    }
    this.fournisseurService.desactiveFournisseurExploitation(this.idFournisseur, exploitation).subscribe({
      next: (data) => {
        this.toggleToast('Fournisseur supprimer');
        this.resetFournisseur();
        this.initFournisseur();
        this.toggle = !this.toggle;
      }
    });
  }

  addToggleModal() {
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
    this.idFournisseur = 0;
    this.resetFournisseur()
  }

  modifToggleModal() {
    this.modifToggle = !this.modifToggle;
  }

  toggleModal() {
    this.toggle = !this.toggle;
    this.addToggle = this.addToggle == false ? false : true;
    this.initFournisseur();
  }

  cancel() {
    if (this.idFournisseur === 0) {
      this.toggle = true;
      this.modifToggle = true;

      this.resetFournisseur();
    } else {
      this.fournisseurService.getFournisseurById(this.idFournisseur || 0).subscribe({
        next: (_fournisseur) => {
          this.fournisseur = _fournisseur;
          this.modifToggle = !this.modifToggle;
        },
      })
    }
  }

  submit() {
    if (this.idFournisseur === 0) {
      this.fournisseurService.addFournisseur(this.fournisseur).subscribe({
        next: (fournisseur: any) => {
          this.fournisseur = fournisseur;
          this.idFournisseur = fournisseur.id;
          const exploitation: number[] = [];
          if (this.isAdmin) {
            for (const i of this.exploitations) {
              if (i.selected === true) {
                exploitation.push(i.id ? i.id : 0)
              }
            }
          } else {
            exploitation.push(this.exploitation);
          }
          this.fournisseurService.updateFournisseurExploitation(fournisseur.id, exploitation).subscribe({
            next: () => {
              this.toggleToast('Fournisseur enregistrer')
              this.modifToggle = !this.modifToggle;
            }
          });
        }
      })
    } else {

      this.fournisseurService.updateFournisseur(this.idFournisseur, this.fournisseur).subscribe((response) => {
        const exploitation: number[] = [];
        if (this.isAdmin) {
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id ? i.id : 0)
            }
          }
        } else {
          exploitation.push(this.exploitation);
        }
        forkJoin({
          fournisseur: this.fournisseurService.getFournisseurById(this.idFournisseur),
          updateExploitationFournisseur: this.fournisseurService.updateFournisseurExploitation(this.idFournisseur, exploitation),
          fournisseurExploitation: this.fournisseurService.getAllExploitationByFournisseur(this.idFournisseur)
        }).subscribe({
          next: (data) => {
            const { fournisseur, updateExploitationFournisseur, fournisseurExploitation } = data;
            this.fournisseur = fournisseur;
            this.toggleToast('Fournisseur modifier')
            for (const item of this.exploitations) {
              const comparisonItem = fournisseurExploitation.find((i: any) => i.exploitationsId === item.id);
              if (comparisonItem != undefined) {
                item.selected = true;
              }
            }
            this.modifToggle = !this.modifToggle;
          }
        })
      })
    }
  }

  checked(event: any, operateur: InterfaceOperateur) {

    if (event.target?.checked === true) {
      if (operateur.id) {
        this.checkContact.push(operateur.id)
      }
    } else {
      if (operateur.id) {
        const i = this.checkContact.map(elt => { return elt }).indexOf(operateur.id);
        this.checkContact.splice(i, 1);
      }
    }

    if (this.checkContact.length === 1) {
      this.modifContactToggle = true;
    } else {
      this.modifContactToggle = false;
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

  updateSelect(line: InterfaceAdresse) {

    this.checkAdress = line;
  }

  resetaddresse() {
    this.fournisseurService.getAllAdresse().subscribe({
      next: (adresses) => {
        for (const adresse of adresses) {
          adresse.selected = false;
          adresse.flags = this.selectFlags(adresse);
        }
        this.adresses = adresses;
      }
    })
  }

  changeAdress(content: TemplateRef<any>) {
    if (this.modifToggle === false) {
      this.fournisseurService.getAllAdresse().subscribe({
        next: (adresses) => {
          for (const adresse of adresses) {
            if (this.fournisseur.adresse) {
              if (adresse.id == this.fournisseur.adresse.id) {
                adresse.selected = true;
              } else {
                adresse.selected = false;
              }
            }
            adresse.flags = this.selectFlags(adresse);
          }

          this.adresses = adresses;
          this.adresseadd = {
            rue: '',
            ville: '',
            code_postal: '',
            pays: '',
            selected: false,
            centreRevenu: [],
            exploitation: [],
            operateur: []
          };
          this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;

              if (this.closeResult == 'Closed with: Save click') {
                if (this.checkAdress) {
                  this.fournisseur.adresse = this.checkAdress;
                  this.fournisseur.adresseId = this.checkAdress.id ? this.checkAdress.id : null;
                } else {

                  if (!this.fournisseur.adresse) {
                    this.fournisseurService.createnewadresse(this.fournisseur.adresse).subscribe({
                      next: (adresse: any) => {

                        this.fournisseur.adresse = adresse;
                        this.fournisseur.adresseId = adresse.id;
                        this.toggleToast('Nouvelle adresse ajouter')
                      }
                    })
                  }
                }
              }
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;


            },
          );
        }
      })
    }
  }

  open(content: TemplateRef<any>) {
    this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
      next: (article) => {
        const filteredArticles = article.filter((_article: any) =>
          _article.article.articleexploitation.some(
            (element: any) => element.exploitationsId === this.exploitation
          )
        );






        this.articleExclude = [0];
        for (const _article of filteredArticles) {
          this.articleExclude.push(_article.articleId)
        }

        this.articleFournisseurs = filteredArticles;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;

            if (this.closeResult == 'Closed with: Save click') {

            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;


          },
        );
      }
    })
  }

  selectFlags(line: any) {

    if (line !== undefined) {
      const pays = line.pays;
      const comparison = this.country.find((i: any) => i.translations.fr === pays);
      if (comparison) {
        return comparison?.alpha2Code.toLowerCase() + '.svg';
      }
    }
    return 'xx.svg';
  }

  selectCountry(line: any) {

    this.fournisseur.adresse.pays = line.translations.fr;
    this.fournisseur.adresse.flags = line.alpha2Code.toLowerCase() + '.svg';
  }

  getFlag(line: InterfaceFournisseur): string {
    if (line.adresse != undefined) {
      const pays = line.adresse.pays;
      const comparison = this.country.find((i: any) => i.translations.fr === pays);
      if (comparison) {
        return comparison?.alpha2Code.toLowerCase() + '.svg';
      }
    }
    return 'xx.svg';
  }

  addoperateur() {
    if (this.operateur.id == 0) {
      this.operateurService.createOperateur(this.operateur).subscribe({
        next: () => {
          this.addOperateurToggle();
          this.operateurService.getOperateur(this.idFournisseur).subscribe({
            next: (operateur) => {
              this.fournisseur.operateur = operateur;
            }
          })
          this.toggleToast('Contacts ajouter')
        }
      });
    } else {
      this.operateurService.updateOperateur(this.operateur.id ? this.operateur.id : 0, this.operateur).subscribe({
        next: () => {
          this.addOperateurToggle();
          this.operateurService.getOperateur(this.idFournisseur).subscribe({
            next: (operateur) => {
              this.fournisseur.operateur = operateur;
              this.modifContactToggle = false;
            }
          })
          this.toggleToast('Contacts modifier')
        }
      })
    }
  }

  addOperateurToggle() {
    this.addToggleOperateur = !this.addToggleOperateur;
    this.initOperateur(this.idFournisseur);
  }

  deleteOperateur() {
    const operateurId: number[] = [0];
    for (const operateur of this.fournisseur.operateur) {
      if (operateur.selected == true) {
        operateurId.push(operateur.id ? operateur.id : 0)
      }
    }
    this.operateurService.deleteOperateurs(this.idFournisseur, operateurId).subscribe({
      next: () => {
        this.operateurService.getOperateur(this.idFournisseur).subscribe({
          next: (operateur) => {
            this.fournisseur.operateur = operateur;
            this.checkContact = [];
            this.modifContactToggle = !this.modifContactToggle;
            this.toggleToast('Contacts supprimer')
          }
        })
      }
    })
  }

  modfifOperateur() {
    let operateurId: number = 0;
    for (const operateur of this.fournisseur.operateur) {
      if (operateur.selected == true) {
        operateurId = (operateur.id ? operateur.id : 0)
        this.initOperateur(this.idFournisseur, operateur)
      }
    }
    this.addToggleOperateur = !this.addToggleOperateur;
  }

  addArticle(content: TemplateRef<any>) {
    this.articleService.getArticlesExclude(this.exploitation, this.articleExclude).subscribe({
      next: (article: any) => {
        this.articles = article;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;

            if (this.closeResult == 'Closed with: Save click') {

              this.toggleArticle = false;
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

            this.toggleArticle = false;
          },
        );
      }
    })
  }

  addUniteConditionnement(content: TemplateRef<any>) {

    this.articleFournisseur = {
      articleId: this.article.id ? this.article.id : 0,
      fournisseurId: this.fournisseur.id ? this.fournisseur.id : 0,
      marque: '',
      prixReference: this.article.cout,
      prixReferencePrecedent: 0,
      commentaire: '',

      article: this.article,
      fournisseur: this.fournisseur,
      conditionnement: []
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;

        if (this.closeResult == 'Closed with: Save click') {

          this.fournisseurService.addArticleFournisseur(this.articleFournisseur).subscribe({
            next: (_articleFournisseur: any) => {
              this.conditionnement.articlefournisseurId = _articleFournisseur.id;
              this.fournisseurService.addConditionnement(this.conditionnement).subscribe({
                next: () => {
                  this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
                    next: (_article) => {
                      this.articleFournisseurs = _article;
                    }
                  })
                  this.toggleToast('Article fournisseur ajouter')
                }
              })
            }
          });
        } else {

        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;


      },
    );
  }

  updateSelectArticle(line: InterfaceArticle) {
    this.toggleArticle = true;
    this.article = line;
    this.initConditionnement(this.article);
  }

  selectUniteCommande(unite: InterfaceUnite) {
    this.conditionnement.idUniteCommande = unite.id ? unite.id : 0;
    this.conditionnement.uniteCommande = unite;
  }

  selectUniteAchat(unite: InterfaceUnite) {
    this.conditionnement.idUniteAchat = unite.id ? unite.id : 0;
    this.conditionnement.uniteAchat = unite;
  }

  selectUniteInventaire(unite: InterfaceUnite) {
    this.conditionnement.iduniteInventaire = unite.id ? unite.id : 0;
    this.conditionnement.uniteInventaire = unite;
  }

  updateArticleFournisseur(_articleFournisseur: InterfaceArticlefournisseurs, _conditionnement: IntefaceConditionnement, content: TemplateRef<any>) {

    this.article = _articleFournisseur.article;
    this.articleFournisseur = _articleFournisseur;
    this.conditionnement = _conditionnement;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;

        if (this.closeResult == 'Closed with: Save click') {
          this.articleFournisseur = {
            articleId: _articleFournisseur.id ? _articleFournisseur.id : 0,
            fournisseurId: this.fournisseur.id ? this.fournisseur.id : 0,
            marque: '',
            prixReference: _articleFournisseur.prixReference,
            prixReferencePrecedent: 0,
            commentaire: '',

            article: _articleFournisseur.article,
            fournisseur: this.fournisseur,
            conditionnement: []
          }

          if (this.conditionnement.articlefournisseurId == 0) {
            this.fournisseurService.addArticleFournisseur(this.articleFournisseur).subscribe({
              next: (_articleFournisseur: any) => {
                this.conditionnement.articlefournisseurId = _articleFournisseur.id;
                this.fournisseurService.addConditionnement(this.conditionnement).subscribe({
                  next: () => {
                    this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
                      next: (_article) => {
                        this.articleFournisseurs = _article;
                      }
                    })
                    this.toggleToast('Article fournisseur ajouter')
                  }
                })
              }
            });
          } else {
            if (this.conditionnement.id == 0) {
              this.fournisseurService.addConditionnement(this.conditionnement).subscribe({
                next: () => {
                  this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
                    next: (_article) => {
                      this.articleFournisseurs = _article;
                    }
                  })
                  this.toggleToast('Conditionnement ajouter')
                }
              })
            } else {
              this.fournisseurService.updateConditionnement(this.conditionnement.id ? this.conditionnement.id : 0, this.conditionnement).subscribe({
                next: () => {
                  this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
                    next: (_article) => {
                      this.articleFournisseurs = _article;
                    }
                  })
                  this.toggleToast('Conditionnement Modifier')
                }
              })
            }
          }
        } else {

        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;


      },
    );
  }

  addNouveauConditionnement(_articlefournisseur: InterfaceArticlefournisseurs) {
    this.articleFournisseur = _articlefournisseur;
    this.initConditionnement(this.articleFournisseur.article);
    this.articleFournisseur.id = _articlefournisseur.id;
    this.conditionnement.articlefournisseurId = _articlefournisseur.id ? _articlefournisseur.id : 0;

  }

  deleteArticleFournisseur(_articleFournisseur: InterfaceArticlefournisseurs, _conditionnement: IntefaceConditionnement) {
    this.fournisseurService.deleteConditionnement(_conditionnement).subscribe({
      next: () => {
        this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
          next: (_article) => {
            this.articleFournisseurs = _article;
            for (const _af of this.articleFournisseurs) {
              if (_articleFournisseur.id == _af.id && _af.conditionnement.length == 0) {
                this.fournisseurService.deleteArticleFournisseur(_af.id ? _af.id : 0).subscribe({
                  next: () => {
                    this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
                      next: (_article) => {
                        this.articleFournisseurs = _article;
                        this.toggleToast('Article fournisseur supprimer');
                      }
                    })
                  }
                })
              }
            }
          }
        })
        this.toggleToast('Conditionnement supprimer');
      },
    })
  }

  onSortFournisseurs(event: any, colonne: any, type: string = 'string') {
    return this.sortFilterSearchService.handleSort(event, this.fournisseurs, colonne, type, this.fournisseursBack);
  }

  onSearchFournisseurs(event: any, colonne: any) {
    this.fournisseurs = (this.sortFilterSearchService.handleSearch(event, this.fournisseurs, colonne, this.fournisseursBack));
  }
}
