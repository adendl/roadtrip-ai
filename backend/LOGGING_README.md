# Logging Setup with Log4j2

This document explains the logging configuration and how to use logging in the TravelJournal AI application.

## Configuration Files

### 1. log4j2.xml
Located at `src/main/resources/log4j2.xml`, this file configures:
- **Console Appender**: Logs to console with timestamp, thread, level, logger name, and message
- **Rolling File Appenders**: 
  - `traveljournal-ai.log` - General application logs
  - `traveljournal-ai-error.log` - Error-level logs only
  - `traveljournal-ai-security.log` - Security-related logs
  - `traveljournal-ai-database.log` - Database/Hibernate logs

### 2. application.properties
Contains logging-specific properties:
```properties
logging.config=classpath:log4j2.xml
logging.level.com.adendl.traveljournalai=DEBUG
logging.level.org.springframework.security=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

## Log Levels

- **TRACE**: Most detailed logging, including parameter values
- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error messages for error conditions
- **FATAL**: Severe errors that may prevent the application from running

## How to Use Logging

### 1. Basic Logger Setup
```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class YourClass {
    private static final Logger logger = LogManager.getLogger(YourClass.class);
    
    public void yourMethod() {
        logger.info("This is an info message");
        logger.debug("This is a debug message");
        logger.error("This is an error message", exception);
    }
}
```

### 2. Using LoggingUtils (Recommended)
```java
import com.adendl.traveljournalai.utils.LoggingUtils;

public class YourClass {
    private static final Logger logger = LoggingUtils.getLogger(YourClass.class);
    
    public void yourMethod(String param1, int param2) {
        // Log method entry with parameters
        LoggingUtils.logMethodEntry(logger, "yourMethod", "param1", param1, "param2", param2);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Your business logic here
            String result = "some result";
            
            // Log method exit with result
            LoggingUtils.logMethodExit(logger, "yourMethod", result);
            
            // Log performance
            LoggingUtils.logPerformance(logger, "yourMethod", startTime);
            
        } catch (Exception e) {
            // Log method exit with exception
            LoggingUtils.logMethodExitWithException(logger, "yourMethod", e);
            throw e;
        }
    }
}
```

### 3. Security Logging
```java
// Log security events
LoggingUtils.logSecurityEvent(logger, "LOGIN_ATTEMPT", username, "Failed login attempt");
LoggingUtils.logSecurityEvent(logger, "UNAUTHORIZED_ACCESS", null, "Access denied to /admin");
```

## Log File Locations

Log files are created in the `logs/` directory relative to your application's working directory:

- `logs/traveljournal-ai.log` - General application logs
- `logs/traveljournal-ai-error.log` - Error logs only
- `logs/traveljournal-ai-security.log` - Security logs
- `logs/traveljournal-ai-database.log` - Database logs

## Log Rotation

Log files are automatically rotated:
- **Time-based**: Daily rotation
- **Size-based**: When file reaches 10MB
- **Retention**: Maximum 10 files per log type

## Best Practices

1. **Use appropriate log levels**:
   - TRACE: For detailed debugging
   - DEBUG: For development debugging
   - INFO: For general application flow
   - WARN: For potential issues
   - ERROR: For actual errors

2. **Include context in log messages**:
   ```java
   // Good
   logger.info("User {} created trip from {} to {}", username, fromCity, toCity);
   
   // Bad
   logger.info("Trip created");
   ```

3. **Use parameterized logging**:
   ```java
   // Good - parameters are only evaluated if log level is enabled
   logger.debug("Processing user: {}", username);
   
   // Bad - string concatenation happens regardless of log level
   logger.debug("Processing user: " + username);
   ```

4. **Log exceptions properly**:
   ```java
   try {
       // some code
   } catch (Exception e) {
       logger.error("Failed to process request: {}", e.getMessage(), e);
   }
   ```

5. **Use LoggingUtils for common patterns**:
   - Method entry/exit logging
   - Performance logging
   - Security event logging

## Monitoring and Debugging

### Viewing Logs
- **Console**: Logs appear in your IDE console or terminal
- **Files**: Check the `logs/` directory for log files
- **Real-time**: Use `tail -f logs/traveljournal-ai.log` to follow logs

### Common Issues
1. **No logs appearing**: Check if log level is set correctly
2. **Too many logs**: Increase log level (INFO → WARN → ERROR)
3. **Missing logs**: Decrease log level (ERROR → WARN → INFO → DEBUG)

## Configuration Changes

To modify logging behavior:
1. Edit `log4j2.xml` for appender and logger configuration
2. Edit `application.properties` for Spring Boot logging levels
3. Restart the application for changes to take effect

## Example Output

```
2024-01-15 10:30:45.123 [http-nio-8080-exec-1] INFO  c.a.t.controller.TripController - Creating new trip from New York to Paris for 7 days
2024-01-15 10:30:45.456 [http-nio-8080-exec-1] DEBUG c.a.t.service.TripService - Entering createTrip(jwtToken=eyJ..., fromCity=New York, toCity=Paris, roundtrip=true, days=7)
2024-01-15 10:30:46.789 [http-nio-8080-exec-1] INFO  c.a.t.controller.TripController - Successfully created trip with ID: 123
2024-01-15 10:30:46.790 [http-nio-8080-exec-1] INFO  c.a.t.utils.LoggingUtils - createTrip completed in 1667 ms
``` 