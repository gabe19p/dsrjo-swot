import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  private baseUrl =
    'https://nodeappapis-aef6fgczecbggeec.japanwest-01.azurewebsites.net/api/swot/';

  constructor(private http: HttpClient) {}

  createSwotEntry(eventId: string, entryData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/events/${eventId}/entries`,
      entryData
    );
  }

  getEntriesForEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${eventId}/entries`);
  }

  getArchivedEntries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entries/archived`);
  }

  updateEntry(entryId: string, entryData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/entries/${entryId}`, entryData);
  }

  archiveEntry(entryId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/entries/${entryId}/archive`, {});
  }

  restoreEntry(entryId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/entries/${entryId}/restore`, {});
  }
}
