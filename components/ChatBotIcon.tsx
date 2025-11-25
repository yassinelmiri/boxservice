'use client';

import Script from 'next/script';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'call-us-selector': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'phonesystem-url'?: string;
        party?: string;
      };
    }
  }
}

export default function ChatBotIcon() {
  const CallUsSelector = 'call-us-selector' as any;

  return (
    <>
      <CallUsSelector phonesystem-url="https://1612.3cx.cloud/LiveChat92646" party="transit"></CallUsSelector>

      <Script defer src="https://downloads-global.3cx.com/downloads/livechatandtalk/v1/callus.js" id="tcx-callus-js" ></Script>

    </>
  );
}