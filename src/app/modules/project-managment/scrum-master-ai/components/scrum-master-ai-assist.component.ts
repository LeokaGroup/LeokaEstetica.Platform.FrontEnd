import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProjectManagmentService } from "../../services/project-managment.service";
import {MessageService} from "primeng/api";
import { ProjectManagementSignalrService } from "src/app/modules/notifications/signalr/services/project-magement-signalr.service";

@Component({
  selector: "scrum-master-ai-assist",
  templateUrl: "./scrum-master-ai-assist.component.html",
  styleUrls: ["./scrum-master-ai-assist.component.scss"]
})

/**
 * Класс компонента чата с нейросетью Scrum Master AI.
 */
export class ScrumMasterAiAssistComponent implements OnInit {
  constructor(private readonly _projectManagmentService: ProjectManagmentService,
              private readonly _router: Router,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _projectManagementSignalrService: ProjectManagementSignalrService,
              private readonly _messageService: MessageService) {
  }

  isShowScrumMasterAiAssistModal: boolean = false;
  message: string = "";
  aDialogs: any[] = [];
  aMessages: any[] = [];
  lastMessage: any;
  dialogId: number = 0;

  public async ngOnInit() {
    forkJoin([
      // this.checkUrlParams(),
    ]).subscribe();

    // Подключаемся.
    this._projectManagementSignalrService.startConnection().then(async () => {
      console.log("Подключились");

      this.listenAllHubsNotifications();
    });

    // Подписываемся на получение всех сообщений.
    this._projectManagementSignalrService.AllFeedObservable
      .subscribe((response: any) => {
        console.log("Подписались на сообщения", response);

        // Если пришел тип уведомления, то просто показываем его.
        if (response.notificationLevel !== undefined) {
          this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
        }


        else if (response.actionType == "All" && response.dialogs.length > 0) {
          console.log("Сообщения чата проекта: ", response);
          this.aDialogs = response.dialogs;
          this.aMessages = response.dialogs;
        }

        else if (response.actionType == "Concrete") {
          console.log("Сообщения диалога: ", response.messages);

          this.aMessages = response.messages;
          let lastMessage = response.messages[response.messages.length - 1];
          this.lastMessage = lastMessage;

          // Делаем небольшую задержку, чтобы диалог успел открыться, прежде чем будем скролить к низу.
          setTimeout(() => {
            let block = document.getElementById("#idMessages");
            block!.scrollBy({
              left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
              top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
              behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
            });
          }, 1);
        }

        else if (response.actionType == "Message") {
          console.log("Сообщения диалога: ", this.aMessages);

          this.message = "";
          let dialogIdx = this.aDialogs.findIndex(el => el.dialogId == this.dialogId);
          let lastMessage = response.messages[response.messages.length - 1];
          this.lastMessage = lastMessage;
          this.aDialogs[dialogIdx].lastMessage = this.lastMessage.message;

          this.aMessages = response.messages;

          this.aMessages.forEach((msg: any) => {
            if (msg.userCode !== localStorage["u_c"]) {
              msg.isMyMessage = false;
            }
            else {
              msg.isMyMessage = true;
            }
          });

          setTimeout(() => {
            let block = document.getElementById("#idMessages");
            block!.scrollBy({
              left: 0, // На какое количество пикселей прокрутить вправо от текущей позиции.
              top: block!.scrollHeight, // На какое количество пикселей прокрутить вниз от текущей позиции.
              behavior: 'auto' // Определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно.
            });
          }, 1);
        }
      });
  };

  /**
   * Функция слушает все хабы.
   */
  private listenAllHubsNotifications() {
    this._projectManagementSignalrService.listenGetDialogs();
    // this._signalrService.listenGetProjectDialogs();

    // this._signalrService.listenGetDialog();
    // this._signalrService.listenSendMessage();
  };

  private async checkUrlParams() {
    this._activatedRoute.queryParams
      .subscribe(async params => {
        // this.projectId = params["projectId"];
      });
  };

  public async onSendMessageAsync() {

  };

  public async onGetDialogAsync(dialogId: number) {

  };

  public onShowScrumMasterAiAssist() {
    this.isShowScrumMasterAiAssistModal = !this.isShowScrumMasterAiAssistModal

    this._projectManagementSignalrService.getDialogsAsync();
  };
}
