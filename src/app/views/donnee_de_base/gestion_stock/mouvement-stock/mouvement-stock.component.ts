import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, TooltipModule } from '@coreui/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Adress } from 'src/app/shared/model/adresse';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceExploitations } from 'src/app/shared/model/interface-exploitations';
import { ArticleService } from 'src/app/shared/service/article.service';
import { InventairesService } from 'src/app/shared/service/inventaires.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { PdfserviceService } from 'src/app/shared/service/pdfservice.service';
import { ZonestockagesService } from 'src/app/shared/service/zonestockages.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mouvement-stock',
  standalone: true,
  imports: [CommonModule, NgbNavModule, FormsModule, BsDatepickerModule, AlertModule, TooltipModule, TooltipModule, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent],
  templateUrl: './mouvement-stock.component.html',
  styleUrl: './mouvement-stock.component.scss'
})
export class MouvementStockComponent implements OnInit {

  public centrerevenusdefault: InterfaceCentreRevenu[];
  public centrerevenus: InterfaceCentreRevenu[];
  public centrerevenu: InterfaceCentreRevenu;
  public exploitations: InterfaceExploitations[];
  public exploitation: InterfaceExploitations;
  public centrerevenusselected: number[];
  public exploitationsselected: number[];

  public mouvemenstock: {
    article_id: number,
    libelle: string,
    unite: string,
    inventaires: number,
    inventairesfinal: number,
    cout: number,
    pertes: number,
    achats: number,
    ventes: number,
    stock_theorique: number,
    stock_reel: number,
    stock_initiale: number
  }[];
  public mouvemenstockback: {
    article_id: number,
    libelle: string,
    unite: string,
    inventaires: number,
    inventairesfinal: number,
    cout: number,
    pertes: number,
    achats: number,
    ventes: number,
    stock_theorique: number,
    stock_reel: number,
    stock_initiale: number
  }[];

  public periode: { debut: Date, fin: Date }[] = []
  public periodeselected: { debut: Date, fin: Date };

