export class Pipeline {
    private startTime: Date;
    private endTime: Date;
    private pipelineId: string;
    private totalScheduledTime: string;
    private totalCpuTime: string;
    private totalBlockedTime: string;
    private rawInputPositions: number;
    private processedInputPositions: number;
    private outputPositions: number;

    constructor(pipelineId: string, startTime: Date, endTime: Date, totalScheduledTime:string
        , totalCpuTime: string
        , totalBlockedTime: string
        , rawInputPositions: number
        , processedInputPositions: number
        , outputPositions: number) {
        this.pipelineId = pipelineId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalScheduledTime = totalScheduledTime;
        this.totalCpuTime = totalCpuTime;
        this.totalBlockedTime = totalBlockedTime;
        this.rawInputPositions = rawInputPositions;
        this.processedInputPositions = processedInputPositions;
        this.outputPositions = outputPositions;
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

    public getTotalScheduledTime(): string {
        return this.totalScheduledTime;
    }

    public getTotalCpuTime(): string {
        return this.totalCpuTime;
    }

    public getTotalBlockedTime(): string {
        return this.totalBlockedTime;
    }

    public getRawInputPositions(): number {
        return this.rawInputPositions;
    }

    public getProcessedInputPositions(): number {
        return this.processedInputPositions;
    }

    public getOutputPositions(): number {
        return this.outputPositions;
    }
}