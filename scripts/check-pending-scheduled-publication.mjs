import fs from 'node:fs';
import path from 'node:path';

const MARKER_PATH = path.join(process.cwd(), '.github', 'pending-publication.json');

function writeOutput(key, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  fs.appendFileSync(outputPath, `${key}=${String(value)}\n`, 'utf8');
}

function readPendingPublicationMarker() {
  if (!fs.existsSync(MARKER_PATH)) {
    return {
      hasPending: false,
      reason: 'marker_missing',
      nextPublishDate: null,
    };
  }

  try {
    const marker = JSON.parse(fs.readFileSync(MARKER_PATH, 'utf8'));
    const nextPublishDate = typeof marker?.nextPublishDate === 'string'
      ? new Date(marker.nextPublishDate)
      : null;

    if (!nextPublishDate || Number.isNaN(nextPublishDate.getTime())) {
      return {
        hasPending: false,
        reason: 'marker_empty',
        nextPublishDate: null,
      };
    }

    const isDue = nextPublishDate.getTime() <= Date.now();
    return {
      hasPending: isDue,
      reason: isDue ? 'pending_marker_due' : 'pending_marker_not_due',
      nextPublishDate: nextPublishDate.toISOString(),
    };
  } catch (error) {
    console.warn('Scheduled publication marker is invalid:', error);
    return {
      hasPending: false,
      reason: 'marker_invalid',
      nextPublishDate: null,
    };
  }
}

function main() {
  const result = readPendingPublicationMarker();
  writeOutput('has_pending_publication', result.hasPending ? 'true' : 'false');
  writeOutput('gate_reason', result.reason);
  writeOutput('next_publish_date', result.nextPublishDate || '');
  writeOutput('last_success_started_at', '');
  writeOutput('candidate_count', result.hasPending ? '1' : '0');
  console.log('Scheduled publication marker result:', result);
}

main();
