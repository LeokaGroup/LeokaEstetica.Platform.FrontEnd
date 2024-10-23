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
  public readonly aDialogGroups$ = this._communicationsService.aDialogGroups$;

  aAbstractScopes: any[] = [];
  aGroupObjects: any[] = [];
  aObjectDialogs: any[] = [];
  aMessages: any[] = [];
  message: string = "";
  aGroupObjectActions: any[] = [];
  aDialogGroups: any[] = [];
  isShowCreateChat: boolean = false;
  dialogName: string = "";
  aChatMembers: any[] = [];
  selectedChatMember: any;
  dialogId: number = 0;
  abstractScopeId: number = 0;

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

        if (groupObjects.dialogGroupType == "Project") {
          this.aGroupObjects = groupObjects.objects;
        }

        else if (groupObjects.dialogGroupType == "Company") {
          this.aGroupObjects = groupObjects.objects[0].items;
        }

        else {
          throw new Error(`Неизвестный тип DialogGroupType. DialogGroupType: ${groupObjects.dialogGroupType}.`);
        }

        // Навешиваем команды всем элементам.
        this.aGroupObjects.forEach((item: any) => {
          item.command = (event: any) => {
            console.log(event.item);

            // Если получили диалоги проектов, то они имеют вложенность.
            if (groupObjects.dialogGroupType == "Project"
              && event.item.items !== null
              && event.item.items.length > 0) {
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

            // Если получили диалоги компании, то вложенности у них нету.
            else if (groupObjects.dialogGroupType == "Company") {
              item.command = (event: any) => {
                console.log(event.item);

                this.dialogId = event.item.dialogId;

                this._communicationsService.sendDialogMessages(this.dialogId);

                this._communicationsService.receiveDialogMessages$.subscribe((dialogMessages: any) => {
                  if (dialogMessages !== null) {
                    debugger;
                    this.aMessages = dialogMessages.dialogMessages;
                  }
                });
              };
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
  public async onSelectAbstractScopeAndGetScopeGroupObjectsAsync(selectedItem: MenuItem, dialogGroupType: string) {
    this.abstractScopeId = selectedItem["abstractScopeId"];

    this._communicationsService.sendAbstractScopeGroupObjects(selectedItem['abstractScopeId'],
      selectedItem['abstractScopeType'], dialogGroupType);

    await this.getGroupObjectMenuItemsAsync();
    await this.getDialogGroupMenuItemsAsync();
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
   * Функция получает элементы меню для групп объектов чата.
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

  /**
   * Функция получает элементы меню группировок диалогов чата.
   */
  private async getDialogGroupMenuItemsAsync() {
    (await this._communicationsService.getDialogGroupMenuItemsAsync())
      .subscribe(_ => {
        console.log("Меню группировок диалогов: ", this.aDialogGroups$.value);

        this.aDialogGroups = this.aDialogGroups$.value.items;

        // Навешиваем команды.
        this.aDialogGroups.forEach((item: any) => {
          item.command = async (event: any) => {
            if (event.item.id == "CompanyChat") {
              await this.onSelectAbstractScopeAndGetScopeGroupObjectsAsync(
                {
                  abstractScopeId: this.abstractScopeId,
                  abstractScopeType: "company"
                }, "Company");
            }

            else if (event.item.id == "ProjectChat") {
              await this.onSelectAbstractScopeAndGetScopeGroupObjectsAsync(
                {
                  abstractScopeId: this.abstractScopeId,
                  abstractScopeType: "company"
                }, "Project");
            }
          }
        });
      });
  };
}
