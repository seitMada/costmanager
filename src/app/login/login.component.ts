import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExploitationService } from "../shared/service/exploitation.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    private exploitationService: ExploitationService) { }

  public idExploitation = 0;
  public exploitations: any;

  ngOnInit(): void {
    this.exploitationService.getExploitation().subscribe({
      next: (exploitation) => {
        this.exploitations = exploitation;
        console.log(this.exploitations)
      },
      error: (error) => {
        alert('ERREUR');
      }
    });
  }

  public onLogin() {
    this.router.navigate(['dash'])
  }

  public selectCR() {
    console.log(this.idExploitation);
  }

}
