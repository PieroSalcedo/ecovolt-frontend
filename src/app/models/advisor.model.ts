export class EnergyAdvisorRequest {
  idHome?: number;
  period?: string;
}

export class EnergyAdvisorMetric {
  label?: string;
  type?: string;
  value?: number;
  unit?: string;
}

export class EnergyAdvisorRecommendation {
  title?: string;
  description?: string;
  priority?: string;
  category?: string;
}

export class EnergyAdvisorResponse {
  summary?: string;
  riskLevel?: string;
  totalKwh?: number;
  estimatedCost?: number;
  monthlyGoalKwh?: number;
  goalProgressPercentage?: number;
  estimatedSaving?: number;
  aiGenerated?: boolean;
  metrics?: EnergyAdvisorMetric[];
  recommendations?: EnergyAdvisorRecommendation[];
}
