import type { Plugin } from 'vite';
import { executeGenerateMealPlan, executeSwapMeal } from './mealPlanService';
import { executeChat } from './chatService';

/**
 * Vite plugin that provides live, secure server-side API endpoints
 * for NutriCoach AI:
 * - POST /api/chat
 * - POST /api/generate-meal-plan
 * - POST /api/swap-meal
 */
export function vitePluginMealPlan(): Plugin {
  const handleApiRequest = async (req: any, res: any, next: () => void) => {
    const url = req.url?.split('?')[0];

    // 1. Chatbot API Endpoint
    if (req.method === 'POST' && url === '/api/chat') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const result = await executeChat(payload);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: false,
            isLiveApi: false,
            text: 'An error occurred processing the chat query.',
            suggestedPrompts: [],
            error: err?.message || 'Internal server error in chat'
          }));
        }
      });
      return;
    }

    // 2. Generate Meal Plan Endpoint
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

    // 3. Swap Meal Endpoint
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
    name: 'vite-plugin-nutricoach-api',
    configureServer(server) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRequest);
    }
  };
}

export const vitePluginApi = vitePluginMealPlan;
