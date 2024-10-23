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
              private _communicationsService: CommunicationsServiceService) {
  }

  public readonly createdDialog$ = this._communicationsService.createdDialog$;
  public readonly aGroupObjectActions$ = this._communicationsService.aGroupObjectActions$;

  aAbstractScopes: any[] = [];
  aGroupObjects: any[] = [];
  aObjectDialogs: any[] = [];
  aMessages: any[] = [];
  message: string = "";
  aGroupObjectActions: any[] = [];
  isShowCreateChat: boolean = false;
  dialogName: string = "";
  aChatMembers: any[] = [];
  selectedChatMember: any;
  dialogId: number = 0;

  public async ngOnInit() {
    await this.checkUrlParams();
    this.executeSubscriptionLogic();
    await this.getGroupObjectMenuItemsAsync();
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
    this._communicationsService.abstractScopes$.subscribe((abstractScopes: any) => {
      if (abstractScopes !== null) {
        this.aAbstractScopes = [];
        this.aAbstractScopes = abstractScopes;
      }
    });

    // Подписка на получение групп объектов абстрактной области из прокси-сервиса.
    this._communicationsService.groupObjects$.subscribe((groupObjects: any) => {
      if (groupObjects !== null) {
        this.aGroupObjects = [];
        this.aGroupObjects = groupObjects.objects;

        // Навешиваем команды всем элементам.
        this.aGroupObjects.forEach((item: any) => {
          item.command = (event: any) => {
            console.log(event.item);

            if (event.item.items !== null && event.item.items.length > 0) {
              event.item.items.forEach((msg: any) => {
                msg.command = (event: any) => {
                  console.log(event.item);

                  this.dialogId = event.item.dialogId;

                  this._communicationsService.sendDialogMessages(this.dialogId);

                  this._communicationsService.receiveDialogMessages$.subscribe((dialogMessages: any) => {
                    if (dialogMessages !== null) {
                      this.aMessages = dialogMessages.dialogMessages;
                    }
                  });
                };
              });
            }
          };
        });
      }
    });

    // Подписка на получение сообщения из прокси-сервиса.
    this._communicationsService.receiveMessage$.subscribe((dialogMessage: any) => {
      if (dialogMessage !== null) {
        // Находим диалог, в котором пишут и добавляем новое сообщение.
        this.aMessages.push(dialogMessage);
      }
    });
  };

  /**
   * Функция выбирает абстрактную группу чата и получает ее объекты.
   * @param ac - Выбранная абстрактная область чата.
   */
  public onSelectAbstractScopeAndGetScopeGroupObjects(selectedItem: MenuItem) {
    this._communicationsService.sendAbstractScopeGroupObjects(selectedItem['abstractScopeId'], selectedItem['abstractScopeType']);
  };

  /**
   * Функция отправляет сообщение.
   */
  public async onSendMessageAsync() {
    this._communicationsService.sendMessage({message: this.message, dialogId: this.dialogId});
    this.message = "";
  };

  /**
   * Функция добавляет участников в массив.
   */
  public onAddChatMember() {
    this.aChatMembers.push(this.selectedChatMember);
    this.selectedChatMember = "";
  };

  /**
   * Функция создает диалог и добавляет его участников.
   */
  public async onCreateDialogAsync() {
    (await this._communicationsService.onCreateDialogAsync(this.aChatMembers, this.dialogName))
      .subscribe(_ => {
        console.log("Созданный диалог: ", this.createdDialog$.value);

        this.isShowCreateChat = false;
      });
  };

  /**
   * Функция создает диалог и добавляет его участников.
   */
  private async getGroupObjectMenuItemsAsync() {
    (await this._communicationsService.getGroupObjectMenuItemsAsync())
      .subscribe(_ => {
        console.log("Меню возможных действий групп объектов: ", this.aGroupObjectActions$.value);

        this.aGroupObjectActions = this.aGroupObjectActions$.value.items;

        // Навешиваем команды.
        this.aGroupObjectActions.forEach((item: any) => {
          item.command = (event: any) => {
            if (event.item.id == "GroupChat") {
              this.isShowCreateChat = true;
            }
          }
        });
      });
  };
}
