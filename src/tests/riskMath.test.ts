import { describe, it, expect } from 'vitest';
import {
  calculateConfusionMatrixAtThreshold,
  calculateBrierScore,
} from '../utils/riskMath';

describe('FraudGraph AI — Risk Mathematics & Calibration', () => {
  it('recalculates confusion matrix metrics dynamically at different thresholds', () => {
    const lowThreshold = calculateConfusionMatrixAtThreshold(0.20, 50000, 2056);
    const highThreshold = calculateConfusionMatrixAtThreshold(0.80, 50000, 2056);

    // At lower threshold: Higher recall, lower precision, more false positives
    expect(lowThreshold.recall).toBeGreaterThan(highThreshold.recall);
    expect(lowThreshold.falsePositives).toBeGreaterThan(highThreshold.falsePositives);

    // At higher threshold: Higher precision, fewer false positives
    expect(highThreshold.precision).toBeGreaterThan(lowThreshold.precision);
    expect(highThreshold.truePositives + highThreshold.falseNegatives).toBe(2056);
  });

  it('computes accurate Brier calibration scores', () => {
    // Perfect predictions
    expect(calculateBrierScore([1, 0, 1], [1, 0, 1])).toBe(0);

    // Moderate calibration
    const brier = calculateBrierScore([0.9, 0.2, 0.8], [1, 0, 1]);
    expect(brier).toBeLessThan(0.05);
  });
});
