import { Task } from "./task";

export class Stage {
    private stageId: string;
    private level: number = 0; 
    private subStages: Stage[] = [];
    private startTime: Date;
    private endTime: Date;
    private tasks: Task[] = []
    constructor(stageId: string, level: number) {
        this.stageId = stageId;
        this.level = level;
        this.startTime = new Date();
        this.endTime = new Date();
    }

    public addTask(t: Task): void {
        this.tasks.push(t);
        if(!this.startTime) {
            this.startTime = t.getStartTime();
        } else if(this.startTime > t.getStartTime()) {
            this.startTime = t.getStartTime();
        }

        if(!this.endTime) {
            this.endTime = t.getEndTime();
        } else if(this.endTime > t.getEndTime()) {
            this.endTime = t.getEndTime();
        }
    }

    public addSubStage(s: Stage):void {
        this.subStages.push(s);
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
    
    public getStageLevel(): number {
        return this.level;
    }

    public getStageId(): string {
        return this.stageId;
    }

    public getSubStages(): Stage[] {
        return this.subStages;
    }

    public getTasks(): Task[] {
        return this.tasks;
    }
}