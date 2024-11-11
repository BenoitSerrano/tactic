type examApiType = {
    id: string;
    name: string;
    duration: number | null;
    startText: string;
    endText: string;
    createdAt: string;
    startTime: string;
    endTime: string | null;
    classe: classeType | undefined;
};

type sortedExamsApiType = {
    toCome: examApiType[];
    current: examApiType[];
    past: examApiType[];
};

type classeType = {
    id: string;
};

export type { examApiType, sortedExamsApiType };
