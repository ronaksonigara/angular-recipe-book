import {
  Component,
  OnInit,
  ViewChild,
  // ComponentFactoryResolver,
  // OnDestroy,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';

// import { AlertComponent } from '../shared/alert/alert.component';
// import { PlaceholderDirective } from './../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
// , OnDestroy
export class AuthComponent implements OnInit {
  @ViewChild('authForm') form!: NgForm;

  // @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = '';

  // compSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router // private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const email: string = this.form.value.email;
    const password: string = this.form.value.password;
    this.isLoading = true;
    let authObservable: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObservable = this.authService.signIn(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(
      (response) => {
        this.form.reset();
        if (!this.isLoginMode) {
          this.onSwitchMode();
        }
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (error) => {
        this.isLoading = false;
        this.error = error;
        // this.showAlertComponent(error);
      }
    );
  }

  onErrorAlertClose() {
    this.error = '';
  }

  // private showAlertComponent(message: string) {
  //   const alertComponentFactory =
  //     this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //   const componentRef = hostViewContainerRef.createComponent(
  //     alertComponentFactory
  //   );
  //   componentRef.instance.message = message;
  //   this.compSub = componentRef.instance.close.subscribe(() => {
  //     this.compSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   });
  // }

  // ngOnDestroy() {
  //   if (this.compSub) {
  //     this.compSub.unsubscribe();
  //   }
  // }
}
