import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true;
  } else {
    console.log('du bist nicht eingeloggt');

    router.navigateByUrl('/login');
    return false;
  }
};
