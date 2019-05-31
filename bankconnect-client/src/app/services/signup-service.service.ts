import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banks } from '../domain/banks';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {

  constructor(private http: HttpClient) { }

  getallBanks(): Banks[] {
    let allbanks = [
        new Banks('HDFC'),
        new Banks('RBL'),
        new Banks('Federal Bank'),
        new Banks('Canara Bank')
    ]
    return allbanks;
}

  sendAdminSignUpDetails(user: any): Observable<any>{
    return this.http.post<any>('route/sendmail', user,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAdminSignUpDetails(): Observable<any>{
    return this.http.get<any>('route/adminprofile', {
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }
  checkBankConnect():Observable<any>{
    return this.http.get<any>('/route/bankdetails',{
      headers:
      new HttpHeaders({'Content-Type':'application/json'})
    });
  }


  sendBankAccountDetails(user: any): Observable<any>{
    return this.http.post<any>('route/bankdetails', user,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  sendIDBPIntegrationDetails(user: any): Observable<any>{
    return this.http.post<any>('route/idbpdetails', user,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  checkintegrated():Observable<any>{
    return this.http.get<any>('route/idbpdetails',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }
}
