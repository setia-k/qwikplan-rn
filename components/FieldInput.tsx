import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FieldInputPropsType {
  label: string,
  value: string,
  setValue: (text: string) => void;
  required?: boolean,
  errorText?: string,
  width?: number,
}

export const FieldInput = forwardRef((props: FieldInputPropsType, ref) => {
  const { label, required, value, setValue } = props;

  // const [value, setValue] = useState<string>('')
  const [error, setError] = useState(false);

  const style = StyleSheet.create({
    container: {
      marginVertical: 4,
      marginHorizontal: 4,
    },
    inputField: {
      height: 32,
      width: props?.width ?? 128,
      borderBottomWidth: 1,
      paddingVertical: 5,
      borderColor: error ? 'red' : 'black',
    },
    errorText: {
      color: 'red',
    },
  });

  useImperativeHandle(ref, () => ({
    setErrorState: (isValid: boolean) => {
      setError(isValid);
    },
    setFieldValue: (text: string) => {
      setValue(text)
    },
  }));

  function onChangeText(text: string) {
    if (error) setError(false);
    setValue(text)
  }

  return (
    <View style={style.container}>
      <Text>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={style.inputField}
      />
      {error && <Text style={style.errorText}>{props?.errorText ?? 'Please fill'}</Text>}
    </View>
  );
});
