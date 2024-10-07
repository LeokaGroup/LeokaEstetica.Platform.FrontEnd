import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BackOfficeService } from '../../../services/backoffice.service';
import { CreateProjectInput } from '../models/input/create-project-input';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/modules/project/services/project.service';
import { RedirectService } from 'src/app/common/services/redirect.service';
import { ProjectManagmentService } from '../../../../project-managment/services/project-managment.service';

@Component({
  selector: 'create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})

/**
 * Класс проектов пользователя.
 */
export class CreateProjectComponent implements OnInit {
  public readonly projectColumns$ = this._backofficeService.projectColumns$;
  public readonly projectData$ = this._backofficeService.projectData$;
  public readonly projectStages$ = this._projectService.projectStages$;

  projectName: string = '';
  projectDetails: string = '';
  selectedStage: any;
  public = true;
  demands: string = '';
  conditions: string = '';
  isCreateProject: boolean = false;
  isNeedUserAction: boolean = false;
  companyId: number = 1;

  constructor(
    private readonly _backofficeService: BackOfficeService,
    private readonly _messageService: MessageService,
    private readonly _router: Router,
    private readonly _projectService: ProjectService,
    private readonly _redirectService: RedirectService,
    private readonly _projectManagmentService: ProjectManagmentService,
    private readonly _activatedRoute: ActivatedRoute
  ) {}

  public async ngOnInit() {
    this.checkUrlParams();
    await this.getProjectsColumnNamesAsync();
    await this.getProjectStagesAsync();
  }

  private checkUrlParams() {
    this._activatedRoute.queryParams.subscribe(async (params) => {
      // this.companyId = +params['companyId'];

      await this.createCompanyCacheAsync();
    });
  }

  /**
   // * Функция получает поля таблицы проектов пользователя.
   // * @returns - Список полей.
   */
  private async getProjectsColumnNamesAsync() {
    (await this._backofficeService.getProjectsColumnNamesAsync()).subscribe(
      (_) => {
        console.log(
          'Столбцы таблицы проектов пользователя: ',
          this.projectColumns$.value
        );
      }
    );
  }

  /**
   * Функция создает модель для сохранения проекта.
   * @returns - Входная модель проекта.
   */
  private createProjectModel() {
    const createProjectInput: CreateProjectInput = {
      ProjectName: this.projectName,
      ProjectDetails: this.projectDetails,
      ProjectStage: this.selectedStage.stageId,
      Conditions: this.conditions,
      Demands: this.demands,
      isPublic: this.public,
      companyId: this.companyId,
    };

    this.isCreateProject = true;

    return createProjectInput;
  }

  /**
   * Функция создает новый проект пользователя.
   * @returns Данные проекта.
   */

  public async onCreateProjectAsync() {
    let createProjectInput = this.createProjectModel();

    (
      await this._backofficeService.createProjectAsync(createProjectInput)
    ).subscribe((response: any) => {
      if (
        this.projectData$.value.errors !== null &&
        this.projectData$.value.errors.length > 0
      ) {
        response.errors.forEach((item: any) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Что то не так',
            detail: item.errorMessage,
          });
        });
      } else {
        setTimeout(() => {
          this._router.navigate(['/projects/my']);
        }, 4000);
      }
    });
  }

  /**
   * Функция получает список стадий проекта.
   * @returns - Список стадий проекта.
   */
  private async getProjectStagesAsync() {
    (await this._projectService.getProjectStagesAsync()).subscribe((_) => {
      console.log('Стадии проекта для выбора: ', this.projectStages$.value);
    });
  }

  public onSelectProjectStage() {
    console.log(this.selectedStage);
  }

  private async createCompanyCacheAsync() {}
}
