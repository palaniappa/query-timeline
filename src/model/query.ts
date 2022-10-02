import { Stage } from "./stage";

export class Query {
    private queryId: String;
    private startTime:Date = new Date();
    private endTime:Date = new Date();
    private outputStage: Stage | null = null;
    constructor(queryId:String, start: Date, end:Date) {
        this.queryId = queryId;
        this.startTime = start;
        this.endTime = end;
    }

    public setOutputStage(s: Stage) { 
        this.outputStage = s;
    }

    public getOutputStage(): Stage | null {
        return this.outputStage;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
}