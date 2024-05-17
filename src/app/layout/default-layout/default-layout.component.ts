import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgScrollbar} from 'ngx-scrollbar';

import {IconDirective} from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import {DefaultFooterComponent, DefaultHeaderComponent} from './';
import {EmpNavItems, navItems, SecNavItems} from './_nav';
import {TokenService} from "../../services/token/token.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {NgIf} from "@angular/common";

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    NgIf
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  public EmpNavItems = EmpNavItems;
  public SecNavItems = SecNavItems;

  // @ts-ignore
  public userRole: string;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    // Après l'authentification, récupérez le rôle de l'utilisateur à partir du token
    this.userRole = this.extractUserRoleFromToken();
    console.log(this.userRole);
  }

  private extractUserRoleFromToken(): string {
    const token = this.tokenService.token;
    const decodedToken = this.jwtHelper.decodeToken(token);
    const authorities = decodedToken.authorities; // Récupérer la liste des autorités
    const userRole = authorities[0]; // Récupérer le premier élément de la liste (le rôle)
    return userRole;
  }



}
