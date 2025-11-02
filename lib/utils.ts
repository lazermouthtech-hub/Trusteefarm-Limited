
import { Farmer, GradingInfo, GradingBadge } from '../types';

export const calculateFarmerGrade = (farmer: Farmer): GradingInfo => {
  // Data Completeness (40%)
  const completenessWeight = farmer.profileCompleteness * 40;

  // Ensure registrationDate is a valid Date object before calling getTime()
  const registrationDate = new Date(farmer.registrationDate);

  // Activity & Reliability (30%) - Mocked
  const activityScore = Math.min(1, farmer.produces.length / 5) * 5 + // Number of produces listed (5%)
                        (farmer.buyerRating > 0 ? 10 : 0) + // Harvest date accuracy (mocked with rating) (10%)
                        Math.min(1, (new Date().getTime() - registrationDate.getTime()) / (30 * 24 * 60 * 60 * 1000)) * 5 + // Profile update freq (mocked with age) (5%)
                        (farmer.buyerRating / 5) * 10; // Response rate (mocked with rating) (10%)
  const activityWeight = Math.min(activityScore, 30);

  // Quality Indicators (20%) - Mocked
  const qualityScore = (farmer.buyerRating / 5) * 10 + // Buyer ratings (10%)
                       Math.min(1, farmer.successfulTransactions / 10) * 10; // Completed transactions (10%)
  const qualityWeight = Math.min(qualityScore, 20);

  // Verification Status (10%)
  const verificationScore = (farmer.phoneVerified ? 4 : 0) +
                            (farmer.identityVerified ? 3 : 0) +
                            (farmer.bankAccountVerified ? 3 : 0);
  const verificationWeight = verificationScore;

  const totalScore = Math.round(completenessWeight + activityWeight + qualityWeight + verificationWeight);
  const stars = Math.round((totalScore / 100) * 5 * 2) / 2; // half-star increments

  let badge: GradingBadge;
  if (totalScore >= 85) badge = GradingBadge.Premium;
  else if (totalScore >= 70) badge = GradingBadge.Trusted;
  else if (totalScore >= 50) badge = GradingBadge.Verified;
  else badge = GradingBadge.NewFarmer;

  return { score: totalScore, stars, badge };
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};