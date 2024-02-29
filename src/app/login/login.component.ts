import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  constructor(public router: Router,
    public route: ActivatedRoute,) { }

  ngOnInit(): void {
  }

  public onLogin() {
    this.router.navigate(['dash'])
  }

}
