import os
import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Pattern to match the broken return statement
    # It looks for return ( followed by some whitespace (including newlines) 
    # and then some top-level JSX elements, and finally );
    # The key is that it's missing the wrapping fragment or div.
    
    # We want to find:
    # return (
    # \s+
    # (JSX content)
    # \s+
    # );
    
    # Specifically, many files have:
    #   return (
    #     
    #       {/* Tabs */}
    # ...
    #   );
    
    # Let's try to match the return block and see if it's missing a parent.
    
    return_match = re.search(r'return \(\s*\n\s*\n(.*?)\n\s*\n\s*\);', content, re.DOTALL)
    if not return_match:
        # Try another common pattern where there is only one newline
        return_match = re.search(r'return \(\s*\n\s+(<.*?>.*?)\n\s+\);', content, re.DOTALL)
        
    if return_match:
        inner_content = return_match.group(1)
        # Check if it already has a parent (starts with < and ends with >)
        # but if it has multiple top-level elements, it won't be valid.
        # If it starts with <> or <div or <ToolShell, it might be fine.
        # But our problematic files specifically have a lot of whitespace and multiple elements.
        
        # Another way to detect: if it has multiple top-level elements.
        # Or just look for the specific broken pattern we saw.
        
        fixed_inner = f'    <div className="space-y-6">\n{inner_content}\n    </div>'
        new_return = f'  return (\n{fixed_inner}\n  );'
        
        # We need to be careful with indentation.
        
        # Let's try a more surgical approach for the replacement.
        
    # Manual replacement for the known pattern
    pattern = r'  return \(\s*\n\s*\n(.*?)\n\s*\n\s*\);'
    new_content = re.sub(pattern, r'  return (\n    <div className="space-y-6">\n\1\n    </div>\n  );', content, flags=re.DOTALL)
    
    if new_content != content:
        with open(path, 'w') as f:
            f.write(new_content)
        return True
    return False

# List of files from typecheck
files_to_fix = [
    "app/(tools)/calculators/compound-interest/CompoundInterestClient.tsx",
    "app/(tools)/calculators/currency-converter/CurrencyConverterClient.tsx",
    "app/(tools)/calculators/discount-calculator/DiscountCalculatorClient.tsx",
    "app/(tools)/calculators/numeral-converter/NumeralConverterClient.tsx",
    "app/(tools)/calculators/percentage-calculator/PercentageCalculatorClient.tsx",
    "app/(tools)/calculators/safe-to-spend/SafeToSpendClient.tsx",
    "app/(tools)/calculators/salary-calculator/SalaryCalculatorClient.tsx",
    "app/(tools)/calculators/smart-converter/SmartConverterClient.tsx",
    "app/(tools)/calculators/time-calculator/TimeCalculatorClient.tsx",
    "app/(tools)/calculators/unit-converter/UnitConverterClient.tsx",
    "app/(tools)/calculators/work-hours/WorkHoursClient.tsx",
    "app/(tools)/developer-tools/code-minifier/CodeMinifierClient.tsx",
    "app/(tools)/developer-tools/diff-checker/DiffCheckerClient.tsx",
    "app/(tools)/developer-tools/format/CodeFormatterClient.tsx",
    "app/(tools)/developer-tools/json-csv/JSONCSVConverterClient.tsx",
    "app/(tools)/developer-tools/json-formatter/JSONFormatterClient.tsx",
    "app/(tools)/developer-tools/regex/RegexTesterClient.tsx",
    "app/(tools)/image-tools/bg-remover/BgRemoverClient.tsx",
    "app/(tools)/image-tools/compress/ImageCompressorClient.tsx",
    "app/(tools)/image-tools/image-base64/ImageBase64Client.tsx",
    "app/(tools)/image-tools/image-converter/ImageConverterClient.tsx",
    "app/(tools)/pdf-tools/compress-pdf/CompressPdfClient.tsx",
    "app/(tools)/pdf-tools/image-to-pdf/ImageToPdfClient.tsx",
    "app/(tools)/pdf-tools/lock-unlock/LockUnlockPdfClient.tsx",
    "app/(tools)/pdf-tools/merge-pdf/MergePdfClient.tsx",
    "app/(tools)/pdf-tools/page-numbering/PageNumberingClient.tsx",
    "app/(tools)/pdf-tools/rotate-pdf/RotatePdfClient.tsx",
    "app/(tools)/pdf-tools/split-pdf/SplitPdfClient.tsx",
    "app/(tools)/pdf-tools/watermark-pdf/WatermarkPdfClient.tsx",
    "app/(tools)/security-tools/hash-generator/HashGeneratorClient.tsx",
    "app/(tools)/security-tools/html-entities/HTMLEntitiesClient.tsx",
    "app/(tools)/security-tools/jwt-decoder/JWTDecoderClient.tsx",
    "app/(tools)/security-tools/password-generator/PasswordGeneratorClient.tsx",
    "app/(tools)/security-tools/url-encoder/URLEncoderClient.tsx",
    "app/(tools)/seo-tools/image-seo/ImageSeoClient.tsx",
    "app/(tools)/seo-tools/seo-title/SeoTitleTesterClient.tsx",
    "app/(tools)/utilities/grammar-checker/GrammarCheckerClient.tsx",
    "app/(tools)/utilities/qrcode/QRCodeGeneratorClient.tsx",
    "app/(tools)/utilities/split-copy/SplitCopyClient.tsx",
    "app/(tools)/utilities/text-utility/TextUtilityClient.tsx",
    "app/(tools)/utilities/url-cleaner/URLCleanerClient.tsx",
    "app/(tools)/utilities/validate/FileValidatorClient.tsx",
]

base_dir = "/data/data/com.termux/files/home/karuvilab"
fixed_count = 0
for f in files_to_fix:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        if fix_file(path):
            print(f"Fixed {f}")
            fixed_count += 1
        else:
            print(f"Could not fix {f} - pattern not found")
    else:
        print(f"File not found: {f}")

print(f"Total fixed: {fixed_count}")
