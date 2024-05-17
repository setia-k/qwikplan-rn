import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FieldInputPropsType {
  label: string;
  required?: boolean;
  errorText?: string;
  width?: number;
}

export interface FieldInputRefType {
  setErrorState: (v: boolean) => void;
  getFieldValue: () => string;
  setFieldValue: (v: string) => void;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 4,
  },
  inputField: {
    height: 32,
    width: 128,
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderColor: 'black',
  },
  errorText: {
    color: 'red',
  },
});

export const FieldInput = forwardRef((props: FieldInputPropsType, ref) => {
  const { label, required, errorText, width } = props;
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState(false);

  useImperativeHandle(ref, () => ({
    setErrorState: (isValid: boolean) => {
      setError(isValid);
    },
    getFieldValue: () => value,
    setFieldValue: (text: string) => {
      setValue(text);
    },
  }));

  const onChangeText = useCallback(
    (text: string) => {
      if (error) setError(false);
      setValue(text);
    },
    [error, setValue]
  );

  return (
    <View style={styles.container}>
      <Text>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.inputField, { borderColor: error ? 'red' : 'black', width: width ?? 128 }]}
      />
      {error && <Text style={styles.errorText}>{errorText ?? 'Please fill'}</Text>}
    </View>
  );
});
