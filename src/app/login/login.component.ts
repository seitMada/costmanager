import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExploitationService } from "../shared/service/exploitation.service";
import { CentreRevenuService } from "../shared/service/centre-revenu.service";
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InterfaceOperateur } from "../shared/model/interface-operateur";
import { LoginService } from "../shared/service/login.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  public loginForm:FormGroup;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private loginService: LoginService,
    formBuilder:FormBuilder
  ) { 
    this.loginForm = formBuilder.group({
      email:["", Validators.required,Validators.email],
      mdp: ["", Validators.required,Validators.minLength(5)],
      exploitationId: ["", Validators.required],
      // centreId: ["", Validators.required]
    });
  }

  

  public operateurData: InterfaceOperateur= {
    id:0,
    nom: '',
    prenom: '',
    email: '',
    mdp:  '',
    compteConnecte: false,
    actif: true,
    login_count: 0,
    code: '',
    adresseId: 0,
    contactId: 0,
    exploitationId:     0,
    centreId:           0
  };

  
  public exploitations: any;
  public centreRevenus: any;
  public isLoggedIn:boolean;


  ngOnInit(): void {

    this.exploitationService.getExploitation().subscribe({
      next: (exploitation) => {
        this.exploitations = exploitation;
      },
      error: (error) => {
        alert('ERREUR EXP');
      }
    });
  }

  public onLogin(form:NgForm) {    
    this.loginService.auth(this.operateurData);
  }

  
  public selectCR() {
    this.centreRevenus = [];
    this.centreRevenuService.getCrExploitation(this.operateurData.exploitationId).subscribe({
      next: (centreRevenu) => {
        this.centreRevenus = centreRevenu;
      },
      error: (error) => {
        alert('ERREUR CR');
      }
    })
  }

}
