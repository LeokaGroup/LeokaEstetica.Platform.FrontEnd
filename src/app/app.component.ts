import { Component } from '@angular/core';
import { NetworkService } from './core/interceptors/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading$ = this.networkService.loading$;

  constructor(public networkService: NetworkService) { }
}
