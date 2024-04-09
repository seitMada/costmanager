import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";

import { FournisseurModalComponent } from '../../../modal/fournisseur-modal/fournisseur-modal.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';

import { InterfaceBonCommande } from '../../../shared/model/interface-bonCommande';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { InterfaceAchat } from "../../../shared/model/interface-achats";
import { Achat } from "../../../shared/model/achats";
import { Article } from 'src/app/shared/model/articles';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule, FormsModule,BsDatepickerModule],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss',
  providers:[NgbModalConfig,NgbModal]
})
export class BonCommandeAchatsComponent implements OnInit {

  @ViewChild('contentFournisseur') contentFournisseur: ElementRef;
  

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private commandeService: CommandeService,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private modalService: NgbModal,
    config:NgbModalConfig,
  ) { 
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
    config.backdrop = 'static';
    config.keyboard = false;
  }
  public toggle = true;
  public modifToggle = true;
  // private modalService = inject(NgbModal);
  closeResult = '';
  public showlist = true;
  public bonCommandeForm = FormGroup;
  public modalFournisseur = 'block';
  public showBtnAddArticle = 'none';
  public showBtnAddBC = 'inline-block';
  public showSupprBc ='none';
  public modalArticle = 'none';
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  private today = new Date();
  public dates = {
    today:new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate())
  }
  public fournisseur: any;
  public fournisseurs: any;
  public idFournisseur =0;
  public exploitationId = sessionStorage.getItem('exploitation');
  public centres:any;
  public centre:any;
  public artFournis:any;
  public exploitation:any;
  public achat: InterfaceAchat;
  public article: Article;
  public articles:InterfaceArticle[];
  public articleFournisseur:any;
  public articleFournisseurs:any;
  public articleExploitation:any;
  public articleExploitations:any;
  public achats: Achat;
  public num_commande:string = "COM-"+this.today.toLocaleDateString().replaceAll('/','')+this.today.toLocaleTimeString().replaceAll(':','')+this.today.getMilliseconds();

  public commandes: any;
  public reason:any
  public validateArticleId:any[]=[];
  public artExploitationArticleId:any[]=[];
  public bonCommande: InterfaceBonCommande;

  toggleModal() {
    this.toggle = !this.toggle;
  }

  addToggleModal(){
      this.selectOnFournisseur();
      this.modifToggle = !this.modifToggle;
      this.toggle = (this.toggle === false ? true : false);
      this.modalService.dismissAll();
      this.showBtnAddArticle = 'inline-block'
      this.showBtnAddBC = 'none';
      this.showSupprBc = 'inline-block';
  }

  closeToggleModal() {
    this.modalFournisseur = 'none';
  }

  showListToggle() {
    this.showlist = (this.showlist === false ? true : false);
  }



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

    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next: (exploitation) => {
        this.exploitation = exploitation;
        console.log(this.exploitation);
        this.centres = [];
        this.centreRevenuService.getCrExploitation(this.exploitation.id).subscribe({
          next: (centre) => {
            this.centres = centre;
            console.log(this.centres);
          },
        });
      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    })

    this.commandeService.getAllCommande().subscribe({
      next: (commande) => {
        this.commandes = commande;
        console.log(this.commandes);

      },
      error: (error) => {
        alert('Liste de bon de commande vide');
      }
    })
  }

  cancel() { }

  showFournisseur(fournisseur: any) {
    this.fournisseurs = fournisseur;
  }

  ShowArticleFournisseurByExploitation(){
    const fournisseur =this.fournisseur;
    const exploitationId = Number(this.exploitationId)
    this.commandeService.getArticleExploitation(exploitationId).subscribe({
      next:(artExploitation) =>{
        this.articleExploitations = artExploitation;
        console.log(this.articleExploitations);
        
        for (const i of this.articleExploitations) {
         this.artExploitationArticleId.push(i.articleId);          
        }
        console.log(this.artExploitationArticleId);
        
        this.commandeService.getArticleFournisseurByFournisseurId(this.fournisseur.id,this.artExploitationArticleId).subscribe({
          next:(artFournisseur) =>{
            this.articleFournisseurs = artFournisseur;
            console.log(this.articleFournisseurs);
          }
        });
      }
    });
    
  }
  showCommande(comm: any) {
    this.commandes = comm;
    console.log(this.commandes);
    this.toggleModal();
  }

  addBonCommande(bonCommande?: any) {
    this.commandeService.createBonCommande(bonCommande);
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

  public openModalArticle(content:TemplateRef<any>){
    this.modalService.open(content,{ size: 'xl',ariaDescribedBy:'modal-basic-title'});
    this.ShowArticleFournisseurByExploitation();
    
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

  public onCheckboxChange(articleFournisseurId:number,event:any){
    const isChecked = event.target.checked;
    if (isChecked) {
      this.validateArticleId.push(articleFournisseurId);
    }else{
      const index = this.validateArticleId.indexOf(articleFournisseurId);
      if (index !== -1) {
        this.validateArticleId.splice(index,1);
      }
    }
    
    
  }

  public validatearticle(){
    const articleFournisseurId = this.validateArticleId;
    this.commandeService.getArticleFournisseurById(articleFournisseurId).subscribe(response => {
        console.log(response);
        
    });
  }

}
