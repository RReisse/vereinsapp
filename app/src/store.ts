import { supabase } from './lib/supabase';
import type { Player } from './types';

export async function loadPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('number', { ascending: true });

  if (error) {
    console.error('Error loading players:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    name: row.name,
    number: row.number,
    position: row.position,
    age: row.age,
    games: row.games,
    goals: row.goals,
    status: row.status,
    injury: row.injury ?? undefined,
  })) as Player[];
}

export async function addPlayer(player: Omit<Player, 'id'>): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .insert({
      name: player.name,
      number: player.number,
      position: player.position,
      age: player.age,
      games: player.games,
      goals: player.goals,
      status: player.status,
      injury: player.injury ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding player:', error);
    return null;
  }

  return { ...data, injury: data.injury ?? undefined } as Player;
}

export async function updatePlayer(player: Player): Promise<boolean> {
  const { error } = await supabase
    .from('players')
    .update({
      name: player.name,
      number: player.number,
      position: player.position,
      age: player.age,
      games: player.games,
      goals: player.goals,
      status: player.status,
      injury: player.injury ?? null,
    })
    .eq('id', player.id);

  if (error) {
    console.error('Error updating player:', error);
    return false;
  }
  return true;
}

export async function deletePlayer(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting player:', error);
    return false;
  }
  return true;
}
