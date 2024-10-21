import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { ModalDismissReasons, NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Adress, Adresse } from 'src/app/shared/model/adresse';
import { Exploitation } from 'src/app/shared/model/exploitations';
import { InterfaceAdresse } from 'src/app/shared/model/interface-adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { InterfaceOperateur } from 'src/app/shared/model/interface-operateur';
import { InterfaceOperateurCentreExploitation } from 'src/app/shared/model/interface-operateurcentreexploitation';
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';
import { LieustockageService } from 'src/app/shared/service/lieustockage.service';
import { OperateursService } from 'src/app/shared/service/operateurs.service';
import { ZonestockagesService } from 'src/app/shared/service/zonestockages.service';
import { PAYS } from 'src/assets/pays';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, AlertModule, ToasterComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent implements OnInit {

  public adresse: Adress;
  public adresses: Adresse;
  public centre: InterfaceCentreRevenu;
  public centres: InterfaceCentreRevenu[];
  public exploitation: InterfaceExploitations;
  public exploitations: InterfaceExploitations[];
  public lieuSTockage: InterfaceLieustockages;
  public lieuSTockages: InterfaceLieustockages[];
  public zoneStockage: InterfaceZonestockages;
  public zoneStockages: InterfaceZonestockages[];
  public operateur: InterfaceOperateur;
  public operateurs: InterfaceOperateur[];
  public operateurExploitationCentre: InterfaceOperateurCentreExploitation;
  public operateurExploitationCentres: InterfaceOperateurCentreExploitation[];
  public adresseadd: InterfaceAdresse;

  public exploitationForm = FormGroup;
  public centreForm = FormGroup;

  public active = 1;
  public active_3 = 1;

  closeResult = '';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  private exploitationid = sessionStorage.getItem('exploitation') ? Number(sessionStorage.getItem('exploitation')) : 0;
  private operateurid = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : 0;

  public toggle = true;
  public toggleexploitation = true;
  public modifToggle = true;
  public inputModif = false;
  public addCentre = false;
  public addLieu = false;
  public addExploitation = false;

  public addLieuStockage = false;
  public addZone = false;
  selectedExploitationId: number | null = null;

  public country = PAYS;
  public flags: string = '';

  public exploitationId = 0;
  public centreId = 0;
  public lieuId = 0;
  public zoneId = 0;
  public operateurId = 0;

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
    private exploitationService: ExploitationService,
    private centreService: CentreRevenuService,
    private fournisseurService: FournisseurService,
    private lieustockageService: LieustockageService,
    private zonestockageService: ZonestockagesService,
    private operateurService: OperateursService,
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;
    this.resetCentre();
    this.resetExploitation();
    this.resetLieuStockage();
    this.resetExploitation();
  }

  ngOnInit(): void {
    this.showAllExploitation();
    this.getAllCentreRevenu();
    this.showAllCentreRevenu();
    this.findAllLieuStockage();
    this.showAllOperateur();
    this.showAllZoneStockage();
  }

  /* renitialiser variable */

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
    this.centre = {
      code: '',
      libelle: '',
      exploitationsId: 0,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: new Exploitation(),
      adresses: new Adress(),
      lieuStockage: [],
    }
  }

  public resetLieuStockage() {
    this.lieuSTockage = {
      lieu: '',
      centreId: 0,
      selected: false,
      centre: this.centre,
      zonestockage: this.zoneStockages
    }
  }

  public resetOperateur() {
    this.operateur = {
      nom: '',
      prenom: '',
      email: '',
      mdp: '',
      compteConnecte: false,
      actif: true,
      login_count: 0,
      code: '',
      fournisseurId: null,
      telephone: '',
      civilite: ''
    }
  }

  public resetExploitation() {
    this.adresse = {
      rue: '',
      ville: '',
      code_postal: null,
      pays: '',
      selected: false,
      centreRevenu: [],
      exploitation: [],
      operateur: [],
    }
    this.exploitation = {
      code_couleur: "...",
      libelle: "...",
      nbDecimal: 0,
      commentaire: "...",
      siteWeb: "...",
      codenaf: "...",
      siret: "...",
      logo: "...",
      actif: true,
      adressesId: 0,
      adresses: new Adress(),
      selected: false,
      centreRevenu: []
    }
  }

  public resetZonestockage() {
    this.zoneStockage = {
      zone: '',
      lieuId: 0,
      selected: false,
      lieu: this.lieuSTockage,
    }
  }

  public resetOperateurCentreExploitation() {
    this.operateurExploitationCentre = {
      centreId: 0,
      exploitationId: 0,
      operateurId: 0,

      operateur: this.operateur,
      centre: this.centre,
      exploitation: this.exploitation,
    }
  }

  /* show all data*/

  public showAllExploitation() {
    if (this.isAdmin) {
      this.exploitationService.findAllExploitation().subscribe({
        next: async (_exploitations) => {
          console.log(_exploitations)
          for (const _exploitation of _exploitations) {
            if (_exploitation.adresses === null) {
              _exploitation.adresses = {
                rue: ' ',
                ville: ' ',
                code_postal: ' ',
                pays: ' ',
                selected: false,
                centreRevenu: [],
                exploitation: [],
                operateur: [],
              }
            } else {
              console.log(_exploitation.adresses.pays)
              console.log(this.country)
              console.log(this.country.filter((item: any) => { item.translations.fr === _exploitation.adresses.pays }))
              _exploitation.adresses.flags = this.country.filter((item: any) => { item.translations.fr === _exploitation.adresses.pays })
            }
          }
          this.exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN');
        }
      })
    } else {
      this.exploitationService.getAllExploitationById(this.exploitationid).subscribe({
        next: (_exploitations) => {
          for (const _exploitation of _exploitations) {
            if (_exploitation.adresses === null) {
              _exploitation.adresses = {
                rue: ' ',
                ville: ' ',
                code_postal: ' ',
                pays: ' ',
                selected: false,
                centreRevenu: [],
                exploitation: [],
                operateur: [],
              }
            }
          }
          this.exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN');
        },
      });
    }
  }

  findAllLieuStockage() {
    this.lieustockageService.getAllLieuStockage().subscribe({
      next: (_lieuStockages) => {
        this.lieuSTockages = _lieuStockages;
        this.lieuSTockage = _lieuStockages[0];
        this.zoneStockage = {
          zone: '',
          lieuId: _lieuStockages[0].id ? _lieuStockages[0].id : 0,
          selected: false,
          lieu: _lieuStockages[0],
        }
      },
    })
  }

  getAllCentreRevenu() {
    this.centreService.getAllCentreRevenuWithoutLinks().subscribe({
      next: (_centres) => {
        this.centres = _centres;
        console.log(this.centres);

        this.exploitation = {
          code_couleur: "...",
          libelle: "...",
          nbDecimal: 0,
          commentaire: "...",
          siteWeb: "...",
          codenaf: "...",
          siret: "...",
          logo: "...",
          actif: true,
          adressesId: this.adresse.id ? this.adresse.id : 0,
          adresses: this.adresse,
          selected: false,
          centreRevenu: _centres
        }
      },
    });
  }

  showAllZoneStockage() {
    this.zonestockageService.getAllZoneDeStockage().subscribe({
      next: (_zonestockages) => {
        this.zoneStockages = _zonestockages;
        this.zoneStockage = _zonestockages[0];
        console.log(this.zoneStockages);

      },
    })
  }



  modifZoneStockage() {
    this.inputModif = !this.inputModif;
    this.modifToggle = !this.modifToggle;
  }







  saveLieu() {
    this.zoneId = this.zoneStockage.id ? this.zoneStockage.id : 0;
    this.zoneStockages = [];
    if (this.zoneId == 0) {
      this.lieustockageService.createLieuStockage(this.lieuSTockage, this.zoneStockages).subscribe({
        next: () => {
          this.findAllLieuStockage();
          this.toggleToast('Nouveau lieu de stockage crée avec succès !');
          this.addLieu = (this.addLieu === false ? true : false);
        }
      })
    }
  }

  showOnezoneStockage(zonestockage: InterfaceZonestockages) {
    this.resetZonestockage();
    this.resetLieuStockage();
    this.zoneStockage = zonestockage;
    this.inputModif = true;
    this.toggle = !this.toggle;
    this.lieustockageService.getAllLieuStockage().subscribe({
      next: (_lieuStockages) => {
        this.lieuSTockages = [];
        for (const _lieu of _lieuStockages) {
          if (_lieu.id == zonestockage.lieuId) {
            this.lieuSTockage = {
              lieu: _lieu.lieu,
              centreId: _lieu.centreId,
              selected: false,
              centre: _lieu.centre,
              zonestockage: _lieu.zoneStockage
            }
            this.lieuSTockages.push(this.lieuSTockage);
          }
        }
      },
    })
  }

  addFormLieu() {
    if (this.isAdmin) {
      this.resetLieuStockage();
      this.addLieu = (this.addLieu === false ? true : false);
    }
  }

  deleteZoneStockage() {
    this.zonestockageService.deleteZoneStockage(this.zoneStockage).subscribe({
      next: (value) => {
        this.resetZonestockage();
        this.toggleToast('Ce zone de stocakage a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllZoneStockage();
      },
    });
  }





  toggleModal() {
    if (this.isAdmin) {
      this.toggleexploitation = !this.toggleexploitation;
      this.modifToggle = !this.modifToggle;
      this.resetExploitation();
      this.getAllCentreRevenu();
      this.fournisseurService.getAllAdresse().subscribe({
        next: (adresses) => {
          this.adresses = adresses;
          this.adresse = adresses[0];
        },
      })
    }
  }

  selectCentreRevenu(centre: InterfaceCentreRevenu) {
    this.exploitation.centreRevenu = [];
    this.exploitation.centreRevenu = this.centres.filter(line => line.selected);
    console.log(this.exploitation);

  }

  changeAdress(content: TemplateRef<any>) {
    if (this.modifToggle === false) {
      this.fournisseurService.getAllAdresse().subscribe({
        next: (adresses) => {
          for (const adresse of adresses) {
            if (this.exploitation.adresses) {
              if (adresse.id == this.exploitation.adresses.id) {
                adresse.selected = true;
              } else {
                adresse.selected = false;
              }
            }
            if (this.centre.adresses) {
              if (adresse.id == this.centre.adresses.id) {
                adresse.selected = true;
              } else {
                adresse.selected = false;
              }
            }
          }
          this.adresses = adresses;
          this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdropClass: 'light-dark-backdrop', centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
              console.log(this.closeResult)
              if (this.closeResult == 'Closed with: Save click') {
                if (this.adresse) {
                  if (this.addCentre === false) {
                    this.exploitation.adresses = this.adresse;
                    this.exploitation.adressesId = this.adresse.id ? this.adresse.id : 0;
                  } else {
                    this.centre.adresses = this.adresse;
                    this.centre.adressesId = this.adresse.id ? this.adresse.id : 0;
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

  addFormCentre() {
    if (this.isAdmin) {
      this.resetCentre();
      this.addCentre = (this.addCentre === false ? true : false);
    }
  }

  selectAdress(data: Adress) {
    this.adresse = data;
    this.adresse.id = data.id;
  }

  modifyExploitation() {
    this.inputModif = !this.inputModif;
    this.modifToggle = !this.modifToggle;
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

  updateSelect(data: Adress) {
    this.adresse = data;
  }

  cancelexploitation() {
    this.toggleexploitation = !this.toggleexploitation ? true : false;
    this.resetExploitation();
    this.showAllExploitation();
  }

  cancel() {
    this.modifToggle = true;
    this.exploitations = this.exploitations;
    this.addCentre = false;
    this.centres = [];
    this.resetOperateur();
    this.showAllOperateur();
  }

  submit() {
    if (this.isAdmin) {
      this.exploitationId = this.exploitation.id ? this.exploitation.id : 0;
      if (this.exploitationId == 0) {
        this.exploitation.centreRevenu = this.centres.filter((line: any) => line.selected);
        this.centres = this.exploitation.centreRevenu;
        if (this.exploitation.centreRevenu.length > 0) {
          this.exploitationService.createExploitation(this.exploitation, this.centres).subscribe({
            next: (value) => {
              this.toggleToast('Nouveau exploitation crée avec succès !');
              this.inputModif = !this.inputModif;
              this.modifToggle = true;
            },
          });
        } else {
          alert('Veuiller sélectionner au moins un centre de revenu');
        }
      } else {
        console.log(this.exploitation);

        this.exploitationService.updateExploitation(this.exploitation).subscribe({
          next: (value) => {
            this.toggleToast('Cet exploitation a été modifié avec succès !');
            this.inputModif = !this.inputModif;
            this.modifToggle = true;
          },
        });
      }
    }
  }

  saveCentre() {
    this.lieuSTockages = this.centre.lieuStockage;
    this.centreService.createCentreRevenu(this.centre, this.lieuSTockages).subscribe({
      next: (value) => {
        this.toggleToast('Nouveau centre de revenu crée avec succès !');
        this.addCentre = (this.addCentre === false ? true : false);
        this.getAllCentreRevenu();
      },
    })
  }

  showExploitation(exploitation: InterfaceExploitations) {
    this.resetExploitation();
    this.exploitation = exploitation;
    this.inputModif = true;
    this.toggleexploitation = !this.toggleexploitation;
    for (const _centre of this.exploitation.centreRevenu) {
      this.centre = {
        code: _centre.code,
        libelle: _centre.libelle,
        exploitationsId: _centre.exploitationsId,
        adressesId: _centre.adressesId,
        email: _centre.email,
        telephone: _centre.telephone,
        exploitations: _centre.exploitations,
        selected: true,
        adresses: _centre.adresses,
        lieuStockage: _centre.lieuStockage,
      };
      this.centres.push(this.centre);
    }
  }

  getAllExploitation() {
    this.exploitationService.findAllExploitation().subscribe({
      next: (_exploitations) => {
        console.log(_exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN'))
        this.exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN');
      },
    })
  }

  saveExploitation() {
    if (this.isAdmin) {
      this.centres = [];
      this.exploitationService.createExploitation(this.exploitation, this.centres).subscribe({
        next: (value) => {
          this.getAllExploitation();
          this.toggleToast('Nouveau centre de revenu crée avec succès!');
          this.addExploitation = (this.addExploitation === false ? true : false);
        },
      })
    } else {
      alert('Il est impossible de créer un centre de revenu');
    }

  }

  modifyCentre() {
    this.inputModif = !this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  showAllCentreRevenu() {
    if (this.isAdmin) {
      this.centreService.getcentrerevenu().subscribe({
        next: async (_centres) => {
          this.centres = _centres;
          this.centre = _centres[0];
          console.log(this.centres);

        }
      });
    } else {
      this.centreService.getCrExploitation(this.exploitationid).subscribe({
        next: async (_centres) => {
          this.centres = _centres;
          this.centre = _centres[0]
        }
      });
    }

  }

  deleteCentreRevenu() {
    if (this.isAdmin) {
      this.centreService.deleteCentreRevenu(this.centre).subscribe({
        next: (value) => {
          this.resetCentre();
          this.toggleToast('Ce centre de revenu a été supprimé avec succès!');
          this.toggle = !this.toggle;
          this.showAllCentreRevenu();
        },
      });
    }
  }

  deleteExploitation() {
    if (this.isAdmin) {
      this.exploitationId = this.exploitation.id ? this.exploitation.id : 0;
      if (this.exploitationId == 0) {
        alert('Cet exploitation ne peut pas supprimé');
      } else {
        this.centres = this.exploitation.centreRevenu;
        this.exploitationService.deleteExploitation(this.exploitation).subscribe({
          next: (value) => {
            this.resetExploitation();
            this.toggleToast('Cet exploitation a été supprimé avec succès !');
            this.toggleexploitation = !this.toggleexploitation;
            this.showAllExploitation();
          },
        })
      }
    }
  }

  showCentreRevenu(centreRevenu: InterfaceCentreRevenu) {
    this.resetCentre();
    this.resetExploitation();
    this.resetLieuStockage();
    this.centre = centreRevenu;
    this.centreId = centreRevenu.id ? centreRevenu.id : 0;

    this.exploitationService.getExploitationByCentreId(this.centreId).subscribe({
      next: (_exploitations) => {
        this.exploitations = [];
        this.inputModif = true;
        this.toggle = !this.toggle;
        for (const exploitation of _exploitations) {
          this.exploitation = {
            code_couleur: exploitation.code_couleur,
            libelle: exploitation.libelle,
            nbDecimal: exploitation.nbDecimal,
            commentaire: exploitation.commentaire,
            siteWeb: exploitation.siteWeb,
            codenaf: exploitation.codenaf,
            siret: exploitation.siret,
            logo: exploitation.logo,
            actif: exploitation.actif,
            adressesId: exploitation.adresseId,
            adresses: exploitation.adresses,
            selected: false,
            centreRevenu: exploitation.centreRevenu
          }
          this.exploitations.push(this.exploitation);
        }
        this.lieustockageService.findListLieuStockage(this.centreId).subscribe({
          next: (_lieuStockages) => {
            this.zoneStockages = _lieuStockages;
          }
        })
      },
    })
  }

  findAllLieuStockageWithoutLinks() {
    this.lieustockageService.findAllLieuStockageWithoutLinks().subscribe({
      next: (_lieuStockages) => {
        this.lieuSTockages = _lieuStockages;
      }
    })
  }

  addFormExploitation() {
    if (this.isAdmin) {
      this.resetExploitation();
      this.addExploitation = (this.addExploitation === false ? true : false);
    }
  }

  saveLieuDeStockage() {
    if (this.isAdmin) {
      this.centreId = this.centre.id ? this.centre.id : 0;
      this.zoneStockages = [];
      this.lieustockageService.createLieuStockage(this.lieuSTockage, this.zoneStockages).subscribe({
        next: () => {
          this.findAllLieuStockageWithoutLinks();
          this.toggleToast('Nouveau lieu de stockage crée avec succès !');
          this.addLieuStockage = (this.addLieuStockage === false ? true : false);
        }
      })
    } else {
      alert('Il est impossible de créer un lieu de stockage');
    }
  }

  addFormLieuStockage() {
    if (this.isAdmin) {
      this.resetLieuStockage();
      this.addLieuStockage = (this.addLieuStockage === false ? true : false);
    }
  }

  showAllLieuStockage() {
    this.lieustockageService.getAllLieuStockage().subscribe({
      next: (_lieustocks) => {
        this.lieuSTockages = _lieustocks;
        this.zoneStockage = _lieustocks[0];
      },
    });
  }

  modifLieuStockage() {
    this.inputModif = !this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  showOneLieuStockage(lieustockage: InterfaceLieustockages) {
    this.resetLieuStockage();
    this.resetCentre();
    this.lieuSTockage = lieustockage;

    this.lieuId = this.lieuSTockage.id ? this.lieuSTockage.id : 0;

    this.centreService.getcentrerevenu().subscribe({
      next: (_centres) => {
        this.centres = [];
        this.inputModif = true;
        this.toggle = !this.toggle;
        for (const centre of _centres) {
          if (centre.id == lieustockage.centreId) {
            this.centre = {
              code: centre.code,
              libelle: centre.libelle,
              exploitationsId: centre.exploitationId ? centre.exploitationId : 0,
              adressesId: centre.adresseId ? centre.adresseId : 0,
              email: centre.email,
              telephone: centre.telephone,
              exploitations: centre.exploitation,
              adresses: centre.adresse,
              selected: false,
              lieuStockage: []
            }
            this.centres.push(this.centre);
          }
        }
        this.zonestockageService.getListZoneWithoutLinksByLieuId(this.lieuId).subscribe({
          next: (_zonestockages) => {

            for (const zonestock of _zonestockages) {
              let selected = false;
              this.zoneStockages = [];
              for (const _lieustock of this.lieuSTockage.zonestockage) {
                if (zonestock.id === _lieustock.id) {
                  selected = true;
                }
                this.zoneStockage = {
                  zone: _lieustock.zone,
                  lieuId: _lieustock.lieuId,
                  selected: selected,
                  lieu: this.lieuSTockage,
                }
                this.zoneStockages.push(this.zoneStockage);
              }
            }
          },
        })
      },
    })
  }

  deleteLieuStockage() {
    this.lieustockageService.deleteOneLieuDeStockage(this.lieuSTockage).subscribe({
      next: (value) => {
        this.resetLieuStockage();
        this.toggleToast('Ce lieu de stockage a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllLieuStockage();
      },
    })
  }

  addFormZoneStockage() {
    if (this.isAdmin) {
      this.resetZonestockage();
      this.addZone = (this.addZone === false ? true : false);
    }
  }

  getAllZoneStockageWithoutLinks() {
    this.zonestockageService.getAllZoneStockageWithoutLinks().subscribe({
      next: (_zones) => {
        this.zoneStockages = _zones;
        this.zoneStockage = _zones[0];
      },
    })
  }

  saveZoneDeStockage() {
    this.zonestockageService.createZoneDeStockage(this.zoneStockage).subscribe({
      next: (value) => {
        this.toggleToast('Nouveau zone de stockage crée avec succès !');
        this.addZone = (this.addZone === false ? true : false);
        this.getAllZoneStockageWithoutLinks();
      },
    });
  }

  modifyOperateur() {
    this.inputModif = !this.inputModif;
    this.modifToggle = !this.modifToggle;
  }

  showAllOperateur() {
    if (this.isAdmin) {
      this.operateurService.getAllOperateur().subscribe({
        next: (_operateurs) => {
          this.operateurs = _operateurs;
          this.operateur = _operateurs[0];

        },
      })
    } else {
      this.operateurService.findOperateurById(this.operateurid).subscribe({
        next: (_operateurs) => {
          this.operateurs = _operateurs;
          this.operateur = _operateurs[0];
          console.log(this.operateurs);
        },
      })
    }
  }

  deleteOperateur() {
    this.operateurService.deleteOperateur(this.operateur).subscribe({
      next: (value) => {
        this.resetOperateur();
        this.resetOperateurCentreExploitation();
        this.toggleToast('Cet utilisateur a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllOperateur();
      },
    });
  }

  selectExploitation(exploitation: InterfaceExploitations) {
    this.centres = exploitation.centreRevenu;
  }

  showOperateur(operateur: InterfaceOperateur) {
    this.resetOperateur();
    this.resetOperateurCentreExploitation();
    this.operateur = operateur;
    this.operateurId = operateur.id ? operateur.id : 0;
    this.inputModif = true;
    this.toggle = !this.toggle;
    this.operateurService.findOperateurCentreExploitationByOperateurId(this.operateurId).subscribe({
      next: (_operateur) => {
        this.exploitationService.getExploitation().subscribe({
          next: (_exploitations) => {
            this.exploitations = [];
            for (const _exploitation of _exploitations) {
              if (_exploitation.id == _operateur.exploitationId) {
                this.exploitation = {
                  code_couleur: _exploitation.code_couleur,
                  libelle: _exploitation.libelle,
                  nbDecimal: _exploitation.nbDecimal,
                  commentaire: _exploitation.commentaire,
                  siteWeb: _exploitation.siteWeb,
                  codenaf: _exploitation.codenaf,
                  siret: _exploitation.siret,
                  logo: _exploitation.logo,
                  actif: _exploitation.actif,
                  adressesId: _exploitation.adressesId,
                  adresses: _exploitation.adresse,
                  selected: false,
                  centreRevenu: _exploitation.centreRevenu
                }
                this.exploitations.push(this.exploitation);
              } else {
                this.exploitations = _exploitations;
              }
            }
            this.centreService.getcentrerevenu().subscribe({
              next: (_centres) => {
                this.centres = [];
                for (const _centre of _centres) {
                  if (_centre.id == _operateur.centreId) {
                    this.centre = {
                      code: _centre.code,
                      libelle: _centre.libelle,
                      exploitationsId: _centre.exploitationId,
                      adressesId: _centre.adressesId,
                      email: _centre.email,
                      telephone: _centre.telephone,
                      exploitations: _centre.exploitations,
                      adresses: _centre.adresses,
                      selected: false,
                      lieuStockage: [],
                    }
                    this.centres.push(this.centre);
                  } else {
                    this.centres = _centres;
                  }
                }
              },
            });
          },
        })
      },
    })
  }

  selectCountry(line: any) {
    console.log(line)
    this.exploitation.adresses.pays = line.translations.fr;
    this.exploitation.adresses.flags = line.alpha2Code.toLowerCase() + '.svg';
  }
}
