import { NextResponse } from 'next/server';
import { SEEDED_AMBIGUITY_INSIGHTS } from '@/lib/seed-data';

export async function GET() {
  const violationsByType = [
    { type: 'Terminology', count: 320, color: '#164E8A' },
    { type: 'Unsupported Claims', count: 210, color: '#EF4444' },
    { type: 'Tone & Voice', count: 180, color: '#F4B942' },
    { type: 'Visual Identity', count: 160, color: '#8B5CF6' },
    { type: 'Accessibility', count: 130, color: '#10B981' },
  ];

  const violationsTrend = [
    { month: 'Jun', violations: 142, resolved: 138, avgScore: 82 },
    { month: 'Jul', violations: 185, resolved: 179, avgScore: 84 },
    { month: 'Aug', violations: 220, resolved: 215, avgScore: 88 },
    { month: 'Sep', violations: 195, resolved: 192, avgScore: 89 },
    { month: 'Oct', violations: 160, resolved: 158, avgScore: 92 },
    { month: 'Nov', violations: 125, resolved: 122, avgScore: 95 },
  ];

  const channelDistribution = [
    { channel: 'Ad Campaigns', count: 48 },
    { channel: 'Social Media', count: 35 },
    { channel: 'Email Marketing', count: 24 },
    { channel: 'Sales Decks', count: 18 },
    { channel: 'Blog & Docs', count: 12 },
  ];

  return NextResponse.json({
    kpis: {
      complianceScore: 94.6,
      scoreDelta: '+8.2%',
      itemsReviewed: 1248,
      itemsDelta: '+24%',
      pendingApprovals: 6,
      avgTurnaroundHours: 3.8,
      turnaroundDelta: '-42%',
      acceptanceRate: 87.4,
    },
    violationsByType,
    violationsTrend,
    channelDistribution,
    ambiguityInsights: SEEDED_AMBIGUITY_INSIGHTS,
  });
}
