import { ApplicationStatus } from '@prisma/client';

/**
 * Loan lifecycle state machine:
 *  LEAD → LOGIN → DOC_PENDING → UNDER_REVIEW → APPROVED → DISBURSED
 *                                           ↘ REJECTED
 *  Any state (except terminal DISBURSED) → CANCELLED.
 */
const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  LEAD:          ['LOGIN', 'CANCELLED'],
  LOGIN:         ['DOC_PENDING', 'CANCELLED'],
  DOC_PENDING:   ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW:  ['APPROVED', 'REJECTED', 'DOC_PENDING', 'CANCELLED'],
  APPROVED:      ['DISBURSED', 'CANCELLED'],
  REJECTED:      [],
  DISBURSED:     [],
  CANCELLED:     [],
};

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function nextAllowed(from: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[from] ?? [];
}
