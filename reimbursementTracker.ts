import { Claim } from '../types';

/**
 * Service for tracking and analyzing reimbursement data
 */
export class ReimbursementTracker {
  /**
   * Calculates reimbursement metrics for a set of claims
   * @param claims Array of claims to analyze
   * @returns Object containing reimbursement metrics
   */
  static calculateReimbursementMetrics(claims: Claim[]): {
    totalBilled: number;
    totalReimbursed: number;
    reimbursementRate: number;
    potentialLoss: number;
    appealableAmount: number;
  } {
    // Calculate total billed amount
    const totalBilled = claims.reduce((sum, claim) => sum + claim.amountBilled, 0);
    
    // Calculate total reimbursed amount
    const totalReimbursed = claims.reduce((sum, claim) => sum + claim.amountApproved, 0);
    
    // Calculate reimbursement rate
    const reimbursementRate = totalBilled > 0 ? totalReimbursed / totalBilled : 0;
    
    // Calculate potential loss (denied claims that could be appealed)
    const potentialLoss = claims
      .filter(claim => claim.status === 'denied')
      .reduce((sum, claim) => sum + claim.amountBilled, 0);
    
    // Calculate appealable amount (denied claims + pending claims at risk)
    const appealableAmount = potentialLoss + claims
      .filter(claim => claim.status === 'appealing')
      .reduce((sum, claim) => sum + claim.amountBilled, 0);
    
    return {
      totalBilled,
      totalReimbursed,
      reimbursementRate,
      potentialLoss,
      appealableAmount
    };
  }
  
  /**
   * Predicts reimbursement outcome for a new claim
   * @param claim The claim to analyze
   * @returns Predicted reimbursement amount and confidence score
   */
  static predictReimbursement(claim: Partial<Claim>): {
    predictedAmount: number;
    confidenceScore: number;
    riskFactors: string[];
  } {
    // In a real implementation, this would use AI to predict reimbursement
    // For the MVP, we'll use simple heuristics
    
    const amountBilled = claim.amountBilled || 0;
    const riskFactors: string[] = [];
    let confidenceScore = 0.8; // Start with high confidence
    
    // Adjust based on drug name (simplified for MVP)
    if (claim.drugName) {
      const drugName = claim.drugName.toLowerCase();
      
      if (drugName.includes('generic')) {
        confidenceScore += 0.1;
      } else if (drugName.includes('brand')) {
        confidenceScore -= 0.1;
        riskFactors.push('Brand-name medication');
      }
      
      // High-cost medications often have lower reimbursement rates
      if (amountBilled > 100) {
        confidenceScore -= 0.15;
        riskFactors.push('High-cost medication');
      }
    }
    
    // Adjust based on insurer (simplified for MVP)
    if (claim.insurerName) {
      const insurerName = claim.insurerName.toLowerCase();
      
      if (insurerName.includes('medicare')) {
        confidenceScore -= 0.05;
        riskFactors.push('Medicare typically has fixed reimbursement schedules');
      } else if (insurerName.includes('medicaid')) {
        confidenceScore -= 0.1;
        riskFactors.push('Medicaid typically has lower reimbursement rates');
      }
    }
    
    // Calculate predicted amount (simplified for MVP)
    let predictedAmount = amountBilled;
    
    if (confidenceScore < 0.7) {
      // Higher risk of partial reimbursement
      predictedAmount = amountBilled * 0.8;
    } else if (confidenceScore < 0.6) {
      // Higher risk of significant reduction
      predictedAmount = amountBilled * 0.6;
    }
    
    // Ensure confidence score is within bounds
    confidenceScore = Math.max(0, Math.min(1, confidenceScore));
    
    return {
      predictedAmount,
      confidenceScore,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['No significant risk factors identified']
    };
  }
  
  /**
   * Analyzes reimbursement trends over time
   * @param claims Array of claims to analyze
   * @returns Analysis of reimbursement trends
   */
  static analyzeReimbursementTrends(claims: Claim[]): {
    trend: 'improving' | 'stable' | 'declining';
    averageReimbursementRate: number;
    topInsurers: { name: string; rate: number }[];
    recommendations: string[];
  } {
    // Group claims by insurer
    const insurerGroups: Record<string, Claim[]> = {};
    
    claims.forEach(claim => {
      if (!insurerGroups[claim.insurerName]) {
        insurerGroups[claim.insurerName] = [];
      }
      insurerGroups[claim.insurerName].push(claim);
    });
    
    // Calculate reimbursement rate by insurer
    const insurerRates: { name: string; rate: number }[] = [];
    
    Object.entries(insurerGroups).forEach(([insurer, insurerClaims]) => {
      const totalBilled = insurerClaims.reduce((sum, claim) => sum + claim.amountBilled, 0);
      const totalReimbursed = insurerClaims.reduce((sum, claim) => sum + claim.amountApproved, 0);
      const rate = totalBilled > 0 ? totalReimbursed / totalBilled : 0;
      
      insurerRates.push({ name: insurer, rate });
    });
    
    // Sort insurers by reimbursement rate (descending)
    insurerRates.sort((a, b) => b.rate - a.rate);
    
    // Calculate overall average reimbursement rate
    const totalBilled = claims.reduce((sum, claim) => sum + claim.amountBilled, 0);
    const totalReimbursed = claims.reduce((sum, claim) => sum + claim.amountApproved, 0);
    const averageReimbursementRate = totalBilled > 0 ? totalReimbursed / totalBilled : 0;
    
    // Determine trend (simplified for MVP)
    // In a real implementation, this would analyze data over time
    const trend: 'improving' | 'stable' | 'declining' = 
      averageReimbursementRate > 0.8 ? 'improving' :
      averageReimbursementRate > 0.6 ? 'stable' : 'declining';
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (trend === 'declining') {
      recommendations.push('Review claim submission process for common errors');
      recommendations.push('Analyze denied claims for patterns and address root causes');
    }
    
    if (insurerRates.length > 0 && insurerRates[0].rate > averageReimbursementRate + 0.1) {
      recommendations.push(`Study successful claims with ${insurerRates[0].name} to identify best practices`);
    }
    
    if (insurerRates.length > 0 && insurerRates[insurerRates.length - 1].rate < averageReimbursementRate - 0.1) {
      recommendations.push(`Consider renegotiating terms with ${insurerRates[insurerRates.length - 1].name}`);
    }
    
    // Ensure we have at least one recommendation
    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring reimbursement trends');
    }
    
    return {
      trend,
      averageReimbursementRate,
      topInsurers: insurerRates.slice(0, 3), // Top 3 insurers
      recommendations
    };
  }
}
