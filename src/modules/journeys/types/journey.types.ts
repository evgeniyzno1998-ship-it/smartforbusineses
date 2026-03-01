export interface JourneyStep {
  triggerEvent: string;
  conditionRuleId?: string;
  action: {
    type: 'email' | 'webhook' | 'xp_bonus' | 'tag';
    payload: Record<string, unknown>;
  };
}
