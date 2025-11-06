# AVRO-RPC Client Input Methods

This document explores the various ways users and systems can provide input to our AVRO-RPC clients, from simple programmatic calls to complex user interfaces.

## Input Method Categories

### 1. Programmatic Inputs

#### **Direct API Calls**
```javascript
import { AvroRpcClient } from './src/rpc/avro-client.js';

const client = new AvroRpcClient('http://localhost:3001/avro-rpc');

// Direct programmatic input
const result = await client.validateTerrorismLiability({
  occupancy: 'office',
  employeeCount: 'HUNDRED_TO_THOUSAND',
  annualRevenue: 10000000,
  terrorismLimit: 50000000
});
```
- ✅ **Benefits**: Type safety, immediate validation, programmatic control
- ✅ **Use cases**: Integration tests, service-to-service calls, batch processing
- 📊 **Performance**: Fastest, direct object passing

#### **JSON Configuration Files**
```javascript
// config/terrorism-liability-quote.json
{
  "occupancy": "manufacturing",
  "employeeCount": "THOUSAND_TO_TEN_THOUSAND", 
  "annualRevenue": 50000000,
  "terrorismLimit": 100000000,
  "deductible": 1000000,
  "manufacturingSecurity": true
}

// Load and process
const config = JSON.parse(fs.readFileSync('config/quote.json'));
const result = await client.validateTerrorismLiability(config);
```
- ✅ **Benefits**: Version control, reusable configurations, batch processing
- ✅ **Use cases**: Environment configs, test data, deployment settings
- 📊 **Performance**: Good, file I/O overhead

#### **Environment Variables**
```javascript
// Process environment variables into AVRO-RPC call
const quote = {
  occupancy: process.env.OCCUPANCY_TYPE || 'office',
  employeeCount: process.env.EMPLOYEE_COUNT || 'HUNDRED_TO_THOUSAND',
  annualRevenue: parseInt(process.env.ANNUAL_REVENUE) || 10000000,
  terrorismLimit: parseInt(process.env.TERRORISM_LIMIT) || 50000000
};

const result = await client.validateTerrorismLiability(quote);
```
- ✅ **Benefits**: 12-factor app compliance, container-friendly, secure
- ✅ **Use cases**: Kubernetes deployments, CI/CD pipelines, cloud functions
- ⚠️ **Considerations**: Limited data types, environment pollution

### 2. Web Page Inputs

#### **HTML Forms**
```html
<!-- terrorism-liability-form.html -->
<form id="terrorism-liability-form">
  <select name="occupancy" required>
    <option value="office">Office</option>
    <option value="retail">Retail</option>
    <option value="manufacturing">Manufacturing</option>
  </select>
  
  <select name="employeeCount" required>
    <option value="UNDER_HUNDRED">Under 100</option>
    <option value="HUNDRED_TO_THOUSAND">100-1,000</option>
    <option value="THOUSAND_TO_TEN_THOUSAND">1,000-10,000</option>
  </select>
  
  <input type="number" name="annualRevenue" min="0" required>
  <input type="number" name="terrorismLimit" min="0" required>
  <input type="checkbox" name="manufacturingSecurity">
  
  <button type="submit">Validate Quote</button>
</form>

<script>
document.getElementById('terrorism-liability-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const quote = {
    occupancy: formData.get('occupancy'),
    employeeCount: formData.get('employeeCount'),
    annualRevenue: parseInt(formData.get('annualRevenue')),
    terrorismLimit: parseInt(formData.get('terrorismLimit')),
    manufacturingSecurity: formData.get('manufacturingSecurity') === 'on'
  };
  
  const result = await client.validateTerrorismLiability(quote);
  displayResult(result);
});
</script>
```
- ✅ **Benefits**: User-friendly, validation, accessibility
- ✅ **Use cases**: Customer portals, admin interfaces, public forms
- 📊 **Performance**: Interactive, real-time validation

