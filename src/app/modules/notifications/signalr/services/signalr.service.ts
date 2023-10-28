import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { API_URL } from 'src/app/core/core-urls/api-urls';
import { DialogInput } from 'src/app/modules/messages/chat/models/input/dialog-input';
import { RedisService } from 'src/app/modules/redis/services/redis.service';

@Injectable()
export class SignalrService {
  private hubConnection: any;
  public $allFeed: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public constructor(private readonly _redisService: RedisService,
    private readonly _router: Router) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(API_URL.apiUrl + "/notify", 4)
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
   * Функция слушает уведомления сохранения профиля пользователя из хаба.
   */
  public listenSuccessSaveProfileInfo() {
    (<HubConnection>this.hubConnection).on("SendNotifySuccessSave", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о навыках пользователя из хаба.
   */
  public listenWarningUserSkillsInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserSkills", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о целях пользователя из хаба.
   */
  public listenWarningUserIntentsInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSaveUserIntents", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления создания проекта пользователя из хаба.
   */
  public listenSuccessCreatedUserProjectInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedUserProject", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления создания проекта пользователя из хаба.
   */
  public listenWarningDublicateUserProjectInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningDublicateUserProject", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления создания вакансии пользователя из хаба.
   */
  public listenSuccessCreatedUserVacancyInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedUserVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления обновления проекта пользователя из хаба.
   */
  public listenSuccessUpdatedUserVacancyInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessUpdatedUserProject", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления прикрепления вакансии проекта из хаба.
   */
  public listenSuccessAttachProjectVacancyInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessAttachProjectVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления дубликата прикрепления вакансии проекта из хаба.
   */
  public listenErrorDublicateAttachProjectVacancyInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorDublicateAttachProjectVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления об отклике на проект из хаба.
   */
  public listenSuccessProjectResponseInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessProjectResponse", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления о предупреждении отклика на проект из хаба.
   */
  public listenWarningProjectResponseInfo() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningProjectResponse", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешное Удаления  проекта из хаба.*/
  public listenSuccessDeleteProject() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteProject", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешное Удаления  вакансии проекта из хаба.*/
  public listenSuccessDeleteProjectVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteProjectVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления Если была ошибка удаления вакансии проекта из хаба.*/
  public listenErrorDeleteProjectVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorDeleteProjectVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешное Удаления вакансии из раздела Мои Ваканси с хаба.*/
  public listenSuccessDeleteVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки удаления вакансии из раздела Мои Ваканси с хаба.*/
  public listenSendErrorDeleteVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorDeleteVacancy", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о инвайте в проект.
   */
  public listenWarningProjectInviteTeam() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningProjectInviteTeam", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о блокировке пользователя.
   */
  public listenWarningBlockedUser() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningBlockedUser", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения не заполненной анкеты пользователя.
   */
  public listenWarningEmptyUserProfile() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningEmptyUserProfile", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о приглашенном пользователе в команде проекта.
   */
  public listenWarningUserAlreadyProjectInvitedTeam() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningUserAlreadyProjectInvitedTeam", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о приглашенном пользователе в команде проекта.
   */
  public listenSuccessUserProjectInvitedTeam() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessUserProjectInvitedTeam", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о исключении пользователя из команды проекта.
   */
  public listenSuccessDeleteProjectTeamMember() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteProjectTeamMember", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения об успешном сохранении замечаний проекта.
   */
  public listenSuccessCreateProjectRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreateProjectRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения об успешной отправке замечаний проекта.
   */
  public listenSuccessSendProjectRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessSendProjectRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о внесении замечаний проекта.
   */
  public listenWarningSendProjectRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSendProjectRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха о внесении замечаний вакансии.
   */
  public listenSuccessCreateVacancyRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreateVacancyRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха о отправке замечаний вакансии.
   */
  public listenSuccessSendVacancyRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessSendVacancyRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о отправке замечаний вакансии.
   */
  public listenWarningSendVacancyRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSendVacancyRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха о внесении замечаний анкеты.
   */
  public listenSuccessCreateResumeRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreateResumeRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о отправке замечаний анкеты.
   */
  public listenWarningSendResumeRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSendResumeRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха о отправке замечаний анкеты.
   */
  public listenSuccessSendResumeRemarks() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessSendResumeRemarks", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки ошибки вычисления суммы возврата.
   */
  public listenErrorCalculateRefund() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCalculateRefund", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешное добавление проекта в архив.
   */
  public listenSuccessAddArchiveProject() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessAddProjectArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки добавление проекта в архив.
   */
  public listenErrorAddArchiveProject() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorAddProjectArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о добавленном проекте в архив.
   */
  public listenWarningAddArchiveProject() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningAddProjectArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешное добавление вакансии в архив.
   */
  public listenSuccessAddArchiveVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessAddVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки добавление вакансии в архив.
   */
  public listenErrorAddArchiveVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorAddVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о добавленной вакансии в архив.
   */
  public listenWarningAddArchiveVacancy() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningAddVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешного удаления проекта из архива из хаба.
   */
  public listenSuccessDeleteProjectArchive() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteProjectArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успешного удаления вакансии из архива из хаба.
   */
  public listenSuccessDeleteVacancyArchive() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessDeleteVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о блокировке аккаунта.
   */
  public listenSendNotificationWarningBlockedUserProfile() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningBlockedUserProfile", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха при отправке ссылки для восстановления пароля.
   */
  public listenSendNotificationSuccessLinkRestoreUserPassword() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessLinkRestoreUserPassword", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления успеха при восстановлении пароля.
   */
  public listenSendNotifySuccessRestoreUserPassword() {
    (<HubConnection>this.hubConnection).on("SendNotifySuccessRestoreUserPassword", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки при удалении вакансии из архива.
   */
  public listenSendNotificationErrorDeleteVacancyArchive() {
    (<HubConnection>this.hubConnection).on("SendNotificationErrorDeleteVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки при удалении проекта из архива.
   */
  public listenSendNotificationWarningDeleteProjectArchive() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningDeleteProjectArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления ошибки при удалении вакансии из архива.
   */
  public listenSendNotificationWarningDeleteVacancyArchive() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningDeleteVacancyArchive", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает уведомления предупреждения о лимите кол-ва проектов при создании проекта.
   */
  public listenWarningLimitFareRuleProjects() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningLimitFareRuleProjects", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция получает диалоги проекта.
   * @param projectId - Id проекта.
   */
  public getDialogsAsync(projectId: number | null) {
    <HubConnection>this.hubConnection.invoke("GetDialogsAsync", localStorage["u_e"], localStorage["t_n"], +projectId!)
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает получение диалогов проекта.
   */
  public listenGetProjectDialogs() {
    (<HubConnection>this.hubConnection).on("listenGetProjectDialogs", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
  * Функция получает диалог проекта.
  * @param diaalogId - Id диалога.
  */
  public getDialogAsync(dialogInput: DialogInput) {
    <HubConnection>this.hubConnection.invoke("GetDialogAsync", localStorage["u_e"], localStorage["t_n"], JSON.stringify(dialogInput))
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает получение диалога проекта.
   */
  public listenGetDialog() {
    (<HubConnection>this.hubConnection).on("listenGetDialog", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
 * Функция отправляет сообщение.
 */
  public sendMessageAsync(message: string, dialogId: number) {
    <HubConnection>this.hubConnection.invoke("SendMessageAsync", message, dialogId, localStorage["u_e"], localStorage["t_n"])
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает отправку сообщений.
   */
  public listenSendMessage() {
    (<HubConnection>this.hubConnection).on("listenSendMessage", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
* Функция получает диалоги ЛК.
* @param projectId - Id проекта.
*/
  public getProfileDialogsAsync() {
    <HubConnection>this.hubConnection.invoke("GetProfileDialogsAsync", localStorage["u_e"], localStorage["t_n"])
      .catch((err: any) => {
        console.error(err);
      });
  };

  /**
   * Функция слушает получение диалогов ЛК.
   */
  public listenProfileDialogs() {
    (<HubConnection>this.hubConnection).on("listenProfileDialogs", (response: any) => {
      this.$allFeed.next(response);
    });
  };

  /**
   * Функция слушает предупреждение при поиске пользователя для приглашения в проект.
   */
   public listenWarningSearchProjectTeamMember() {
    (<HubConnection>this.hubConnection).on("SendNotificationWarningSearchProjectTeamMember", (data: any) => {
      this.$allFeed.next(data);
    });
  };

  /**
   * Функция слушает успешную запись комментария к проекту.
   */
   public listenSuccessCreatedCommentProject() {
    (<HubConnection>this.hubConnection).on("SendNotificationSuccessCreatedCommentProject", (data: any) => {
      this.$allFeed.next(data);
    });
  };

   /**
   * Функция слушает успешное создание возврата.
   */
    public listenSuccessSuccessManualRefund() {
      (<HubConnection>this.hubConnection).on("SendNotificationSuccessManualRefund", (data: any) => {
        this.$allFeed.next(data);
      });
    };

     /**
   * Функция слушает предупреждения создание возврата при дубликате.
   */
      public listenWarningManualRefund() {
        (<HubConnection>this.hubConnection).on("SendNotificationWarningManualRefund", (data: any) => {
          this.$allFeed.next(data);
        });
      };
}