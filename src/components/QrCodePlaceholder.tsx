import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../constants';

interface QrCodePlaceholderProps {
  size?: number;
}

const GRID_SIZE = 17;

function isFinderCell(row: number, col: number) {
  const inTopLeft = row < 5 && col < 5;
  const inTopRight = row < 5 && col > GRID_SIZE - 6;
  const inBottomLeft = row > GRID_SIZE - 6 && col < 5;

  return inTopLeft || inTopRight || inBottomLeft;
}

function isFilledCell(row: number, col: number) {
  if (isFinderCell(row, col)) {
    const localRow = row < 5 ? row : row - (GRID_SIZE - 5);
    const localCol = col < 5 ? col : col - (GRID_SIZE - 5);
    const isOuterRing =
      localRow === 0 || localRow === 4 || localCol === 0 || localCol === 4;
    const isCenterBlock =
      localRow > 0 && localRow < 4 && localCol > 0 && localCol < 4;

    return isOuterRing || isCenterBlock;
  }

  return (row * col + row + col) % 3 === 0 || (row + col) % 5 === 0;
}

export function QrCodePlaceholder({
  size = 228,
}: QrCodePlaceholderProps) {
  const cellSize = Math.floor(size / GRID_SIZE);

  return (
    <View
      style={[
        styles.frame,
        {
          width: cellSize * GRID_SIZE + spacing.md,
          height: cellSize * GRID_SIZE + spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.grid,
          {
            width: cellSize * GRID_SIZE,
            height: cellSize * GRID_SIZE,
          },
        ]}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const row = Math.floor(index / GRID_SIZE);
          const col = index % GRID_SIZE;
          const filled = isFilledCell(row, col);

          return (
            <View
              key={`${row}-${col}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: filled ? colors.textPrimary : colors.white,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
