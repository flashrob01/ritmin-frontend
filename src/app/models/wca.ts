import { Milestone } from "./milestone";

export interface WCA {
  identifier: string;
  creator: string;
  stakePer100Token: number;
  maxTokenSoldCount: number;
  milestonesCount: number;
  creationTimestamp: Date;
  description: string;
  milestones: Milestone[];
  coolDownInterval: number;
  thresholdMilestoneIndex: number;
  lastUpdateTimestamp: Date;
  nextMilestone: number;
  remainTokenCount: number;
  buyerCount: number;
  status: string;
}
