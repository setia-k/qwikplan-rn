import { TaskType } from "@/interfaces/task";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { FieldInput } from "./FieldInput";

// DO NOT CHANGE THE ORDER =======================
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
// =================

export const TaskModal = (props: {
  visible: boolean,
  onModalClose: () => void,
  onFinishCallback: () => void,
  data?: TaskType,
  isEdit?: boolean,
}) => {
  const { visible, onModalClose, data, isEdit } = props;
  const db = useSQLiteContext();

  // form
  const [title, setTitle] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [pickerDate, setPickerDate] = useState(new Date());

  // Input Ref to trigger validation
  const titleRef = useRef();

  // reset form
  function resetForm() {
    setTitle('');
    setEvent('');
    setDetails('');
    setPickerDate(new Date());
  }

  // Now + 2 minute
  function getDateTimeLimit(): Date {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 2 * 60000);
    return futureDate;
  }

  function submit() {
    const now = new Date();
    if (isEdit && data) {
      let update: TaskType = {
        id: data.id,
        title, event, details,
        datetime: pickerDate.toISOString(),
        created_at: data.created_at,
        updated_at: now.toISOString(),
        status: 'TODO',
      }
      updateData(update)
    } else {
      const newId = uuidv4();
      const newTask: TaskType = {
        id: newId,
        title, event, details,
        datetime: pickerDate.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        status: 'TODO',
      }
      insertData(newTask)
    }
  }

  async function insertData(data: TaskType) {
    const query = await db.prepareAsync(`
      INSERT INTO task (id, title, event, details, datetime, status, created_at, updated_at)
      VALUES ($id, $title, $event, $details, $datetime, $status, $created_at, $updated_at) 
    `)
    try {
      let result = await query.executeAsync({
        $id: data.id,
        $title: data.title,
        $event: data.event,
        $details: data.details,
        $datetime: data.datetime,
        $status: data.status,
        $created_at: data.created_at,
        $updated_at: data.updated_at
      });
      console.log(`RESULT ${result.changes}`)
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to add new task');
    } finally {
      await query.finalizeAsync();
      props?.onFinishCallback()
      resetForm();
    }
  }

  async function updateData(update: TaskType) {
    const query = await db.prepareAsync(`
    UPDATE task
    SET title = $title, 
        event = $event, 
        details = $details, 
        datetime = $datetime,
        updated_at = $updated_at
    WHERE id = $id
    `)
    try {
      let result = await query.executeAsync({
        $title: update.title,
        $event: update.event,
        $details: update.details,
        $datetime: update.datetime,
        $updated_at: update.updated_at,
        $id: update.id,
      })
      console.log(`RESULT ${result.changes}`)
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to update task');
    } finally {
      query.finalizeAsync();
      props?.onFinishCallback()
      resetForm();
    }
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
      setPickerDate(dataDate);
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
              date={pickerDate}
              onDateChange={setPickerDate}
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