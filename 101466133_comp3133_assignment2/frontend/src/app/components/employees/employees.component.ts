import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  errorMessage = '';

  searchPosition = '';
  searchDepartment = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load employees.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchPosition.trim() && !this.searchDepartment.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.employeeService.searchEmployees(this.searchPosition.trim(), this.searchDepartment.trim()).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Search failed.';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchPosition = '';
    this.searchDepartment = '';
    this.loadEmployees();
  }

  deleteEmployee(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadEmployees();
          return;
        }
        alert(response.message || 'Delete failed.');
      },
      error: (error) => {
        console.error(error);
        alert('Delete failed.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}