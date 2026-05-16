export interface VehicleTask {
  TaskID: string;
  Duration: number;
  Impact: number;
}

export function solveKnapsack(tasks: VehicleTask[], maxHours: number) {
  if (!Array.isArray(tasks) || tasks.length === 0 || typeof maxHours !== 'number' || isNaN(maxHours) || maxHours <= 0) {
    return { selectedTasks: [], totalDuration: 0, totalImpact: 0 };
  }
  const n = tasks.length;
  // dp[i][w] will be the max impact for first i tasks and w capacity
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    for (let w = 0; w <= maxHours; w++) {
      if (task.Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - task.Duration] + task.Impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find the selected tasks
  let res = dp[n][maxHours];
  let w = maxHours;
  const selectedTasks: string[] = [];
  let totalDuration = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      // This task was included
      const task = tasks[i - 1];
      selectedTasks.push(task.TaskID);
      res -= task.Impact;
      w -= task.Duration;
      totalDuration += task.Duration;
    }
  }

  return {
    selectedTasks: selectedTasks.reverse(),
    totalDuration,
    totalImpact: dp[n][maxHours]
  };
}
