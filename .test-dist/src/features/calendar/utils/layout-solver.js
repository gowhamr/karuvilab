import { parseISO } from 'date-fns';
/**
 * Computes columns and width distributions for overlapping events to prevent them
 * from covering each other in Day and Week timeline views.
 */
export function computeEventPositions(events) {
    if (events.length === 0)
        return [];
    // Sort events by start time, and then by duration descending
    const sorted = [...events].sort((a, b) => {
        const aStart = parseISO(a.startDate).getTime();
        const bStart = parseISO(b.startDate).getTime();
        if (aStart !== bStart)
            return aStart - bStart;
        const aEnd = parseISO(a.endDate).getTime();
        const bEnd = parseISO(b.endDate).getTime();
        return (bEnd - bStart) - (aEnd - aStart); // longer duration first
    });
    const clusters = [];
    let currentCluster = [];
    let clusterEnd = 0;
    // 1. Group events into clusters that overlap in timeline
    sorted.forEach(event => {
        const start = parseISO(event.startDate).getTime();
        const end = parseISO(event.endDate).getTime();
        if (currentCluster.length === 0) {
            currentCluster.push(event);
            clusterEnd = end;
        }
        else if (start < clusterEnd) {
            currentCluster.push(event);
            if (end > clusterEnd) {
                clusterEnd = end;
            }
        }
        else {
            clusters.push(currentCluster);
            currentCluster = [event];
            clusterEnd = end;
        }
    });
    if (currentCluster.length > 0) {
        clusters.push(currentCluster);
    }
    const positionedEvents = [];
    // 2. Distribute events into columns within each cluster
    clusters.forEach(cluster => {
        const columns = [];
        cluster.forEach(event => {
            const start = parseISO(event.startDate).getTime();
            // Find the first column where this event does not overlap with the last event in that column
            let placed = false;
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
                const colEvents = columns[colIdx];
                if (!colEvents)
                    continue;
                const lastEvent = colEvents[colEvents.length - 1];
                if (!lastEvent)
                    continue;
                const lastEnd = parseISO(lastEvent.endDate).getTime();
                if (start >= lastEnd) {
                    colEvents.push(event);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                columns.push([event]);
            }
        });
        // Map each event to its position
        cluster.forEach(event => {
            const colIdx = columns.findIndex(col => col.includes(event));
            positionedEvents.push({
                event,
                column: colIdx,
                totalColumns: columns.length
            });
        });
    });
    return positionedEvents;
}
