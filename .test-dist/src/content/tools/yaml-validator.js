export const yamlValidatorContent = {
    detailedDescription: "<p>The <strong>YAML Validator</strong> is an essential developer utility engineered to instantly parse, validate, and format your YAML configuration files entirely within your browser. Strictly upholding KaruviLab's <strong>Zero-Server-Upload</strong> and <strong>Privacy-First</strong> standards, this tool guarantees that your proprietary infrastructure setups, Kubernetes manifests, and application configurations are never transmitted to a third-party server. All syntax checking and formatting happens securely on your local machine.</p><p>By leveraging robust <strong>Local-First Execution</strong>, our validation engine analyzes your YAML strings in milliseconds. It instantly highlights syntax errors, indentation issues, and formatting anomalies without the latency associated with cloud-based linting services. This real-time feedback loop allows developers and DevOps engineers to quickly debug and refine their configurations with absolute confidence that their sensitive data remains isolated.</p><p>Furthermore, this developer tool is built with complete <strong>Offline Resilience</strong>. Once loaded in your browser, the YAML Validator remains fully functional even if you disconnect from the network. Whether you are troubleshooting server deployments in a secure, air-gapped environment or coding on a flight, this utility ensures your development workflow is never hindered by connectivity issues.</p>",
    howTo: [
        "Paste or type your YAML configuration data directly into the input editor.",
        "Wait a split second as the local validation engine automatically parses the syntax.",
        "Review any errors or warnings highlighted by the validator, complete with line numbers and explanations.",
        "Make the necessary corrections to resolve the syntax issues.",
        "Use the formatting options or click 'Copy' to retrieve your validated, well-structured YAML."
    ],
    examples: [
        {
            label: "Validate a Kubernetes Deployment",
            description: "Checks a complex Kubernetes manifest for proper indentation and array syntax.",
            input: "A multi-layered YAML file defining a k8s deployment and service.",
            output: "Valid YAML confirmation, or a specific error pointing to a misplaced hyphen."
        },
        {
            label: "Debug Docker Compose Syntax",
            description: "Identifies mapping errors or duplicate keys in a Docker Compose configuration.",
            input: "A docker-compose.yml file with a duplicated 'ports' mapping.",
            output: "Error: 'Map keys must be unique' at line 14."
        },
        {
            label: "Format CI/CD Pipelines",
            description: "Validates and standardizes the structure of a GitHub Actions workflow file.",
            input: "A slightly messy but syntactically correct .github/workflows/main.yml file.",
            output: "A clean, perfectly indented, and validated YAML output."
        }
    ],
    faq: [
        {
            question: "Are my configuration files sent to a server for validation?",
            answer: "No. We utilize a strict Zero-Server-Upload design. Your YAML data is parsed entirely on your device, ensuring maximum privacy for your infrastructure configs."
        },
        {
            question: "Can I use the YAML Validator offline?",
            answer: "Yes, the tool features complete Offline Resilience. You can use it without an internet connection once the page is fully loaded."
        },
        {
            question: "Does the validator provide specific line numbers for errors?",
            answer: "Yes, our local parsing engine will highlight the exact line and column where the syntax error or indentation issue occurred, making debugging simple."
        },
        {
            question: "Will it catch duplicate keys in my YAML file?",
            answer: "Yes, the strict validation rules will flag duplicate mapping keys, which is a common cause of configuration deployment failures."
        },
        {
            question: "Is there a size limit to the YAML files I can validate?",
            answer: "Because processing happens locally, the limit is based on your browser's memory. It can easily handle files with thousands of lines of configuration instantly."
        }
    ],
    useCases: [
        "DevOps engineers validating complex Kubernetes manifests before applying them to a production cluster.",
        "Software developers debugging syntax errors in their continuous integration (CI) workflow files.",
        "System administrators ensuring that infrastructure-as-code (IaC) configurations are perfectly formatted.",
        "Technical writers standardizing YAML code blocks within software documentation or tutorials."
    ],
    commonErrors: [
        {
            error: "Indentation Error",
            fix: "YAML relies heavily on exact spacing. Ensure you are using spaces instead of tabs, and verify that nested elements align perfectly."
        },
        {
            error: "Duplicate Key Error",
            fix: "Search the highlighted line for a mapping key that has already been defined at the same level in the hierarchy, and remove or rename the duplicate."
        }
    ]
};
