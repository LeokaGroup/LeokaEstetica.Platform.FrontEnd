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
  aObjectDialogs: any[] = [];

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

        // Навешиваем команды всем элементам.
        // Подгружаем с бэка для нужного элемента данные,
        // чтобы не нагружать фронт сразу всеми диалогами всех элементов меню.
        this.aGroupObjects.forEach((item: any) => {
          item.command = (event: any) => {
            console.log(event.item);

            // Получаем диалоги выбранного объекта группы.
            this._communicationsServiceService.sendGroupObject(event.item.abstractGroupId);

            this._communicationsServiceService.receiptGroupObjectDialogs$.subscribe((objectDialogs: any) => {
              if (objectDialogs !== null) {
                debugger;
                this.aGroupObjects = [];
                // this.aObjectDialogs = objectDialogs;
                this.aGroupObjects = objectDialogs;
              }
            });
          };
        });
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

  /**
   * Функция выбирает объект из группы объектов абстрактной области чата.
   * @param ac - Выбранный объект группы.
   */
  public onSelectGroupObject(selectedItem: any) {
    console.log(selectedItem);
  }
}
