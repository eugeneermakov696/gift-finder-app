const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const CURRENT_LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();
const IS_OFFLINE = process.env.IS_OFFLINE === 'true';

// Fallback safely to info (1) if an invalid env value is provided
const currentLevelPriority = LOG_LEVELS[CURRENT_LOG_LEVEL] !== undefined
  ? LOG_LEVELS[CURRENT_LOG_LEVEL]
  : 1;

/**
 * Core log orchestrator that builds output strings according to runtime state
 */
function log(level, message, context = {}) {
  // Guard against untracked log levels to prevent runtime errors
  const messagePriority = LOG_LEVELS[level] !== undefined ? LOG_LEVELS[level] : 99;

  if (messagePriority < currentLevelPriority) {
    return; // Suppress logs below the active configuration threshold
  }

  const timestamp = new Date().toISOString();

  if (IS_OFFLINE) {
    // Human-friendly, colorized shell output configuration for local debugging
    const colors = { debug: '\x1b[36m', info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m', reset: '\x1b[0m' };
    const color = colors[level] || colors.reset;
    const contextString = Object.keys(context).length ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';

    console.log(`[${timestamp}] ${color}${level.toUpperCase()}${colors.reset}: ${message}${contextString}`);
  } else {
    // Standardized single-line JSON structure optimized for AWS CloudWatch parsing log loops
    console.log(JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      stage: process.env.STAGE || 'unknown',
      ...context
    }));
  }
}

// Helper to normalize context data and handle embedded Error instances
function formatContext(ctx) {
  if (ctx instanceof Error) {
    return { errorName: ctx.name, errorMessage: ctx.message, stack: ctx.stack };
  }
  return ctx;
}

module.exports = {
  debug: (msg, ctx) => log('debug', msg, formatContext(ctx)),
  info: (msg, ctx) => log('info', msg, formatContext(ctx)),
  warn: (msg, ctx) => log('warn', msg, formatContext(ctx)),
  error: (msg, ctx) => log('error', msg, formatContext(ctx))
};
