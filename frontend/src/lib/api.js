const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchUser = async (userId) => {
  const res = await fetch(`${API_URL}/api/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const fetchPolicies = async (userId) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/policies`);
  if (!res.ok) throw new Error('Failed to fetch policies');
  return res.json();
};

export const simulateTrigger = async (location) => {
  const res = await fetch(`${API_URL}/api/simulator/trigger?city=${encodeURIComponent(location)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to trigger simulation');
  return res.json();
};
