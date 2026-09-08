import { CouncilMode } from '../types/ai';

export const VALID_MODES: CouncilMode[] = ['QUICK', 'BALANCED', 'DEEP ANALYSIS', 'DEBATE', 'CODING'];

export const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_QUESTION_LENGTH = 10000;
export const MIN_QUESTION_LENGTH = 3;

export function validateQuestion(question: unknown): { valid: boolean; error?: string; cleanQuestion?: string } {
  if (typeof question !== 'string') {
    return { valid: false, error: 'Question must be a text string.' };
  }

  const trimmed = question.trim();
  if (trimmed.length < MIN_QUESTION_LENGTH) {
    return { valid: false, error: `Question must be at least ${MIN_QUESTION_LENGTH} characters long.` };
  }

  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return { valid: false, error: `Question exceeds maximum allowed length of ${MAX_QUESTION_LENGTH} characters.` };
  }

  return { valid: true, cleanQuestion: trimmed };
}

export function validateMode(mode: unknown): CouncilMode {
  if (typeof mode === 'string' && VALID_MODES.includes(mode as CouncilMode)) {
    return mode as CouncilMode;
  }
  return 'BALANCED';
}

export function sanitizeFilename(filename: string): string {
  // Strip paths, special characters, and keep safe alphanumeric + extensions
  const base = filename.replace(/^.*[\\/]/, '');
  const sanitized = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return sanitized.slice(0, 100) || 'attachment.txt';
}
