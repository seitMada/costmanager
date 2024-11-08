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
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public choiceexp: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private loginService: LoginService,
    formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: ["", Validators.required, Validators.email],
      mdp: ["", Validators.required, Validators.minLength(5)],


    });
  }



  public operateurData: InterfaceOperateur = {
    id: 0,
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
  };


  public exploitations: any;
  public centreRevenus: any;
  public isLoggedIn: boolean;


  ngOnInit(): void {


  }

  public onLogin(form: NgForm) {




    if (this.operateurData.exploitationId) {
      sessionStorage.setItem('exploitation', String(this.operateurData.exploitationId));
      sessionStorage.setItem('id', String(this.operateurData.id));
      sessionStorage.setItem('admin', (this.operateurData.code === '0000' ? '1' : '0'));
      this.router.navigate(['dash']);
    } else {
      alert('Veuillez selectionner une exploitation.')
    }
  }


  public selectCR() {
    this.centreRevenus = [];
    this.centreRevenuService.getCrExploitation(this.operateurData.exploitationId ? this.operateurData.exploitationId : 0).subscribe({
      next: (centreRevenu) => {
        this.centreRevenus = centreRevenu;
      },
      error: (error) => {
        alert('ERREUR CR');
      }
    })
  }

  public goback() {
    this.choiceexp = false;
  }

  public chooselogin() {
    this.loginService.auth(this.operateurData).subscribe(
      (response: any) => {
        this.operateurData = response.operateur;
        if (response.code == '0000') {
          this.exploitationService.getExploitation().subscribe({
            next: (exploitation) => {
              this.choiceexp = false;

              this.operateurData.exploitationId = exploitation.filter((obj: { codenaf: string; }) => obj.codenaf === "ADMIN").map((obj: { id: any; }) => obj.id).join(',');
              sessionStorage.setItem('exploitation', String(this.operateurData.exploitationId));
              sessionStorage.setItem('id', String(this.operateurData.id));
              sessionStorage.setItem('admin', (this.operateurData.code === '0000' ? '1' : '0'));
              this.router.navigate(['dash']);
            },
            error: (error) => {
              alert('ERREUR EXP');
            }
          });
        } else {
          this.exploitationService.getExploitation().subscribe({
            next: (exploitation) => {


              this.exploitations = exploitation.filter((obj1: { id: any; }) =>
                response.operateur.operateurscentreexploitation.some((obj2: { exploitationId: any; }) => obj1.id === obj2.exploitationId)
              );
              this.choiceexp = true;
            },
            error: (error) => {
              alert('ERREUR EXP');
            }
          });
        }
      }
    )
  }

}
