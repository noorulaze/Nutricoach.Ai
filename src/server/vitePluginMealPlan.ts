import type { Plugin } from 'vite';
import { executeGenerateMealPlan, executeSwapMeal } from './mealPlanService';

/**
 * Vite plugin that provides live, secure server-side API endpoints
 * for NutriCoach AI meal planning:
 * - POST /api/generate-meal-plan
 * - POST /api/swap-meal
 */
export function vitePluginMealPlan(): Plugin {
  const handleApiRequest = async (req: any, res: any, next: () => void) => {
    const url = req.url?.split('?')[0];

    if (req.method === 'POST' && url === '/api/generate-meal-plan') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = await executeGenerateMealPlan(payload);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            isAIGenerated: false,
            days: [],
            error: err?.message || 'Internal server error processing meal plan'
          }));
        }
      });
      return;
    }

    if (req.method === 'POST' && url === '/api/swap-meal') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = await executeSwapMeal(payload);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            isAIGenerated: false,
            error: err?.message || 'Internal server error swapping meal'
          }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'vite-plugin-meal-plan-api',
    configureServer(server) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRequest);
    }
  };
}