#### **React/Vue Components**
```jsx
// TerrorismLiabilityForm.jsx
import { useState } from 'react';
import { AvroRpcClient } from '../rpc/avro-client.js';

export function TerrorismLiabilityForm() {
  const [quote, setQuote] = useState({
    occupancy: 'office',
    employeeCount: 'HUNDRED_TO_THOUSAND',
    annualRevenue: 0,
    terrorismLimit: 0
  });
  
  const [result, setResult] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = new AvroRpcClient('/avro-rpc');
    const response = await client.validateTerrorismLiability(quote);
    setResult(response);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <select 
        value={quote.occupancy}
        onChange={(e) => setQuote({...quote, occupancy: e.target.value})}
      >
        <option value="office">Office</option>
        <option value="retail">Retail</option>
        <option value="manufacturing">Manufacturing</option>
      </select>
      
      <input 
        type="number"
        value={quote.annualRevenue}
        onChange={(e) => setQuote({...quote, annualRevenue: parseInt(e.target.value)})}
      />
      
      <button type="submit">Validate Quote</button>
      
      {result && <QuoteResult result={result} />}
    </form>
  );
}
```
- ✅ **Benefits**: Dynamic UI, real-time updates, component reusability
- ✅ **Use cases**: Modern web apps, SPAs, interactive dashboards
- 📊 **Performance**: Excellent UX, client-side validation

#### **JSON Editor Widgets**
```html
<!-- Using Monaco Editor for JSON input -->
<div id="json-editor" style="height: 400px;"></div>
<button onclick="validateFromEditor()">Validate JSON</button>

<script src="https://unpkg.com/monaco-editor/min/vs/loader.js"></script>
<script>
require(['vs/editor/editor.main'], function() {
  const editor = monaco.editor.create(document.getElementById('json-editor'), {
    value: JSON.stringify({
      occupancy: 'office',
      employeeCount: 'HUNDRED_TO_THOUSAND',
      annualRevenue: 10000000,
      terrorismLimit: 50000000
    }, null, 2),
    language: 'json',
    theme: 'vs-dark'
  });
  
  window.validateFromEditor = async () => {
    try {
      const json = JSON.parse(editor.getValue());
      const result = await client.validateTerrorismLiability(json);
      console.log('Validation result:', result);
    } catch (error) {
      console.error('Invalid JSON or validation failed:', error);
    }
  };
});
</script>
```
- ✅ **Benefits**: Developer-friendly, syntax highlighting, validation
- ✅ **Use cases**: Admin tools, API testing, developer portals
- 📊 **Performance**: Good for complex data structures

### 3. Command Line Interfaces

#### **CLI with Commander.js**
```javascript
#!/usr/bin/env node
// bin/avro-rpc-cli.js

import { Command } from 'commander';
import { AvroRpcClient } from '../src/rpc/avro-client.js';

const program = new Command();

program
  .name('avro-rpc')
  .description('AVRO-RPC CLI for terrorism liability validation')
  .version('1.0.0');

program
  .command('validate')
  .description('Validate terrorism liability quote')
  .option('-o, --occupancy <type>', 'occupancy type', 'office')
  .option('-e, --employees <range>', 'employee count range', 'HUNDRED_TO_THOUSAND')
  .option('-r, --revenue <amount>', 'annual revenue', '10000000')
  .option('-l, --limit <amount>', 'terrorism limit', '50000000')
  .option('-d, --deductible <amount>', 'deductible amount')
  .option('-s, --security', 'manufacturing security measures')
  .option('--url <url>', 'RPC service URL', 'http://localhost:3001/avro-rpc')
  .action(async (options) => {
    const client = new AvroRpcClient(options.url);
    
    const quote = {
      occupancy: options.occupancy,
      employeeCount: options.employees,
      annualRevenue: parseInt(options.revenue),
      terrorismLimit: parseInt(options.limit),
      ...(options.deductible && { deductible: parseInt(options.deductible) }),
      ...(options.security && { manufacturingSecurity: true })
    };
    
    try {
      const result = await client.validateTerrorismLiability(quote);
      console.log('✅ Validation Result:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('validate-file <file>')
  .description('Validate quote from JSON file')
  .action(async (file, options) => {
    const fs = await import('fs');
    const quote = JSON.parse(fs.readFileSync(file, 'utf-8'));
    
    const client = new AvroRpcClient('http://localhost:3001/avro-rpc');
    const result = await client.validateTerrorismLiability(quote);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
```

