<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
} else {
    // Fallback or error handling
    $host = 'localhost';
    $user = 'root';
    $pass = ''; // Should be empty or handled
    $charset = 'utf8mb4';
}

function getPDO($db = null) {
    global $host, $user, $pass, $charset;
    $dsn = "mysql:host=$host" . ($db ? ";dbname=$db" : "") . ";charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    return new PDO($dsn, $user, $pass, $options);
}

try {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'get_databases') {
        $pdo = getPDO();
        $stmt = $pdo->query("SHOW DATABASES");
        $dbs = $stmt->fetchAll(PDO::FETCH_COLUMN);
        // Filter out system databases
        $filtered = array_filter($dbs, function($db) {
            return !in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']);
        });
        echo json_encode(array_values($filtered));
        exit;
    }

    if ($action === 'get_tables') {
        $dbName = $_GET['db'] ?? 'ERD';
        $pdo = getPDO($dbName);
        
        // Get all tables
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $result = [
            'tables' => [],
            'relationships' => []
        ];
        
        foreach ($tables as $table) {
            // Get Schema
            $stmtSchema = $pdo->query("DESCRIBE `$table` text"); // Using backticks for sanity
            // Note: DESCRIBE is simpler. Let's use it.
            $stmtSchema = $pdo->query("DESCRIBE `$table` text"); // Wait, original used DESCRIBE
            $stmtSchema = $pdo->query("DESCRIBE `$table` ");
            $schema = $stmtSchema->fetchAll();
            
            // Get Data (all rows)
            $stmtData = $pdo->query("SELECT * FROM `$table` ");
            $data = $stmtData->fetchAll();
            
            $result['tables'][$table] = [
                'schema' => $schema,
                'data' => $data
            ];
        }
        
        // Get Relationships (Foreign Keys)
        $relStmt = $pdo->prepare("
            SELECT 
                TABLE_NAME as 'from_table', 
                COLUMN_NAME as 'from_column', 
                REFERENCED_TABLE_NAME as 'to_table', 
                REFERENCED_COLUMN_NAME as 'to_column'
            FROM 
                information_schema.KEY_COLUMN_USAGE
            WHERE 
                TABLE_SCHEMA = ?
                AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        $relStmt->execute([$dbName]);
        $result['relationships'] = $relStmt->fetchAll();
        
        echo json_encode($result);
        exit;
    }

    echo json_encode(['message' => 'API is running', 'status' => 'success']);

} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
