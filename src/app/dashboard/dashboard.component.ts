import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Employee } from './employee.model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  formValue!: FormGroup;
  employeeModalObj: Employee = new Employee();
  employeeList!: any;
  empId!: number;

  showAdd!: boolean;
  showUpdate!: boolean;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.formValue = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      salary: new FormControl(null, [Validators.required]),
    });

    this.getEmployeesList();
    this.onAE();
  }
  onAE() {
    this.showAdd = true;
    this.showUpdate = false;
  }
  postData() {
    this.employeeModalObj.firstName = this.formValue.value.firstName;
    this.employeeModalObj.lastName = this.formValue.value.lastName;
    this.employeeModalObj.email = this.formValue.value.email;
    this.employeeModalObj.phone = this.formValue.value.phone;
    this.employeeModalObj.salary = this.formValue.value.salary;

    return this.api.postEmployee(this.employeeModalObj).subscribe(
      (res) => {
        console.log(res);
        alert('Data Added sucssesFully');

        this.formValue.reset(); //resets the form

        let cancel = document.getElementById('cancel');
        cancel?.click(); //closes form

        this.getEmployeesList(); //updates the table
      },
      (err) => {
        alert('something went Wrong');
        console.log(err);
      }
    );
  }

  getEmployeesList() {
    this.api.getEmployees().subscribe((res) => {
      this.employeeList = res;
    });
  }

  deleteEmp(row: any) {
    this.api.deleteEmployee(row.id).subscribe((res) => {
      alert('Employee ' + row.firstName + ' is deleted');
      this.getEmployeesList();
    });
  }

  onEdit(row: any) {
    this.empId = row.id;
    
    this.showAdd = false;
    this.showUpdate = true;

    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phone'].setValue(row.phone);
    this.formValue.controls['salary'].setValue(row.salary);
  }
  updateEmployees() {
   
    this.employeeModalObj.firstName = this.formValue.value.firstName;
    this.employeeModalObj.lastName = this.formValue.value.lastName;
    this.employeeModalObj.email = this.formValue.value.email;
    this.employeeModalObj.phone = this.formValue.value.phone;
    this.employeeModalObj.salary = this.formValue.value.salary;
    this.employeeModalObj.id = this.empId;
    this.api
      .updateEmployee(this.employeeModalObj, this.employeeModalObj.id)
      .subscribe((res) => {
        alert('updated Sucssessfully');
        this.formValue.reset();

        let cancel = document.getElementById('cancel');
        cancel?.click(); //closes form

        this.getEmployeesList(); //updates the table
      });
    this.employeeModalObj.id = 0;
  }
}
