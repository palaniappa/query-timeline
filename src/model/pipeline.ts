export class Pipeline {
    private startTime: Date;
    private endTime: Date;
    private pipelineId: string;

    constructor(pipelineId: string, startTime: Date, endTime: Date) {
        this.pipelineId = pipelineId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public getPipelineId(): string {
        return this.pipelineId;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
}