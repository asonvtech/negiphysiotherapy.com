import { HtmlBlock } from './HtmlBlock';

type FloatingWhatsAppButtonProps = {
  html: string;
};

export function FloatingWhatsAppButton({ html }: FloatingWhatsAppButtonProps) {
  return <HtmlBlock html={html} />;
}
