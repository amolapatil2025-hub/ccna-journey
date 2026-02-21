'use client';

import Container from './Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <Container>
        <div className="py-8 text-center text-sm text-slate-500">
          <p>&copy; {currentYear} CCNA Journey. All Rights Reserved.</p>
          <p className="mt-2">
            This is a personal study tool. AI-generated content may contain inaccuracies.
            <br />
            Always verify information with official Cisco documentation.
          </p>
        </div>
      </Container>
    </footer>
  );
}
