export type ProjectStatus = 'PENDING' | 'ONGOING' | 'FINISHED' | 'UNKNOWN';
export type ProjectStage = null | 'Ready-To-Finish' | 'Active' | 'Open';

export interface NekoHitProject {
  identifier: string;
  description: string;
  creator: string;
  token: string;
  creationTimestamp: Date;
  stakePer100Token: number;
  maxTokenSoldCount: number;
  milestonesCount: number;
  milestones: Milestone[];
  thresholdMilestoneIndex: number;
  coolDownInterval: number;
  lastUpdateTimestamp: Date;
  nextMilestone: number;
  remainTokenCount: number;
  buyerCount: number;
  status: ProjectStatus;
  stage: ProjectStage;
  isPublic: boolean;
  stakedTokensChartData?: any; // used to bind new attributes to the project
  stakeInput?: number; // used to bind new attributes to the project
  tokenSymbol?: string;
  svg?: string; // for the avatar
}

export interface Milestone {
  title: string;
  description: string;
  endTimestamp: Date;
  linkToResult: string;
}
