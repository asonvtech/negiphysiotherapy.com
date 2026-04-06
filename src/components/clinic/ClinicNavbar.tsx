import { HtmlBlock } from './HtmlBlock';

type ClinicNavbarProps = {
  html: string;
};

export function ClinicNavbar({ html }: ClinicNavbarProps) {
  return <HtmlBlock html={html} />;
}
