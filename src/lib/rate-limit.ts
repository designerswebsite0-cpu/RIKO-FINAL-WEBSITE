const attempts = new Map<string, number>();

export function reservationRateLimited(ip: string) {
  const last = attempts.get(ip) ?? 0;
  return Date.now() - last < 30_000;
}

export function recordReservation(ip: string) {
  attempts.set(ip, Date.now());
}
