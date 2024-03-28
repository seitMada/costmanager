import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from "../../../shared/service/fournisseur.service";
import { CommandeService } from "../../../shared/service/commande.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterfaceBonCommande } from '../../../shared/model/interface-bonCommande';

@Component({
  selector: 'app-bon-commande-achats',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './bon-commande-achats.component.html',
  styleUrl: './bon-commande-achats.component.scss'
})
export class BonCommandeAchatsComponent implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fournisseurService:FournisseurService,
    private commandeService : CommandeService,
  ){}
  public toggle = true;
  public modifToggle = true;
  public showlist = true;

  public bonCommande: InterfaceBonCommande;

  toggleModal() {
    this.toggle = !this.toggle;
  }

  addToggleModal(){
    this.modifToggle = !this.modifToggle;
    this.toggle = (this.toggle === false ? true : false);
  }

  showListToggle(){
    this.showlist = (this.showlist === false ? true : false);
  }

  public fournisseur: any;
  public fournisseurs: any;

  public commande: any;
  public commandes: any;

  ngOnInit():void{
    this.fournisseurService.getAllFournisseur().subscribe({
      next:(founisseur) =>{
        this.fournisseurs = founisseur;
        console.log(this.fournisseurs);
      },
      error:(error) =>{
        alert('Liste fournisseur vide')
      }
    });

    this.commandeService.getAllCommande().subscribe({
      next:(commande)=>{
        this.commandes = commande;
        console.log(this.commandes);
        
      },
      error:(error) =>{
        alert('Liste de bon de commande vide');
      }
    })
  }

  cancel(){}

  showFournisseur(fournisseur:any){
    this.fournisseurs = fournisseur;
    console.log(this.fournisseurs);   
  }

  showCommande(comm:any){
    this.commandes = comm;
    console.log(this.commandes);
    this.toggleModal();
  }

  addBonCommande(bonCommande?:any){
    this.commandeService.createBonCommande(bonCommande);
  }
  
 
}