**Usage Examples:**
```bash
# Direct CLI validation
avro-rpc validate \
  --occupancy manufacturing \
  --employees THOUSAND_TO_TEN_THOUSAND \
  --revenue 50000000 \
  --limit 100000000 \
  --security

# File-based validation
avro-rpc validate-file ./quotes/manufacturing-quote.json

# Pipe JSON input
echo '{"occupancy":"office","employeeCount":"HUNDRED_TO_THOUSAND","annualRevenue":10000000,"terrorismLimit":50000000}' | avro-rpc validate-stdin
```
- ✅ **Benefits**: Scriptable, CI/CD integration, Unix philosophy
- ✅ **Use cases**: DevOps, automation, testing, batch processing
- 📊 **Performance**: Excellent for automation

#### **Interactive CLI with Inquirer**
```javascript
// bin/interactive-cli.js
import inquirer from 'inquirer';
import { AvroRpcClient } from '../src/rpc/avro-client.js';

async function interactiveValidation() {
  console.log('🏢 Terrorism Liability Quote Validator');
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'occupancy',
      message: 'What is the occupancy type?',
      choices: ['office', 'retail', 'manufacturing', 'warehouse']
    },
    {
      type: 'list', 
      name: 'employeeCount',
      message: 'How many employees?',
      choices: [
        { name: 'Under 100', value: 'UNDER_HUNDRED' },
        { name: '100-1,000', value: 'HUNDRED_TO_THOUSAND' },
        { name: '1,000-10,000', value: 'THOUSAND_TO_TEN_THOUSAND' },
        { name: 'Over 10,000', value: 'OVER_TEN_THOUSAND' }
      ]
    },
    {
      type: 'number',
      name: 'annualRevenue',
      message: 'Annual revenue (USD):',
      validate: (value) => value > 0 || 'Please enter a positive number'
    },
    {
      type: 'number',
      name: 'terrorismLimit',
      message: 'Terrorism liability limit (USD):',
      validate: (value) => value > 0 || 'Please enter a positive number'
    },
    {
      type: 'confirm',
      name: 'manufacturingSecurity',
      message: 'Manufacturing security measures in place?',
      when: (answers) => answers.occupancy === 'manufacturing'
    }
  ]);
  
  console.log('\n🔄 Validating quote...');
  
  const client = new AvroRpcClient('http://localhost:3001/avro-rpc');
  const result = await client.validateTerrorismLiability(answers);
  
  if (result.success) {
    console.log('✅ Quote validation passed!');
    console.log(`Valid: ${result.data.valid}`);
    if (result.data.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.data.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  } else {
    console.log('❌ Quote validation failed:');
    console.log(result.error);
  }
}

interactiveValidation().catch(console.error);
```
- ✅ **Benefits**: User-friendly CLI, guided input, validation
- ✅ **Use cases**: Training, manual operations, wizard-style tools
- 📊 **Performance**: Great user experience

### 4. File-Based Inputs

#### **CSV Batch Processing**
```javascript
// bin/csv-processor.js
import csv from 'csv-parser';
import fs from 'fs';
import { AvroRpcClient } from '../src/rpc/avro-client.js';

async function processCsvQuotes(filename) {
  const client = new AvroRpcClient('http://localhost:3001/avro-rpc');
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const quote = {
            occupancy: row.occupancy,
            employeeCount: row.employeeCount,
            annualRevenue: parseInt(row.annualRevenue),
            terrorismLimit: parseInt(row.terrorismLimit),
            ...(row.deductible && { deductible: parseInt(row.deductible) }),
            ...(row.manufacturingSecurity === 'true' && { manufacturingSecurity: true })
          };
          
          const result = await client.validateTerrorismLiability(quote);
          results.push({ ...row, validationResult: result });
          
        } catch (error) {
          results.push({ ...row, validationError: error.message });
        }
      })
      .on('end', () => {
        console.log(`Processed ${results.length} quotes`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// Usage: node bin/csv-processor.js quotes.csv
const results = await processCsvQuotes(process.argv[2]);
```

**Sample CSV:**
```csv
occupancy,employeeCount,annualRevenue,terrorismLimit,manufacturingSecurity
office,HUNDRED_TO_THOUSAND,10000000,50000000,false
manufacturing,THOUSAND_TO_TEN_THOUSAND,50000000,100000000,true
retail,UNDER_HUNDRED,5000000,25000000,false
```
- ✅ **Benefits**: Bulk processing, Excel compatibility, data pipeline integration
- ✅ **Use cases**: Data migration, bulk validation, reporting
- 📊 **Performance**: Efficient for large datasets

