import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private readonly userService: UserService, private readonly router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      rememberMe: new FormControl<boolean>(false),
    });
  }

  loginWithGoogle() {
    this.userService.signInWithGoogle().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  loginWithGithub() {
    this.userService.signInWithGitHub().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  loginWithApple() {
    this.userService.signInWithApple().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
