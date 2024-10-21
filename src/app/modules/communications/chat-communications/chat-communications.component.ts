import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";
import {CommunicationsServiceService} from "../services/communications.service";

@Component({
  selector: "chat-communications",
  templateUrl: "./chat-communications.component.html",
  styleUrls: ["./chat-communications.component.scss"]
})

/**
 * Класс компонента чата.
 */
export class ChatCommunicationsComponent implements OnInit {

  constructor(private readonly _router: Router,
              private _communicationsServiceService: CommunicationsServiceService) {
  }

  aAbstractScopes: any[] = [];

  public async ngOnInit() {
    await this.checkUrlParams();
    this.executeSubscriptionLogic();
  };

  private async checkUrlParams() {
    this._router.events
      .subscribe(async (event: any) => {
      });
  };

  private executeSubscriptionLogic() {
    // Подписка на получение абстрактных областей из прокси-сервиса.
    this._communicationsServiceService.abstractScopes$.subscribe((response: any) => {
      if (response !== null) {
        this.aAbstractScopes = [];
        this.aAbstractScopes = response;
      }
    });
  };
}
