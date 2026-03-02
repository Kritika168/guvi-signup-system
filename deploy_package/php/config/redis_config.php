<?php
// Redis Configuration
class RedisConfig {
    private static $redis = null;
    
    // Environment detection
    private static function getConfig() {
        $isLocal = (isset($_SERVER['HTTP_HOST']) && 
                   (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
                    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false));
        
        if ($isLocal) {
            return [
                'host' => '127.0.0.1',
                'port' => 6379,
                'password' => null
            ];
        } else {
            // Cloud Configuration - Redis Cloud
            return [
                'host' => getenv('REDIS_HOST') ?: 'redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com',
                'port' => getenv('REDIS_PORT') ?: 12345,
                'password' => getenv('REDIS_PASSWORD') ?: null
            ];
        }
    }
    
    const SESSION_PREFIX = 'session:';
    const SESSION_EXPIRY = 3600; // 1 hour in seconds
    
    // Get Redis connection
    public static function getRedisConnection() {
        if (self::$redis === null) {
            try {
                $config = self::getConfig();
                self::$redis = new Redis();
                self::$redis->connect($config['host'], $config['port']);
                
                // Authenticate if password is provided
                if ($config['password']) {
                    self::$redis->auth($config['password']);
                }
            } catch (Exception $e) {
                error_log("Redis Connection failed: " . $e->getMessage());
                return null;
            }
        }
        return self::$redis;
    }
    
    // Store session in Redis
    public static function setSession($sessionToken, $userId, $data = []) {
        $redis = self::getRedisConnection();
        if (!$redis) {
            return false;
        }
        
        try {
            $sessionData = array_merge([
                'userId' => $userId,
                'createdAt' => time()
            ], $data);
            
            $key = self::SESSION_PREFIX . $sessionToken;
            $redis->setex($key, self::SESSION_EXPIRY, json_encode($sessionData));
            return true;
        } catch (Exception $e) {
            error_log("Redis setSession failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Get session from Redis
    public static function getSession($sessionToken) {
        $redis = self::getRedisConnection();
        if (!$redis) {
            return null;
        }
        
        try {
            $key = self::SESSION_PREFIX . $sessionToken;
            $data = $redis->get($key);
            
            if ($data) {
                return json_decode($data, true);
            }
            return null;
        } catch (Exception $e) {
            error_log("Redis getSession failed: " . $e->getMessage());
            return null;
        }
    }
    
    // Delete session from Redis
    public static function deleteSession($sessionToken) {
        $redis = self::getRedisConnection();
        if (!$redis) {
            return false;
        }
        
        try {
            $key = self::SESSION_PREFIX . $sessionToken;
            $redis->del($key);
            return true;
        } catch (Exception $e) {
            error_log("Redis deleteSession failed: " . $e->getMessage());
            return false;
        }
    }
    
    // Validate session
    public static function validateSession($sessionToken, $userId) {
        $sessionData = self::getSession($sessionToken);
        
        if ($sessionData && isset($sessionData['userId']) && $sessionData['userId'] == $userId) {
            return true;
        }
        return false;
    }
}
?>
