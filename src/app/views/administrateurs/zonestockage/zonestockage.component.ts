import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceCentreRevenu } from 'src/app/shared/model/interface-centrerevenu';
import { InterfaceLieustockages } from 'src/app/shared/model/interface-lieustockages';
import { InterfaceZonestockages } from 'src/app/shared/model/interface-zonestockages';
import { LieustockageService } from 'src/app/shared/service/lieustockage.service';
import { ZonestockagesService } from 'src/app/shared/service/zonestockages.service';

@Component({
  selector: 'app-zonestockage',
  standalone: true,
  imports: [CommonModule, FormsModule,NgbNavModule,NgbDropdownModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './zonestockage.component.html',
  styleUrl: './zonestockage.component.scss'
})
export class ZonestockageComponent implements OnInit{

  public centre:InterfaceCentreRevenu;
  public centres:InterfaceCentreRevenu[];
  public lieustockage:InterfaceLieustockages;
  public lieustockages:InterfaceLieustockages[];
  public zonestockage: InterfaceZonestockages;
  public zonestockages:InterfaceZonestockages[];

  public lieuForm: FormGroup;
  public zoneStockageForm: FormGroup;

  closeResult = '';

  private isAdmin = sessionStorage.getItem('admin') === '0' ? false : true;
  public zoneId = 0;

  public toggle = true;
  public modifToggle = true;
  public inputModif = false;
  public addLieu = false;

  public active_2 = 1;

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
    public lieustockageService : LieustockageService,
    public zonestockageService: ZonestockagesService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop =  'static';
    config.keyboard = false;
    this.resetLieuStockage();
    this.resetZonestockage();
  }
  ngOnInit(): void {
    this.showAllZoneStockage();
  }

  public resetLieuStockage(){
    this.lieustockage = {
      lieu : '',
      centreId:0,
      selected:false,
      centre:this.centre,
      zonestockage:[]
    }
  }

  public resetZonestockage(){
    this.zonestockage = {
      zone:'',
      lieuId: 0,
      selected: false,
      lieu: this.lieustockage,
    }
  }

  showAllZoneStockage(){
    this.zonestockageService.getAllZoneDeStockage().subscribe({
      next:(_zonestockages) =>{
        this.zonestockages = _zonestockages;
        this.zonestockage =_zonestockages[0];
        console.log(this.zonestockages);
        
      },
    })
  }

  findAllLieuStockage(){
    this.lieustockageService.getAllLieuStockage().subscribe({
      next:(_lieuStockages) =>{
        this.lieustockages = _lieuStockages;
        this.lieustockage = _lieuStockages[0];
        this.zonestockage = {
          zone: '',
          lieuId: _lieuStockages[0].id ? _lieuStockages[0].id:0,
          selected: false,
          lieu: _lieuStockages[0],
        }
      },
    })
  }

  showOnezoneStockage(zonestockage:InterfaceZonestockages){
    this.resetZonestockage();
    this.resetLieuStockage();
    this.zonestockage = zonestockage;
    this.inputModif = true;
    this.toggle = !this.toggle;
    this.lieustockageService.getAllLieuStockage().subscribe({
      next:(_lieuStockages) =>{
        this.lieustockages = [];
        for (const _lieu of _lieuStockages) {
          let selected = false;
          if (_lieu.id == zonestockage.lieuId) {
            selected =true;
          }
          this.lieustockage = {
            lieu : _lieu.lieu,
            centreId: _lieu.centreId,
            selected:selected,
            centre: _lieu.centre,
            zonestockage:_lieu.zoneStockage
          }
          this.lieustockages.push(this.lieustockage);
        }
      },
    })
  }

  saveLieu(){
    this.zoneId = this.zonestockage.id ? this.zonestockage.id : 0;
   this.zonestockages = [];
   if (this.zoneId == 0) {
    this.lieustockageService.createLieuStockage(this.lieustockage,this.zonestockages).subscribe({
      next:() =>{
        this.findAllLieuStockage();
        this.toggleToast('Nouveau lieu de stockage crée avec succès !');
        this.addLieu = (this.addLieu === false ? true:false);
      }
    })
   }
  }

  addFormLieu(){
    this.resetLieuStockage();
    this.addLieu = (this.addLieu === false ? true:false);
  }

  submit(){
    this.zoneId = this.zonestockage.id ? this.zonestockage.id : 0;
    if (this.zoneId == 0) {
      const lieuStockagesSelect = this.lieustockages.filter(line =>line.selected);
      if (lieuStockagesSelect.length >0) {
        for(const _lieu of lieuStockagesSelect){
          this.zonestockage.lieu = _lieu;
          this.zonestockage.lieuId = _lieu.id?_lieu.id:0;
          this.zonestockageService.createZoneDeStockage(this.zonestockage).subscribe({
            next:(value) =>{
              this.toggleToast('Nouveau zone de stockage crée avec succès !');
              this.inputModif = !this.inputModif;
              this.modifToggle = true;
            },
          });
        }
      } else {
        alert('Veuillez sélectionner un lieu de stockage');
      }
    } else {
      const lieuStockagesSelect = this.lieustockages.filter(line =>line.selected);
      if (lieuStockagesSelect.length >0) {
        for(const _lieu of lieuStockagesSelect){
          this.zonestockage.lieu = _lieu;
          this.zonestockage.lieuId = _lieu.id?_lieu.id:0;
          this.zonestockageService.updateZoneDeStockage(this.zonestockage).subscribe({
            next:(value) =>{
              this.toggleToast('Zone de stockage modifié avec succès !');
              this.inputModif = !this.inputModif;
              this.modifToggle = true;
            },
          });
        }
      } else {
        alert('Veuillez sélectionner un lieu de stockage');
      }
    }
  }


  cancel(){
    this.modifToggle = true;
    this.toggle = !this.toggle;
    this.inputModif = (this.inputModif === false ? true:false);
    this.addLieu = false;
    this.resetLieuStockage();
    this.showAllZoneStockage();
  }

  modifZoneStockage(){
    this.inputModif =!this.inputModif;
    this.modifToggle = !this.modifToggle;
  }


  toggleModal(){
    this.resetZonestockage();
    this.modifToggle = !this.modifToggle;
    this.inputModif = false;
    this.toggle = !this.toggle;
    this.findAllLieuStockage();
  }

  deleteZoneStockage(){
    this.zonestockageService.deleteZoneStockage(this.zonestockage).subscribe({
      next:(value) =>{
        this.resetZonestockage();
        this.toggleToast('Ce zone de stocakage a été supprimé avec succès!');
        this.toggle = !this.toggle;
        this.showAllZoneStockage();
      },
    });
  }


}
