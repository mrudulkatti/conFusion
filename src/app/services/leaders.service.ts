import { Injectable } from '@angular/core';
import { leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<leader[]>{
    return this.http.get<leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getLeader(id: string): Observable<leader>{
    return this.http.get<leader>(baseURL + 'leadership/'+id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getFeaturedLeaders(): Observable<leader>{
    return this.http.get<leader[]>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
