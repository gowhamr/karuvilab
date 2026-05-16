import { ToolContent } from '../../registry/types';

export const numeralConverter: ToolContent = {
  detailedDescription: "Convert numbers between different bases like Binary, Octal, Decimal, and Hexadecimal. This tool is essential for computer science students and developers working with low-level data, bitwise operations, or different numbering systems. It provides instant conversion as you type.",
  howTo: [
    "Select the input base (e.g., Decimal) from the options.",
    "Enter the number you want to convert in the input field.",
    "The tool will instantly show the equivalent values in Binary, Octal, Decimal, and Hexadecimal.",
    "Copy the result you need using the copy button next to each output."
  ],
  faq: [
    { question: "What bases are supported?", answer: "We support Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16)." },
    { question: "Can it handle fractional numbers?", answer: "Currently, this tool is optimized for integers. Support for floating-point base conversion is planned for a future update." }
  ],
  useCases: [
    "Converting memory addresses from hex to decimal",
    "Understanding binary representations for bitwise flags",
    "Computer science homework and learning base systems",
    "Decoding data from low-level protocols"
  ],
  alternatives: ["RapidTables", "BinaryHexConverter", "Google search ('[num] hex to dec')"]
};
