import { Request, Response } from 'express';
import { fetchDepots, fetchVehicles } from '../services/apiService';
import { solveKnapsack } from '../services/knapsackService';
import { Log } from 'logging_middleware';

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
      return res.status(401).json({ error: 'No access token configured' });
    }

    const [depots, vehicles] = await Promise.all([
      fetchDepots(token),
      fetchVehicles(token)
    ]);

    const results = depots.map((depot: any) => {
      const knapsackResult = solveKnapsack(vehicles, depot.MechanicHours);
      return {
        depotId: depot.ID,
        mechanicHours: depot.MechanicHours,
        selectedTasks: knapsackResult.selectedTasks,
        totalDuration: knapsackResult.totalDuration,
        totalImpact: knapsackResult.totalImpact
      };
    });

    await Log('backend', 'info', 'controller', 'Generated schedule using 0/1 knapsack');
    res.status(200).json({ results });
  } catch (error: any) {
    await Log('backend', 'error', 'controller', `Failed to generate schedule: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
