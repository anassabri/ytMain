import { ErrorAnalyzer, ErrorRootCause, ErrorSeverity } from '../core/ErrorAnalyzer';

describe('ErrorAnalyzer', () => {
  let analyzer: ErrorAnalyzer;

  beforeEach(() => {
    analyzer = new ErrorAnalyzer();
  });

  describe('Error Categorization', () => {
    it('should categorize syntax errors correctly', () => {
      const mockErrorLine = "utils/securityMonitoring.ts:515:58 - error TS1005: ';' expected.";
      
      // Use reflection to access private method for testing
      const parseErrorLine = (analyzer).parseErrorLine.bind(analyzer);
      const result = parseErrorLine(mockErrorLine);
      
      expect(result).toBeDefined();
      expect(result.code).toBe('TS1005');
      expect(result.category.rootCause).toBe(ErrorRootCause.SYNTAX);
      expect(result.severity).toBe(ErrorSeverity.CRITICAL);
      expect(result.file).toBe('utils/securityMonitoring.ts');
      expect(result.line).toBe(515);
      expect(result.column).toBe(58);
    });

    it('should categorize import errors correctly', () => {
      const mockErrorLine = "src/components/Test.tsx:1:1 - error TS2307: Cannot find module 'missing-module'.";
      
      const parseErrorLine = (analyzer).parseErrorLine.bind(analyzer);
      const result = parseErrorLine(mockErrorLine);
      
      expect(result).toBeDefined();
      expect(result.code).toBe('TS2307');
      expect(result.category.rootCause).toBe(ErrorRootCause.IMPORT);
      expect(result.severity).toBe(ErrorSeverity.HIGH);
    });

    it('should categorize type errors correctly', () => {
      const mockErrorLine = "src/components/Test.tsx:10:5 - error TS2339: Property 'nonExistent' does not exist on type 'TestType'.";
      
      const parseErrorLine = (analyzer).parseErrorLine.bind(analyzer);
      const result = parseErrorLine(mockErrorLine);
      
      expect(result).toBeDefined();
      expect(result.code).toBe('TS2339');
      expect(result.category.rootCause).toBe(ErrorRootCause.TYPE);
      expect(result.severity).toBe(ErrorSeverity.MEDIUM);
    });
  });

  describe('Error Analysis', () => {
    it('should handle empty error output', async () => {
      // Mock the captureTypeScriptErrors method to return empty string
      jest.spyOn(analyzer, 'captureTypeScriptErrors').mockReturnValue('');
      
      const result = await analyzer.analyzeErrors();
      
      expect(result.totalErrors).toBe(0);
      expect(result.errorsByCategory.size).toBe(0);
      expect(result.criticalFiles.length).toBe(0);
    });

    it('should generate recommendations for critical files', () => {
      const mockErrors = [
        {
          file: 'test.ts',
          line: 1,
          column: 1,
          message: 'Syntax error',
          code: 'TS1005',
          category: {
            name: 'Missing Semicolon',
            priority: 1,
            pattern: /TS1005/,
            rootCause: ErrorRootCause.SYNTAX,
            fixingStrategy: 'bulk' as const,
            description: 'Missing semicolons'
          },
          severity: ErrorSeverity.CRITICAL,
          dependencies: [],
          rawError: 'test.ts:1:1 - error TS1005: Syntax error'
        }
      ];

      const generateAnalysisResult = (analyzer).generateAnalysisResult.bind(analyzer);
      const result = generateAnalysisResult(mockErrors);
      
      expect(result.totalErrors).toBe(1);
      expect(result.criticalFiles).toContain('test.ts');
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toContain('CRITICAL');
    });
  });

  describe('Error Parsing', () => {
    it('should parse complex error messages', () => {
      const complexError = "utils/securityMonitoring.ts:515:58 - error TS1005: ';' expected.";
      
      const parseErrorLine = (analyzer).parseErrorLine.bind(analyzer);
      const result = parseErrorLine(complexError);
      
      expect(result).toBeDefined();
      expect(result.file).toBe('utils/securityMonitoring.ts');
      expect(result.line).toBe(515);
      expect(result.column).toBe(58);
      expect(result.code).toBe('TS1005');
      expect(result.message).toBe("';' expected.");
    });

    it('should handle malformed error lines gracefully', () => {
      const malformedError = "This is not a valid TypeScript error line";
      
      const parseErrorLine = (analyzer).parseErrorLine.bind(analyzer);
      const result = parseErrorLine(malformedError);
      
      expect(result).toBeNull();
    });
  });
});