/**
 Copyright 2021 Rob Royce

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

import {Pipe, PipeTransform} from '@angular/core';
import {ProjectType} from "../../../models/project.model";
import {ProjectService} from "../../../services/factory-services/project-service/project.service";

@Pipe({
  name: 'projectType'
})
export class ProjectTypePipe implements PipeTransform {
  constructor(private projectService: ProjectService) {
  }

  transform(type: ProjectType): string {
    if (!type) {
      return 'Default';
    } else {
      return this.projectService.ProjectTypes.find(t => t.code === type)?.name ?? 'Default';
    }
  }

}