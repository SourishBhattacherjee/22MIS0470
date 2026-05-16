export interface EvaluationNotification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export const getTopNotifications = (notifications: EvaluationNotification[], limit: number = 10) => {
  const currentTimestamp = Date.now();

  const scoredNotifications = notifications.map(notif => {
    let basePriority = 0;
    if (notif.Type === 'Placement') basePriority = 100;
    else if (notif.Type === 'Result') basePriority = 80;
    else if (notif.Type === 'Event') basePriority = 60;

    // Convert ISO Timestamp to numeric value and calculate recency weight
    // A simple recency weight: normalize by max age if needed, or simply
    // (1 / ageInSeconds) * arbitrary factor
    const notifTimestamp = new Date(notif.Timestamp).getTime();
    const ageInSeconds = Math.max(1, (currentTimestamp - notifTimestamp) / 1000);
    const recencyWeight = 10000 / ageInSeconds; // the newer, the higher the weight

    const score = basePriority + recencyWeight;

    return {
      ...notif,
      score
    };
  });

  scoredNotifications.sort((a, b) => b.score - a.score);
  return scoredNotifications.slice(0, limit);
};
