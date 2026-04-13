import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees(): Observable<any[]> {
    return this.apollo.watchQuery({
      query: gql`
        query GetEmployees {
          employees {
            success
            message
            employees {
              _id
              first_name
              last_name
              email
              gender
              position
              department
              salary
              date_of_joining
              employee_photo
            }
          }
        }
      `,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result?.data?.employees?.employees || [])
    );
  }

  getEmployeeById(id: string): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query GetEmployeeById($id: ID!) {
          employee(id: $id) {
            success
            message
            employee {
              _id
              first_name
              last_name
              email
              gender
              position
              designation
              department
              salary
              date_of_joining
              employee_photo
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result?.data?.employee?.employee)
    );
  }

  searchEmployees(position: string, department: string): Observable<any[]> {
    return this.apollo.watchQuery({
      query: gql`
        query SearchEmployees($position: String, $department: String) {
          searchEmployees(position: $position, department: $department) {
            success
            message
            employees {
              _id
              first_name
              last_name
              email
              gender
              position
              department
              salary
              date_of_joining
              employee_photo
            }
          }
        }
      `,
      variables: {
        position: position || null,
        department: department || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result?.data?.searchEmployees?.employees || [])
    );
  }

  addEmployee(input: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee($input: EmployeeInput!) {
          addEmployee(input: $input) {
            success
            message
            employee {
              _id
              first_name
              last_name
            }
          }
        }
      `,
      variables: { input }
    }).pipe(
      map((result: any) => result.data.addEmployee)
    );
  }

  updateEmployee(id: string, input: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee($eid: ID!, $input: EmployeeUpdateInput!) {
          updateEmployeeByEid(eid: $eid, input: $input) {
            success
            message
            employee {
              _id
              first_name
              last_name
            }
          }
        }
      `,
      variables: {
        eid: id,
        input
      }
    }).pipe(
      map((result: any) => result.data.updateEmployeeByEid)
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($eid: ID!) {
          deleteEmployeeByEid(eid: $eid) {
            success
            message
            employee {
              _id
            }
          }
        }
      `,
      variables: { eid: id }
    }).pipe(
      map((result: any) => result.data.deleteEmployeeByEid)
    );
  }
}