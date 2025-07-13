import type { MetaFunction } from '@remix-run/cloudflare';
import { UniversalWrapper } from '~/components/universal-wrapper';

export const meta: MetaFunction = () => {
  return [
    { title: 'KN3AUX-CODE™ Universal Wrapper' },
    { 
      name: 'description', 
      content: 'Universal application wrapper for embedding websites, web apps, Chrome extensions, and custom code' 
    },
  ];
};

export default function UniversalWrapperRoute() {
  return <UniversalWrapper />;
}