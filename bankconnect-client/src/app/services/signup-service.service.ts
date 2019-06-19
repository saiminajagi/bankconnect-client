import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {

  constructor(private http: HttpClient) { }

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

  checkadminaccount():Observable<any>{
    return this.http.get<any>('route/checkadmin',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  checkbankaccount():Observable<any>{
    return this.http.get<any>('route/checkbank',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  getBanks(){
    return this.http.get<any>('/route/getBanks',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  getApis(obj:any):Observable<any>{
    return this.http.post<any>('/route/getApi',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  getApiDetails(obj:any):Observable<any>{
    var api = obj.api;
    return this.http.get<any>(`http://localhost:3000/route/getapiDetails/${api}`,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  pendingReq(obj:any):Observable<any>{
    return this.http.post<any>('/route/pendingReq',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  sendPassDetails(){
    return this.http.post<any>('route/password',{
      headers:
        new HttpHeaders({'Content-Type':'application/json'})
    });
  }

  getRequests(){
    return this.http.get('/route/pendingReq',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  getSignUpDetails():Observable<any>{
    return this.http.get<any>('route/profile', {
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  sendLoginDetails(user:any):Observable<any>{
    return this.http.post<any>('route/loginconfirm',user,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  getUserType(){
    return this.http.get<any>('/route/getUserType',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  setBank(obj:any):Observable<any>{
    return this.http.post<any>('/route/setBank',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

}
