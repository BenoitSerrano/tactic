type examApiType = {
    id: string;
    name: string;
    duration: number | null;
    startText: string;
    endText: string;
    createdAt: string;
    archivedAt: string | null;
    classe: classeType | undefined;
};

type classeType = {
    id: string;
    name: string;
};

export type { examApiType };
