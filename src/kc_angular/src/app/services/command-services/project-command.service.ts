/**
 Copyright 2022 Rob Royce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import {Injectable} from '@angular/core';
import {UUID} from "../../../../../kc_shared/models/uuid.model";
import {BehaviorSubject} from "rxjs";
import {KcProject, ProjectUpdateRequest} from "../../models/project.model";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {ProjectService} from "../factory-services/project.service";
import {ProjectCreationDialogComponent} from "../../components/project-components/project-creation-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class ProjectCommandService {

  private _projectDetailEvent = new BehaviorSubject<KcProject | undefined>(undefined);
  detailEvent = this._projectDetailEvent.asObservable();

  private _projectRemoveEvent = new BehaviorSubject<KcProject[]>([]);
  removeEvent = this._projectRemoveEvent.asObservable();

  private _projectShareEvent = new BehaviorSubject<KcProject[]>([]);
  shareEvent = this._projectShareEvent.asObservable();

  private _projectCopyJSONEvent = new BehaviorSubject<KcProject[]>([]);
  copyJSONEvent = this._projectCopyJSONEvent.asObservable();

  private _projectUpdateEvent = new BehaviorSubject<ProjectUpdateRequest[]>([]);
  updateEvent = this._projectUpdateEvent.asObservable();

  constructor(private dialog: DialogService,
              private confirmation: ConfirmationService,
              private projects: ProjectService) {
  }

  new(parentId?: UUID) {
    this.dialog.open(ProjectCreationDialogComponent, {
      width: `min(90vw, 92rem)`,
      data: {parentId: parentId},
      style: {'border-radius': '10px'}
    })
  }

  update(projectList: ProjectUpdateRequest[]) {
    this._projectUpdateEvent.next(projectList);
  }

  remove(projectList: KcProject[]) {
    if (projectList.length <= 0) {
      return;
    }

    const count = (id: string): number => {
      const project = this.projects.getProject(id);
      if (!project) {
        return 0;
      }

      if (!project.subprojects || project.subprojects.length === 0) {
        return 1;
      }

      return 1 + project.subprojects
        .map(s => count(s))
        .reduce((prev, curr) => {
          return prev + curr;
        });
    }

    let ids = projectList.map(p => p.id.value);
    let n = 0;
    for (let id of ids) {
      n += count(id);
    }

    this.confirmation.confirm({
      message: `Are you sure you want to remove ${n} Projects?`,
      accept: () => {
        for (let project of projectList) {
          this.projects.deleteProject(project.id);
        }
      }
    })
  }

  detail(project: KcProject) {
    this._projectDetailEvent.next(project);
  }

  share(projectList: KcProject[]) {
    this._projectShareEvent.next(projectList);
  }

  copyJSON(projectList: KcProject[]) {
    this._projectCopyJSONEvent.next(projectList);
  }
}
