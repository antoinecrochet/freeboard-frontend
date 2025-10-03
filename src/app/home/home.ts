import { Component, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly keycloak = inject(Keycloak);

  isLoggedIn = this.keycloak.authenticated ?? false;
  fullName = this.keycloak.tokenParsed?.['name'] ?? '';
}