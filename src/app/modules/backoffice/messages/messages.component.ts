import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { DialogMessageInput } from "../../messages/chat/models/input/dialog-message-input";
import { ChatMessagesService } from "../../messages/chat/services/chat-messages.service";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
import { MessageService } from "primeng/api";
import { DialogInput } from "../../messages/chat/models/input/dialog-input";

@Component({
    selector: "messages",
    templateUrl: "./messages.component.html",
    styleUrls: ["./messages.component.scss"]
})

/**
 * TODO: Логика чатов дублируется с логикой в просмотре проекта. Отрефачить и унифицировать в одном месте где-то.
 * Класс компонента сообщений пользователя в ЛК.
 */
export class MessagesComponent implements OnInit, OnDestroy {
    public readonly dialog$ = this._messagesService.dialog$;
    public profileMessages$ = this._messagesService.profileMessages$;
    aMessages: any[] = [];
    aDialogs: any[] = [];
    lastMessage: any;
    dialogId: number = 0;
    message: string = "";
    projectId: number = 0;
    allFeedSubscription: any;

    constructor(private readonly _router: Router,
        private readonly _messagesService: ChatMessagesService,
        private readonly _signalrService: SignalrService,
        private readonly _messageService: MessageService) {

    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();

        // Подключаемся.
        this._signalrService.startConnection().then(async () => {
            console.log("Подключились");

            this.listenAllHubsNotifications();
        });

        // Подписываемся на получение всех сообщений.
        this._signalrService.AllFeedObservable
        .subscribe((response: any) => {
            console.log("Подписались на сообщения", response);
            
            // Если пришел тип уведомления, то просто показываем его.
            if (response.notificationLevel !== undefined) {
                this._messageService.add({ severity: response.notificationLevel, summary: response.title, detail: response.message });
            }
            
            if (response.actionType == "All") {
                console.log("Сообщения чата ЛК: ", response);
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
    private async listenAllHubsNotifications() {
        this._signalrService.getDialogsAsync(this.projectId);
        this._signalrService.listenGetProjectDialogs();

        this._signalrService.listenGetDialog();
        this._signalrService.listenSendMessage();

        this._signalrService.getProfileDialogsAsync();
        this._signalrService.listenProfileDialogs();
    };
    
    /**
     * Функция получает диалог и его сообщения.
     * @param discussionTypeId - Id типа обсуждения.
     * @returns - Диалог и его сообщения.
     */
     public async onGetDialogAsync(dialogId: number, projectId: number) {
        let dialogInput = new DialogInput();
        dialogInput.DialogId = dialogId;
        dialogInput.DiscussionType = "Project";
        dialogInput.DiscussionTypeId = projectId;

        this._signalrService.getDialogAsync(dialogInput);

        this.dialogId = dialogId;
    };

    public async onSendMessageAsync() {
        let dialogInput = new DialogMessageInput();
        dialogInput.Message = this.message;
        dialogInput.DialogId = this.dialogId;       
        
        this._signalrService.sendMessageAsync(this.message, this.dialogId);
    };

    public ngOnDestroy() { 
        this._signalrService.NewAllFeedObservable;
    }; 
}