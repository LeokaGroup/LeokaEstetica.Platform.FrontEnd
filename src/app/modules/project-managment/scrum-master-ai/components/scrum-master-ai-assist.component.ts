import { Component, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import {DialogInput} from "../../../messages/chat/models/input/dialog-input";
import {DialogMessageInput} from "../../../messages/chat/models/input/dialog-message-input";

@Component({
  selector: "scrum-master-ai-assist",
  templateUrl: "./scrum-master-ai-assist.component.html",
  styleUrls: ["./scrum-master-ai-assist.component.scss"]
})

/**
 * Класс компонента чата с нейросетью Scrum Master AI.
 */
export class ScrumMasterAiAssistComponent implements OnInit {
  constructor() {
  }

  isShowScrumMasterAiAssistModal: boolean = false;
  message: string = "";
  aDialogs: any[] = [];
  aMessages: any[] = [];
  lastMessage: any;
  dialogId?: number | null;

  public async ngOnInit() {
    forkJoin([
      // this.checkUrlParams(),
    ]).subscribe();

    // Подписываемся на получение всех сообщений.
    // this._projectManagementSignalrService.AllFeedObservable
    //   .subscribe(async (response: any) => {
    //     console.log("Подписались на сообщения", response);

    //     if (response.scrumMasterAiEventType != null && response.scrumMasterAiEventType != undefined) {
    //       await this.onGetDialogAsync(response.dialogId, false);

    //       this.message = "";
    //     }

    //     // Если это не ответ нейросети, то обрабатываем сообщения как обычно.
    //     else {
    //       // Если пришел тип уведомления, то просто показываем его.
    //       if (response.notificationLevel !== undefined) {
    //         this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
    //       }


    //       else if (response.actionType == "All" && response.dialogs.length > 0) {
    //         console.log("Сообщения чата проекта: ", response);
    //         this.aDialogs = response.dialogs;
    //       }

    //       else if (response.actionType == "Concrete") {
    //         console.log("Сообщения диалога: ", response.messages);

    //         this.aMessages = response.messages;
    //         let lastMessage = response.messages[response.messages.length - 1];
    //         this.lastMessage = lastMessage;

    //         // Делаем небольшую задержку, чтобы диалог успел открыться, прежде чем будем скролить к низу.
    //         setTimeout(() => {
    //           let block = document.getElementById("#idMessages");
    //           block!.scrollBy({
    //             left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
    //             top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
    //             behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
    //           });
    //         }, 1);
    //       }

    //       else if (response.actionType == "Message") {
    //         console.log("Сообщения диалога: ", this.aMessages);

    //         this.message = "";
    //         let dialogIdx = this.aDialogs.findIndex(el => el.dialogId == this.dialogId);
    //         let lastMessage = response.messages[response.messages.length - 1];
    //         this.lastMessage = lastMessage;
    //         this.aDialogs[dialogIdx].lastMessage = this.lastMessage.message;

    //         this.aMessages = response.messages;

    //         this.aMessages.forEach((msg: any) => {
    //           if (msg.userCode !== localStorage["u_c"]) {
    //             msg.isMyMessage = false;
    //           }
    //           else {
    //             msg.isMyMessage = true;
    //           }
    //         });

    //         setTimeout(() => {
    //           let block = document.getElementById("#idMessages");
    //           block!.scrollBy({
    //             left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
    //             top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
    //             behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
    //           });
    //         }, 1);
    //       }
    //     }
    //   });
  };

  /**
   * TODO: Как будем отправлять сообщения в хаб при новой архитектуре хабов?
   * Функия отправляет сообщение.
   */
  public async onSendMessageAsync() {
    let dialogInput = new DialogMessageInput();
    dialogInput.Message = this.message;
    dialogInput.DialogId = this.dialogId;

    // this._projectManagementSignalrService.sendMessageAsync(this.message, this.dialogId);
  };

  /**
   * TODO: Как будем отправлять сообщения в хаб при новой архитектуре хабов?
   * Функция получает диалог и его сообщения.
   * @param discussionTypeId - Id типа обсуждения.
   * @returns - Диалог и его сообщения.
   */
  public async onGetDialogAsync(dialogId: number | null, isManualNewDialog: boolean) {
    let dialogInput = new DialogInput();
    dialogInput.DialogId = dialogId;
    dialogInput.DiscussionType = "ScrumMasterAi";
    dialogInput.DiscussionTypeId = null;
    dialogInput.isManualNewDialog = isManualNewDialog;

    // this._projectManagementSignalrService.getDialogAsync(dialogInput);

    this.dialogId = dialogId;
  };

  /**
   * TODO: Как будем отправлять сообщения в хаб при новой архитектуре хабов?
   * Функция отображает модалку чата с нейросетью.
   */
  public onShowScrumMasterAiAssist() {
    this.isShowScrumMasterAiAssistModal = !this.isShowScrumMasterAiAssistModal

    // this._projectManagementSignalrService.getDialogsAsync();
  };
}
