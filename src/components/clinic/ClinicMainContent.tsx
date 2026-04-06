import { HtmlBlock } from './HtmlBlock';

type ClinicMainContentProps = {
  html: string;
};

export function ClinicMainContent({ html }: ClinicMainContentProps) {
  return <HtmlBlock html={html} />;
}
