import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user.model';


// Configure cognito Credentials
//Use case 1. Registering a user with the application
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
const  POOL_DATA = {
  UserPoolId : 'us-east-1_N8WBFPJfg', // Your user pool id here
  ClientId : '659qcum8jub18udh1fiu6bch95' // Your client id here
};
const userPool = new CognitoUserPool(POOL_DATA);

// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js


@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();


  // class to get the user from congnito
  registerUser: CognitoUser;



  constructor(private router: Router) {}
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };

    // Attibute list to connect using email to cognito
    const attrList: CognitoUserAttribute[] = [];




     const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
   // array to hold the attributes for the cognito besides the username and password that are by default
    attrList.push(new CognitoUserAttribute(emailAttribute));


    // use the userpool object and call the sign up method
    userPool.signUp(user.username, user.password, attrList, null, (err, result) => {
   if(err){
     this.authDidFail.next(true);
     this.authIsLoading.next(false);

     //in the case that we did succesfully sign up set the register user to what i get back from the result
     this.registerUser = result.user;
     return;
   }

   this.authDidFail.next(false);
   this.authIsLoading.next(false);

    });

    return;
  }

  // Use case 2. Confirming a registered, unauthenticated user using a confirmation code received via SMS.
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    // confirm cognito user
    const userData = {
      Username: username,
      Pool: userPool
    };

    //create a new cognito user
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if(err){
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          return;
        }
          //in the case that we did succesfully confirm the user
          this.authDidFail.next(false);
          this.authIsLoading.next(false);
          // send the to the root of the page
          this.router.navigate(['/']);
    });
  }

  //Use case 4. Authenticating a user and establishing a user session with the Amazon Cognito Identity service.
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };

    //Authentication details
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    };

    // with the userdata we create a new user and pass the userdata to initialize our user
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    //authenticate the user with cognito
    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result: CognitoUserSession){
         that.authStatusChanged.next(true);
         that.authDidFail.next(false);
         that.authIsLoading.next(false);
         console.log(result);
      },
      onFailure(err){
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
        console.log(err);
      }
    });
    this.authStatusChanged.next(true);
    return;
  }

  //Use case 5. Retrieve user attributes for an authenticated user.
  // Get the current authenticated user
  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }

  //Use case 14. Signing out from the application.
  logout() {
    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);
  }

// verify that the user is authenticated
  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        user.getSession((err, session) => {
                if(err) {
                  // inform the app that the user is not authenticated
                  observer.next(false);
                } else {
                  // check if the session is valid
                  if(session.isValid()){
                     // inform the app that the user is authenticated
                    observer.next(true);
                  } else {
                    // if the session is present but no valid I will inform the app that the user is not authenticated
                    observer.next(false);
                  }
                }
        });

        observer.next(false);
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
