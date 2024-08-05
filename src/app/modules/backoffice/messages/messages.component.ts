import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import { DialogMessageInput } from "../../messages/chat/models/input/dialog-message-input";
import { ChatMessagesService } from "../../messages/chat/services/chat-messages.service";
import { SignalrService } from "../../notifications/signalr/services/signalr.service";
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

    constructor(private readonly _messagesService: ChatMessagesService,
        private readonly _signalrService: SignalrService) {

    }

    public async ngOnInit() {
        forkJoin([
            
        ]).subscribe();
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