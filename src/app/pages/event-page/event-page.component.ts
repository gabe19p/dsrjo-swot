import { Component } from '@angular/core';

@Component({
  selector: 'app-event-page',
  imports: [],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent {
  events: any[] = [];

  ngOnInit() {
    this.events = [
      { title: 'Bridget Visit', Date: Date.now },
      { title: 'Mike Visit', Date: Date.now },
      { title: 'Another Visit', Date: Date.now },
    ];
  }
}
