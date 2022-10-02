import { DataItem, DataSet, Timeline, DataGroup } from 'vis';
import { LevelGroup } from './model/LevelGroup';
import { Query } from './model/query';
import { Stage } from './model/stage';
import { Task } from './model/task';
import { queryJson } from './queryinfo';

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
      title: s.getStageId(),
    };
    dataItems.push(dataItem);

    s.getTasks().forEach( (t:Task) => {
      let dataItem: DataItem = {
        group: s.getStageLevel(),
        content: t.getTaskId(),
        start: t.getStartTime(),
        end: t.getEndTime(),
        title: t.getTaskId(),
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
    queryJson.outputStage.tasks.forEach((t) => {
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
    const q: Query = new Query(
      queryJson.queryId,
      new Date(queryJson.queryStats.createTime),
      new Date(queryJson.queryStats.endTime),
    );
    const outputStage: Stage = this.processStage(queryJson.outputStage, 0);
    q.setOutputStage(outputStage);

    const dataItems: DataItem[] = [];
    let maxNumber = this.getDataItems(q, dataItems);

    const levelGroups: LevelGroup[] = [];
    for (let i = 0; i < maxNumber; ++i) {
      let newLevel: LevelGroup = {
        id: i,
        content: 'Level ' + i,
        value: i,
      };
      levelGroups.push(newLevel);
    }

    // const groups = new DataSet([
    //   { id: 0, content: 'First', value: 1 },
    //   { id: 1, content: 'Third', value: 3 },
    //   { id: 2, content: 'Second', value: 2 },
    // ]);

    // create a dataset with items
    // note that months are zero-based in the JavaScript Date object, so month 3 is April
    const items = new DataSet([
      {
        id: 0,
        group: 0,
        content: 'item 0',
        start: new Date(2014, 3, 17),
        end: new Date(2014, 3, 21),
      },
      {
        id: 1,
        group: 0,
        content: 'item 1',
        start: new Date(2014, 3, 19),
        end: new Date(2014, 3, 20),
      },
      {
        id: 2,
        group: 1,
        content: 'item 2',
        start: new Date(2014, 3, 16),
        end: new Date(2014, 3, 24),
      },
      {
        id: 3,
        group: 1,
        content: 'item 3',
        start: new Date(2014, 3, 23),
        end: new Date(2014, 3, 24),
      },
      {
        id: 4,
        group: 1,
        content: 'item 4',
        start: new Date(2014, 3, 22),
        end: new Date(2014, 3, 26),
      },
      {
        id: 5,
        group: 2,
        content: 'item 5',
        start: new Date(2014, 3, 24),
        end: new Date(2014, 3, 27),
      },
    ]);

    // create visualization
    const container: HTMLElement | null = document.getElementById('timeline');
    if (container != null) {
      const options = {
        groupOrder: function (a: LevelGroup, b: LevelGroup) {
          return b.value - a.value;
        },
        editable: true,
      };

      const timeline = new Timeline(container, dataItems);
      timeline.setOptions(options);
      timeline.setGroups(levelGroups);
      timeline.setItems(dataItems);
    }
  }
}