  position = 'top-end';
  visible = false;
  active = 1;
  percentage = 0;
  public message = '';
  public color = 'success';
  public textcolor = 'text-light';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  public toggle: boolean = true;
  public contentinventaire: any;
  public modifToggle: any;
  public inventaire: any;
  public addToggle: any;
  public isvalorisation: boolean = false;
  public isfinperiode: boolean = false;

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public idexploitation = +(sessionStorage.getItem('exploitation') || 3);
  public idoperateur = +(sessionStorage.getItem('id') || 3);
  public idcentrerevenu: number = 0;
  private today = new Date();
  public dates = {
    debut: new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate()),
    fin: this.today,
  }
  public sorticon = 'fa-sort';
  public unitefilter: any[] = [];
  public headerchoice = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private centrerevenuService: CentreRevenuService,
    private exploitationService: ExploitationService,
    private zonelieuService: ZonestockagesService,
    private articleService: ArticleService,
    private inventaireService: InventairesService,
    private datePipe: DatePipe,
    private pdfService: PdfserviceService
  ) {
    this.headerchoice = '';
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    this.resetCentreRevenu();
    this.exploitations = [];

    this.centrerevenuService.getCrExploitation(this.idexploitation).subscribe({
      next: async (_centreRevenu) => {
        this.headerchoice = '';
        this.centrerevenus = _centreRevenu;
        this.centrerevenusdefault = _centreRevenu;
        this.centrerevenu = _centreRevenu[0];
        await this.selectCentreRevenus(this.centrerevenu);

        this.exploitationService.getExploitation().subscribe({
          next: async (_exploitation) => {
            this.exploitations = _exploitation;
            if (this.isAdmin === true) {
              this.exploitations = this.exploitations.filter(e => e.id !== this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId !== this.idexploitation);
            } else {
              this.exploitations = this.exploitations.filter(e => e.id == this.idexploitation);
              this.centrerevenus = this.centrerevenus.filter(c => c.exploitationsId == this.idexploitation);
            }
            // this.exploitationsdefault = _exploitation;
            this.exploitations[0].selected = true;
            this.exploitationsselected = [this.exploitations[0].id || 0];
            this.headerchoice = this.exploitations[0].libelle;
            this.exploitation = this.exploitations[0];
            // await this.selectExploitations(this.exploitation);
            this.inventaireService.getPeriode(this.exploitationsselected, true).subscribe({
              next: (value: any) => {
                this.periode = value;
                for (const _date of this.periode) {
                  if (_date.fin == null) {
                    _date.fin = new Date();
                  }
                }
                console.log(this.periode)
                if (this.periode.length > 0) {
                  const _index = this.periode.length - 1;
                  const _periode = this.periode[_index]
                  this.periodeselected = this.periode[_index];
                  if (this.periodeselected.fin == null) {
                    this.periodeselected.fin = new Date();
                  }
                  const _dateFin = new Date(this.periodeselected.fin);
                  _dateFin.setDate(_dateFin.getDate() - 1);
                  console.log(this.exploitations[0])
                  this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.periodeselected.debut)), fin: this.formatDate(new Date(_dateFin)), final: this.formatDate(new Date(this.periodeselected.fin)) }, this.exploitationsselected, true).subscribe({
                    next: (_articles: any) => {
                      this.mouvemenstock = _articles;
                      this.mouvemenstockback = _articles;
                      this.unitefilter = [];
                      this.dates.debut = new Date(_periode.debut);
                      this.dates.fin = new Date(_periode.fin ? _periode.fin : new Date());
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  }

  ngOnInit(): void {
    
  }

  selectPeriode(_periode: { debut: Date, fin: Date }) {
    this.periodeselected = _periode;
    this.dates.debut = new Date(this.periodeselected.debut);
    this.dates.fin = new Date(this.periodeselected.fin);
  }

  open() {
    this.toggle = !this.toggle;
  }

  validate() {
    this.headerchoice = '';
    this.toggle = true;
    this.exploitationsselected = [];
    this.centrerevenusselected = [];
    for (const _exploitation of this.exploitations) {
      if (_exploitation.selected === true) {
        this.exploitationsselected.push(_exploitation.id || 0);
        this.headerchoice += _exploitation.libelle + ', ';
      }
    }
    for (const _centrerevenu of this.centrerevenus) {
      if (_centrerevenu.selected === true) {
        this.centrerevenusselected.push(_centrerevenu.id || 0);
        this.headerchoice += _centrerevenu.libelle + ', ';
      }
    }
    this.headerchoice.substring(0, this.headerchoice.length - 2);

    const _dateFin = new Date(this.periodeselected.fin);
    _dateFin.setDate(_dateFin.getDate() - 1);
    this.articleService.getMouvementStock({ debut: this.formatDate(new Date(this.periodeselected.debut)), fin: this.formatDate(new Date(_dateFin)), final: this.formatDate(new Date(this.periodeselected.fin)) }, this.exploitationsselected.length > 0 ? this.exploitationsselected : this.centrerevenusselected, this.exploitationsselected.length > 0).subscribe({
      next: (_articles: any) => {
        this.mouvemenstock = _articles;
        this.mouvemenstockback = _articles;
        this.unitefilter = [];
        this.dates.debut = new Date(this.periodeselected.debut);
        this.dates.fin = new Date(this.periodeselected.fin ? this.periodeselected.fin : new Date());
        for (const unite of _articles) {
          this.unitefilter.push(unite.unite);
        }
        this.isfinperiode = true;
        this.unitefilter = this.removeDuplicates(this.unitefilter);
      }
    })
  }

  screenDate(date: Date | string, format: string = 'dd/MM/yyyy') {
    return this.datePipe.transform(date, format);
  }

  private formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // console.log(`${year}-${month}-${day} 00:00:00`)
    return `${year}-${month}-${day}`;
  }

  private removeDuplicates<T>(array: T[]): T[] {
    const uniqueSet = new Set(array);
    return Array.from(uniqueSet);
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

  initialise() {
    for (const _exploitation of this.exploitations) {
      _exploitation.selected = false;
    }
    for (const _centrerevenu of this.centrerevenus) {
      _centrerevenu.selected = false;
    }
  }

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

  submit() {
    throw new Error('Method not implemented.');
  }
  cancel() {
    throw new Error('Method not implemented.');
  }


  async selectCentreRevenus(_centrerevenu: InterfaceCentreRevenu) {
    this.centrerevenu = _centrerevenu;
    this.idcentrerevenu = _centrerevenu.id ? _centrerevenu.id : 0;
  }

  tri(event: any, colonne: any, type: string = 'string') {
    // console.log(this.mouvemenstock['libelle'])
    switch (event.target.id) {
      case 'fa-sort':
        event.target.id = 'fa-sort-up';
        event.target.className = 'fas fa-sort-up col-1 m-auto';
        this.mouvemenstock = this.mouvemenstock.sort((a: any, b: any): any => {
          if (type === 'numeric') {
            if (+a[colonne] > +b[colonne]) {
              return 1;
            }
            if (+a[colonne] < +b[colonne]) {
              return -1;
            }
          } else if (type === 'string') {
            if (a[colonne].toUpperCase() > b[colonne].toUpperCase()) {
              return 1;
            }
            if (a[colonne].toUpperCase() < b[colonne].toUpperCase()) {
              return -1;
            }
          } else if (type === 'date') {
            if (new Date(a[colonne]) > new Date(b[colonne])) {
              return 1;
            }
            if (new Date(a[colonne]) < new Date(b[colonne])) {
              return -1;
            }
          }
        })
        break;
      case 'fa-sort-up':
        event.target.id = 'fa-sort-down';
        event.target.className = 'fas fa-sort-down col-1 m-auto';
        this.mouvemenstock = this.mouvemenstock.sort((a: any, b: any): any => {
          if (type === 'numeric') {
            if (+a[colonne] < +b[colonne]) {
              return 1;
            }
            if (+a[colonne] > +b[colonne]) {
              return -1;
            }
          } else if (type === 'string') {
            if (a[colonne].toUpperCase() < b[colonne].toUpperCase()) {
              return 1;
            }
            if (a[colonne].toUpperCase() > b[colonne].toUpperCase()) {
              return -1;
            }
          } else if (type === 'date') {
            if (new Date(a[colonne]) < new Date(b[colonne])) {
              return 1;
            }
            if (new Date(a[colonne]) > new Date(b[colonne])) {
              return -1;
            }
          }
        })
        break;
      case 'fa-sort-down':
        event.target.id = 'fa-sort';
        event.target.className = 'fas fa-sort col-1 m-auto';
        this.mouvemenstock = this.mouvemenstockback;
        break;

      default:
        break;
    }
  }

  search(event: any, colonne: any = 'libelle') {
    const value = (event.target.value).toLowerCase();
    console.log(value)
    if (value === '') {
      this.mouvemenstock = this.mouvemenstockback;
    } else {
      // this.searchCode = '';
      const search: any[] = [];
      this.mouvemenstockback.forEach((element: any): any => {
        const rpl = element[colonne].replace(new RegExp(/[èéêë]/g), 'e');
        const rpl_o = rpl.replace(new RegExp(/[öô]/g), 'o');
        const rpl_a = rpl_o.replace(new RegExp(/[àâä@]/g), 'a');
        const str = rpl_a.toLowerCase();
        if (str.search(value) !== -1) {
          search.push(element);
        }
        this.mouvemenstock = search;
      });
    }
  }

  showvalorisation() {
    this.isvalorisation = !this.isvalorisation;
  }

  delete() {
    throw new Error('Method not implemented.');
  }
  deletes() {
    throw new Error('Method not implemented.');
  }
  openInventaire(arg0: any) {
    throw new Error('Method not implemented.');
  }
  modifToggleModal() {
    throw new Error('Method not implemented.');
  }
  toggleModal() {
    throw new Error('Method not implemented.');
  }
  validInventaire() {
    throw new Error('Method not implemented.');
  }

}
