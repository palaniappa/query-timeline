import { DataItem, DataSet, Timeline, DataGroup } from 'vis';
import { LevelGroup } from './model/LevelGroup';
import { Query } from './model/query';
import { Stage } from './model/stage';
import { Task } from './model/task';
import { queryJson } from './queryinfo';
import { queryJson2 } from './queryInfo2';

export class QueryTimeline {
  private getDataItems(query: Query, dataItems: DataItem[]): number {
    let s: Stage | null = query.getOutputStage();
    if (s) {
      return this.processStageForDataItem(s, dataItems);
    }
    return 0;
  }

  private processStageForDataItem(s: Stage, dataItems: DataItem[]): number {
    let currentLevel = s.getStageLevel();
    let dataItem: DataItem = {
      group: s.getStageLevel(),
      content: s.getStageId(),
      start: s.getStartTime(),
      end: s.getEndTime(),
      title: s.getStageId() + ",\n" + s.getStartTime() + ",\n" + s.getEndTime(),
    };
    dataItems.push(dataItem);

    s.getTasks().forEach( (t:Task) => {
      let dataItem: DataItem = {
        group: s.getStageLevel(),
        content: t.getTaskId(),
        start: t.getStartTime(),
        end: t.getEndTime(),
        title: t.getTaskId() + ",\n" + t.getStartTime() + ",\n" + t.getEndTime(),
        className: 'green',
      };
      dataItems.push(dataItem)
    });

    s.getSubStages().forEach((subStage: Stage) => {
      let newLevel = this.processStageForDataItem(subStage, dataItems);
      if (newLevel > currentLevel) {
        currentLevel = newLevel;
      }
    });

    return currentLevel;
  }

  private processStage(s: any, level: number): Stage {
    let stage: Stage = new Stage(s.stageId, level);
    s.tasks.forEach((t: any) => {
      const task: Task = new Task(
        t.taskStatus.taskId,
        new Date(t.stats.firstStartTime),
        new Date(t.stats.lastEndTime),
      );
      stage.addTask(task);
    });
    if (s.subStages) {
      s.subStages.forEach((s1: any) => {
        let subStage = this.processStage(s1, level + 1);
        stage.addSubStage(subStage);
      });
    }
    return stage;
  }

  public processTimeline(): void {
    let queryData:any = queryJson;
    const q: Query = new Query(
      queryData.queryId,
      new Date(queryData.queryStats.createTime),
      new Date(queryData.queryStats.endTime),
    );
    const outputStage: Stage = this.processStage(queryData.outputStage, 0);
    q.setOutputStage(outputStage);

    const dataItems: DataItem[] = [];
    let maxNumber = this.getDataItems(q, dataItems);

    const levelGroups: LevelGroup[] = [];
    for (let i = 0; i <= maxNumber; ++i) {
      let newLevel: LevelGroup = {
        id: i,
        content: 'Level ' + i,
        value: i,
      };
      levelGroups.push(newLevel);
    }

    // create visualization
    const container: HTMLElement | null = document.getElementById('timeline');
    if (container != null) {
      const options = {
        groupOrder: function (a: LevelGroup, b: LevelGroup) {
          return b.value - a.value;
        },
        editable: false,
        maxHeight: 800,
        stack: true,
        verticalScroll: true,
        zoomKey: "ctrlKey",
      };

      const timeline = new Timeline(container, dataItems);
      timeline.setOptions(options);
      timeline.setGroups(levelGroups);
      timeline.setItems(dataItems);
    }
  }
}
