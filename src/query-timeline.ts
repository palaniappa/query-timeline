import { DataItem, DataSet, Timeline, DataGroup } from 'vis';
import { LevelGroup } from './model/LevelGroup';
import { Query } from './model/query';
import { Stage } from './model/stage';
import { Task } from './model/task';
import { queryJson } from './queryinfo';
import { queryJson2 } from './queryInfo2';
import { queryJson3 } from './queryInfo3';
import { QueryTimelineOptions } from './model/queryTimelineOptions';
import { Pipeline } from './model/pipeline';

export class QueryTimeline {
  private query: Query | null = null;
  private options: QueryTimelineOptions = new QueryTimelineOptions();
  private timeline: Timeline | null = null;
  private queryJsonObject: any = null;

  constructor(options: QueryTimelineOptions) {
    this.options = options;
    this.queryJsonObject = queryJson3;
  }
  private getDataItems(
    query: Query,
    dataItems: DataItem[],
    options: QueryTimelineOptions,
  ): number {
    let s: Stage | null = query.getOutputStage();
    if (s) {
      return this.processStageForDataItem(s, dataItems, options);
    }
    return 0;
  }

  private processStageForDataItem(
    s: Stage,
    dataItems: DataItem[],
    options: QueryTimelineOptions,
  ): number {
    let currentLevel = s.getStageLevel();
    if (
      options.showAll ||
      options.showOnlyStages ||
      options.selectedStageId === s.getStageId()
    ) {
      let dataItem: DataItem = {
        id: 'STAGE:' + s.getStageId(),
        group: s.getStageLevel(),
        content: s.getStageId(),
        start: s.getStartTime(),
        end: s.getEndTime(),
        title:
          s.getStageId() + ',\n' + s.getStartTime() + ',\n' + s.getEndTime(),
      };
      dataItems.push(dataItem);
    }
    s.getTasks().forEach((t: Task) => {
      if (
        options.showAll ||
        options.selectedStageId === s.getStageId() ||
        options.selectedTaskId === t.getTaskId()
      ) {
        let dataItem: DataItem = {
          id: 'TASK:' + t.getTaskId(),
          group: s.getStageLevel(),
          content: t.getTaskId(),
          start: t.getStartTime(),
          end: t.getEndTime(),
          title:
            t.getTaskId() + ',\n' + t.getStartTime() + ',\n' + t.getEndTime(),
          className: 'green',
        };
        dataItems.push(dataItem);

        if (options.showAll || options.selectedTaskId === t.getTaskId()) {
          t.getPipelines().forEach((p: Pipeline) => {
            let dataItem: DataItem = {
              id: 'PIPELINE:' + p.getPipelineId(),
              group: s.getStageLevel(),
              content: p.getPipelineId(),
              start: p.getStartTime(),
              end: p.getEndTime(),
              title:this.getPipelineTooltip(p),
              className: 'blue',
            };
            dataItems.push(dataItem);
          });
        }
      }
    });

    s.getSubStages().forEach((subStage: Stage) => {
      let newLevel = this.processStageForDataItem(subStage, dataItems, options);
      if (newLevel > currentLevel) {
        currentLevel = newLevel;
      }
    });

    return currentLevel;
  }

  private getPipelineTooltip(p: Pipeline) : string {
    let details = '<tr><td>Total Scheduled Time</td>' + '<td> ' + p.getTotalScheduledTime() + '</td></tr>';
    details = details + '<tr><td>Total CPU Time</td>' + '<td> ' + p.getTotalCpuTime() + '</td></tr>';
    details = details +  '<tr><td>Total Blocked Time</td>' + '<td> ' + p.getTotalBlockedTime() + '</td></tr>';
    details = details +  '<tr><td>Total Raw Input</td>' + '<td> ' + p.getRawInputPositions() + '</td></tr>';
    details = details +  '<tr><td>Total Processed Input</td>' + '<td> ' + p.getProcessedInputPositions() + '</td></tr>';
    details = details +  '<tr><td>Total Output</td>' + '<td>' + p.getOutputPositions() + '</td></tr>';
    let tooltip = '<table>' + details + '</table>';
    return tooltip;
  }

  private processTask(t: any, task: Task): void {
    if (t.stats.pipelines) {
      t.stats.pipelines.forEach((p: any) => {
        let pipelineId = task.getTaskId() + '::' + p.pipelineId;
        let pipeline = new Pipeline(
          pipelineId,
          new Date(p.firstStartTime),
          new Date(p.lastEndTime),
          p.totalScheduledTime,
          p.totalCpuTime,
          p.totalBlockedTime,
          p.rawInputPositions,
          p.processedInputPositions,
          p.outputPositions,
        );
        task.addPipeline(pipeline);
      });
    }
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
      this.processTask(t, task);
    });
    if (s.subStages) {
      s.subStages.forEach((s1: any) => {
        let subStage = this.processStage(s1, level + 1);
        stage.addSubStage(subStage);
      });
    }
    return stage;
  }

  public setQueryJson(queryJson: any):void {
    this.queryJsonObject = queryJson;
  }

  public processQuery(): void {
    if(this.timeline) {
      this.timeline.destroy();
      this.options.showOnlyStages = true;
      this.options.showAll = false;
      this.options.selectedTaskId='';
      this.options.selectedPipelineId='';
      this.options.selectedStageId='';
    }
    this.timeline = null;
    let queryData: any = this.queryJsonObject;
    this.query = new Query(
      queryData.queryId,
      new Date(queryData.queryStats.createTime),
      new Date(queryData.queryStats.endTime),
    );
    const outputStage: Stage = this.processStage(queryData.outputStage, 0);
    this.query.setOutputStage(outputStage);
  }

  public processTimeline(): void {
    if (this.query) {
      const dataItems: DataItem[] = [];
      let maxNumber = this.getDataItems(this.query, dataItems, this.options);

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
          zoomKey: 'ctrlKey',
          horizontalScroll: true,
        };

        if (this.timeline == null) {
          this.timeline = new Timeline(container, dataItems);
          this.timeline.setOptions(options);
          this.timeline.on('click', this.onItemSelected.bind(this));
        }

        this.timeline.setGroups(levelGroups);
        this.timeline.setItems(dataItems);
      }
    }
  }

  public onItemSelected(properties: any) {
    if (properties.item) {
      this.options.showOnlyStages = false;
      this.options.showAll = false;
      this.options.selectedStageId = '';
      this.options.selectedTaskId = '';

      console.log(properties.item);
      let selectedItemDetail = properties.item.split(':');
      if (selectedItemDetail[0] === 'STAGE') {
        this.options.selectedStageId = selectedItemDetail[1];
      } else if (selectedItemDetail[0] === 'TASK') {
        this.options.selectedTaskId = selectedItemDetail[1];
      }
    }
    this.processTimeline();
  }

  public showAll(): void {
    this.options.showAll = true;
    this.options.showOnlyStages = false;
    this.options.selectedTaskId = '';
    this.options.selectedStageId = '';
    this.processTimeline();
  }
  public showOnlyStages(): void {
    this.options.showAll = false;
    this.options.showOnlyStages = true;
    this.options.selectedTaskId = '';
    this.options.selectedStageId = '';
    this.processTimeline();
  }
}
