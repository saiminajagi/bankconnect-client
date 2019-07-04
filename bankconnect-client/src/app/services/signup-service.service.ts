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
    return this.http.post<any>('http://idbpportal.bank.com:3000/route/pendingReqClient',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  subscribeApi(obj:any):Observable<any>{
    return this.http.post('/route/subscribeApi',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  getsubscribedApis(){
    return this.http.get<any>('/route/subscribeApi',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  addSubscribeApi(obj:any):Observable<any>{
    return this.http.post('http://idbpportal.bank.com:3000/route/addSubscribeApi',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  sendRevokedPartners(){
    return this.http.get('/route/getRevokedPartners',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  sendTokenDetails(obj:any):Observable<any>{
    return this.http.post('/someroute',obj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  revoke(myObj:any):Observable<any>{
    return this.http.post('/route/revoke', myObj, {
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  revokeInIDBP(myObj:any):Observable<any>{
    return this.http.post('http://idbpportal.bank.com:3000/route/revoke',myObj,{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  getTransactions(){
    return this.http.get('/route/getTransactions',{
      headers :
      new HttpHeaders({ 'Content-Type':'application/json'})
    })
  }

  // a dummy service call...to just populate the api response
  getDummyResponse(){
    return this.http.get('"https://reqres.in//api/unknown/2',{
      headers :
      new HttpHeaders({ 'Content-Type': 'application/json'})
    });
  }

}
