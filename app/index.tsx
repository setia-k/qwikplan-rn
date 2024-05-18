import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { TaskType } from "@/interfaces/task";
import { deleteNotifications } from "@/service/notification";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity , Image} from "react-native";
import { Button, List } from 'react-native-paper';

const style = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flex:1,
  },
  buttonAddTask: {
    flex: 1, 
    justifyContent: 'space-between', // Ensures button stays at bottom
  },
  button: {
    margin: 4,
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Position it 20 pixels from the bottom
    left: 20, // Position it 20 pixels from the left (adjust as needed)
    right: 20, // Position it 20 pixels from the right (adjust as needed)
    alignSelf: 'flex-end',
    width: '90%', // Make it 90% of the screen width
  },
  subTitle:{
    fontSize: 18,
    color: '#6253A2',
    margin:5
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6253A2',
    margin: 4
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sview: {
    marginTop: 10
  }
})

const Home = () => {
  const db = useSQLiteContext();
  const [modalValue, setModalValue] = useState<any>({
    visible: false,
    data: null,
    isEdit: false,
  })
  function hideModal() {
    setModalValue({
      data: null,
      isEdit: false,
      visible: false
    })
  }
  const [items, setItems] = useState<TaskType[]>([])

  function onAddTaskPressed() {
    setModalValue({
      visible: true,
      data: null,
      isEdit: false,
      onFinishCallback: () => {
        hideModal();
        getData();
      },
    })
  }

  function onDeletePressed(data: TaskType) {
    const query = db.prepareSync(`
    DELETE FROM task
    WHERE id = $id;
    `);
    try {
      let result = query.executeSync({ $id: data.id })
      console.log(`RESULT ${result.changes}`)
      if (result.changes) {
        deleteNotifications(data.id)
      }
    } catch (error) {
      Alert.alert('Unable to delete task');
      console.error(error);
    } finally {
      getData();
    }
  }

  function onEditPressed(data: TaskType) {
    setModalValue({
      visible: true,
      data,
      isEdit: true,
      onFinishCallback: () => {
        hideModal();
        getData();
      },
    })
  }

  function onCompletePressed(data: TaskType) {
    let query = db.prepareSync(`
    UPDATE task
      SET status = 'COMPLETED'
    WHERE id = $id
    `);
    try {
      let result = query.executeSync({ $id: data.id })
      console.log(`RESULT ${result.changes}`)
      if (result.changes) {
        deleteNotifications(data.id)
      }
    } catch (error) {
      Alert.alert('Unable to complete task');
      console.error(error);
    } finally {
      getData();
    }
  }

  async function getData() {
    const query = `
    SELECT * FROM task 
    WHERE status != 'COMPLETED' 
    ORDER BY datetime(updated_at) DESC;
    `
    const result = await db.getAllAsync<TaskType>(query)
    setItems(result);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={style.page}>

      <TaskModal onModalClose={() => hideModal()} {...modalValue} />

      <Text style={style.subTitle}>Hello,</Text>
      <Text style={style.title}>You Have {items?.length ?? 0} Upcoming Task</Text>
      {items.length == 0 && <TouchableOpacity style={style.container} onPress={() => onAddTaskPressed()}>
        <Image
          source={require('../assets/images/notes.png')}
          style={style.image}
        />
      </TouchableOpacity>}
      <ScrollView style={style.sview}>
        {items?.map((v) => (
          <TaskCard
            key={v.id}
            data={v}
            onDeletePressed={onDeletePressed}
            onEditPressed={onEditPressed}
            onCompletePressed={onCompletePressed}
          />
        ))}
      </ScrollView>
      <Button mode="contained" onPress={() => onAddTaskPressed()} style={style.button}>
        Add Task +
      </Button>
    </View>
  );
}

export default Home;