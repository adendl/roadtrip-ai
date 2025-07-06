package com.adendl.traveljournalai.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Utility class for common logging operations
 */
public class LoggingUtils {
    
    /**
     * Get a logger for the specified class
     * @param clazz The class to get a logger for
     * @return Logger instance
     */
    public static Logger getLogger(Class<?> clazz) {
        return LogManager.getLogger(clazz);
    }
    
    /**
     * Log method entry with parameters
     * @param logger The logger to use
     * @param methodName The name of the method being entered
     * @param params The parameters to log
     */
    public static void logMethodEntry(Logger logger, String methodName, Object... params) {
        if (logger.isDebugEnabled()) {
            StringBuilder sb = new StringBuilder("Entering ").append(methodName).append("(");
            for (int i = 0; i < params.length; i += 2) {
                if (i > 0) sb.append(", ");
                if (i + 1 < params.length) {
                    sb.append(params[i]).append("=").append(params[i + 1]);
                } else {
                    sb.append(params[i]);
                }
            }
            sb.append(")");
            logger.debug(sb.toString());
        }
    }
    
    /**
     * Log method exit
     * @param logger The logger to use
     * @param methodName The name of the method being exited
     * @param result The result to log (can be null)
     */
    public static void logMethodExit(Logger logger, String methodName, Object result) {
        if (logger.isDebugEnabled()) {
            if (result != null) {
                logger.debug("Exiting {} with result: {}", methodName, result);
            } else {
                logger.debug("Exiting {}", methodName);
            }
        }
    }
    
    /**
     * Log method exit with exception
     * @param logger The logger to use
     * @param methodName The name of the method being exited
     * @param exception The exception that occurred
     */
    public static void logMethodExitWithException(Logger logger, String methodName, Exception exception) {
        logger.error("Exiting {} with exception: {}", methodName, exception.getMessage(), exception);
    }
    
    /**
     * Log performance information
     * @param logger The logger to use
     * @param operation The operation being performed
     * @param startTime The start time in milliseconds
     */
    public static void logPerformance(Logger logger, String operation, long startTime) {
        long duration = System.currentTimeMillis() - startTime;
        logger.info("{} completed in {} ms", operation, duration);
    }
    
    /**
     * Log security-related events
     * @param logger The logger to use
     * @param event The security event
     * @param username The username (can be null)
     * @param details Additional details
     */
    public static void logSecurityEvent(Logger logger, String event, String username, String details) {
        if (username != null) {
            logger.warn("SECURITY: {} - User: {} - Details: {}", event, username, details);
        } else {
            logger.warn("SECURITY: {} - Details: {}", event, details);
        }
    }
} 