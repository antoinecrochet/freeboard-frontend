import { Routes } from '@angular/router';
import { Timesheet } from './timesheet/timesheet';
import { Home } from './home/home';

// export const routes: Routes = [
//   {
//     path: '',
//     component: Layout,
//     children: [
//       { path: '', component: Home },
//       { path: 'timesheet', component: Timesheet }
//     ]
//   }
// ];
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'timesheet', component: Timesheet },
];