#### **YAML Configuration**
```yaml
# quotes/manufacturing-quote.yml
terrorism_liability_quote:
  occupancy: manufacturing
  employee_count: THOUSAND_TO_TEN_THOUSAND
  annual_revenue: 50000000
  terrorism_limit: 100000000
  deductible: 1000000
  manufacturing_security: true

metadata:
  created_by: underwriter@company.com
  created_at: 2024-01-15T10:30:00Z
  notes: "High-value manufacturing client with security measures"
```

```javascript
// Process YAML input
import yaml from 'js-yaml';
import fs from 'fs';

const doc = yaml.load(fs.readFileSync('quotes/manufacturing-quote.yml', 'utf8'));
const quote = doc.terrorism_liability_quote;

// Convert snake_case to camelCase for AVRO
const avroQuote = {
  occupancy: quote.occupancy,
  employeeCount: quote.employee_count,
  annualRevenue: quote.annual_revenue,
  terrorismLimit: quote.terrorism_limit,
  deductible: quote.deductible,
  manufacturingSecurity: quote.manufacturing_security
};

const result = await client.validateTerrorismLiability(avroQuote);
```
- ✅ **Benefits**: Human-readable, comments, complex structures
- ✅ **Use cases**: Configuration management, DevOps, documentation
- 📊 **Performance**: Good for complex configurations

### 5. API Integrations

#### **REST API Proxy**
```javascript
// server/rest-to-avro-proxy.js
import express from 'express';
import { AvroRpcClient } from '../src/rpc/avro-client.js';

const app = express();
app.use(express.json());

const avroClient = new AvroRpcClient('http://localhost:3001/avro-rpc');

// REST endpoint that proxies to AVRO-RPC
app.post('/api/terrorism-liability/validate', async (req, res) => {
  try {
    const result = await avroClient.validateTerrorismLiability(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('REST-to-AVRO proxy listening on port 3000');
});
```

**Usage:**
```bash
curl -X POST http://localhost:3000/api/terrorism-liability/validate \
  -H "Content-Type: application/json" \
  -d '{
    "occupancy": "office",
    "employeeCount": "HUNDRED_TO_THOUSAND", 
    "annualRevenue": 10000000,
    "terrorismLimit": 50000000
  }'
```
- ✅ **Benefits**: Standard REST interface, HTTP tooling, caching
- ✅ **Use cases**: Legacy integration, public APIs, mobile apps
- 📊 **Performance**: Good, adds HTTP layer

#### **GraphQL Resolver**
```javascript
// server/graphql-avro-resolver.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AvroRpcClient } from '../src/rpc/avro-client.js';

const typeDefs = `#graphql
  type ValidationResult {
    valid: Boolean!
    errors: String
    warnings: [String!]!
  }
  
  input TerrorismLiabilityInput {
    occupancy: String!
    employeeCount: String!
    annualRevenue: Int!
    terrorismLimit: Int!
    deductible: Int
    manufacturingSecurity: Boolean
  }
  
  type Query {
    validateTerrorismLiability(quote: TerrorismLiabilityInput!): ValidationResult!
  }
`;

const resolvers = {
  Query: {
    validateTerrorismLiability: async (parent, { quote }) => {
      const client = new AvroRpcClient('http://localhost:3001/avro-rpc');
      const result = await client.validateTerrorismLiability(quote);
      return result.data;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`GraphQL server ready at ${url}`);
```

**Usage:**
```graphql
query ValidateQuote {
  validateTerrorismLiability(quote: {
    occupancy: "office"
    employeeCount: "HUNDRED_TO_THOUSAND"
    annualRevenue: 10000000
    terrorismLimit: 50000000
  }) {
    valid
    errors
    warnings
  }
}
```
- ✅ **Benefits**: Type-safe queries, efficient data fetching, modern approach
- ✅ **Use cases**: Modern web apps, mobile APIs, data aggregation
- 📊 **Performance**: Excellent with caching and batching

### 6. Advanced Input Methods

