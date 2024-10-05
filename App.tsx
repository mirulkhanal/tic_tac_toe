import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useState} from 'react';

type Turn = 'X' | 'O' | null;

const App = () => {
  const [board, setBoard] = useState<Turn[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [turn, setTurn] = useState<Turn>('O');

  const changeTurn = () => {
    setTurn(prevTurn => (prevTurn === 'O' ? 'X' : 'O'));
  };

  const handleCellPress = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex] !== null) return;

    const updatedBoard = [...board];
    updatedBoard[rowIndex][colIndex] = turn;
    setBoard(updatedBoard);

    if (checkWinningLogic(updatedBoard, rowIndex, colIndex)) {
      Alert.alert(`Player ${turn} Wins!`);
      resetBoard();
      return;
    }

    if (checkDraw(updatedBoard)) {
      Alert.alert("It's a Draw!");
      resetBoard();
      return;
    }

    changeTurn();
  };

  const resetBoard = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  };

  const checkWinningLogic = (
    board: Turn[][],
    row: number,
    col: number,
  ): boolean => {
    const player = board[row][col];
    const size = board.length;

    if (board[row].every(cell => cell === player && cell !== null)) return true;
    if (board.every(r => r[col] === player && r[col] !== null)) return true;
    if (
      row === col &&
      board.every((r, idx) => r[idx] === player && r[idx] !== null)
    )
      return true;
    if (
      row + col === size - 1 &&
      board.every((r, idx) => r[size - 1 - idx] === player)
    )
      return true;

    return false;
  };

  const checkDraw = (board: Turn[][]): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const renderCellContent = (value: Turn) => {
    return <Text style={styles.cellText}>{value}</Text>;
  };

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const top = rowIndex === 0 ? 0 : 1;
    const bottom = rowIndex === 2 ? 0 : 1;
    const left = colIndex === 0 ? 0 : 1;
    const right = colIndex === 2 ? 0 : 1;

    return {
      ...styles.cell,
      borderTopWidth: top,
      borderBottomWidth: bottom,
      borderLeftWidth: left,
      borderRightWidth: right,
      borderColor:
        turn === 'O' ? '#a3be8c' : turn === 'X' ? '#d08770' : '#4c566a',
    };
  };

  const getTurnTextStyle = (turnText: Turn) => {
    let styleObject = {
      ...styles.turnText,
    };

    if (turnText === 'O' && turnText === turn) {
      styleObject = {
        ...styleObject,
        ...styles.oTurn,
      };
      return styleObject;
    }
    if (turnText === 'X' && turnText === turn) {
      styleObject = {
        ...styleObject,
        ...styles.xTurn,
      };
      return styleObject;
    }
    return styleObject;
  };
  return (
    <View style={styles.container}>
      <View style={styles.turnContainer}>
        <Text style={getTurnTextStyle('X')}>X</Text>
        <Text style={getTurnTextStyle('O')}>O</Text>
        <Text>O</Text>
      </View>
      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cellValue, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={getCellStyle(rowIndex, colIndex)}
                onPress={() => handleCellPress(rowIndex, colIndex)}>
                {renderCellContent(cellValue)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={resetBoard}>
          <Text style={styles.resetBoardButton}>Reset board</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 80,
    height: '100%',
    backgroundColor: '#d8dee9',
  },
  turnContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  boardContainer: {},
  xTurn: {
    backgroundColor: '#d08770',
    color: '#d8dee9',
    borderWidth: 0,
  },
  oTurn: {
    backgroundColor: '#a3be8c',
    color: '#d8dee9',
    borderWidth: 0,
  },
  turnText: {
    color: '#4c566a',
    fontSize: 30,
    backgroundColor: '#d8dee9',
    marginHorizontal: 50,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4c566a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 40,
    color: '#4c566a',
  },
  optionsContainer: {
    width: '100%',
    height: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBoardButton: {
    fontSize: 30,
    color: '#d8dee9',
    backgroundColor: '#88c0d0',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 9,
  },
});
