import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const SalarySlip = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Salary Slip</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#555',
    fontSize: 16,
  },
});

export default SalarySlip;
