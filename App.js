import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function App() {
  const [displayValue, setDisplayValue] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handlePress = (target) => {
    if (target === 'AC') {
      setDisplayValue('');
    } else if (target === 'DEL') {
      setDisplayValue(displayValue.slice(0, -1));
    } else if (target === '=') {
      calculateResult();
    } else if (target === 'HIST') {
      setShowHistory(!showHistory);
    } else if (target === 'ADV') {
      setIsAdvancedMode(!isAdvancedMode);
    } else {
      setDisplayValue(displayValue + target);
    }
  };

  const calculateResult = () => {
    if (!displayValue) return;
    try {
      let expression = displayValue;
      
      expression = expression.split('×').join('*');
      expression = expression.split('÷').join('/');
      expression = expression.split('π').join('Math.PI');
      expression = expression.split('e').join('Math.E');
      expression = expression.split('sin').join('Math.sin');
      expression = expression.split('cos').join('Math.cos');
      expression = expression.split('tan').join('Math.tan');
      expression = expression.split('asin').join('Math.asin');
      expression = expression.split('acos').join('Math.acos');
      expression = expression.split('atan').join('Math.atan');
      expression = expression.split('ln').join('Math.log');
      expression = expression.split('log').join('Math.log10');
      expression = expression.split('√').join('Math.sqrt');
      expression = expression.split('²').join('**2');
      expression = expression.split('^').join('**');

      let openBrackets = expression.split('(').length - 1;
      let closeBrackets = expression.split(')').length - 1;
      while (openBrackets > closeBrackets) {
        expression += ')';
        closeBrackets++;
      }

      const res = eval(expression);
      
      if (res !== undefined && !isNaN(res)) {
        const formattedResult = Number(res.toFixed(6)).toString();
        setHistory([{ expr: displayValue, result: formattedResult }, ...history]);
        setDisplayValue(formattedResult);
      } else {
        setDisplayValue('Error');
      }
    } catch (error) {
      setDisplayValue('Error');
    }
  };

  const standardButtons = [
    ['HIST', 'ADV', '(', ')'],
    ['AC', 'DEL', '^', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'π', '=']
  ];

  const advancedButtons = [
    ['HIST', 'ADV', '(', ')'],
    ['sin(', 'cos(', 'tan(', '÷'],
    ['asin(', 'acos(', 'atan(', '×'],
    ['ln(', 'log(', '√(', '-'],
    ['²', 'e', 'DEL', '+'],
    ['AC', '0', '.', '=']
  ];

  const currentButtons = isAdvancedMode ? advancedButtons : standardButtons;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.expressionText} numberOfLines={2} adjustsFontSizeToFit>
          {displayValue || '0'}
        </Text>
      </View>

      {showHistory ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>History</Text>
            <TouchableOpacity onPress={() => setHistory([])}>
              <Text style={styles.clearHistoryText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.historyList}>
            {history.length === 0 ? (
              <Text style={styles.emptyHistory}>No logs recorded</Text>
            ) : (
              history.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.historyItem}
                  onPress={() => {
                    setDisplayValue(item.result);
                    setShowHistory(false);
                  }}
                >
                  <Text style={styles.historyExpr}>{item.expr}</Text>
                  <Text style={styles.historyRes}>= {item.result}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeHistoryBtn} onPress={() => setShowHistory(false)}>
            <Text style={styles.closeHistoryText}>Close History</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.keypadContainer}>
          {currentButtons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((btn) => {
                let btnStyle = styles.button;
                let textStyle = styles.buttonText;

                if (['+', '-', '×', '÷', '='].includes(btn)) {
                  btnStyle = [styles.button, styles.operatorButton];
                  textStyle = [styles.buttonText, styles.operatorText];
                } else if (btn === 'ADV') {
                  btnStyle = [styles.button, styles.advButtonActive];
                  textStyle = [styles.buttonText, styles.advText];
                } else if (['AC', 'DEL', 'HIST'].includes(btn)) {
                  btnStyle = [styles.button, styles.actionButton];
                  textStyle = [styles.buttonText, styles.actionText];
                } else if (['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'ln(', 'log(', '√(', '²', '^', '(', ')'].includes(btn)) {
                  btnStyle = [styles.button, styles.scientificButton];
                  textStyle = [styles.buttonText, styles.scientificText];
                }

                return (
                  <TouchableOpacity
                    key={btn}
                    style={btnStyle}
                    onPress={() => handlePress(btn)}
                  >
                    <Text style={textStyle}>{btn}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  displayContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#000000'
  },
  expressionText: { 
    color: '#FFFFFF', 
    fontSize: 56, 
    textAlign: 'right', 
    fontWeight: '300' 
  },
  keypadContainer: { 
    flex: 5, 
    paddingHorizontal: 12, 
    paddingBottom: 25 
  },
  row: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 6 
  },
  button: { 
    flex: 1, 
    aspectRatio: 1, 
    marginHorizontal: 6, 
    backgroundColor: '#333333', 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: '500' 
  },
  operatorButton: { 
    backgroundColor: '#FF9F0A' 
  },
  operatorText: { 
    color: '#FFFFFF', 
    fontSize: 28, 
    fontWeight: '600' 
  },
  advButtonActive: { 
    backgroundColor: '#64D2FF' 
  },
  advText: { 
    color: '#000000', 
    fontWeight: '700',
    fontSize: 15
  },
  actionButton: { 
    backgroundColor: '#A5A5A5' 
  },
  actionText: { 
    color: '#000000', 
    fontSize: 17,
    fontWeight: '600' 
  },
  scientificButton: { 
    backgroundColor: '#1C1C1E' 
  },
  scientificText: { 
    color: '#64D2FF', 
    fontSize: 15,
    fontWeight: '500' 
  },
  historyContainer: { 
    flex: 5, 
    backgroundColor: '#1C1C1E', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24 
  },
  historyHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  historyTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '700' 
  },
  clearHistoryText: { 
    color: '#FF453A', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  historyList: { 
    flex: 1 
  },
  emptyHistory: { 
    color: '#8E8E93', 
    textAlign: 'center', 
    marginTop: 50,
    fontSize: 16 
  },
  historyItem: { 
    paddingVertical: 14, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#38383A' 
  },
  historyExpr: { 
    color: '#8E8E93', 
    fontSize: 16, 
    textAlign: 'right' 
  },
  historyRes: { 
    color: '#64D2FF', 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'right', 
    marginTop: 4 
  },
  closeHistoryBtn: { 
    backgroundColor: '#FF9F0A', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 12 
  },
  closeHistoryText: { 
    color: '#FFFFFF', 
    fontSize: 17, 
    fontWeight: '600' 
  }
});