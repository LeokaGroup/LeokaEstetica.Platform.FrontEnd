import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterService } from '../services/footer.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public readonly footerData$ = this._footerService.footerData$;

  constructor(private readonly _footerService: FooterService,
      private readonly _router: Router,
      private readonly _activatedRoute: ActivatedRoute) {
  }

  public async ngOnInit() {
      await this.getFooterItemsAsync();
  }

   /**
     * Функция получит список элементов футера.
     * @returns - Список элементов футера.
     */
  private async getFooterItemsAsync() {
      (await this._footerService.getFooterItemsAsync())
      .subscribe(_ => {
          console.log("Данные футера: ", this.footerData$.value);
      });
  };

  public onSelectFooterItem(event: MouseEvent, item: any) {
    event.preventDefault();
    this._router.navigate([item.menuItemUrl]);
  };
}
