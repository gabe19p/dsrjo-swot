import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private baseUrl =
    'https://nodeappapis-aef6fgczecbggeec.japanwest-01.azurewebsites.net/api/swot/events';

  constructor(private http: HttpClient) {}

  getActiveEvents(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getSwotEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${eventId}`);
  }

  createSwotEvent(event: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, event);
  }

  archiveSwotEvent(eventId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${eventId}/archive`, {});
  }
}
