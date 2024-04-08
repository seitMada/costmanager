import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';

@Component({
  selector: 'app-bon-livraison-achats',
  standalone: true,
  imports: [CommonModule, FormsModule,BsDatepickerModule],
  templateUrl: './bon-livraison-achats.component.html',
  styleUrl: './bon-livraison-achats.component.scss',
  providers:[NgbModalConfig,NgbModal]
})
export class BonLivraisonAchatsComponent implements OnInit{

  @ViewChild('contentFournisseur') contentFournisseur: ElementRef;

 constructor(
  public router: Router,
  public route: ActivatedRoute,
  private fournisseurService: FournisseurService,
  private modalService: NgbModal,
  config:NgbModalConfig,
 ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;
 }

  public fournisseur: any;
  public fournisseurs: any;
  public idFournisseur =0;
  public exploitationId = sessionStorage.getItem('exploitation');
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };
  private today = new Date();
  public dates = {
    today:new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate())
  }
  closeResult = '';

  ngOnInit(): void {
    this.fournisseurService.getAllFournisseur().subscribe({
      next: (fournisseur) => {
        this.fournisseurs = fournisseur;
        this.openModalFournisseur();        
      },
      error: (error) => {
        alert('Liste fournisseur vide')
      }
    });
  }

  showFournisseur(fournisseur: any) {
    this.fournisseurs = fournisseur;
  }

  public openModalFournisseur(){
    const modalRef= this.modalService.open(this.contentFournisseur).result.then(
      (result) =>{
        this.closeResult = 'Closed with: ${result}';
        if (this.closeResult == 'Closed with: Save click') {
          this.showFournisseur(this.fournisseur);
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    
  }

  private getDismissReason(reason:any):string{
    switch(reason){
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  addToggleModal(){
    this.selectOnFournisseur();
    this.modalService.dismissAll();
  }

  public selectOnFournisseur() {

    this.fournisseurService.getOneFournisseur(this.fournisseur).subscribe({
      next: (fournisseur) => {
        this.fournisseur = fournisseur;
        console.log(this.fournisseur);

      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
