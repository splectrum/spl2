//  name        Delete
//  URI         gp/fs/delete
//  type        API Method  
//  description Deletes files within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_delete(input) {
    // Extract parameters individually
    const file = spl.action(input, 'file');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    // Delete the file
    fs.deleteFile(fullAppDataPath, file);
    
    // Create standardized delete record
    const deleteRecord = {
        headers: {
            gp: {
                fs: {
                    operation: 'delete',
                    file: file,
                    timestamp: new Date().toISOString()
                }
            }
        },
        value: {
            success: true,
            deleted: file
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
    
    // STEP 2: Work within the API record - add delete operation result
    const deleteKey = spl.fURI("delete", file);
    apiRecord.value[deleteKey] = deleteRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/delete: successfully deleted ${file}`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////
