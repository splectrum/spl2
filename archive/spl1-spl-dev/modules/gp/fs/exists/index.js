//  name        Check File/Directory Existence
//  URI         gp/fs/exists
//  type        API Method
//  description Checks if file or directory exists within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_exists(input) {
    // Extract parameters individually
    const path = spl.action(input, 'path');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    // Check if path exists
    const exists = fs.exists(fullAppDataPath, path);
    
    // Get additional info if it exists
    let pathInfo = null;
    if (exists) {
        pathInfo = fs.info(fullAppDataPath, path);
    }
    
    // Create standardized existence record
    const existsRecord = {
        headers: {
            gp: {
                fs: {
                    path: path,
                    operation: 'exists',
                    exists: exists,
                    type: pathInfo ? (pathInfo.isDirectory ? 'directory' : 'file') : null,
                    timestamp: new Date().toISOString()
                }
            }
        },
        value: {
            exists: exists,
            info: pathInfo
        }
    };
    
    // STEP 1: Get the API record (gp/fs)
    let apiRecord = spl.wsRef(input, "gp/fs");
    if (!apiRecord) {
        // Create new API record with proper structure
        apiRecord = {
            headers: { gp: { fs: { api: "gp/fs", timestamp: new Date().toISOString() } } },
            value: {}
        };
    }
    
    // STEP 2: Work within the API record - add/update existence check
    const pathKey = spl.fURI("exists", path);
    apiRecord.value[pathKey] = existsRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/exists: ${path} ${exists ? 'exists' : 'does not exist'}`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////
