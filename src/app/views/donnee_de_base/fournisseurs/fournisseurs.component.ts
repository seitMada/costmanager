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

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule],
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
    public articleService: ArticleService
  ) { }

  public toggle = true;
  public addToggle = true;
  public modifToggle = true;
  public modifContactToggle = false;
  public addToggleOperateur = false;

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
  public articles: Article;

  public articleExclude: number[] = [];
  public checkContact: number[] = [];
  public checkAdress: InterfaceAdresse;

  public idFournisseur = 0;
  active = 1;
  private modalService = inject(NgbModal);
  closeResult = '';

  public exploitation = +(sessionStorage.getItem('exploitation') || 3);

  ngOnInit(): void {
    this.resetFournisseur();
    this.initFournisseur();
    this.initOperateur();
  }

  public initFournisseur() {
    forkJoin({
      fournisseurs: this.fournisseurService.getAllFournisseurByExploitation(this.exploitation),
      exploitations: this.exploitationService.getExploitation()
    }).subscribe({
      next: (data) => {
        const { fournisseurs, exploitations } = data;
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
        this.exploitations = exploitations;
      }
    })
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

  }

  delete() {

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

  }

  submit() {
    if (this.idFournisseur === 0) {
      this.fournisseurService.addFournisseur(this.fournisseur).subscribe({
        next: (fournisseur: any) => {
          this.fournisseur = fournisseur;
          this.idFournisseur = fournisseur.id;
          const exploitation: number[] = [];
          exploitation.push(3)
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
        this.articleExclude = [];
        for (const _article of article) {
          this.articleExclude.push(_article.id)
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
          }
        })
        alert('Contacts supprimer')
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
        console.log(article)
        this.articles = article;
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

  addUniteConditionnement(content: TemplateRef<any>) {

  }
}
