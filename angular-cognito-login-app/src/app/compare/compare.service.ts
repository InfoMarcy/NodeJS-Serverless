import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { CompareData } from './compare-data.model';
import { AuthService } from '../user/auth.service';

@Injectable()
export class CompareService {
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  dataLoaded = new Subject<CompareData[]>();
  dataLoadFailed = new Subject<boolean>();
  userData: CompareData;

  constructor(private http: Http,
              private authService: AuthService) {
  }

  onStoreData(data: CompareData) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    this.dataEdited.next(false);
    this.userData = data;
 
    // Get the id token of the current logged in user on cognito, get the sesion using asynchronous code
    this.authService.getAuthenticatedUser().getSession((err, session)=> {
      // check if the user is loggefd in if not return
          if(err){

            // show an error message
            return new Error('El usuario no esta autenticado, la session ha expirado, intenta autenticarte al app otra vez por favor, gracias.');
          }
     // the user is logged in we send the reader request authorization token and can call the api
     this.http.post('https://9lbdss2s0c.execute-api.us-east-1.amazonaws.com/dev/compare-yourself', data, {
      headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
    })
      .subscribe(
        (result) => {
          this.dataLoadFailed.next(false);
          this.dataIsLoading.next(false);
          this.dataEdited.next(true);
        },
        (error) => {
          this.dataIsLoading.next(false);
          this.dataLoadFailed.next(true);
          this.dataEdited.next(false);
        }
      );

    });






  }
  onRetrieveData(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
        
    // get the accessToken of the current loggin user
    this.authService.getAuthenticatedUser().getSession((err, session)=> {

       // check if the user is loggefd in if not return
       if(err){

        // show an error message
        return new Error('El usuario no esta autenticado, la session ha expirado, intenta autenticarte al app otra vez por favor, gracias.');
      }
      
   //access query params
   const queryParam = '?accessToken=' + session.getAccessToken().getJwtToken();
   //let urlParam = 'all';
   //if (!all) {
     //urlParam = 'single';
  // } + urlParam 
   this.http.get('https://9lbdss2s0c.execute-api.us-east-1.amazonaws.com/dev/compare-yourself/' + queryParam, {
     headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
   })
     .map(
       (response: Response) => response.json()
     )
     .subscribe(
       (data) => {
         if (all) {
           this.dataLoaded.next(data);
         } else {
           console.log(data);
           if (!data) {
             this.dataLoadFailed.next(true);
             return;
           }
           this.userData = data[0];
           this.dataEdited.next(true);
         }
       },
       (error) => {
         this.dataLoadFailed.next(true);
         this.dataLoaded.next(null);
       }
     );
    });

    
  }
  onDeleteData() {
    this.dataLoadFailed.next(false);
      this.http.delete('https://9lbdss2s0c.execute-api.us-east-1.amazonaws.com/dev', {
        headers: new Headers({'Authorization': 'XXX'})
      })
        .subscribe(
          (data) => {
            console.log(data);
          },
          (error) => this.dataLoadFailed.next(true)
        );
  }
}
