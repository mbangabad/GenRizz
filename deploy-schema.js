#!/usr/bin/env node
/**
 * Quick script to deploy schema via Supabase REST API
 * This bypasses the CLI migration issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_REF = 'ifzdbimmruhhuepymgph';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmemRiaW1tcnVoaHVlcHltZ3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAyMTg3NCwiZXhwIjoyMDc4NTk3ODc0fQ.EBO-gls1kAzyZf8EgDsifAJNds8C7T8F8K3mA0Vaflk';

async function deploySchema() {
  const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  console.log('📤 Deploying schema to Supabase...');
  console.log(`📊 Schema size: ${(schema.length / 1024).toFixed(2)} KB`);

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(
      `https://${PROJECT_REF}.supabase.co/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql: schema })
      }
    );

    if (!response.ok) {
      // Try alternative: direct SQL execution via Management API
      console.log('⚠️  Trying alternative method...');
      throw new Error('First method failed');
    }

    const result = await response.json();
    console.log('✅ Schema deployed successfully!');
    return result;
  } catch (error) {
    console.log('⚠️  API method not available. Please use SQL Editor:');
    console.log(`\n🔗 https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new\n`);
    console.log('📋 Copy the contents of supabase/schema.sql and paste into the SQL Editor');
    process.exit(1);
  }
}

deploySchema().catch(console.error);

