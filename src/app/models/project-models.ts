export interface Project {
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

export interface Milestone {
  title: string;
  description: string;
  endTimestamp: Date;
  linkToResult?: string;
}
