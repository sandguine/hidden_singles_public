export const settings = {
  testEnvironment: true,
  // hostURL: 'http://52.53.212.49:5001',
  hostURL: 'http://localhost:5001',
  saveDirectory: 'hiddensingles/round1',
  numPhase1Puzzles: 25,
  numConditions: 8,
  maxTime: 120, // in seconds
  timeoutPenalty: 10, // in seconds
  tutorialMaxAttempts: 1,
  testMaxAttempts: 1,
  failurePenalty: 10, // in seconds
  basePay: 0.20,
  stayPay: 0, //.375,
  instructionPay: 0.00,
  simpleTaskPay: 0.00,
  practicePuzzlePay: [0.16],
  puzzlePay: [0.16, 0],
  diagnosticTestPay: 0.25,
};

if (settings.testEnvironment) {
  settings['saveDirectory'] = settings['saveDirectory'] + '/test';
}