import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExploitationService } from "../shared/service/exploitation.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private exploitationService: ExploitationService) { }

  ngOnInit(): void {
    this.exploitationService.getExploitation().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        alert('ERREUR');
      }
    });
  }

  public onLogin() {
    this.router.navigate(['dash'])
  }

}
