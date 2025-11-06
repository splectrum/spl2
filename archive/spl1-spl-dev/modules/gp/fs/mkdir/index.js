//  name        Mkdir
//  URI         gp/fs/mkdir
//  type        API Method  
//  description Creates directories within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_mkdir(input) {
    // Extract parameters individually
    const path = spl.action(input, 'path');
    const recursive = spl.action(input, 'recursive');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    // Create directory with options
    const options = {
        recursive: recursive
    };
    fs.mkdir(fullAppDataPath, path, options);
    
    // Create standardized mkdir record
    const mkdirRecord = {
        headers: {
            gp: {
                fs: {
                    operation: 'mkdir',
                    path: path,
                    recursive: options.recursive,
                    timestamp: new Date().toISOString()
                }
            }
        },
        value: {
            success: true,
            created: path,
            recursive: options.recursive
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
    
    // STEP 2: Work within the API record - add mkdir operation result
    const mkdirKey = spl.fURI("mkdir", path);
    apiRecord.value[mkdirKey] = mkdirRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/mkdir: successfully created directory ${path}${options.recursive ? ' (recursive)' : ''}`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////
