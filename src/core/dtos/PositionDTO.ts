export interface PositionDTO {
  col: number;
  row: number;
  notation: string; 
}

export function toPositionDTO(position: { 
  col: number; 
  row: number; 
  toNotation: () => string 
}): PositionDTO {
  return {
    col: position.col,
    row: position.row,
    notation: position.toNotation()
  };
}

export function isValidPositionDTO(dto: unknown): dto is PositionDTO {
  if (typeof dto !== 'object' || dto === null) {
    return false;
  }
  
  const pos = dto as PositionDTO;
  return (
    typeof pos.col === 'number' &&
    typeof pos.row === 'number' &&
    typeof pos.notation === 'string' &&
    pos.col >= 0 && pos.col <= 7 &&
    pos.row >= 0 && pos.row <= 7
  );
}