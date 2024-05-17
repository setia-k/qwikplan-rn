import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { TaskType } from "@/interfaces/task";
import { deleteNotifications } from "@/service/notification";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const style = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    paddingTop: 8
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

      <Text>Hello,</Text>
      <Text>You Have {items?.length ?? 0} Upcoming Task</Text>

      <Pressable onPress={() => onAddTaskPressed()}>
        <Text>
          Add Task +
        </Text>
      </Pressable>

      <ScrollView>
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

    </View>
  );
}

export default Home;