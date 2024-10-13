import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";
import {CommunicationsServiceService} from "../services/communications.service";
import {MenuItem} from "primeng/api";

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
  aGroupObjects: any[] = [];

  public async ngOnInit() {
    await this.checkUrlParams();
    this.executeSubscriptionLogic();
  };

  private async checkUrlParams() {
    this._router.events
      .subscribe(async (event: any) => {
      });
  };

  /**
   * Функция выполняет логику подписчиков на прокси-сервис.
   */
  private executeSubscriptionLogic() {
    // Подписка на получение абстрактных областей из прокси-сервиса.
    this._communicationsServiceService.abstractScopes$.subscribe((abstractScopes: any) => {
      if (abstractScopes !== null) {
        this.aAbstractScopes = [];
        this.aAbstractScopes = abstractScopes;
      }
    });

    // Подписка на получение групп объектов абстрактной области из прокси-сервиса.
    this._communicationsServiceService.groupObjects$.subscribe((groupObjects: any) => {
      if (groupObjects !== null) {
        this.aGroupObjects = [];
        this.aGroupObjects = groupObjects.objects;
      }
    });
  };

  /**
   * Функция выбирает абстрактную группу чата и получает ее объекты.
   * @param ac - Выбранная абстрактная область чата.
   */
  public onSelectAbstractScopeAndGetScopeGroupObjects(selectedItem: MenuItem) {
    this._communicationsServiceService.sendAbstractScopeGroupObjects(selectedItem['abstractScopeId'], selectedItem['abstractScopeType']);
  };

  public onSelectGroupObject(go: any) {

  }
}
