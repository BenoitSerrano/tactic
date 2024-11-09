type establishmentUpsertionModalStatusType =
    | {
          kind: 'editing';
          establishment: establishmentType;
      }
    | {
          kind: 'creating';
      };

type establishmentType = { id: string; name: string };

export type { establishmentUpsertionModalStatusType, establishmentType };
