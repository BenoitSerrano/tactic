import { controllerType, methodType } from '../types';

type webhookType = { method: methodType; path: string; controller: controllerType };

export type { webhookType };
