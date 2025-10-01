import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format } from 'date-fns';

interface TimeSheetResponse {
  id: number;
  day: string;
  hours: number;
}

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './timesheet.html',
  styleUrls: ['./timesheet.scss']
})
export class Timesheet {
  currentMonth: Date = new Date();
  weeks: any[] = [];
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMonth();
  }

  changeMonth(offset: number) {
    this.currentMonth = addMonths(this.currentMonth, offset);
    this.loadMonth();
  }

  loadMonth() {
    const from = format(startOfMonth(this.currentMonth), 'yyyy-MM-dd');
    const to = format(endOfMonth(this.currentMonth), 'yyyy-MM-dd');
    this.http.get<{ timesheets: TimeSheetResponse[] }>(`/api/timesheets?from=${from}&to=${to}`)
      .subscribe(res => this.buildWeeks(res.timesheets));
  }

  buildWeeks(entries: TimeSheetResponse[]) {
    const start = startOfWeek(startOfMonth(this.currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(this.currentMonth), { weekStartsOn: 1 });
    let weeks: any[] = [];
    let current = start;

    while (current <= end) {
      let week: any = {};
      for (let i = 0; i < 7; i++) {
        const dayStr = format(current, 'yyyy-MM-dd');
        const entry = entries.find(e => e.day === dayStr);
        week[this.weekDays[i]] = { date: dayStr, id: entry?.id, hours: entry?.hours ?? 0 };
        current = addDays(current, 1);
      }
      weeks.push(week);
    }
    this.weeks = weeks;
  }

  updateHours(entry: any) {
    if (entry.id) {
      this.http.patch(`/api/timesheets/${entry.id}`, { hours: entry.hours }).subscribe();
    } else if (entry.hours > 0) {
      this.http.post(`/api/timesheets`, { day: entry.date, hours: entry.hours })
        .subscribe((res: any) => entry.id = res.id);
    }
  }
}
