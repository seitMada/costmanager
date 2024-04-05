import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';

import { InterfaceBonCommande } from '../../../shared/model/interface-bonCommande';
import { InterfaceFournisseur } from 'src/app/shared/model/interface-fournisseurs';
import { Fournisseur } from 'src/app/shared/model/fournisseurs';
import { ExploitationService } from 'src/app/shared/service/exploitation.service';
import { CentreRevenuService } from 'src/app/shared/service/centre-revenu.service';
import { InterfaceAchat } from "../../../shared/model/interface-achats";
import { Achat } from "../../../shared/model/achats";
import { Article } from 'src/app/shared/model/articles';
import { InterfaceArticle } from 'src/app/shared/model/interface-articles';
@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss'
})
export class BonCommandeAchatsComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fournisseurService: FournisseurService,
    private commandeService: CommandeService,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
  ) { 
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
  }
  public toggle = true;
  public modifToggle = true;
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

  public bonCommande: InterfaceBonCommande;

  toggleModal() {
    this.toggle = !this.toggle;
  }

  addToggleModal(){
      this.selectOnFournisseur();
      this.modifToggle = !this.modifToggle;
      this.toggle = (this.toggle === false ? true : false);
      this.modalFournisseur = 'none';
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
    this.commandeService.getArticleFournisseurByFournisseurId(this.fournisseur.id,this.exploitationId).subscribe({
      next:(artFournisseur) =>{
        this.articleFournisseurs = artFournisseur;
        console.log(this.articleFournisseurs);
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

  public openModalArticle(){
    this.modalArticle ='block';
    this.ShowArticleFournisseurByExploitation();
  }

  public closeToggleModalArticle(){
    this.modalArticle ='none';
  }
}
