import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import { ProjectManagmentService } from 'src/app/modules/project-managment/services/project-managment.service';
import {RedisService} from 'src/app/modules/redis/services/redis.service';
import {DialogInput} from "../../../messages/chat/models/input/dialog-input";

@Injectable({
  providedIn: 'root'
})

export class ProjectManagementSignalrService {
  private hubConnection: HubConnection;
  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public isConnected: boolean = false;

  public constructor(private readonly _redisService: RedisService,
                     private readonly _router: Router,
                     private readonly _projectManagmentService: ProjectManagmentService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(API_URL.apiUrlProjectManagment + "/project-management-notify", HttpTransportType.LongPolling)
      .build();
  }

  public async startConnection() {
    if (this.hubConnection.state !== "Connected") {
      return await new Promise(async (resolve, reject) => {
        this.hubConnection.start()
          .then(async () => {
            console.log("Соединение установлено");
            console.log("ConnectionId:", this.hubConnection.connectionId);
            this.isConnected = true;

            if (this._router.url !== "/user/signin" && this.hubConnection.connectionId) {
              await (await this._redisService.addConnectionIdCacheAsync(this.hubConnection.connectionId))
                .subscribe(_ => {
                  console.log("Записали ConnectionId");
                });
            }

            return resolve(true);
          })
          .catch((err: any) => {
            console.log("Ошибка соединения: " + err);
            reject(err);
          });
      });
    }
  };

  public get AllFeedObservable() {
    return this.$allFeed;
  };

  public get NewAllFeedObservable() {
    return new BehaviorSubject<any>(null);
  };

  /**
   * Функция слушает уведомления успешного планирования спринта.
   */
  public listenSuccessPlaningSprint() {
    this.hubConnection.on("SendNotifySuccessPlaningSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

    /**
   * Функция закрывает слушатель уведомления успешного планирования спринта.
   */
  public offlistenSuccessPlaningSprint() {
    this.hubConnection.off("SendNotifySuccessPlaningSprint");
  };

  /**
   * Функция слушает уведомления успешного планирования эпика.
   */
  public listenSuccessSuccessIncludeEpicTask() {
    this.hubConnection.on("SendNotifySuccessIncludeEpicTask", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки планирования эпика.
   */
  public listenErrorSuccessIncludeEpicTask() {
    this.hubConnection.on("SendNotifyErrorIncludeEpicTask", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenSuccessStartSprint() {
    this.hubConnection.on("SendNotificationSuccessStartSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenWarningStartSprint() {
    this.hubConnection.on("SendNotificationWarningStartSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция получает диалоги с нейросетью Scrum Master AI.
   */
  public listenGetDialogs() {
    this.hubConnection.on("listenGetDialogs", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  public getDialogsAsync() {
    this.hubConnection.invoke("GetDialogsAsync", localStorage["u_e"], localStorage["t_n"], null)
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция получает диалог нейросети.
   * @param diaalogId - Id диалога.
   */
  public getDialogAsync(dialogInput: DialogInput) {
    this.hubConnection.invoke("GetDialogAsync", localStorage["u_e"], localStorage["t_n"], JSON.stringify(dialogInput))
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает получение диалога нейросети.
   */
  public listenGetDialog() {
    this.hubConnection.on("listenGetDialog", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция отправляет сообщение.
   */
  public sendMessageAsync(message: string, dialogId?: number | null) {
    this.hubConnection.invoke("SendMessageAsync", message, dialogId, localStorage["u_e"], localStorage["t_n"], this._projectManagmentService.apiUrl)
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает отправку сообщений.
   */
  public listenSendMessage() {
    this.hubConnection.on("listenSendMessage", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция слушает ответы нейросети.
   */
  public listenClassificationNetworkMessageResponse() {
    this.hubConnection.on("SendClassificationNetworkMessageResult", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция слушает уведомление об успешном изменении ролей.
   */
  public listenSendNotifySuccessUpdateRoles() {
    this.hubConnection.on("SendNotifySuccessUpdateRoles", (data: any) => {
      this.$allFeed.next(data);
    });
  };
}
