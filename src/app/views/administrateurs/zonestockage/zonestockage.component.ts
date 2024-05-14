import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertModule, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-zonestockage',
  standalone: true,
  imports: [CommonModule, FormsModule,NgbNavModule,NgbDropdownModule,AlertModule,ToasterComponent,ToastComponent,ToastHeaderComponent,ToastBodyComponent],
  templateUrl: './zonestockage.component.html',
  styleUrl: './zonestockage.component.scss'
})
export class ZonestockageComponent implements OnInit{
  ngOnInit(): void {}
}
