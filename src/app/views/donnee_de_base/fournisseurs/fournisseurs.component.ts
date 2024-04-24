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
import { Exploitations } from 'src/app/shared/model/exploitations';
import { InterfaceContact, InterfaceOperateur } from 'src/app/shared/model/interface-operateur';
import { PAYS } from "../../../../assets/pays";
import { Fournisseur, Fournisseurs } from 'src/app/shared/model/fournisseurs';
import { Adress, Adresse } from "../../../shared/model/adresse";
import { Article } from 'src/app/shared/model/articles';
import { InterfaceArticlefournisseurs } from 'src/app/shared/model/interface-articlefournisseurs';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { Unite, Unites } from 'src/app/shared/model/unite';
import { InterfaceUnite } from 'src/app/shared/model/interface-unite';
import { UnitesService } from 'src/app/shared/service/unites.service';
import { IntefaceConditionnement } from 'src/app/shared/model/inteface-conditionnements';
import { TooltipModule } from '@coreui/angular';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, TooltipModule],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.scss'
})
export class FournisseursComponent {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public fournisseurService: FournisseurService,
    public exploitationService: ExploitationService,
    public operateurService: OperateursService,
    public articleService: ArticleService,
    public uniteService: UnitesService
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
        // console.log(fournisseurs)
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
    this.flags = this.getFlag(fournisseur);
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
    } else {
      exploitation = [this.exploitation]
    }
    if (selectedIds.length > 0) {
      const data = {
        fournisseurId: selectedIds,
        exploitationsId: exploitation
      }
      this.fournisseurService.desactiveFournisseursExploitation(data).subscribe(() => {
        alert('Fournisseurs supprimer');
        this.initFournisseur();
      })
    }
  }

  delete() {
    let exploitation: number[] = [];
    if (this.isAdmin === true) {
      for (const e of this.exploitations) {
        exploitation.push(e.id || 0)
      }
    } else {
      exploitation = [this.exploitation]
    }
    this.fournisseurService.desactiveFournisseurExploitation(this.idFournisseur, exploitation).subscribe({
      next: (data) => {
        alert('Fournisseur supprimer');
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
    this.addToggle = !this.addToggle;
    this.initFournisseur();
  }

  cancel() {
    if (this.idFournisseur === 0) {
      this.toggle = true;
      this.modifToggle = true;
      // this.exploitationToggle = true;
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
          exploitation.push(this.exploitation);
          for (const i of this.exploitations) {
            if (i.selected === true) {
              exploitation.push(i.id ? i.id : 0)
            }
          }
          this.fournisseurService.updateFournisseurExploitation(fournisseur.id, exploitation).subscribe({
            next: () => {
              alert('Fournisseur enregistrer')
              this.modifToggle = !this.modifToggle;
            }
          });
        }
      })
    } else {
      this.fournisseurService.updateFournisseur(this.idFournisseur, this.fournisseur).subscribe((response) => {
        const exploitation: number[] = [];
        exploitation.push(this.exploitation);
        for (const i of this.exploitations) {
          if (i.selected === true) {
            exploitation.push(i.id ? i.id : 0)
          }
        }
        forkJoin({
          fournisseur: this.fournisseurService.getFournisseurById(this.idFournisseur),
          updateExploitationFournisseur: this.fournisseurService.updateFournisseurExploitation(this.idFournisseur, exploitation),
          fournisseurExploitation: this.fournisseurService.getAllExploitationByFournisseur(this.idFournisseur)
        }).subscribe({
          next: (data) => {
            const { fournisseur, updateExploitationFournisseur, fournisseurExploitation } = data;
            this.fournisseur = fournisseur;
            alert('Fournisseur modifier')
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
    console.log(event.target?.checked)
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
    console.log(this.checkContact.length)
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
    // console.log(line)
    this.checkAdress = line;
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
          }
          console.log(adresses)
          this.adresses = adresses;
          this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                if (this.checkAdress) {
                  this.fournisseur.adresse = this.checkAdress;
                  this.fournisseur.adresseId = this.checkAdress.id ? this.checkAdress.id : null;
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

  open(content: TemplateRef<any>) {
    this.articleService.getArticlesByFournisseur(this.idFournisseur).subscribe({
      next: (article) => {
        console.log(article)
        this.articleExclude = [0];
        for (const _article of article) {
          this.articleExclude.push(_article.articleId)
        }
        console.log(this.articleExclude);
        this.articleFournisseurs = article;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult)
            if (this.closeResult == 'Closed with: Save click') {

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

  selectCountry(line: any) {
    if (this.fournisseur.adresse != undefined) {
      this.fournisseur.adresse.pays = line.translations.fr;
      this.flags = line.alpha2Code.toLowerCase() + '.svg';
    } else {
      // this.fournisseur.adresse.pays = line.translations.fr;
      this.flags = 'xx.svg';
    }
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
          alert('Contacts ajouter')
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
          alert('Contacts modifier')
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
            alert('Contacts supprimer')
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
            console.log(this.closeResult)
            if (this.closeResult == 'Closed with: Save click') {
              // this.addUniteConditionnement();
              this.toggleArticle = false;
            }
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult)
            this.toggleArticle = false;
          },
        );
      }
    })
  }

  addUniteConditionnement(content: TemplateRef<any>) {
    console.log(this.conditionnement)
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
        console.log(this.closeResult)
        if (this.closeResult == 'Closed with: Save click') {
          console.log(this.articleFournisseur, this.conditionnement)
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
                  alert('Article fournisseur ajouter')
                }
              })
            }
          });
        } else {
          // alert('annuler')
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)

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
    console.log(_articleFournisseur, _conditionnement)
    this.article = _articleFournisseur.article;
    this.articleFournisseur = _articleFournisseur;
    this.conditionnement = _conditionnement;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-article', backdropClass: 'light-dark-backdrop', centered: true, size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult)
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
          console.log(this.articleFournisseur, this.conditionnement)
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
                    alert('Article fournisseur ajouter')
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
                  alert('Conditionnement ajouter')
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
                  alert('Conditionnement Modifier')
                }
              })
            }
          }
        } else {
          // alert('annuler')
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult)

      },
    );
  }

  addNouveauConditionnement(_articlefournisseur: InterfaceArticlefournisseurs) {
    this.articleFournisseur = _articlefournisseur;
    this.initConditionnement(this.articleFournisseur.article);
    this.articleFournisseur.id = _articlefournisseur.id;
    this.conditionnement.articlefournisseurId = _articlefournisseur.id ? _articlefournisseur.id : 0;
    console.log(this.articleFournisseur, this.conditionnement)
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
                        alert('Article fournisseur supprimer');
                      }
                    })
                  }
                })
              }
            }
          }
        })
        alert('Conditionnement supprimer');
      },
    })
  }
}
