# Security Guide for roadtrip.ai

## 🔒 Security Considerations

This document outlines security best practices for deploying roadtrip.ai in production.

## Environment Variables

### Backend Configuration

1. **Copy the template file:**
   ```bash
   cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
   ```

2. **Configure the following variables:**

   - `spring.datasource.url`: Your PostgreSQL database URL
   - `spring.datasource.username`: Database username
   - `spring.datasource.password`: Strong database password
   - `jwt.secret`: Generate a strong JWT secret (at least 256 bits)
   - `openai.api.key`: Your OpenAI API key

3. **Generate a secure JWT secret:**
   ```bash
   # Using OpenSSL
   openssl rand -base64 32
   
   # Or using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

### Frontend Configuration

1. **Copy the template file:**
   ```bash
   cp frontend/env.template frontend/.env.production
   ```

2. **Configure the following variables:**
   - `VITE_API_BASE_URL`: Your backend API URL
   - `VITE_GRAPHHOPPER_API_KEY`: (Optional) GraphHopper API key

## Production Security Checklist

### ✅ Database Security
- [ ] Use strong, unique passwords for database users
- [ ] Enable SSL/TLS for database connections
- [ ] Restrict database access to application servers only
- [ ] Regularly update database software
- [ ] Enable database logging and monitoring

### ✅ API Security
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Set appropriate CORS policies
- [ ] Validate all input data
- [ ] Use prepared statements (already implemented with JPA)

### ✅ JWT Security
- [ ] Use a strong, randomly generated secret
- [ ] Set appropriate token expiration times
- [ ] Implement token refresh mechanism
- [ ] Store secrets securely (use environment variables)

### ✅ OpenAI API Security
- [ ] Use environment variables for API keys
- [ ] Implement rate limiting for OpenAI API calls
- [ ] Monitor API usage and costs
- [ ] Consider using API key rotation

### ✅ Infrastructure Security
- [ ] Use HTTPS for all external communications
- [ ] Implement proper firewall rules
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Implement backup strategies

## Security Headers

The application should be deployed with the following security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

## Monitoring and Logging

- Monitor application logs for suspicious activity
- Set up alerts for failed authentication attempts
- Monitor API usage patterns
- Regular security audits

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices) 