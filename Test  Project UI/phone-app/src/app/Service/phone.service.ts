import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phone } from '../model/phone.model';
@Injectable({
  providedIn: 'root'
})

export class PhoneService {
  private apiUrl = 'http://localhost:3000/api/';
  username='';
  password='';
  isAuthenticated=false;
  constructor(private http: HttpClient) { }


  login(username:any, password:any): Observable<any> {
    const loginUrl = 'http://localhost:3000/api/login'; // Replace with your login API endpoint URL
    const body = { username, password }; // Create the request body
    this.username= username;
    this.password= password;
  
    return this.http.post(loginUrl, body);
  }
  getPhones(): Observable<Phone[]> {
    console.log(this.apiUrl+'phones');
    return this.http.get<Phone[]>(this.apiUrl+'phones');
  }

  addPhone(phone: Phone): Observable<Phone> {
    const username =this.username;
    const password = this.password;
    
    const headers = new HttpHeaders().set('Authorization', `${username} ${password}`);
    console.log(this.apiUrl+'addPhones','req.body is ', phone);
    return this.http.post<Phone>(this.apiUrl+'addPhones', phone,{headers});
  }

  deletePhone(id: number): Observable<Phone | null> {
    const username =this.username;
    const password = this.password;
    
    const headers = new HttpHeaders().set('Authorization', `${username} ${password}`);
    console.log(`${this.apiUrl}deletePhones/${id}`);
    const url = `${this.apiUrl}deletePhones/${id}`;
    return this.http.delete<any>(url,{headers});
  }

  updatePhones(phone:Phone,id:any){
    console.log(this.apiUrl+'updatePhones/'+id,'req.body is',phone);    
    return this.http.put<any>(this.apiUrl+'updatePhones/'+id,phone);
  }
  
  sortPhones(value:any, direction:any){
    console.log('sort method Api is',this.apiUrl+'phones/sort', 'params is', { params: {sortBy:value, sortOrder:direction} });
    return this.http.get<Phone[]>(this.apiUrl+'phones/sort', { params: {sortBy:value, sortOrder:direction} });
  }

  filterPhones(filterValue:any): Observable<Phone[]> {
    console.log('sort method Api is',this.apiUrl+'phones/filter', 'params is', { params: filterValue});
  
    return this.http.get<Phone[]>(this.apiUrl+'phones/filter', { params: filterValue });
  }

}
