import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExploitationService } from "../shared/service/exploitation.service";
import { CentreRevenuService } from "../shared/service/centre-revenu.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InterfaceOperateur } from "../shared/model/interfaceOperateur";
import { LoginService } from "../shared/service/login.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private exploitationService: ExploitationService,
    private centreRevenuService: CentreRevenuService,
    private loginService: LoginService) { }

  public operateurData: InterfaceOperateur = {
    id:                 0,
    nom:                '',
    prenom:             '',
    email:              '',
    mdp:                '',
    connecter:          0,
    actif:              0,
    loginError:         0,
    exploitationId:     0,
    centreId:           0
  }

  // public idExploitation = 0;
  // public idCR = 0;
  public exploitations: any;
  public centreRevenus: any;

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

  public onLogin() {
    // this.router.navigate(['dash'])
    console.log(this.operateurData.exploitationId,this.operateurData.centreId,this.operateurData.email,this.operateurData.mdp);
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
