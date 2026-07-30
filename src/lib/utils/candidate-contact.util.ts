export function getCandidateContactLabel(
  email?: string | null,
  phone?: string | null,
): string {
  if (email && phone) {
    return `${email} · ${phone}`;
  }

  return email || phone || 'No contact information';
}