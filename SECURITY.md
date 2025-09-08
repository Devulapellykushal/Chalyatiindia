# Security Configuration Guide

## Environment Variables

This application uses environment variables for secure configuration. Never commit sensitive data to version control.

### Required Environment Variables

1. **MONGODB_URI** - MongoDB connection string
2. **JWT_SECRET** - Secret key for JWT tokens (minimum 32 characters)
3. **ADMIN_PASSWORD** - Admin account password

### Security Best Practices

1. **Change Default Credentials**
   - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in production
   - Use strong passwords (minimum 12 characters with special characters)

2. **JWT Secret**
   - Generate a cryptographically secure random string
   - Minimum 32 characters recommended
   - Keep it secret and rotate regularly

3. **Database Security**
   - Use MongoDB Atlas with IP whitelisting
   - Enable database authentication
   - Use connection string with proper credentials

4. **CORS Configuration**
   - Only allow trusted domains
   - Remove localhost URLs in production

5. **File Uploads**
   - Consider using cloud storage (AWS S3, Cloudinary)
   - Validate file types and sizes
   - Scan uploaded files for malware

## Production Deployment Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Configure production database
- [ ] Update CORS origins
- [ ] Set up HTTPS/SSL
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Configure rate limiting
- [ ] Set up security headers

## Security Headers

The application includes security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Rate Limiting

- Login attempts: 5 attempts per 15 minutes
- Admin operations: 100 requests per 15 minutes
- General API: Configured per endpoint

## File Security

- Maximum file size: 5MB
- Allowed file types: Images only
- Upload path: ./uploads (consider cloud storage for production)
