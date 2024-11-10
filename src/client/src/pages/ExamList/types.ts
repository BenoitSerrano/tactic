type examApiType = {
    id: string;
    name: string;
    duration: number | null;
    startText: string;
    endText: string;
    createdAt: string;
    classe: classeType | undefined;
};

type sortedExamsApiType = {
    toCome: examApiType[];
    current: examApiType[];
    past: examApiType[];
};

type classeType = {
    id: string;
    name: string;
};

export type { examApiType, sortedExamsApiType };
