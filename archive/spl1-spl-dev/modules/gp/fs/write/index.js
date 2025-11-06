//  name        Write File Contents
//  URI         gp/fs/write
//  type        API Method
//  description Writes content to file within app data boundary
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const fs = require("gp_fs_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Universal Kafka Record Pattern
exports.default = function gp_fs_write(input) {
    // Extract parameters individually
    const file = spl.action(input, 'file');
    const content = spl.action(input, 'content');
    const source = spl.action(input, 'source');
    const encoding = spl.action(input, 'encoding');
    
    // Use session working directory
    const fullAppDataPath = spl.getFullAppDataPath(input);
    
    let finalContent = content;
    // Handle multiple content array (from command-line-args multiple: true)
    if (Array.isArray(finalContent)) {
        finalContent = finalContent.join(' ');
    }
    let finalEncoding = encoding;
    
    // Handle source workspace reference
    if (source) {
        const sourceRecord = spl.wsRef(input, source);
        if (sourceRecord) {
            finalContent = sourceRecord.value || sourceRecord;
            // Use source encoding if not explicitly specified
            if (!encoding && sourceRecord.headers?.gp?.fs?.valueEncoding) {
                finalEncoding = sourceRecord.headers.gp.fs.valueEncoding;
            }
        }
    }
    
    // Handle content encoding
    const isText = fs.isTextFile(file);
    const actualEncoding = isText ? finalEncoding : 'binary';
    
    // Write file content
    if (finalEncoding === 'base64' && !isText) {
        // Handle base64 encoded binary content
        const buffer = Buffer.from(finalContent, 'base64');
        fs.writeFile(fullAppDataPath, file, buffer);
    } else {
        fs.writeFile(fullAppDataPath, file, finalContent, actualEncoding);
    }
    
    // Create standardized file record with new content
    const fileRecord = fs.createFileRecord(fullAppDataPath, file, finalContent);
    
    // Update encoding information based on what we actually did
    fileRecord.headers.gp.fs.encoding = actualEncoding;
    fileRecord.headers.gp.fs.valueEncoding = finalEncoding;
    
    // STEP 1: Get the API record (gp/fs)
    let apiRecord = spl.wsRef(input, "gp/fs");
    if (!apiRecord) {
        // Create new API record with proper structure
        apiRecord = {
            headers: { gp: { fs: { api: "gp/fs", timestamp: new Date().toISOString() } } },
            value: {}
        };
    }
    
    // STEP 2: Work within the API record - add/update file
    const fileKey = spl.fURI("write", file);
    apiRecord.value[fileKey] = fileRecord;
    
    // Save the updated API record back to workspace
    spl.wsSet(input, "gp/fs", apiRecord);
    
    spl.history(input, `fs/write: Successfully wrote ${file} (${fileRecord.headers.gp.fs.size} bytes, ${fileRecord.headers.gp.fs.encoding})`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////