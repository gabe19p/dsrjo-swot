import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// primeng imports
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarModule, PanelMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dsrjo-swot';

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/'] },
      { label: 'SWOT Events', icon: 'pi pi-home', routerLink: ['/events'] },
      {
        label: 'SWOT Categories',
        icon: 'pi pi-tags',
        routerLink: ['/categories'],
      },
      { label: 'Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
    ];
  }
}
