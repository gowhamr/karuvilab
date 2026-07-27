import { parseIso8583 } from "./src/lib/iso8583/parser";
try {
  const result = parseIso8583("0200722464010880000016411111111111111111000000000010000007051200001234561200002606");
  console.log("Success:", result);
} catch (e) {
  console.error("Error:", e);
}
