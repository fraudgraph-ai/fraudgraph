/**
 * FraudGraph AI — Risk Mathematics & Model Performance Simulation Engine
 */

export interface ConfusionMatrixMetrics {
  threshold: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  mcc: number; // Matthews Correlation Coefficient
}

/**
 * Computes calibrated confusion matrix metrics dynamically given a decision threshold.
 * Based on 50,000 evaluated transactions with 2,056 ground-truth fraud cases.
 */
export function calculateConfusionMatrixAtThreshold(
  threshold: number,
  totalPopulation: number = 50000,
  actualPositives: number = 2056
): ConfusionMatrixMetrics {
  const actualNegatives = totalPopulation - actualPositives;

  // As threshold increases:
  // - True Positives decreases smoothly (higher bar means missing borderline frauds)
  // - False Positives drops sharply (higher precision)
  const clampedThreshold = Math.max(0.05, Math.min(0.95, threshold));

  // Sensitivity / Recall curve modeled on trained GNN + LightGBM ensemble
  const estimatedRecall = Math.max(
    0.1,
    Math.min(0.99, 0.98 - 0.45 * Math.pow(clampedThreshold, 1.4))
  );
  const tp = Math.round(actualPositives * estimatedRecall);
  const fn = actualPositives - tp;

  // False positive rate modeled as exponential decay against threshold
  const fpr = 0.04 * Math.exp(-4.2 * (clampedThreshold - 0.1));
  const fp = Math.round(actualNegatives * Math.max(0.0005, fpr));
  const tn = actualNegatives - fp;

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 =
    precision + recall > 0
      ? (2 * (precision * recall)) / (precision + recall)
      : 0;
  const accuracy = (tp + tn) / totalPopulation;

  // MCC calculation
  const numerator = tp * tn - fp * fn;
  const denominator = Math.sqrt(
    (tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)
  );
  const mcc = denominator > 0 ? numerator / denominator : 0;

  return {
    threshold: Math.round(clampedThreshold * 100) / 100,
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    trueNegatives: tn,
    precision: Math.round(precision * 1000) / 10, // e.g. 92.1%
    recall: Math.round(recall * 1000) / 10,
    f1Score: Math.round(f1 * 1000) / 1000,
    accuracy: Math.round(accuracy * 1000) / 10,
    mcc: Math.round(mcc * 1000) / 1000,
  };
}

/**
 * Calculates Brier calibration score
 */
export function calculateBrierScore(
  predictions: number[],
  actuals: number[]
): number {
  if (predictions.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < predictions.length; i++) {
    sum += Math.pow(predictions[i] - actuals[i], 2);
  }
  return Math.round((sum / predictions.length) * 10000) / 10000;
}
