export type ProjectStatus = 'PENDING' | 'ONGOING' | 'FINISHED' | 'UNKNOWN';
export type ProjectStage = null | 'Ready-To-Finish' | 'Active' | 'Open';

export interface NekoHitProject {
  identifier: string;
  description: string;
  creator: string;
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
}

export interface Milestone {
  title: string;
  description: string;
  endTimestamp: Date;
  linkToResult: string;
}
