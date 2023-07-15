import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {PhoneService} from '../Service/phone.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError:boolean=false;
  constructor(private service:PhoneService,private router: Router) { 
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    this.service.login(username,password).subscribe((response:any)=>{
      console.log('Login successful:', response);
      this.loginError= false;
      this.service.isAuthenticated= true;
      this.router.navigate(['/landing']);
    },
    (error) => {
      this.loginError= true
      console.error('Login failed:', error);
    })

    console.log('Username:', username);
    console.log('Password:', password);
  }
}
