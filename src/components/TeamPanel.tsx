import type { TeamAggregate } from '../logic/playerStats';
import type { Team } from '../types/liveClient';
import { PlayerCard } from './PlayerCard';

interface Props {
  teamId: Team;
  agg: TeamAggregate;
  activePlayerName: string;
  reverse?: boolean;
}

const POSITION_ORDER: Record<string, number> = {
  TOP: 0, JUNGLE: 1, MIDDLE: 2, BOTTOM: 3, UTILITY: 4,
};

export function TeamPanel({ teamId, agg, activePlayerName, reverse }: Props) {
  const sorted = [...agg.players].sort((a, b) =>
    (POSITION_ORDER[a.position] ?? 99) - (POSITION_ORDER[b.position] ?? 99),
  );

  return (
    <div className={`team-panel team-${teamId.toLowerCase()} ${reverse ? 'reverse' : ''}`}>
      <div className="team-header">
        <div className="team-tag">{teamId === 'ORDER' ? 'BLEU' : 'ROUGE'}</div>
        <div className="team-totals">
          <span className="t-kda">{agg.kills}/{agg.deaths}/{agg.assists}</span>
          <span className="t-sep">·</span>
          <span className="t-gold">{(agg.itemsValue / 1000).toFixed(1)}k</span>
          <span className="t-sep">·</span>
          <span className="t-cs">{agg.cs} CS</span>
        </div>
      </div>
      <div className="team-players">
        {sorted.map((p) => (
          <PlayerCard
            key={p.summonerName + p.championName}
            player={p}
            highlight={p.summonerName === activePlayerName}
            reverse={reverse}
          />
        ))}
      </div>
    </div>
  );
}
