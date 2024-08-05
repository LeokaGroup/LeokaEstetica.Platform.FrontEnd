import {Injectable} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import { ProjectManagmentService } from 'src/app/modules/project-managment/services/project-managment.service';
import {RedisService} from 'src/app/modules/redis/services/redis.service';
import {DialogInput} from "../../../messages/chat/models/input/dialog-input";
import { Router } from '@angular/router';

@Injectable()
export class ProjectManagementSignalrService {
  private hubConnection: any;
  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public isConnected: boolean = false;

  constructor(private readonly _redisService: RedisService,
                     private readonly _router: Router,
                     private readonly _projectManagmentService: ProjectManagmentService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(API_URL.apiUrlProjectManagment + "/project-management-notify", HttpTransportType.LongPolling)
      .build();
  }

  public async startConnection(): Promise<boolean | void>  {
    if (this.hubConnection.state !== "Connected") {
      return await new Promise(async (resolve, reject) => {
        this.hubConnection.start()
          .then(async () => {
            console.log("Соединение установлено");
            console.log("ConnectionId:", this.hubConnection.connectionId);

            if (this._router.url !== "/user/signin") {
              // await (await this._redisService.addConnectionIdCacheAsync(this.hubConnection.connectionId))
              //   .subscribe(_ => {
              //     console.log("Записали ConnectionId");
              //   });
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
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешного планирования эпика.
   */
  public listenSuccessSuccessIncludeEpicTask() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки планирования эпика.
   */
  public listenErrorSuccessIncludeEpicTask() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenSuccessStartSprint() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenWarningStartSprint() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция получает диалоги с нейросетью Scrum Master AI.
   */
  public listenGetDialogs() {
    (<HubConnection>this.hubConnection).on("", (response: any) => {
      this.$allFeed.next(response);
    });
  };



  /**
   * Функция слушает получение диалога нейросети.
   */
  public listenGetDialog() {
    (<HubConnection>this.hubConnection).on("", (response: any) => {
      this.$allFeed.next(response);
    });
  };



  /**
   * Функция слушает отправку сообщений.
   */
  public listenSendMessage() {
    (<HubConnection>this.hubConnection).on("", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция слушает
   */
  public listenClassificationNetworkMessageResponse() {
    (<HubConnection>this.hubConnection).on("", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция слушает уведомление о предупреждении невозможности изменения статуса эпика на недопустимый статус.
   */
  public listenSendNotifyWarningChangeEpicStatus() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление о предупреждении невозможности изменения статуса истории на недопустимый статус.
   */
  public listenSendNotifyWarningChangeStoryStatus() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном обновлении ролей.
   */
  public listenSendNotifySuccessUpdateRoles() {
    (<HubConnection>this.hubConnection).on("", (data: any) => {
      this.$allFeed.next(data);
    });
  };
}
