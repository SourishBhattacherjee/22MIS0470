import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export type Stack = 'backend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type PackageName = 
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' 
  | 'handler' | 'repository' | 'route' | 'service' 
  | 'auth' | 'config' | 'middleware' | 'utils';

export async function Log(
  stack: Stack,
  level: LogLevel,
  packageName: PackageName,
  message: string
): Promise<void> {
  const token = process.env.ACCESS_TOKEN;
  
  if (!token) {
    console.warn('LoggingMiddleware: ACCESS_TOKEN not found in environment variables. Log will be printed to console only.');
    console.log(`[${level.toUpperCase()}] ${packageName}: ${message}`);
    return;
  }

  try {
    const url = 'http://4.224.186.213/evaluation-service/logs';
    await axios.post(
      url,
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (error: any) {
    console.error('LoggingMiddleware: Failed to send log to evaluation service', error?.response?.data || error?.message);
    // Fallback to console logging
    console.log(`[${level.toUpperCase()}] ${packageName}: ${message}`);
  }
}
