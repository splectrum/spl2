//  name        List Directory Contents
//  URI         gp/fs/list
//  type        API Method
//  description Lists files and directories within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_list(input) {
    // Extract parameters individually
    const path = spl.action(input, 'path');
    const stats = spl.action(input, 'stats');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    // List directory contents
    const entries = fs.list(fullAppDataPath, path, {
        includeStats: stats
    });
    
    // Create standardized directory record
    const listRecord = {
        headers: {
            gp: {
                fs: {
                    path: path,
                    type: 'directory',
                    operation: 'list',
                    count: entries.length,
                    timestamp: new Date().toISOString()
                }
            }
        },
        value: entries
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
    
    // STEP 2: Work within the API record - add/update directory listing
    const dirKey = spl.fURI("list", path === '.' ? 'root' : path);
    apiRecord.value[dirKey] = listRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/list: found ${entries.length} entries in ${path}`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////
