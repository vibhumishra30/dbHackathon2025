import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ClrFormsModule, ClrIconModule } from '@clr/angular';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ClrFormsModule, ReactiveFormsModule, ClrIconModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm: FormGroup;
  public error = '';
  public isSignUpMode = false;

  constructor(private readonly userService: UserService, private readonly router: Router) {
    this.loginForm = new FormGroup({
      name: new FormControl(''),
      contactNumber: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  toggleMode(): void {
    this.isSignUpMode = !this.isSignUpMode;
    this.error = '';
  }

  submit(): void {
    const { email, password, name, contactNumber } = this.loginForm.value;

    if (this.isSignUpMode) {
      this.userService.signup({ email, password, name, contactNumber }).subscribe({
        next: (response: string) => {
          if (response === 'User registered successfully!') {
            this.router.navigate(['/finance-guru']);
          } else {
            this.error = 'User already registered';
          }
        },
        error: () => {
          this.error = 'Something went wrong. Please try again.';
        },
      });
    } else {
      this.userService.login(email, password).subscribe({
        next: (response: string) => {
          if (response === 'Login successful!') {
            this.router.navigate(['/finance-guru']);
          } else {
            this.error = 'Invalid email or password';
          }
        },
        error: () => {
          this.error = 'Something went wrong. Please try again.';
        },
      });
    }
  }
}