import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { DialogMessageInput } from "../../messages/chat/models/input/dialog-message-input";
import { ChatMessagesService } from "../../messages/chat/services/chat-messages.service";

@Component({
    selector: "messages",
    templateUrl: "./messages.component.html",
    styleUrls: ["./messages.component.scss"]
})

/**
 * Класс компонента сообщений пользователя в ЛК.
 */
export class MessagesComponent implements OnInit {
    public readonly dialog$ = this._messagesService.dialog$;
    public profileMessages$ = this._messagesService.profileMessages$;
    aMessages: any[] = [];
    aDialogs: any[] = [];
    lastMessage: any;
    dialogId: number = 0;
    message: string = "";
    projectId: number = 0;

    constructor(private readonly _router: Router,
        private readonly _messagesService: ChatMessagesService) {

    }

    public async ngOnInit() {
        forkJoin([
            await this.getProjectDialogsAsync()
        ]).subscribe();
    };
    
    /**
     * TODO: Изменил на сокеты. Убрать.
     * Функция получает диалог и его сообщения.
     * @param discussionTypeId - Id типа обсуждения.
     * @returns - Диалог и его сообщения.
     */
     public async onGetDialogAsync(dialogId: number, projectId: number) {
        this.dialogId = dialogId;

        // await this._messagesService.getProjectDialogAsync(projectId, dialogId)
        //     .then((response: any) => {                
        //         console.log("Сообщения диалога: ", this.dialog$.value);                               
        //         this.aMessages = response.messages;                     
        //         let lastMessage = response.messages[response.messages.length - 1];   
        //         this.lastMessage = lastMessage;  
        //         // let a1 = this.dialog$.value.messages.getValue();                
        //         // a1.push(lastMessage);                                
        //     });
    };

    /**
     * Функция получает список диалогов. Запускается при открытии диалога.
     * @returns - Список диалогов.
     */
     private async getProjectDialogsAsync() {
        (await this._messagesService.getProfileDialogsAsync())
        .subscribe(async _ => {
            console.log("Сообщения чатов ЛК: ", this.profileMessages$.value);
            // this.userName = this.messages$.value.fullName;
            // console.log("userName", this.userName);
            let dialogs = this.profileMessages$.value;
            this.aDialogs = dialogs;     
            this.aMessages = this.profileMessages$.value.messages;                
        });
    };

    // * TODO: Изменил на сокеты. Убрать.
    public async onSendMessageAsync() {
        let dialogInput = new DialogMessageInput();
        dialogInput.Message = this.message;
        dialogInput.DialogId = this.dialogId;        

        // (await this._messagesService.sendDialogMessageAsync(dialogInput))
        // .subscribe(async _ => {
        //     console.log("Сообщения диалога: ", this.profileMessages$.value);
        //     this.message = "";               
        //     this.profileMessages$ = new BehaviorSubject([]);

        //     new Promise(async (resolve, reject) => {
        //         await this.onGetDialogAsync(this.dialogId, this.projectId);
        //         resolve(1);
        //     }).then(() => {
        //         let dialogIdx = this.aDialogs.findIndex(el => el.dialogId == this.dialogId);
        //         this.aDialogs[dialogIdx].lastMessage = this.lastMessage.message;
        //     });         
        // });
    };
}