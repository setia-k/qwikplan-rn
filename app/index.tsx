import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { TaskType } from "@/interfaces/task";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
    setModalValue((prev: any) => ({ ...prev, visible: false }))
  }
  const [items, setItems] = useState<TaskType[]>([])

  function onAddTaskPressed() {
    setModalValue({
      visible: true,
      data: null,
      isEdit: false,
    })
  }

  function onEditPressed(data: TaskType) {
    setModalValue({
      visible: true,
      data,
      isEdit: true,
    })
  }


  async function getData() {
    const result = await db.getAllAsync<TaskType>(`SELECT * FROM task`)
    console.log(result)
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
        {items?.map((v) => <TaskCard onEditPressed={(data) => onEditPressed(data)} key={v.id} data={v} />)}
      </ScrollView>

    </View>
  );
}

export default Home;