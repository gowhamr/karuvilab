const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'src/registry/core-registry.ts');
let content = fs.readFileSync(registryPath, 'utf8');

const toolsToUpdate = ['iso8583-message-parser', 'iso8583-bitmap-decoder', 'tlv-parser', 'pdf-to-image', 'image-converter'];

const currentDate = "2026-07-26";

const changelogData = {
  version: "1.1.0",
  lastVerified: currentDate,
  changelog: [
    {
      version: "1.1.0",
      date: currentDate,
      changes: [
        "Added comprehensive ELS (Engineering Learning System) documentation.",
        "Included ISO standards references and real-world examples."
      ]
    },
    {
      version: "1.0.0",
      date: "2026-07-25",
      changes: [
        "Initial release with core parsing functionality."
      ]
    }
  ]
};

let modified = false;

for (const toolId of toolsToUpdate) {
  const toolRegex = new RegExp(`("id"\\s*:\\s*"${toolId}"[\\s\\S]*?"requiresNetwork"\\s*:\\s*(?:true|false))(\\s*})`, 'g');
  content = content.replace(toolRegex, (match, p1, p2) => {
    modified = true;
    const clString = JSON.stringify(changelogData.changelog, null, 6).replace(/\n/g, '\n    ');
    return p1 + `,\n    "version": "1.1.0",\n    "lastVerified": "${currentDate}",\n    "changelog": ${clString}` + p2;
  });
}

if (modified) {
  fs.writeFileSync(registryPath, content);
  console.log("Registry updated successfully.");
} else {
  console.log("No tools matched.");
}
