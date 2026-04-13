import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loading = false;
  errorMessage = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const usernameOrEmail = this.loginForm.value['usernameOrEmail'] ?? '';
    const password = this.loginForm.value['password'] ?? '';

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          this.authService.saveToken(response.token);
          window.location.href = '/employees';
          return;
        }

        this.errorMessage = response.message || 'Login failed.';
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Login failed.';
        this.loading = false;
      }
    });
  }
}