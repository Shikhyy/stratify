/**
 * Sanitizes input text to prevent XSS and SQL injection attempts.
 * Removes <script> tags and common SQL injection patterns.
 */
export function sanitizeInput(text: string): string {
    if (!text) return "";

    // Remove script tags
    let clean = text.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

    // Remove potential SQL injection chars and commands
    // This is a basic firewall against common patterns
    clean = clean.replace(/(--|;|xp_|DROP TABLE|UNION SELECT)/gi, "");

    return clean;
}
