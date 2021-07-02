import { Milestone } from "./milestone";

export interface WCA {
  creator: string;
  stakePer100Token: number;
  maxTokenSoldCount: number;
  stakePaid: boolean;
  milestonesCount: number;
  milestones: Milestone[];
  coolDownInterval: number;
  thresholdMilestoneIndex: number;
  lastUpdateTimestamp: Date;
  nextMilestone: number;
  remainTokenCount: number;
  buyerCount: number;
}
