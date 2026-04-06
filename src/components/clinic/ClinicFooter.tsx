import { HtmlBlock } from './HtmlBlock';

type ClinicFooterProps = {
  html: string;
};

export function ClinicFooter({ html }: ClinicFooterProps) {
  return <HtmlBlock html={html} />;
}
