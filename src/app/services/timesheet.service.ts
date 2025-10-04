import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments';
import { map, Observable } from 'rxjs';

export interface TimeSheetResponse {
    id: number;
    day: string;
    hours: number;
}

export interface TimeSheetsResponse {
    timesheets: TimeSheetResponse[];
}

@Injectable({ providedIn: 'root' })
export class TimesheetService {
    private baseUrl = `${environment.apiBaseUrl}/timesheets`;

    constructor(private http: HttpClient) { }

    getTimeSheets(from?: string, to?: string): Observable<TimeSheetsResponse> {
        const params: any = {};
        if (from) params.from = from;
        if (to) params.to = to;
        return this.http.get<TimeSheetsResponse>(this.baseUrl, { params });
    }

    getTimeSheet(id: number): Observable<TimeSheetResponse> {
        return this.http.get<TimeSheetResponse>(`${this.baseUrl}/${id}`);
    }

    createTimeSheet(day: string, hours: number): Observable<number> {
        return this.http.post(this.baseUrl, { day, hours }, { observe: 'response' })
            .pipe(
                map(response => {
                    const location = response.headers.get('Location');
                    if (!location) {
                        throw new Error('Location header missing');
                    }
                    return parseInt(location.split('/').pop() || '', 10);
                })
            );
    }

    updateTimeSheet(id: number, hours: number): Observable<TimeSheetResponse> {
        return this.http.patch<TimeSheetResponse>(`${this.baseUrl}/${id}`, { hours });
    }

    deleteTimeSheet(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
