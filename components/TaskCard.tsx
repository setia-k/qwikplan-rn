import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";
import * as React from 'react';
import { StyleSheet, View } from "react-native";
import { Button, Menu, Text } from 'react-native-paper';

export const TaskCard = (props: {
  data: TaskType,
  onEditPressed: (data: TaskType) => void;
  onDeletePressed: (data: TaskType) => void;
  onCompletePressed: (data: TaskType) => void;
}) => {
  const { data } = props;
  const dateText = new Date(data.datetime)

  function onCardEditPress() {
    setVisible((prev: any) => ({ ...prev, 'menu2': false }));
    props?.onEditPressed(data)

  }
  function onCardDeletePressed() {
    setVisible((prev: any) => ({ ...prev, 'menu2': false }));
    props?.onDeletePressed(data)
  }
  function onCardCompletePressed() {
    setVisible((prev: any) => ({ ...prev, 'menu2': false }));
    props?.onCompletePressed(data)
  }

  const style = StyleSheet.create({
    "card-container": {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#000',
      paddingHorizontal: 12,
      paddingVertical: 4
    },
    "date-tip": {},
    "edit-btn": {
      padding: 4,
    },
    container: {
      flexDirection: 'row', // Arrange cards horizontally
      justifyContent: 'space-between', // Distribute space evenly
      flexWrap: 'wrap', // Allow cards to wrap if needed
      paddingHorizontal: 10, // Add horizontal padding
      marginVertical: 10, // Add vertical margin

      flex: 1
    },
    card: {
      flex: 1, // Each card takes equal width
      margin: 5, // Add margin between cards
      backgroundColor: '#222',
      flexDirection: 'row',
      width: '100%'
    },
    title: {
      color: '#fff',
      fontSize: 20,
    },
    paragraph: {
      color: '#fff',
      fontSize: 14,
    },
    time: {
      fontSize: 12,
      color: '#fff',
    },
    date: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
      justifyContent: 'flex-start',
      fontWeight: 'bold',
      marginTop: 10,
    },
    event: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
    day: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'light'
    },
    number: {
      fontSize: 24,
      color: '#007bff',
      fontWeight: 'medium'
    },
    month: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'medium'
    },
    actions: {
      justifyContent: 'flex-end',
    },
    button: {
      backgroundColor: '#6200EE',
    },
  })

  const [visible, setVisible] = React.useState<any>({});
  const _toggleMenu = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });
  const _getVisible = (name: string) => !!visible[name];

  return (
    <View style={{
      backgroundColor: '#222',
      borderRadius: 15,
      padding: 16,
      marginVertical: 8,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View>
          <Text style={style.day}>{dateText.toLocaleDateString('en-US', { weekday: 'long' })}</Text>
          <Text style={style.number}>{dateText.getDate().toString().padStart(2, '0')}</Text>
          <Text style={style.month}>{dateText.toLocaleDateString('en-US', { month: 'long' })}</Text>
        </View>

        <View>
          <Text style={style.title}>{data.title}</Text>
          <Text style={style.paragraph}>{data.event}</Text>
          <Text style={style.time}>{dateText.getHours() + ':' + dateText.getMinutes()}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: 'white' }}>
          {data?.details}
        </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Menu
          visible={_getVisible('menu2')}
          onDismiss={_toggleMenu('menu2')}
          anchor={(
            <Button mode="outlined" onPress={_toggleMenu('menu2')}>
              <Ionicons name="ellipsis-horizontal" />
            </Button>
          )}
        >
          <Menu.Item leadingIcon="pencil" onPress={onCardEditPress} title="Update" />
          <Menu.Item leadingIcon="delete" onPress={onCardDeletePressed} title="Delete" />
          <Menu.Item leadingIcon="check" onPress={onCardCompletePressed} title="Complete" />
        </Menu>
        <Button style={{ backgroundColor: '#6750a4', paddingHorizontal: 16 }}>
          <Text style={{ color: 'white' }}>
            {new Date() > dateText ? 'Completed' : 'Upcoming'}
          </Text>
        </Button>
      </View>

    </View>
  );
}