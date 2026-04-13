import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const username = this.signupForm.value['username'] ?? '';
    const email = this.signupForm.value['email'] ?? '';
    const password = this.signupForm.value['password'] ?? '';

    this.authService.signup(username, email, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Signup successful. You can log in now.';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 1200);
          return;
        }

        this.errorMessage = response.message || 'Signup failed.';
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Signup failed.';
        this.loading = false;
      }
    });
  }
}