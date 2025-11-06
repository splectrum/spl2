//  name        Move
//  URI         gp/fs/move
//  type        API Method  
//  description Moves/renames files within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_move(input) {
    // Extract parameters individually
    const from = spl.action(input, 'from');
    const to = spl.action(input, 'to');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    // Move/rename the file
    fs.moveFile(fullAppDataPath, from, to);
    
    // Create standardized move record
    const moveRecord = {
        headers: {
            gp: {
                fs: {
                    operation: 'move',
                    from: from,
                    to: to,
                    timestamp: new Date().toISOString()
                }
            }
        },
        value: {
            success: true,
            from: from,
            to: to
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
    
    // STEP 2: Work within the API record - add move operation result
    const moveKey = spl.fURI("move", `${from}_to_${to.replace(/[\/\\]/g, '_')}`);
    apiRecord.value[moveKey] = moveRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/move: successfully moved ${from} to ${to}`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////
