import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Phone } from '../model/phone.model';
import {PhoneService} from '../Service/phone.service';
interface IndexedPhone extends Phone {
  [key: string]: any;
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  phones: Phone[] = [];
  filteredPhones: Phone[]=[];
  filterForm: FormGroup;
  phoneForm: FormGroup;
  isEditing: boolean = false;
  selectedPhone: Phone | null =null;
  sortField: string='s';
  sortDirection: 'asc' | 'desc' ='asc';
  searchPhone: string = '';

  constructor( private formBuilder: FormBuilder, private service:PhoneService)  { 
   
    this.filterForm = this.formBuilder.group({
      brand: [''],
      model: [''],
      colour: ['']
    });
    this.phoneForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      colour: ['', Validators.required],
      price: ['', Validators.required]
    });


   }

  ngOnInit(): void {
    this.service.getPhones().subscribe((response:any)=>{
      if(response){
        console.log('phone from server',response);
        this.phones= response;
        this.filteredPhones=this.phones;
      }else{
        window.alert('Error in getting response');
      }
    })
    // this.filteredPhones = [...this.phones]; 
    this.filterForm.valueChanges.subscribe(value => {
    });
   }
 deletePhone(phone: Phone) {
    const index = this.phones.indexOf(phone);
    if (index !== -1) {
      this.service.deletePhone(this.phones[index].id).subscribe((res:any)=>{
        if(res){
          this.filteredPhones= res;
          this.phones= res;
        }
      })
    }

  }
  addPhone() {
    if (this.phoneForm.invalid) {
      return;
    }

    const newPhone: Phone = {
      id: this.getNextId(),
      ...this.phoneForm.value
    };
    this.service.addPhone(newPhone).subscribe((res:any)=>{
      if(res){
        this.phones= res;
        this.filteredPhones= res;
      }
    })
    this.phoneForm.reset();
  }


  editPhone(phone: Phone) {
    this.isEditing = true;
    this.selectedPhone = { ...phone };
    this.phoneForm.patchValue(this.selectedPhone);
  }

  updatePhone() {

    if (this.phoneForm.invalid) {
      return;
    }

    const updatedPhone = { ...this.selectedPhone, ...this.phoneForm.value };
    console.log('Update phones', updatedPhone);
    const index = this.phones.findIndex(p => p.id === updatedPhone.id);
    if (index !== -1) {
      this.service.updatePhones(updatedPhone,updatedPhone.id).subscribe((res)=>{
        this.phones= res;
        this.filteredPhones= res;
      })      
      this.cancelEdit();
    }
  }


  cancelEdit() {
    this.isEditing = false;
    this.selectedPhone= null;
    this.phoneForm.reset();
  }

  
  private getNextId(): number {
    const ids = this.phones.map(p => p.id);
    return Math.max(...ids) + 1;
  }

  applyFilters() {
    console.log('in apply filter');
    if(this.filterForm.invalid){
      return
    }
    const filterValues = this.filterForm.value;
    this.service.filterPhones(filterValues).subscribe((res)=>{
      this.phones= res;
      this.filteredPhones= res;
    })

  }
  getSortIndicator(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }
  searchPhones(phoneData: string) {
    console.log(phoneData);
    if(phoneData==''){
      // console.log(phoneData);
      this.filteredPhones=[...this.phones];
    }else{
    this.filteredPhones = this.filteredPhones.filter(phone =>
      phone.brand.toLowerCase().includes(phoneData.toLowerCase()) ||
      phone.model.toLowerCase().includes(phoneData.toLowerCase()) ||
      phone.colour.toLowerCase().includes(phoneData.toLowerCase()) ||
      phone.price.toString().includes(phoneData)
    );
  }
}

  
  sortTable(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.service.sortPhones(this.sortField, this.sortDirection).subscribe((res)=>{
      console.log('res in sort table methos ts file',res);
      this.filteredPhones= res;
      this.phones= res;
    })
  }

  
}
