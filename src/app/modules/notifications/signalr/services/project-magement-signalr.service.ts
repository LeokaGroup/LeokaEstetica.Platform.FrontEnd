import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import {RedisService} from 'src/app/modules/redis/services/redis.service';

@Injectable()
export class ProjectManagementSignalrService {
  private hubConnection: any;
  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public isConnected: boolean = false;

  public constructor(private readonly _redisService: RedisService,
                     private readonly _router: Router) {
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

            if (this._router.url !== "/user/signin") {
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
    (<HubConnection>this.hubConnection).on("SendNotifySuccessPlaningSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешного планирования эпика.
   */
  public listenSuccessSuccessIncludeEpicTask() {
    (<HubConnection>this.hubConnection).on("SendNotifySuccessIncludeEpicTask", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки планирования эпика.
   */
  public listenErrorSuccessIncludeEpicTask() {
    (<HubConnection>this.hubConnection).on("SendNotifyErrorIncludeEpicTask", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenSuccessStartSprint() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessStartSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомление об успешном начале спринта.
   */
  public listenWarningStartSprint() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningStartSprint", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция получает диалоги с нейросетью Scrum Master AI.
   */
  public listenGetDialogs() {
    (<HubConnection>this.hubConnection).on("listenGetDialogs", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  public getDialogsAsync() {
    <HubConnection>this.hubConnection.invoke("GetDialogsAsync", localStorage["u_e"], localStorage["t_n"], null)
      .catch((err: any) => {
        console.error(err);
      });
  };
}
