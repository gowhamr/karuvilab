import { ToolShell } from '@/components/ui/ToolShell';
import JsonToXmlClientWrapper from './JsonToXmlClientWrapper';

const toolId = 'json-to-xml';

export const metadata = {
  title: 'JSON to XML Converter | KaruviLab',
  description: 'Convert JSON to XML and XML to JSON instantly in your browser.',
};

export default function Page() {
  return (
    <ToolShell title="JSON to XML Converter">
      <JsonToXmlClientWrapper />
    </ToolShell>
  );
}
