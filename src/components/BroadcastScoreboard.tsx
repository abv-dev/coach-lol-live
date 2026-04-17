import type { GameAggregates } from '../logic/playerStats';
import { TeamPanel } from './TeamPanel';

interface Props {
  aggs: GameAggregates;
  activePlayerName: string;
}

export function BroadcastScoreboard({ aggs, activePlayerName }: Props) {
  const orderAgg = aggs.myTeamId === 'ORDER' ? aggs.myTeam : aggs.enemyTeam;
  const chaosAgg = aggs.myTeamId === 'CHAOS' ? aggs.myTeam : aggs.enemyTeam;

  const gapDiff = orderAgg.itemsValue - chaosAgg.itemsValue;
  const leadingTeam = gapDiff >= 0 ? 'ORDER' : 'CHAOS';
  const gapAbs = Math.abs(gapDiff);

  return (
    <div className="scoreboard">
      <div className="sb-banner">
        <div className="sb-side sb-order">
          <div className="sb-team-label">BLEU</div>
          <div className="sb-kda">{orderAgg.kills}</div>
        </div>
        <div className="sb-center">
          <div className="sb-gap-label">{leadingTeam === 'ORDER' ? 'BLEU +' : 'ROUGE +'}</div>
          <div className="sb-gap-value">{(gapAbs / 1000).toFixed(1)}k</div>
          <div className="sb-gap-sub">items value</div>
        </div>
        <div className="sb-side sb-chaos">
          <div className="sb-team-label">ROUGE</div>
          <div className="sb-kda">{chaosAgg.kills}</div>
        </div>
      </div>
      <div className="sb-teams">
        <TeamPanel teamId="ORDER" agg={orderAgg} activePlayerName={activePlayerName} />
        <TeamPanel teamId="CHAOS" agg={chaosAgg} activePlayerName={activePlayerName} reverse />
      </div>
    </div>
  );
}
