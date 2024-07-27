import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private as: AuthService, private router: Router) {}

  // Logik, um mit Backend zu kommunizieren
  async login() {
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        this.email,
        this.password
      );
      console.log(resp);
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/todos');
    } catch (error) {
      alert('login fehlerhaft');
      console.log(error);
    }
  }
}
