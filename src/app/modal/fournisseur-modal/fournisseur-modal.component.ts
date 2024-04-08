import { Component,Input,OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FournisseurService } from 'src/app/shared/service/fournisseur.service';

@Component({
  selector: 'app-fournisseur-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './fournisseur-modal.component.html',
  styleUrl: './fournisseur-modal.component.scss'
})
export class FournisseurModalComponent {
  @Input() title: string;
  @Input() fournisseurs: any;
  @Input() fournisseur:any;
  @ViewChild('contentFournisseur') contentFournisseur:any;
 

  constructor(
    public modal: NgbActiveModal,
  ){ }

 
}
