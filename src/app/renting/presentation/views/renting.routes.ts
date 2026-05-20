import { Routes } from '@angular/router';

//const courseList = () => import('./course-list/course-list').then((m) => m.CourseList);
//const courseForm = () => import('./course-form/course-form').then((m) => m.CourseForm);
const vehicleList = () => import('./vehicle-list/vehicle-list').then((m) => m.VehicleList);
const vehicleForm = () => import('./vehicle-form/vehicle-form').then((m) => m.VehicleForm);

export const rentingRoutes: Routes = [
  //{ path: 'courses', loadComponent: courseList },
  //{ path: 'courses/new', loadComponent: courseForm },
 // { path: 'courses/edit/:id', loadComponent: courseForm },
  { path: 'vehicles', loadComponent: vehicleList },
  { path: 'vehicles/new', loadComponent: vehicleForm },
  { path: 'vehicles/edit/:id', loadComponent: vehicleForm },
];
