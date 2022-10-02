export class Task {
    
    private startTime: Date;
    private endTime: Date;
    private taskId: string;

    constructor(taskId: string, startTime: Date, endTime: Date) {
        this.taskId = taskId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public getTaskId(): string {
        return this.taskId;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
}