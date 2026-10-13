import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const ext = path.resolve('.output/chrome-mv3');
const manifest = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.json')));
if (manifest.version !== '0.2.0') throw Error('Expected real build 0.2.0');
const out = 'docs/store/captures';
fs.mkdirSync(out, { recursive: true });
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'topath-store-'));
const context = await chromium.launchPersistentContext(temp, {
 channel: 'chromium', headless: true,
 args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
 viewport: { width: 340, height: 800 },
});
const evidence = { manifestVersion: manifest.version, buildCommit: execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), method:'Real built extension; isolated temp profile; real UI clicks; measured layout and scroll containers; no DOM/CSS mutations; no mailbox data', captures: [] };
try {
 let [sw]=context.serviceWorkers();
 if(!sw) sw=await context.waitForEvent('serviceworker');
 const page=await context.newPage();
 await page.goto(`chrome-extension://${new URL(sw.url()).host}/popup.html`);
 await page.getByRole('heading',{name:'ToPath Saver'}).waitFor();
 await page.getByRole('radio',{name:/Images/}).click();
 for(const [name,dark] of [['m01-images-selected-full',false],['m05-main-dark-full',true]]) {
  if(dark) {
   await page.getByRole('radio',{name:/Chrome default/}).click();
   await page.getByRole('button',{name:'Settings'}).click();
   await page.getByRole('radio',{name:'EN',exact:true}).click();
   await page.getByRole('switch',{name:'Dark theme'}).click();
   await page.getByRole('button',{name:'Back'}).click();
  }
  await page.waitForTimeout(400);
  const measure=()=>{
   const elems=[...document.body.querySelectorAll('*')];
   const contentBottom=Math.ceil(Math.max(...elems.map(e=>e.getBoundingClientRect().bottom)));
   const scrolling=elems.filter(e=>e.scrollHeight>e.clientHeight+1&&['auto','scroll','hidden','clip'].includes(getComputedStyle(e).overflowY)).map(e=>({tag:e.tagName,class:e.className,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY}));
   return {contentBottom,documentHeight:document.documentElement.scrollHeight,innerScrolling:scrolling};
  };
  const first=await page.evaluate(measure);
  await page.setViewportSize({width:340,height:Math.max(600,first.contentBottom)});
  await page.waitForTimeout(250);
  const layout=await page.evaluate(measure);
  // gmail-ring intentionally clips its oversized decorative ::before gradient,
  // not interface controls (style.css:148-153). Keep it in provenance.
  if(layout.innerScrolling.some(e=>e.class!=='gmail-ring')) throw Error('Inner clipped or scroll containers: '+JSON.stringify(layout));
  const last=page.getByRole('checkbox',{name:'Only for the next download'});
  await last.waitFor({state:'visible'});
  const bottom=await last.boundingBox();
  if(!bottom||bottom.y+bottom.height>page.viewportSize().height) throw Error('Bottom control outside viewport');
  await page.screenshot({path:`${out}/${name}.png`});
  evidence.captures.push({file:`${name}.png`,state:dark?'English; dark; Chrome default':'English; light; Images selected',viewport:page.viewportSize(),layout,bottomControl:bottom});
 }
 fs.writeFileSync(`${out}/provenance.json`,JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify(evidence,null,2));
} finally { await context.close(); fs.rmSync(temp,{recursive:true,force:true}); }
