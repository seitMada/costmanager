import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InterfaceInventaires } from '../../../shared/model/interface-inventaires';
import { InventairesService } from '../../../shared/service/inventaires.service';

@Component({
  selector: 'app-inventaires',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule],
  templateUrl: './inventaires.component.html',
  styleUrl: './inventaires.component.scss'
})
export class InventairesComponent {
  
  public bsConfig: { containerClass: string; locale: string; dateInputFormat: string; };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private inventaireService: InventairesService,
    private datePipe: DatePipe,
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', locale: 'fr', dateInputFormat: 'DD/MM/YYYY' });
  }

  
  private today = new Date();
  public dates = {
    debut: this.formatDate(new Date(this.today.getFullYear(), this.today.getMonth() - 1, this.today.getDate())),
    fin: this.formatDate(this.today, true)
  }


  ngOnInit(): void {
    console.log(this.dates.debut, this.dates.fin)
    this.inventaireService.getInventaireByCrAndDate(6, this.dates.debut, this.dates.fin).subscribe({
      next: (_inventaires) => {
        console.log(_inventaires)
      }
    })
  }

  
  
  formatDate(date: Date, fin: boolean = false) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (fin == true) {
      return `${year}-${month}-${day} 23:59:59`;
    }
    return `${year}-${month}-${day} 00:00:00`;
    // return this.datePipe.transform(date, format);
  }

}
