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

  checkuserfordashboard():Observable<any>{
    return this.http.get<any>('route/checkuserfordashboard',{
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
    return this.http.get<any>(`http://idbpportal.bank.com:3000/route/getapiDetails/${api}`,{
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

  getConfirmation(){
    return this.http.get<any>('/route/getConfirmation',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  checkLogin(){
    return this.http.get<any>('/route/checklogin',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  logout(){
    console.log("logout service called");
    return this.http.get<any>('/route/logout',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    });
  }

  getPartners(){
    return this.http.get<any>('/route/getPartners',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  checkFileUpload() {
    return this.http.get<any>('/route/checkFileUpload',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})})
  }

  showFileForm(){
    return this.http.get<any>('/route/showFileForm',{
      headers :
      //new HttpHeaders({ 'Content-Type':'application/json'})
      new HttpHeaders({ 'Content-Type':'text/html' })
    })
  }

  getPartnerDetails(){
    return this.http.get<any>('/route/getPartnerDetails',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  sendReq(obj:any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/route/pendingReqClient',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  destroySession(){
    return this.http.get<any>('/route/destroySession',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }
}
