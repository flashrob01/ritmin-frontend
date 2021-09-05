import {Milestone} from './milestone';

export interface WCA {
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
  status: string;
  stage: string;
  isPublic?: boolean;
}
