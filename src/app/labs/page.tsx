'use client';

import Container from '@/components/Container';

export default function LabsPage() {
  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Practice Labs</h1>
        <p className="text-slate-600">
          Use Packet Tracer or real devices to practice what you learn.
        </p>

        <ul className="list-disc ml-6 mt-4 space-y-2 text-slate-700">
          <li>Configure VLANs</li>
          <li>Set up inter-VLAN routing</li>
          <li>Practice subnetting</li>
          <li>Configure static & dynamic routing</li>
          <li>Implement NAT and ACLs</li>
        </ul>
      </div>
    </Container>
  );
}