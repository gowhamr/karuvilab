import { parseIso8583 } from "./parser";
try {
  const result = parseIso8583("020072246401088000001641111111111111110000000000100000070512000012345612120026060000510612345612345678901212345678");
  console.log("Success:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e);
}
