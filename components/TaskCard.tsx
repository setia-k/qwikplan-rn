import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Pressable, } from "react-native";
import { Card, Title, Paragraph, Button, Text, Divider, Menu } from 'react-native-paper';
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import * as React from 'react';
export const TaskCard = (props: {
  data: TaskType,
  onEditPressed: (data: TaskType) => void;
  onDeletePressed: (data: TaskType) => void;
  onCompletePressed: (data: TaskType) => void;
}) => {
  const { data } = props;

  function onCardEditPress() {
    setVisible( (prev: any) => ({...prev, 'menu2': false}));
    props?.onEditPressed(data)
    
  }
  function onCardDeletePressed() {
    setVisible( (prev: any) => ({...prev, 'menu2': false}));
    props?.onDeletePressed(data)
  }
  function onCardCompletePressed() {
    setVisible( (prev: any) => ({...prev, 'menu2': false}));
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
    <View style={style.container}>
      <Card style={style.card}>
        <View style={style.container}>
          <Card.Content style={style.date}>
            <Text style={style.day}>{new Date(data.datetime).toLocaleDateString('en-US', { weekday: 'long' })}</Text>
            <Text style={style.number}>{new Date(data.datetime).getDate().toString().padStart(2, '0')}</Text>
            <Text style={style.month}>{new Date(data.datetime).toLocaleDateString('en-US', { month: 'long' })}</Text>
          </Card.Content>
          <Card.Content style={style.event}>
            <Text style={style.title}>{data.title}</Text>
            <Text style={style.paragraph}>
              {data.event}
            </Text>
            <Text style={style.time}>{new Date(data.datetime).getHours() + ':' + new Date(data.datetime).getMinutes()}</Text>
          </Card.Content>
          <View style={{  justifyContent: 'flex-end' }}>
            <Card.Actions >
              <Menu
                visible={_getVisible('menu2')}
                onDismiss={_toggleMenu('menu2')}
                anchor={
                  <Button mode="outlined" onPress={_toggleMenu('menu2')}>
                    <Ionicons name="ellipsis-horizontal" />
                  </Button>
                }
              >
                <Menu.Item leadingIcon="pencil" onPress={onCardEditPress} title="Update" />
                <Menu.Item leadingIcon="delete" onPress={onCardDeletePressed} title="Delete" />
                <Menu.Item leadingIcon="check" onPress={onCardCompletePressed} title="Complete" />
              </Menu>
              <Button>Upcoming</Button>
            </Card.Actions>
          </View>
        </View>
        {/* <Divider style={{ width: 1, height: '100%' }} /> */}

      </Card>
    </View>

  );
}