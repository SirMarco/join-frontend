import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PopupOverlayComponent } from '../../popup-overlay/popup-overlay.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, PopupOverlayComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  newUsername: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loginVisible = true;
  message: string = '';
  showPopup: boolean = false;

  constructor(private as: AuthService, private router: Router) {}

  // Logik, um mit Backend zu kommunizieren
  async login() {
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        this.username,
        this.password
      );
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/board');
    } catch (error) {
      this.message = 'Benutzerdaten falsch';
      console.log(error);
    }
  }

  async register() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwörter stimmen nicht überein';
      return;
    }
    try {
      let resp: any = await this.as.registerNewUser(
        this.newUsername,
        this.newPassword
      );
      localStorage.setItem('token', resp['token']);
      this.message = resp['message'];
      this.showPopup = true;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.message = error.error.error;
        } else {
          this.message = 'Ein unbekannter Fehler ist aufgetreten';
        }
      }
      console.log(error);
    }
  }
  toggleForm() {
    this.loginVisible = !this.loginVisible;
  }

  closePopup() {
    this.showPopup = false;
    this.message = '';
    this.toggleForm();
  }
}
