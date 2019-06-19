import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SignupServiceService } from '../services/signup-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GetUserProfileResolverService implements Resolve<any>{

    constructor(private signupservice: SignupServiceService){}

    resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> {
        return this.signupservice.getSignUpDetails();
    }

}