#### **Voice Input (Speech-to-Text)**
```javascript
// client/voice-input.js
class VoiceQuoteInput {
  constructor(client) {
    this.client = client;
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    
    this.setupCommands();
  }
  
  setupCommands() {
    this.recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      console.log('Heard:', speech);
      
      // Parse voice commands
      const quote = this.parseVoiceInput(speech);
      if (quote) {
        this.validateQuote(quote);
      }
    };
  }
  
  parseVoiceInput(speech) {
    // Simple voice command parsing
    const occupancy = this.extractOccupancy(speech);
    const revenue = this.extractNumber(speech, 'revenue');
    const limit = this.extractNumber(speech, 'limit');
    
    if (occupancy && revenue && limit) {
      return {
        occupancy,
        employeeCount: 'HUNDRED_TO_THOUSAND', // default
        annualRevenue: revenue,
        terrorismLimit: limit
      };
    }
    return null;
  }
  
  async validateQuote(quote) {
    const result = await this.client.validateTerrorismLiability(quote);
    this.speakResult(result);
  }
  
  speakResult(result) {
    const utterance = new SpeechSynthesisUtterance(
      result.data.valid ? 
        'Quote validation passed successfully' : 
        'Quote validation failed with errors'
    );
    speechSynthesis.speak(utterance);
  }
  
  startListening() {
    this.recognition.start();
  }
}

// Usage
const voiceInput = new VoiceQuoteInput(client);
document.getElementById('voice-button').onclick = () => voiceInput.startListening();
```
- ✅ **Benefits**: Hands-free operation, accessibility, mobile-friendly
- ✅ **Use cases**: Accessibility apps, mobile interfaces, IoT devices
- ⚠️ **Considerations**: Accuracy limitations, language support

#### **QR Code/Barcode Input**
```javascript
// client/qr-code-input.js
import QrScanner from 'qr-scanner';

class QrQuoteInput {
  constructor(client) {
    this.client = client;
    this.scanner = null;
  }
  
  async startScanning(videoElement) {
    this.scanner = new QrScanner(
      videoElement,
      (result) => this.handleQrCode(result.data),
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true
      }
    );
    
    await this.scanner.start();
  }
  
  async handleQrCode(data) {
    try {
      // QR code contains JSON quote data
      const quote = JSON.parse(data);
      const result = await this.client.validateTerrorismLiability(quote);
      this.displayResult(result);
    } catch (error) {
      console.error('Invalid QR code data:', error);
    }
  }
  
  generateQrCode(quote) {
    // Generate QR code for quote data
    const qrData = JSON.stringify(quote);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    return qrCodeUrl;
  }
}
```
- ✅ **Benefits**: Mobile-friendly, contactless, data sharing
- ✅ **Use cases**: Mobile apps, field work, data sharing
- 📊 **Performance**: Quick data entry, visual confirmation

## Input Method Comparison Matrix

| Input Method | Setup Complexity | User Experience | Automation | Performance | Best Use Case |
|--------------|------------------|-----------------|------------|-------------|---------------|
| **Direct API** | Low | Developer | High | Fastest | Integration |
| **HTML Forms** | Low | Excellent | Low | Good | User interfaces |
| **React/Vue** | Medium | Excellent | Medium | Good | Modern web apps |
| **CLI Tools** | Medium | Good | High | Good | DevOps/Automation |
| **Interactive CLI** | Medium | Excellent | Low | Good | Training/Manual |
| **JSON Files** | Low | Good | High | Good | Configuration |
| **CSV Batch** | Medium | Good | High | Excellent | Data processing |
| **YAML Config** | Low | Excellent | Medium | Good | Complex config |
| **REST Proxy** | Medium | Good | Medium | Good | Legacy integration |
| **GraphQL** | High | Excellent | Medium | Excellent | Modern APIs |
| **Voice Input** | High | Excellent | Low | Medium | Accessibility |
| **QR Codes** | Medium | Good | Low | Good | Mobile/Sharing |

## Architecture Patterns by Input Type

### Multi-Modal Input Architecture
```
Voice Input ────┐
QR Code Input ──┤
Form Input ─────┼──→ Input Validator ──→ AVRO-RPC Client ──→ Service
CLI Input ──────┤
API Input ──────┘
```

### Progressive Input Complexity
```
Simple: Direct API Calls
    ↓
Interactive: Web Forms  
    ↓
Automated: CLI Tools
    ↓
Advanced: Voice/QR/Batch
```

This comprehensive input system allows our AVRO-RPC service to accept data from virtually any source, making it incredibly flexible for different user needs and integration scenarios!