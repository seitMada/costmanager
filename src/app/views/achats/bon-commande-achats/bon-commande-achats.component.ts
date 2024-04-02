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
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
  ){}
  public toggle = true;
  public modifToggle = true;
  public showlist = true;
  public bonCommandeForm = FormGroup;
  public modalFournisseur = 'none';

  public fournisseur: InterfaceFournisseur;
  public fournisseurs: Fournisseur;
  public idFournisseur =0;
  public exploitationId = sessionStorage.getItem('exploitation');
  public centres:any;
  public centre:any;
  public exploitation:any;

// public achat = InterfaceA

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
  }

  closeToggleModal(){
    this.modalFournisseur = 'none';
  }

  showListToggle(){
    this.showlist = (this.showlist === false ? true : false);
  }

  

  ngOnInit():void{
    this.fournisseurService.getAllFournisseur().subscribe({
      next:(fournisseur) =>{
        this.fournisseurs = fournisseur;
        console.log(this.fournisseurs);
      },
      error:(error) =>{
        alert('Liste fournisseur vide')
      }
    });

    this.exploitationService.getExploitationById(this.exploitationId).subscribe({
      next:(exploitation)=>{
        this.exploitation = exploitation;
        console.log(this.exploitation);
        this.centres = [];
        this.centreRevenuService.getCrExploitation(this.exploitation.id).subscribe({
          next:(centre)=>{
            this.centres = centre;
            console.log(this.centres);
          },
        });
      },
      error:(error) =>{
        alert('Liste de bon de commande vide');
      }
    })

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

  openModalFournisseur(){
    this.modalFournisseur = 'block';
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

  addBonCommande(bonCommande:any){
    this.commandeService.createBonCommande(bonCommande);
  }
  
 public selectOnFournisseur(){
  
  this.fournisseurService.getOneFournisseur(this.fournisseur).subscribe({
    next:(fournisseur) =>{
      this.fournisseur = fournisseur;
      console.log(this.fournisseur);
      
    },
    error:(error) => {
      console.log(error);
    }
  })
 }
}
