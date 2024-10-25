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
  public centresexploitations: InterfaceExploitations[];
  public showbtnmodifcentreexploitation: boolean = true;

  public centresrevenusexploitations: InterfaceCentreRevenu[];
  public exploitation: InterfaceExploitations;
  public exploitations: InterfaceExploitations[];

  public lieuStockage: InterfaceLieustockages;
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

  public active = 3;
  public active_3 = 1;

  closeResult = '';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  private exploitationid = sessionStorage.getItem('exploitation') ? Number(sessionStorage.getItem('exploitation')) : 0;
  private operateurid = sessionStorage.getItem('id') ? Number(sessionStorage.getItem('id')) : 0;

  public toggle = true;

  public toggleexploitation: boolean = true;
  public modifToggleExploitation: boolean = false;
  public toggleCentreExploitation: boolean = true;
  public inputModifExploitation: boolean = true;
  public modifcentreexploitation: boolean = false;

  public toggleCentre: boolean = true;
  public modifToggleCentre: boolean = false;
  public toggleExploitationCentre: boolean = true;
  public inputModifCentre: boolean = true;
  public modifExploitationCentre: boolean = false;
  public exploitationselected: number = 0;
  public lieustockagescentrerevenus: InterfaceLieustockages[];
  public lieustockagescentrerevenusselected: number = 0;
  public modifLieustockageCentre: boolean = false;

  public toggleLieu: boolean = true;
  public modifToggleLieu: boolean = false;
  public inputModifLieu: boolean = true;
  public showbtnmodiflieucentre: boolean = true;
  public zonestockageslieustockages: InterfaceZonestockages[];
  public centrerevenulieustockages: InterfaceCentreRevenu[];
  public centrerevenulieustockagesselected: number = 0;
  public inputModifZone: boolean = true;

  public modifToggle: boolean = true;
  public inputModif = false;
  public addCentre = false;
  public addLieu = false;
  public addExploitation = false;

  public addLieuStockage = false;
  public addZone = false;
  selectedExploitationId: number | null = null;

  // public country = PAYS;
  public country = PAYS.sort((a, b) => {
    const nameA = a.translations?.fr?.toLowerCase() || '';
    const nameB = b.translations?.fr?.toLowerCase() || '';

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
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
  }

  ngOnInit(): void {
    this.showAllExploitation();
    this.getAllCentreRevenuWithoutLink();
    this.showAllCentreRevenu();
    this.showAllLieuStockage();
    this.showAllOperateur();
    this.showAllZoneStockage();
  }

  /* renitialiser variable */

  public initializeview() {
    this.toggleexploitation = true;
    this.toggleCentre = true;
    this.toggleLieu = true;
  }

  public truncateWord(word: string, maxLength = 50) {
    if (word.length > maxLength) {
      return word.slice(0, maxLength) + "...";
    }
    return word;
  }

  public getZoneNames(line: any): string {
    return line.zonestockage.map((lines: any) => lines.zone).join(', ');
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



  public resetZonestockage() {
    this.zoneStockage = {
      zone: '',
      lieuId: 0,
      selected: false,
      lieu: this.lieuStockage,
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

  /***********************EXPLOITATION****************************/
  private async resetExploitation() {
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
      code_couleur: "",
      libelle: "",
      nbDecimal: 0,
      commentaire: "...",
      siteWeb: "",
      codenaf: "",
      siret: "",
      logo: "",
      actif: true,
      adressesId: 0,
      adresses: new Adress(),
      selected: false,
      centreRevenu: []
    }
  }

  public async showAllExploitation() {
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
            } else {
              _exploitation.adresses.flags = this.country.filter((item: any) => { item.translations.fr === _exploitation.adresses.pays })
            }
          }
          this.exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN');
        },
      });
    }
  }

  public createExploitations() {
    if (this.isAdmin) {
      this.toggleexploitation = false;
      this.modifToggleExploitation = true;
      this.toggleCentreExploitation = false;
      this.inputModifExploitation = false;
      this.resetExploitation();
      this.getAllCentreRevenuWithoutLink();
    }
  }

  public modifyExploitation() {
    this.inputModifExploitation = false;
    this.modifToggleExploitation = true;
    this.toggleCentreExploitation = false;
    this.modifcentreexploitation = false;
  }

  public listexploitation() {
    this.toggleexploitation = !this.toggleexploitation ? true : false;
    this.modifToggle = false;
    this.inputModifExploitation = true;
    this.resetExploitation();
    this.showAllExploitation();
  }

  public showExploitation(exploitation: InterfaceExploitations) {
    this.resetExploitation();
    this.exploitation = exploitation;
    this.inputModifExploitation = true;
    this.toggleexploitation = !this.toggleexploitation;
    this.modifcentreexploitation = false;
    this.exploitations = this.exploitations.map(_exploitation => ({
      ..._exploitation,
      selected: false
    }));
  }

  listecentrerevenuexploitation(_centrerevenu: any) {
    this.centreService.getcentrerevenu().subscribe({
      next: async (_centres) => {
        _centres.forEach((element: { exploitationsId: any; id: any; }) => {
          const centre = _centrerevenu.find((c: { exploitationsId: number | undefined; id: any; }) => c.id === element.id && (c.exploitationsId === null || c.exploitationsId === this.exploitation.id));
          if (centre) {
            Object.assign(element, { selected: element.exploitationsId ? true : false });
          }
        });
        this.centresrevenusexploitations = _centres;
        this.modifcentreexploitation = !this.modifcentreexploitation;
      }
    });
  }

  savecentreexploitation(_centresrevenusexploitations: any) {
    const _centres = [];
    for (const centre of _centresrevenusexploitations) {
      if (centre.selected === true) {
        _centres.push(centre)
      }
    }
    this.exploitationService.createExploitation(this.exploitation, _centres).subscribe({
      next: async () => {
        this.exploitationService.getAllExploitationById(this.exploitation.id).subscribe({
          next: (_exploitation) => {
            if (_exploitation[0].adresses === undefined) {
              _exploitation[0].adresses = {
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
              // console.log(_exploitation.adresses)
              _exploitation[0].adresses.flags = this.country.filter((item: any) => { item.translations.fr === _exploitation[0].adresses.pays })
            }
            this.exploitation = _exploitation[0];
            this.modifcentreexploitation = false;
            alert('Centre de revenu mis à jour');
          }
        })
      }
    });
  }

  public cancelexploitation() {
    // console.log(this.exploitation.id)
    this.modifToggleExploitation = false;
    this.inputModifExploitation = true;
    this.toggleCentreExploitation = true;
    if (!this.exploitation.id) {
      this.toggleexploitation = !this.toggleexploitation ? true : false;
      this.exploitations = this.exploitations;
      this.addCentre = false;
      // this.centres = [];
      this.resetOperateur();
      this.showAllOperateur();
    }
  }

  public cancelcentreexploitation(_idexploitation: any) {
    this.exploitationService.getAllExploitationById(_idexploitation).subscribe({
      next: (_exploitation) => {
        if (_exploitation[0].adresses === undefined) {
          _exploitation[0].adresses = {
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
          // console.log(_exploitation.adresses)
          _exploitation[0].adresses.flags = this.country.filter((item: any) => { item.translations.fr === _exploitation[0].adresses.pays })
        }
        this.exploitation = _exploitation[0];
        this.modifcentreexploitation = false;
      }
    })
  }

  public getAllExploitation() {
    this.exploitationService.findAllExploitation().subscribe({
      next: (_exploitations) => {
        console.log(_exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN'))
        this.exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf !== 'ADMIN');
      },
    })
  }

  public saveExploitation() {
    if (this.isAdmin) {
      if (!this.exploitation.id) {
        const _centres = this.centresrevenusexploitations.filter(item => item.selected === true);
        this.exploitationService.createExploitation(this.exploitation, _centres).subscribe({
          next: (value) => {
            this.exploitation.id = value;
            this.inputModifExploitation = true;
            this.modifToggleExploitation = false;
            this.toggleCentreExploitation = true;
            alert('Exploitation enregistree');
          }
        })
      } else {
        this.exploitationService.createExploitation(this.exploitation, this.exploitation.centreRevenu).subscribe({
          next: () => {
            this.inputModifExploitation = true;
            this.modifToggleExploitation = false;
            this.toggleCentreExploitation = true;
            alert('Exploitation mis a jour');
          }
        })
      }
    } else {
      alert('');
    }
  }


  public deleteExploitation() {
    if (this.isAdmin) {
      const listexploitationtodelete = [];
      this.exploitations.forEach(_exploitation => {
        if (_exploitation.selected == true) {
          listexploitationtodelete.push(_exploitation.id)
        }
      });
      if (listexploitationtodelete.length == 0 && this.exploitation.id != undefined) {
        listexploitationtodelete.push(this.exploitation.id)
      }
      if (listexploitationtodelete.length > 0) {
        this.exploitationService.deleteExploitation(listexploitationtodelete).subscribe({
          next: () => {
            this.resetExploitation();
            this.toggleexploitation = true;
            this.showAllExploitation();
            alert('Exploitation supprimés');
          }
        })
      }
    }
  }

  /***************************************************************/

  /***********************CENTREREVENU****************************/
  public gerercentrerevenu() {
    this.active = 2;
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
    this.centre = {
      code: '',
      libelle: '',
      exploitationsId: 0,
      adressesId: 0,
      email: '',
      telephone: '',
      exploitations: {
        id: 0,
        code_couleur: "",
        libelle: "",
        nbDecimal: 0,
        commentaire: "...",
        siteWeb: "",
        codenaf: "",
        siret: "",
        logo: "",
        actif: true,
        adressesId: 0,
        adresses: new Adress(),
        centreRevenu: []
      },
      adresses: new Adress(),
      lieuStockage: [],
      id: undefined,
    }
  }

  public selectexploitation(_event: any) {
    this.exploitationselected = _event.target.id.split('-')[1];
    if (this.inputModifCentre === false) {
      // console.log(_event.target.id.split('-')[2])
      this.centre.exploitations.libelle = _event.target.id.split('-')[2];
    }
  }

  public savecentrerevenuexploitation(_centre: InterfaceCentreRevenu, _save: boolean = true) {
    if (_save) {
      console.log(_centre)
      _centre.exploitationsId = this.exploitationselected;
      this.centreService.updateCentreRevenu(_centre, []).subscribe({
        next: (value) => {
          alert('Exploitation de ' + _centre.libelle + ' mis à jour');
          if (this.exploitationselected == 0) {
            value.exploitations = {
              id: 0,
              code_couleur: "",
              libelle: "",
              nbDecimal: 0,
              commentaire: "...",
              siteWeb: "",
              codenaf: "",
              siret: "",
              logo: "",
              actif: true,
              adressesId: 0,
              adresses: new Adress(),
              centreRevenu: []
            }
          }
          this.centre = value;
          this.showbtnmodifcentreexploitation = true;
          this.exploitationselected = 0
        }
      })
    } else {
      this.showbtnmodifcentreexploitation = true;
      this.exploitationselected = 0;
      this.modifToggleCentre = false;
    }
  }

  public async showCentreRevenu(centreRevenu: InterfaceCentreRevenu) {
    this.resetCentre();
    // this.resetExploitation();
    // this.resetLieuStockage();

    this.centre = centreRevenu;
    this.centreId = centreRevenu.id ? centreRevenu.id : 0;

    if (!this.centre.exploitations) {
      this.centre.exploitations = {
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
      }
    }
    this.exploitationService.getExploitation().subscribe({
      next: (_exploitations) => {
        _exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf != 'ADMIN');
        _exploitations.forEach((element: { exploitationsId: any; centreRevenu: any[]; }) => {
          const centre = element.centreRevenu.find((_centre: { id: number | undefined; }) => _centre.id == centreRevenu.id)
          if (centre) {
            Object.assign(element, { selected: true });
          } else {
            Object.assign(element, { selected: false });
          }
        });
        this.centresexploitations = _exploitations;
        this.inputModifCentre = true;
        this.toggleCentre = false;
        this.modifToggleCentre = false;
        this.showbtnmodifcentreexploitation = true;
        this.centres = this.centres.map(_centre => ({
          ..._centre,
          selected: false
        }));
        this.lieustockageService.getAllLieuStockage().subscribe({
          next: (_lieustocks) => {
            this.lieustockagescentrerevenus = _lieustocks.filter((item: { centreId: number | undefined; }) => item.centreId === this.centre.id);
            // console.log(this.lieustockagescentrerevenus)
          },
        });
      },
    })
  }

  public listcentrerevenu() {
    this.toggleCentre = !this.toggleCentre ? true : false;
    this.modifToggleCentre = false;
    this.inputModifCentre = true;
    this.resetCentre();
    this.showAllCentreRevenu();
  }

  public listelieustockagecentrerevenu(_lieustockages: any) {
    this.lieustockageService.getAllLieuStockage().subscribe({
      next: (_lieustocks) => {
        _lieustocks.forEach((element: { selected: boolean; centreId: number | undefined; }) => {
          if (element.centreId === this.centre.id) {
            element.selected = true;
          }
        });
        this.lieustockagescentrerevenus = _lieustocks;
        this.modifLieustockageCentre = true;
        // console.log(this.lieustockagescentrerevenus)
      },
    });
  }

  public savecentrelieustockage() {
    const _lieu = this.lieustockagescentrerevenus.filter(item => item.selected === true);
    this.centreService.updateCentreRevenu(this.centre, _lieu).subscribe({
      next: async (value) => {
        await this.showCentreRevenu(value);
        alert('Lieu de stockage mis à jour');
        this.modifLieustockageCentre = false;
      }
    })
  }

  public cancelcentrelieustockage() {
    this.lieustockageService.getAllLieuStockage().subscribe({
      next: (_lieustocks) => {
        this.lieustockagescentrerevenus = _lieustocks.filter((item: { centreId: number | undefined; }) => item.centreId === this.centre.id);
        this.modifLieustockageCentre = false;
      },
    });
    // this.lieustockagescentrerevenus = _lieustockages;
    // this.modifLieustockageCentre = false;
  }

  public createCentrerevenu() {
    if (this.isAdmin) {
      this.toggleCentre = false;
      this.modifToggleCentre = false;
      this.showbtnmodifcentreexploitation = false;
      this.inputModifCentre = false;
      this.resetCentre();
      this.exploitationService.getExploitation().subscribe({
        next: (_exploitations) => {
          _exploitations = _exploitations.filter((item: { codenaf: string; }) => item.codenaf != 'ADMIN');
          this.centresexploitations = _exploitations;
        }
      })
    }
  }

  public showAllCentreRevenu() {
    if (this.isAdmin) {
      this.centreService.getcentrerevenu().subscribe({
        next: async (_centres) => {
          this.centres = _centres;
        }
      });
    } else {
      this.centreService.getCrExploitation(this.exploitationid).subscribe({
        next: async (_centres) => {
          this.centres = _centres;
        }
      });
    }
  }

  public savecentrerevenu() {
    if (this.isAdmin) {
      if (this.centre.id) { // MODIFIER CENTRE REVENU
        this.centreService.updateCentreRevenu(this.centre, []).subscribe({
          next: async (value) => {
            await this.showCentreRevenu(value);
            this.exploitationselected = 0;
            alert('Centre de revenu modifié !');
            this.inputModifCentre = true;
            this.modifToggleCentre = false;
            this.showbtnmodifcentreexploitation = true;
          }
        })
      } else { // CREER CENTRE REVENU
        this.centreService.createCentreRevenu(this.centre, []).subscribe({
          next: async (_centre) => {
            _centre.exploitationsId = this.exploitationselected;
            this.centreService.updateCentreRevenu(_centre, []).subscribe({
              next: async (value) => {
                if (this.exploitationselected == 0) {
                  value.exploitations = {
                    id: 0,
                    code_couleur: "",
                    libelle: "",
                    nbDecimal: 0,
                    commentaire: "...",
                    siteWeb: "",
                    codenaf: "",
                    siret: "",
                    logo: "",
                    actif: true,
                    adressesId: 0,
                    adresses: new Adress(),
                    centreRevenu: []
                  }
                }
                await this.showCentreRevenu(value);
                this.exploitationselected = 0;
                alert('Nouveau centre de revenu crée avec succès !');
                this.inputModifCentre = true;
                this.modifToggleCentre = false;
                this.showbtnmodifcentreexploitation = true;
              }
            })
          },
        });
      }
    }
  }

  public async cancelcentrerevenu(_idcentre: any, _centre: InterfaceCentreRevenu) {
    if (!_idcentre) {
      if (this.isAdmin) {
        this.centreService.getcentrerevenu().subscribe({
          next: async (_centres) => {
            this.centres = _centres;
            this.toggleCentre = true;
            this.modifToggleCentre = true;
            this.showbtnmodifcentreexploitation = true;
            this.inputModifCentre = true;
          }
        });
      } else {
        this.centreService.getCrExploitation(this.exploitationid).subscribe({
          next: async (_centres) => {
            this.centres = _centres;
            this.toggleCentre = true;
            this.modifToggleCentre = true;
            this.showbtnmodifcentreexploitation = true;
            this.inputModifCentre = true;
          }
        });
      }
    } else {
      await this.showCentreRevenu(_centre);
    }
  }

  public modifyCentre() {
    this.toggleCentre = false;
    this.modifToggleCentre = false;
    this.showbtnmodifcentreexploitation = true;
    this.inputModifCentre = false;
  }

  public deletecentrerevenu() {
    // console.log(this.centres)
    if (this.isAdmin) {
      const listcentrerevenutodelete = [];
      this.centres.forEach(_centre => {
        if (_centre.selected === true) {
          listcentrerevenutodelete.push(_centre.id)
        }
      });
      if (listcentrerevenutodelete.length === 0 && this.centre.id != undefined) {
        listcentrerevenutodelete.push(this.centre.id)
      }
      if (listcentrerevenutodelete.length > 0) {
        // console.log(listcentrerevenutodelete)
        this.centreService.deleteCentreRevenu(listcentrerevenutodelete).subscribe({
          next: () => {
            this.resetCentre();
            alert('Centre de revenu supprimé');
            this.toggleCentre = true;
            this.showAllCentreRevenu();
          }
        })
      }
    }
  }
  /***************************************************************/

  /*********************LIEU DE STOCKAGE**************************/

  // public findAllLieuStockage() {
  //   this.lieustockageService.getAllLieuStockage().subscribe({
  //     next: (_lieuStockages) => {
  //       this.lieuSTockages = _lieuStockages;
  //       // this.lieuStockage = _lieuStockages[0];
  //       // this.zoneStockage = {
  //       //   zone: '',
  //       //   lieuId: _lieuStockages[0].id ? _lieuStockages[0].id : 0,
  //       //   selected: false,
  //       //   lieu: _lieuStockages[0],
  //       // }
  //     },
  //   })
  // }

  public resetLieuStockage() {
    this.lieuStockage = {
      lieu: '',
      centreId: 0,
      selected: false,
      centre: {
        code: '',
        libelle: '',
        exploitationsId: 0,
        adressesId: 0,
        email: '',
        telephone: '',
        exploitations: new Exploitation(),
        adresses: new Adress(),
        selected: false,
        lieuStockage: []
      },
      zonestockage: [],
      id: undefined
    }
  }

  public async showOneLieuStockage(lieustockage: InterfaceLieustockages) {
    this.resetLieuStockage();
    // this.resetCentre();
    this.lieuStockage = lieustockage;

    this.lieuId = this.lieuStockage.id ? this.lieuStockage.id : 0;

    this.inputModifLieu = true;
    this.toggleLieu = false;
    this.modifToggleLieu = false;
    this.showbtnmodiflieucentre = true;

    if (!this.lieuStockage.centre) {
      this.lieuStockage.centre = {
        code: '',
        libelle: '',
        exploitationsId: 0,
        adressesId: 0,
        email: '',
        telephone: '',
        exploitations: new Exploitation(),
        adresses: new Adress(),
        selected: false,
        lieuStockage: []
      }
    }

    this.zonestockageslieustockages = lieustockage.zonestockage;

    this.lieuSTockages = this.lieuSTockages.map(_lieu => ({
      ..._lieu,
      selected: false
    }));

    this.centreService.getcentrerevenu().subscribe({
      next: (_centre) => {
        if (this.isAdmin) {
          this.centrerevenulieustockages = _centre;
        } else {
          this.centrerevenulieustockages = _centre.filter((item: { exploitationsId: number; }) => item.exploitationsId === this.exploitationId);
        }
      }
    })
    // this.centreService.getcentrerevenu().subscribe({
    //   next: (_centres) => {
    //     this.centres = [];
    //     this.inputModif = true;
    //     this.toggle = !this.toggle;
    //     for (const centre of _centres) {
    //       if (centre.id == lieustockage.centreId) {
    //         this.centre = {
    //           code: centre.code,
    //           libelle: centre.libelle,
    //           exploitationsId: centre.exploitationId ? centre.exploitationId : 0,
    //           adressesId: centre.adresseId ? centre.adresseId : 0,
    //           email: centre.email,
    //           telephone: centre.telephone,
    //           exploitations: centre.exploitation,
    //           adresses: centre.adresse,
    //           selected: false,
    //           lieuStockage: []
    //         }
    //         this.centres.push(this.centre);
    //       }
    //     }
    //     this.zonestockageService.getListZoneWithoutLinksByLieuId(this.lieuId).subscribe({
    //       next: (_zonestockages) => {

    //         for (const zonestock of _zonestockages) {
    //           let selected = false;
    //           this.zoneStockages = [];
    //           for (const _lieustock of this.lieuStockage.zonestockage) {
    //             if (zonestock.id === _lieustock.id) {
    //               selected = true;
    //             }
    //             this.zoneStockage = {
    //               zone: _lieustock.zone,
    //               lieuId: _lieustock.lieuId,
    //               selected: selected,
    //               lieu: this.lieuStockage,
    //             }
    //             this.zoneStockages.push(this.zoneStockage);
    //           }
    //         }
    //       },
    //     })
    //   },
    // })
  }

  public showAllLieuStockage() {
    // this.resetLieuStockage();
    if (this.isAdmin) {
      this.lieustockageService.getAllLieuStockage().subscribe({
        next: (_lieustocks) => {
          this.lieuSTockages = _lieustocks;
        },
      });
    } else {
      this.lieustockageService.findListLieuStockageByExploitation(this.exploitationId).subscribe({
        next: (_lieustocks) => {
          this.lieuSTockages = _lieustocks;
        },
      })
    }
  }

  public modifyLieuStockage() {
    this.toggleLieu = false;
    this.modifToggleLieu = false;
    this.showbtnmodiflieucentre = true;
    this.inputModifLieu = false;
    this.zonestockageService.getAllZoneDeStockage().subscribe({
      next: (_zonestockages) => {
        _zonestockages = _zonestockages.filter((item: { lieuId: number; }) => item.lieuId == 0 || item.lieuId === this.lieuStockage.id);
        _zonestockages.forEach((element: { lieuId: number | undefined; }) => {
          if (element.lieuId === this.lieuStockage.id) {
            Object.assign(element, { selected: true });
          } else {
            Object.assign(element, { selected: false });
          }
        });
        this.zonestockageslieustockages = _zonestockages;
      }
    })
  }

  public listLieuStockage() {
    this.toggleLieu = !this.toggleLieu ? true : false;
    this.modifToggleLieu = false;
    this.inputModifLieu = true;
    this.resetLieuStockage();
    this.showAllLieuStockage();
  }

  public createLieuStockage() {
    if (this.isAdmin) {
      this.toggleLieu = false;
      this.modifToggleLieu = false;
      this.showbtnmodiflieucentre = false;
      this.inputModifLieu = false;
      this.resetLieuStockage();
      this.zonestockageService.getAllZoneDeStockage().subscribe({
        next: (_zonestockages) => {
          this.zonestockageslieustockages = _zonestockages.filter((item: { lieuId: number; }) => item.lieuId == 0);
        }
      })
    }
  }

  public selectcentrerevenulieu(_event: any) {
    this.centrerevenulieustockagesselected = _event.target.id.split('-')[1];
    if (this.inputModifLieu === false) {
      // console.log(_event.target.id.split('-')[2])
      // this.centre.exploitations.libelle = _event.target.id.split('-')[2];
    }
  }

  public saveLieuDeStockage() {
    if (this.isAdmin) {
      if (this.lieuStockage.id) { /// MODIFIER LIEU DE STOCKAGE
        const _zonestockages = this.zonestockageslieustockages.filter(item => item.selected === true);
        this.lieustockageService.updateLieuDeStockage(this.lieuStockage, _zonestockages).subscribe({
          next: async (value) => {
            await this.showOneLieuStockage(value);
            alert('Lieu de stockage mis à jour');
          }
        })
      } else { /// CREER LIEU DE STOCKAGE
        const _zonestockages = this.zonestockageslieustockages.filter(item => item.selected === true);
        this.lieuStockage.centreId = this.centrerevenulieustockagesselected;
        // console.log(this.lieuStockage, _zonestockages)
        this.lieustockageService.createLieuStockage(this.lieuStockage, _zonestockages).subscribe({
          next: async (value) => {
            await this.showOneLieuStockage(value);
            this.centrerevenulieustockagesselected = 0;
            alert('Lieu de stockage ajouté');
          }
        })
      }
    } else {
      alert('Il est impossible de créer un lieu de stockage');
    }
  }

  public savelieucentrerevenu(_lieu: InterfaceLieustockages, _save: boolean = true) {
    if (_save) {
      console.log(_lieu)
      _lieu.centreId = this.centrerevenulieustockagesselected;
      this.lieustockageService.updateLieuDeStockage(_lieu, []).subscribe({
        next: async (value) => {
          await this.showOneLieuStockage(value);
          alert('Centre revenu de ' + _lieu.lieu + ' mis à jour');
          this.centrerevenulieustockagesselected = 0;
        }
      })
    } else {
      this.showbtnmodiflieucentre = true;
      this.centrerevenulieustockagesselected = 0;
      this.modifToggleLieu = false;
    }
  }

  public async cancelLieuDeStockage(_lieu: InterfaceLieustockages) {
    if (_lieu.id === undefined) {
      if (this.isAdmin) {
        this.lieustockageService.getAllLieuStockage().subscribe({
          next: (_lieustocks) => {
            this.lieuSTockages = _lieustocks;
            this.toggleLieu = true;
            this.modifToggleLieu = true;
            this.showbtnmodiflieucentre = true;
            this.inputModifLieu = true;
          },
        });
      } else {
        this.lieustockageService.findListLieuStockageByExploitation(this.exploitationId).subscribe({
          next: (_lieustocks) => {
            this.lieuSTockages = _lieustocks;
            this.toggleLieu = true;
            this.modifToggleLieu = true;
            this.showbtnmodiflieucentre = true;
            this.inputModifLieu = true;
          },
        })
      }
    } else {
      await this.showOneLieuStockage(_lieu);
    }
  }

  public deleteLieuStockage() {
    if (this.isAdmin) {
      const listlieustockagetodelete = [];
      this.lieuSTockages.forEach(_lieu => {
        if (_lieu.selected === true) {
          listlieustockagetodelete.push(_lieu.id)
        }
      });
      if (listlieustockagetodelete.length === 0 && this.lieuStockage.id != undefined) {
        listlieustockagetodelete.push(this.lieuStockage.id)
      }
      if (listlieustockagetodelete.length > 0) {
        this.lieustockageService.deleteOneLieuDeStockage(listlieustockagetodelete).subscribe({
          next: (value) => {
            this.resetLieuStockage();
            alert('Lieu de stockage supprimé');
            this.toggleLieu = true;
            this.showAllLieuStockage();
          },
        })
      }
    }
  }

  public listezonestockageforlieustockage(_lieuStockage: any) {

  }

  public savezonelieustockage() {

  }

  public cancelzonelieustockage() {

  }

  /***************************************************************/


  getAllCentreRevenuWithoutLink() {
    this.centreService.getAllCentreRevenuWithoutLinks().subscribe({
      next: (_centres) => {
        // this.centres = _centres;
        this.centresrevenusexploitations = _centres;
        // console.log(this.centres);
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
      this.lieustockageService.createLieuStockage(this.lieuStockage, this.zoneStockages).subscribe({
        next: () => {
          this.showAllLieuStockage();
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
            this.lieuStockage = {
              lieu: _lieu.lieu,
              centreId: _lieu.centreId,
              selected: false,
              centre: _lieu.centre,
              zonestockage: _lieu.zoneStockage
            }
            this.lieuSTockages.push(this.lieuStockage);
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


  // submit() {
  //   if (this.isAdmin) {
  //     this.exploitationId = this.exploitation.id ? this.exploitation.id : 0;
  //     if (this.exploitationId == 0) {
  //       this.exploitation.centreRevenu = this.centres.filter((line: any) => line.selected);
  //       this.centres = this.exploitation.centreRevenu;
  //       if (this.exploitation.centreRevenu.length > 0) {
  //         this.exploitationService.createExploitation(this.exploitation, this.centres).subscribe({
  //           next: (value) => {
  //             this.toggleToast('Nouveau exploitation crée avec succès !');
  //             this.inputModif = !this.inputModif;
  //             this.modifToggle = true;
  //           },
  //         });
  //       } else {
  //         alert('Veuiller sélectionner au moins un centre de revenu');
  //       }
  //     } else {
  //       console.log(this.exploitation);

  //       this.exploitationService.updateExploitation(this.exploitation).subscribe({
  //         next: (value) => {
  //           this.toggleToast('Cet exploitation a été modifié avec succès !');
  //           this.inputModif = !this.inputModif;
  //           this.modifToggle = true;
  //         },
  //       });
  //     }
  //   }
  // }

  saveCentre() {
    this.lieuSTockages = this.centre.lieuStockage;
    this.centreService.createCentreRevenu(this.centre, this.lieuSTockages).subscribe({
      next: (value) => {
        this.toggleToast('Nouveau centre de revenu crée avec succès !');
        this.addCentre = (this.addCentre === false ? true : false);
        this.getAllCentreRevenuWithoutLink();
      },
    })
  }

  // deleteCentreRevenu() {
  //   if (this.isAdmin) {
  //     this.centreService.deleteCentreRevenu(this.centre).subscribe({
  //       next: (value) => {
  //         this.resetCentre();
  //         this.toggleToast('Ce centre de revenu a été supprimé avec succès!');
  //         this.toggle = !this.toggle;
  //         this.showAllCentreRevenu();
  //       },
  //     });
  //   }
  // }




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



  addFormLieuStockage() {
    if (this.isAdmin) {
      this.resetLieuStockage();
      this.addLieuStockage = (this.addLieuStockage === false ? true : false);
    }
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
