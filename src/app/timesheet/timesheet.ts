import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isWeekend } from 'date-fns';
import { TimesheetService, TimeSheetResponse } from '../services/timesheet.service';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  todayStr: string = format(new Date(), 'yyyy-MM-dd');
  weeks: any[] = [];
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  holidays: string[] = [];

  constructor(private timesheetService: TimesheetService) { }

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

    this.timesheetService.getTimeSheets(from, to).subscribe({
      next: (res) => this.buildWeeks(res.timesheets),
      error: (err) => console.error('Failed to load timesheets', err)
    });
  }

  buildWeeks(entries: TimeSheetResponse[]) {
    const start = startOfWeek(startOfMonth(this.currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(this.currentMonth), { weekStartsOn: 1 });
    let weeks: any[] = [];
    let current = start;

    while (current <= end) {
      let week: any[] = [];

      for (let i = 0; i < 7; i++) {
        const dayStr = format(current, 'yyyy-MM-dd');
        const entry = entries.find(e => e.day === dayStr);
        console.log(dayStr)
        week.push({
          date: dayStr,
          id: entry?.id ?? null,
          hours: entry?.hours ?? 0,
          isWeekend: isWeekend(current),
          isHoliday: this.holidays.includes(dayStr),
          dayName: this.weekDays[i],
          dayNumber: format(current, 'dd'),
          disabled: current.getMonth() !== this.currentMonth.getMonth()
        });

        current = addDays(current, 1);
      }

      weeks.push(week);
    }

    this.weeks = weeks;
  }

  updateHours(entry: any) {
    if (entry.id) {
      this.timesheetService.updateTimeSheet(entry.id, entry.hours).subscribe();
    } else if (entry.hours > 0) {
      this.timesheetService.createTimeSheet(entry.date, entry.hours)
        .subscribe((createdTimeSheetId) => entry.id = createdTimeSheetId);
    }
  }
}
