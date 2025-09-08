#!/usr/bin/env node
import fs from 'fs';
import axios from 'axios';

const KNOWLEDGE_URL = process.env.KNOWLEDGE_URL || 'http://localhost:4000/knowledge';

async function fetchAndIngest(){
  const cfg = JSON.parse(fs.readFileSync(new URL('./sources.json', import.meta.url)));
  const items = [];
  for (const s of (cfg.daily_sources||[])){
    try{
      // Inviamo solo URL + metadati: sarà il knowledge-service a scaricare e parsare.
      items.push({ source: s.source, url: s.url, title: s.title });
    }catch(e){
      console.error('[fetch] failed', s.url, e.message);
    }
  }
  if (!items.length){ console.log('No items to ingest'); return; }
  const r = await axios.post(`${KNOWLEDGE_URL}/ingest`, { items, chunk_size: 1500 });
  console.log('Ingest result:', r.data);
}

fetchAndIngest().catch(err=>{ console.error(err); process.exit(1); });
