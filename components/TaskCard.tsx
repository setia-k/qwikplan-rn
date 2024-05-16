import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, } from "react-native";

export const TaskCard = (props: {
  data: TaskType,
  onEditPressed: (data: TaskType) => void;
  onDeletePressed: (data: TaskType) => void;
  onCompletePressed: (data: TaskType) => void;
}) => {
  const { data } = props;

  function onCardEditPress() {
    props?.onEditPressed(data)
  }
  function onCardDeletePressed() {
    props?.onDeletePressed(data)
  }
  function onCardCompletePressed() {
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
  })

  return (
    <View style={style["card-container"]} >
      <View>
        <Text>{new Date(data.datetime).toDateString()}</Text>
      </View>
      <View>
        <Text>{data.title}</Text>
        <Text>{data.event}</Text>
        <Text>{data.details}</Text>
      </View>
      <View>
      <Pressable
          style={({ pressed }) => [
            style['edit-btn'],
            { backgroundColor: pressed ? 'green' : 'yellow' },
          ]}
          onPress={onCardDeletePressed}
        >
          <Ionicons name="trash" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            style['edit-btn'],
            { backgroundColor: pressed ? 'green' : 'yellow' },
          ]}
          onPress={onCardEditPress}
        >
          <Ionicons name="create" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            style['edit-btn'],
            { backgroundColor: pressed ? 'green' : 'yellow' },
          ]}
          onPress={onCardCompletePressed}
        >
          <Ionicons name="checkmark-circle" />
        </Pressable>
      </View>
    </View>
  );
}