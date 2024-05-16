import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, } from "react-native";

export const TaskCard = (props: {
  data: TaskType,
  onEditPressed: (data: TaskType) => void;
}) => {
  const { data } = props;

  function onCardEditPress() {
    props?.onEditPressed(data)
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
          onPress={onCardEditPress}
        >
          <Ionicons name="ellipsis-horizontal" />
        </Pressable>
      </View>
    </View>
  );
}