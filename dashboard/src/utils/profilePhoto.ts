const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function normalizeFirstName(fullName: string) {
  const first = fullName?.split(/\s+/)[0] || '';
  return first.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getProfilePhoto(fullName: string, existing?: string | null) {
  if (existing) return existing;
  const first = normalizeFirstName(fullName);
  if (!first) return null;
  return `${API_BASE_URL}/profile-pics/${first}.png`;
}
