import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisPipeline } from '@/lib/ai/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, intendedMessage } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const versionId = `ver_demo_${Date.now()}`;
    const result = await runAnalysisPipeline({
      text,
      intendedMessage: intendedMessage || 'General promotional announcement',
      channel: 'ad',
      versionId,
      fileType: 'txt',
    });

    return NextResponse.json({
      success: true,
      findings: result.findings,
      score: result.score,
      scoreSummary: result.scoreSummary,
      pipelineSteps: result.pipelineSteps,
    });
  } catch (err: any) {
    console.error('Demo analyze error:', err);
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 });
  }
}
