import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from 'src/app/core/core-urls/api-urls';
import {RedisService} from 'src/app/modules/redis/services/redis.service';

@Injectable()
export class ProjectManagementSignalrService {
  private hubConnection: any;
  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public constructor(private readonly _redisService: RedisService,
                     private readonly _router: Router) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(API_URL.apiUrlProjectManagment + "/project-management-notify", 4)
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
      debugger;
      this.$allFeed.next(data);
    });
  };
}
