import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-employee.component.html'
})
export class EditEmployeeComponent implements OnInit {
  loading = true;
  saving = false;
  errorMessage = '';
  employeeId = '';
  employeeLoaded = false;
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['Male', Validators.required],
      position: ['', Validators.required],
      salary: [1000, [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: ['']
    });
  }

  isInvalid(field: string): boolean {
    const control = this.employeeForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Employee ID not found.';
      this.loading = false;
      return;
    }

    this.employeeId = id;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        if (!employee) {
          this.employeeLoaded = false;
          this.errorMessage = 'Employee not found.';
          this.loading = false;
          return;
        }

        this.employeeLoaded = true;
        this.errorMessage = '';

        this.employeeForm.patchValue({
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          gender: employee.gender,
          position: employee.position,
          salary: employee.salary,
          date_of_joining: employee.date_of_joining?.substring(0, 10),
          department: employee.department,
          employee_photo: employee.employee_photo || ''
        });

        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.employeeLoaded = false;
        this.errorMessage = 'Failed to load employee.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/employees']);
          return;
        }

        this.errorMessage = response.message || 'Failed to update employee.';
        this.saving = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to update employee.';
        this.saving = false;
      }
    });
  }
}