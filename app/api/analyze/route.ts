import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisPipeline } from '@/lib/ai/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, intendedMessage, channel, versionId, fileType, fileName } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const vId = versionId || `ver_${Date.now()}`;
    const result = await runAnalysisPipeline({
      text,
      intendedMessage,
      channel,
      versionId: vId,
      fileType: fileType || 'txt',
      fileName,
    });

    return NextResponse.json({
      success: true,
      findings: result.findings,
      score: result.score,
      scoreSummary: result.scoreSummary,
      pipelineSteps: result.pipelineSteps,
    });
  } catch (err: any) {
    console.error('Analysis API error:', err);
    return NextResponse.json({ error: err.message || 'Analysis error' }, { status: 500 });
  }
}
