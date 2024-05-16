import { View, Modal, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { FieldInput } from "./FieldInput";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-native-date-picker";
import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";

export const TaskModal = (props: {
  visible: boolean,
  onModalClose: () => void;
  data?: TaskType,
  isEdit?: boolean,
}) => {
  const { visible, onModalClose, data, isEdit } = props;

  // form
  const [title, setTitle] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [date, setDate] = useState(new Date());

  // Input Ref to trigger validation
  const titleRef = useRef();

  // Now + 2 minute
  function getDateTimeLimit(): Date {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 2 * 60000);
    return futureDate;
  }

  function submit() {
    console.log('title', title)
    console.log('event', event)
    console.log('details', details)
    console.log(date);
  }


  const style = StyleSheet.create({
    drape: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: 'white',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
  })

  useEffect(() => {
    if (data && isEdit) {
      setTitle(data.title);
      setEvent(data.event);
      setDetails(data.details);
      const dataDate = new Date(data.datetime);
      setDate(dataDate);
    }
  }, [data, isEdit])

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onModalClose}
    >
      <View style={style.drape}>
        <View style={style.modal}>
          <View style={{ flexDirection: 'row' }}>
            <Text>{isEdit ? 'Edit' : 'Add'} Task</Text>
            <Ionicons name='close' onPress={onModalClose} />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <FieldInput
              value={title}
              setValue={setTitle}
              ref={titleRef}
              label="Title"
              required
            />
            <FieldInput
              value={event}
              setValue={setEvent}
              label="Event"
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <FieldInput
              value={details}
              setValue={setDetails}
              label="Details"
              width={260}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <DatePicker
              date={date}
              onDateChange={setDate}
              is24hourSource="locale"
              locale="id"
              minimumDate={getDateTimeLimit()}
            />
          </View>

          <Pressable
            style={{ paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, margin: 12 }}
            onPress={() => submit()}>
            <Text>Save</Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}