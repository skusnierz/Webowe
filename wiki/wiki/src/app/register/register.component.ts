import { UserService } from './../services/user.service';
import { RegisterService } from './../services/register.service';
import { User } from './../auth/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private emailAlreadyExist: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private Users: RegisterService
  ) { }

  onLogout() {
    this.authService.logout();
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      conPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  passwordsMustMatch() {
    return this.form.value.password === this.form.value.conPassword;
  }

  onSubmit() {
    this.formSubmitAttempt = true;
    this.emailAlreadyExist = false;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    if ( !this.passwordsMustMatch()) { return; }
    if ( this.Users.userIsThere(user) ) {
      this.emailAlreadyExist = true;
      return;
    }
    this.userService.addUser(user);
  }

}
