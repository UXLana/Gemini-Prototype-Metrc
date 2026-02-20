import React, { forwardRef } from 'react';

const Link = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  ({ href, children, ...props }, ref) => (
    <a ref={ref} href={href} {...props}>{children}</a>
  )
);

Link.displayName = 'Link';
export default Link;
