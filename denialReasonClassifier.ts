import { DenialReason } from '../types';

/**
 * Service for classifying and analyzing claim denial reasons
 */
export class DenialReasonClassifier {
  /**
   * Classifies a denial reason based on the text description
   * @param denialText The text description of the denial
   * @returns The classified denial reason with recommended actions
   */
  static classifyDenialReason(denialText: string): DenialReason {
    // In a real implementation, this would use NLP/AI to analyze the text
    // For the MVP, we'll use simple keyword matching
    
    const lowerText = denialText.toLowerCase();
    
    if (lowerText.includes('formulary') || lowerText.includes('not covered')) {
      return {
        code: 'FORM-001',
        description: 'Non-formulary medication',
        category: 'formulary',
        recommendedAction: 'Submit appeal with medical necessity documentation',
        appealSuccessRate: 0.65
      };
    } else if (lowerText.includes('prior auth') || lowerText.includes('authorization')) {
      return {
        code: 'PA-001',
        description: 'Prior authorization required',
        category: 'prior_auth',
        recommendedAction: 'Submit prior authorization request with clinical justification',
        appealSuccessRate: 0.78
      };
    } else if (lowerText.includes('step') || lowerText.includes('try first')) {
      return {
        code: 'ST-001',
        description: 'Step therapy required',
        category: 'step_therapy',
        recommendedAction: 'Document previous medication failures or contraindications',
        appealSuccessRate: 0.72
      };
    } else if (lowerText.includes('quantity') || lowerText.includes('limit')) {
      return {
        code: 'QL-001',
        description: 'Quantity limit exceeded',
        category: 'quantity_limit',
        recommendedAction: 'Provide documentation supporting higher quantity',
        appealSuccessRate: 0.58
      };
    } else if (lowerText.includes('patient') || lowerText.includes('information') || lowerText.includes('mismatch')) {
      return {
        code: 'INFO-001',
        description: 'Patient information mismatch',
        category: 'patient_info',
        recommendedAction: 'Verify and correct patient information',
        appealSuccessRate: 0.92
      };
    } else {
      return {
        code: 'OTH-001',
        description: 'Other denial reason',
        category: 'other',
        recommendedAction: 'Review denial notice and contact insurer for clarification',
        appealSuccessRate: 0.45
      };
    }
  }
  
  /**
   * Gets recommended appeal strategy based on denial reason
   * @param denialReason The denial reason to analyze
   * @returns Recommended appeal strategy text
   */
  static getAppealStrategy(denialReason: DenialReason): string {
    // In a real implementation, this would use AI to generate customized strategies
    // For the MVP, we'll return predefined strategies based on category
    
    switch (denialReason.category) {
      case 'formulary':
        return 'Gather documentation showing patient has tried formulary alternatives without success, or has contraindications to formulary options. Include peer-reviewed studies supporting the efficacy of the prescribed medication for this specific condition.';
        
      case 'prior_auth':
        return 'Complete prior authorization form with detailed clinical justification. Include relevant lab results, treatment history, and specific reasons why this medication is necessary for the patient.';
        
      case 'step_therapy':
        return 'Document all previous medications the patient has tried in this class, including dates, dosages, and reasons for discontinuation (side effects, lack of efficacy, etc.).';
        
      case 'quantity_limit':
        return 'Provide clinical justification for exceeding quantity limits, such as titration schedule, breakthrough symptoms, or specific dosing requirements based on patient characteristics.';
        
      case 'patient_info':
        return 'Verify all patient information with current insurance card. Submit correction with copy of insurance card and any other supporting documentation of current coverage.';
        
      default:
        return 'Request specific details about the denial reason from the insurer. Once clarified, gather appropriate documentation to address the specific concern.';
    }
  }
  
  /**
   * Analyzes denial patterns across multiple claims
   * @param denialReasons Array of denial reasons to analyze
   * @returns Analysis of denial patterns and recommendations
   */
  static analyzeDenialPatterns(denialReasons: DenialReason[]): {
    mostCommonCategory: string;
    highestSuccessRate: number;
    recommendedFocus: string;
  } {
    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    const successRates: Record<string, number[]> = {};
    
    denialReasons.forEach(reason => {
      const category = reason.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      if (!successRates[category]) {
        successRates[category] = [];
      }
      successRates[category].push(reason.appealSuccessRate);
    });
    
    // Find most common category
    let mostCommonCategory = '';
    let maxCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonCategory = category;
      }
    });
    
    // Calculate average success rate for each category
    const avgSuccessRates: Record<string, number> = {};
    let highestSuccessRate = 0;
    let highestSuccessCategory = '';
    
    Object.entries(successRates).forEach(([category, rates]) => {
      const avg = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
      avgSuccessRates[category] = avg;
      
      if (avg > highestSuccessRate) {
        highestSuccessRate = avg;
        highestSuccessCategory = category;
      }
    });
    
    // Determine recommended focus area
    let recommendedFocus = '';
    
    if (categoryCounts[mostCommonCategory] > denialReasons.length * 0.5) {
      // If a single category accounts for more than 50% of denials
      recommendedFocus = `Focus on reducing ${mostCommonCategory} denials through process improvements`;
    } else if (highestSuccessRate > 0.7) {
      // If there's a category with high appeal success rate
      recommendedFocus = `Prioritize appealing ${highestSuccessCategory} denials due to high success rate`;
    } else {
      recommendedFocus = 'Implement comprehensive claim validation process to reduce overall denial rate';
    }
    
    return {
      mostCommonCategory,
      highestSuccessRate,
      recommendedFocus
    };
  }
}
