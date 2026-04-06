import parse from 'html-react-parser';

type HtmlBlockProps = {
  html: string;
};

export function HtmlBlock({ html }: HtmlBlockProps) {
  return <>{parse(html)}</>;
}
