import { Router, Request, Response } from 'express';
import { parseAdHtml } from '../parser.js';
import type { ParseAdRequest, AdData } from '../types.js';

export const apiRouter = Router();

apiRouter.post('/parse-ad', (req: Request<{}, {}, ParseAdRequest>, res: Response<AdData | { error: string }>) => {
  try {
    const { html } = req.body;

    if (!html || typeof html !== 'string') {
      res.status(400).json({
        error: 'Invalid request: html field is required and must be a string',
      });
      return;
    }

    if (html.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request: html cannot be empty',
      });
      return;
    }

    const adData = parseAdHtml(html);

    res.status(200).json(adData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: `Failed to parse ad HTML: ${errorMessage}`,
    });
  }
});
