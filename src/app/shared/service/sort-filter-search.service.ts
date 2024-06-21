import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortFilterSearchService {

  constructor() { }
  onSort(data: any[], colonne: any, type: string = 'string', sortDirection: string = 'asc'): any[] {  
    return data.sort((a: any, b: any): any => {
      let aValue = this.getNestedProperty(a, colonne) || '';
      let bValue = this.getNestedProperty(b, colonne) || '';

      if (type === 'numeric') {
        aValue = +aValue;
        bValue = +bValue;
      } else if (type === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue.toString().toUpperCase();
        bValue = bValue.toString().toUpperCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }

  onSearch(data: any[], searchTerm: string, colonne: any = 'libelle'): any[] {
    const value = searchTerm.trim().toLowerCase();
    if (value === '') {
      return data;
    } else {
      return data.filter(item => {
        const value = this.getNestedProperty(item, colonne) || '';
        const normalizedValue = value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalizedValue.includes(searchTerm);
      });
    }
  }

  handleSort(event: any, data: any[], colonne: any, type: string = 'string', originalData: any[]): any[] {
    let sortedData: any[]; 
    switch (event.target.id) {
      case 'fa-sort':
        event.target.id = 'fa-sort-up';
        event.target.className = 'fas fa-sort-up sort-style';
        sortedData = this.onSort(data, colonne, type, 'asc');
        break;
      case 'fa-sort-up':
        event.target.id = 'fa-sort-down';
        event.target.className = 'fas fa-sort-down sort-style';
        sortedData = this.onSort(data, colonne, type, 'desc');
        break;
      case 'fa-sort-down':
        event.target.id = 'fa-sort-up';
        event.target.className = 'fas fa-sort-up sort-style';
        sortedData = this.onSort(data, colonne, type, 'asc');
        break;
      default:
        sortedData = [...data];
        break;
    }
    return sortedData;
  }

  handleSearch(event: any, data: any[], colonne: any , originalData: any[]): any[] {
    const value = (event.target.value).trim().toLowerCase(); 
    return value === ''
      ? [...originalData] 
      : this.onSearch(originalData, value, colonne);

  }

}
